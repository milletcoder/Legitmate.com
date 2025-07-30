import { generateSecret, authenticator } from "otplib"
import QRCode from "qrcode"

export interface MFASetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface MFAMethod {
  id: string
  type: "totp" | "sms" | "email" | "backup_codes"
  name: string
  enabled: boolean
  verified: boolean
  createdAt: Date
  lastUsed?: Date
}

export class MFAService {
  private static readonly APP_NAME = "Legal Eagle"
  private static readonly ISSUER = "Legal Eagle Platform"

  /**
   * Generate TOTP secret and QR code for authenticator app setup
   */
  static async generateTOTPSetup(userEmail: string): Promise<MFASetup> {
    const secret = generateSecret()
    const otpauth = authenticator.keyuri(userEmail, this.ISSUER, secret)
    const qrCodeUrl = await QRCode.toDataURL(otpauth)

    // Generate backup codes
    const backupCodes = this.generateBackupCodes()

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    }
  }

  /**
   * Verify TOTP token
   */
  static verifyTOTP(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      console.error("TOTP verification error:", error)
      return false
    }
  }

  /**
   * Generate backup codes for account recovery
   */
  static generateBackupCodes(count = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  /**
   * Send SMS verification code
   */
  static async sendSMSCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real implementation, integrate with SMS service like Twilio
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      // Mock SMS sending
      console.log(`SMS Code for ${phoneNumber}: ${code}`)

      // Store code in cache/database with expiration
      await this.storeSMSCode(phoneNumber, code)

      return {
        success: true,
        message: "SMS code sent successfully",
      }
    } catch (error) {
      console.error("SMS sending error:", error)
      return {
        success: false,
        message: "Failed to send SMS code",
      }
    }
  }

  /**
   * Verify SMS code
   */
  static async verifySMSCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // In a real implementation, retrieve from cache/database
      const storedCode = await this.getSMSCode(phoneNumber)
      return storedCode === code
    } catch (error) {
      console.error("SMS verification error:", error)
      return false
    }
  }

  /**
   * Send email verification code
   */
  static async sendEmailCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      // Mock email sending
      console.log(`Email Code for ${email}: ${code}`)

      // Store code in cache/database with expiration
      await this.storeEmailCode(email, code)

      return {
        success: true,
        message: "Email code sent successfully",
      }
    } catch (error) {
      console.error("Email sending error:", error)
      return {
        success: false,
        message: "Failed to send email code",
      }
    }
  }

  /**
   * Verify email code
   */
  static async verifyEmailCode(email: string, code: string): Promise<boolean> {
    try {
      const storedCode = await this.getEmailCode(email)
      return storedCode === code
    } catch (error) {
      console.error("Email verification error:", error)
      return false
    }
  }

  /**
   * Verify backup code
   */
  static async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      // In a real implementation, check against stored backup codes
      const userBackupCodes = await this.getUserBackupCodes(userId)
      const isValid = userBackupCodes.includes(code.toUpperCase())

      if (isValid) {
        // Remove used backup code
        await this.removeBackupCode(userId, code.toUpperCase())
      }

      return isValid
    } catch (error) {
      console.error("Backup code verification error:", error)
      return false
    }
  }

  /**
   * Get user's MFA methods
   */
  static async getUserMFAMethods(userId: string): Promise<MFAMethod[]> {
    // Mock implementation - in real app, fetch from database
    return [
      {
        id: "1",
        type: "totp",
        name: "Authenticator App",
        enabled: true,
        verified: true,
        createdAt: new Date("2024-01-01"),
        lastUsed: new Date("2024-01-15"),
      },
      {
        id: "2",
        type: "sms",
        name: "SMS to +1 (555) ***-1234",
        enabled: false,
        verified: false,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "3",
        type: "backup_codes",
        name: "Backup Codes",
        enabled: true,
        verified: true,
        createdAt: new Date("2024-01-01"),
      },
    ]
  }

  /**
   * Enable MFA method
   */
  static async enableMFAMethod(userId: string, methodId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Enabling MFA method ${methodId} for user ${userId}`)
      return true
    } catch (error) {
      console.error("Error enabling MFA method:", error)
      return false
    }
  }

  /**
   * Disable MFA method
   */
  static async disableMFAMethod(userId: string, methodId: string): Promise<boolean> {
    try {
      // In a real implementation, update database
      console.log(`Disabling MFA method ${methodId} for user ${userId}`)
      return true
    } catch (error) {
      console.error("Error disabling MFA method:", error)
      return false
    }
  }

  // Private helper methods
  private static async storeSMSCode(phoneNumber: string, code: string): Promise<void> {
    // Mock implementation - store in cache with 5-minute expiration
    const key = `sms_code_${phoneNumber}`
    localStorage.setItem(
      key,
      JSON.stringify({
        code,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      }),
    )
  }

  private static async getSMSCode(phoneNumber: string): Promise<string | null> {
    const key = `sms_code_${phoneNumber}`
    const stored = localStorage.getItem(key)

    if (!stored) return null

    const { code, expiresAt } = JSON.parse(stored)

    if (Date.now() > expiresAt) {
      localStorage.removeItem(key)
      return null
    }

    return code
  }

  private static async storeEmailCode(email: string, code: string): Promise<void> {
    const key = `email_code_${email}`
    localStorage.setItem(
      key,
      JSON.stringify({
        code,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      }),
    )
  }

  private static async getEmailCode(email: string): Promise<string | null> {
    const key = `email_code_${email}`
    const stored = localStorage.getItem(key)

    if (!stored) return null

    const { code, expiresAt } = JSON.parse(stored)

    if (Date.now() > expiresAt) {
      localStorage.removeItem(key)
      return null
    }

    return code
  }

  private static async getUserBackupCodes(userId: string): Promise<string[]> {
    const key = `backup_codes_${userId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private static async removeBackupCode(userId: string, code: string): Promise<void> {
    const key = `backup_codes_${userId}`
    const codes = await this.getUserBackupCodes(userId)
    const updatedCodes = codes.filter((c) => c !== code)
    localStorage.setItem(key, JSON.stringify(updatedCodes))
  }
}

export default MFAService
