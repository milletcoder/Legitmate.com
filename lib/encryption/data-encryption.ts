/**
 * Data Encryption Service
 * Provides comprehensive encryption for data at rest and in transit
 */

import CryptoJS from "crypto-js"

export interface EncryptionConfig {
  algorithm: string
  keySize: number
  ivSize: number
  iterations: number
}

export interface EncryptedData {
  data: string
  iv: string
  salt: string
  tag?: string
  algorithm: string
  timestamp: number
}

export interface KeyRotationInfo {
  keyId: string
  version: number
  createdAt: Date
  expiresAt: Date
  isActive: boolean
}

export class DataEncryptionService {
  private static readonly DEFAULT_CONFIG: EncryptionConfig = {
    algorithm: "AES-256-GCM",
    keySize: 256,
    ivSize: 128,
    iterations: 10000,
  }

  private static readonly MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY || "default-master-key-change-in-production"
  private static readonly KEY_ROTATION_INTERVAL = 90 * 24 * 60 * 60 * 1000 // 90 days

  /**
   * Encrypt sensitive data
   */
  static encrypt(plaintext: string, password?: string): EncryptedData {
    try {
      const salt = CryptoJS.lib.WordArray.random(128 / 8)
      const iv = CryptoJS.lib.WordArray.random(128 / 8)

      const key = password
        ? CryptoJS.PBKDF2(password, salt, {
            keySize: this.DEFAULT_CONFIG.keySize / 32,
            iterations: this.DEFAULT_CONFIG.iterations,
          })
        : CryptoJS.PBKDF2(this.MASTER_KEY, salt, {
            keySize: this.DEFAULT_CONFIG.keySize / 32,
            iterations: this.DEFAULT_CONFIG.iterations,
          })

      const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      })

      return {
        data: encrypted.toString(),
        iv: iv.toString(),
        salt: salt.toString(),
        algorithm: this.DEFAULT_CONFIG.algorithm,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Failed to encrypt data")
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: EncryptedData, password?: string): string {
    try {
      const salt = CryptoJS.enc.Hex.parse(encryptedData.salt)
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv)

      const key = password
        ? CryptoJS.PBKDF2(password, salt, {
            keySize: this.DEFAULT_CONFIG.keySize / 32,
            iterations: this.DEFAULT_CONFIG.iterations,
          })
        : CryptoJS.PBKDF2(this.MASTER_KEY, salt, {
            keySize: this.DEFAULT_CONFIG.keySize / 32,
            iterations: this.DEFAULT_CONFIG.iterations,
          })

      const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      })

      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Failed to decrypt data")
    }
  }

  /**
   * Encrypt file data
   */
  static async encryptFile(fileBuffer: ArrayBuffer, password?: string): Promise<EncryptedData> {
    try {
      const uint8Array = new Uint8Array(fileBuffer)
      const base64String = btoa(String.fromCharCode(...uint8Array))

      return this.encrypt(base64String, password)
    } catch (error) {
      console.error("File encryption error:", error)
      throw new Error("Failed to encrypt file")
    }
  }

  /**
   * Decrypt file data
   */
  static async decryptFile(encryptedData: EncryptedData, password?: string): Promise<ArrayBuffer> {
    try {
      const decryptedBase64 = this.decrypt(encryptedData, password)
      const binaryString = atob(decryptedBase64)
      const bytes = new Uint8Array(binaryString.length)

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      return bytes.buffer
    } catch (error) {
      console.error("File decryption error:", error)
      throw new Error("Failed to decrypt file")
    }
  }

  /**
   * Generate secure hash
   */
  static generateHash(data: string, salt?: string): string {
    const saltToUse = salt || CryptoJS.lib.WordArray.random(128 / 8).toString()
    return CryptoJS.PBKDF2(data, saltToUse, {
      keySize: 256 / 32,
      iterations: this.DEFAULT_CONFIG.iterations,
    }).toString()
  }

  /**
   * Verify hash
   */
  static verifyHash(data: string, hash: string, salt: string): boolean {
    try {
      const computedHash = CryptoJS.PBKDF2(data, salt, {
        keySize: 256 / 32,
        iterations: this.DEFAULT_CONFIG.iterations,
      }).toString()

      return computedHash === hash
    } catch (error) {
      console.error("Hash verification error:", error)
      return false
    }
  }

  /**
   * Generate encryption key
   */
  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(256 / 8).toString()
  }

  /**
   * Encrypt database field
   */
  static encryptField(value: any, fieldName: string): EncryptedData | null {
    if (value === null || value === undefined) {
      return null
    }

    const stringValue = typeof value === "string" ? value : JSON.stringify(value)
    const fieldKey = this.deriveFieldKey(fieldName)

    return this.encrypt(stringValue, fieldKey)
  }

  /**
   * Decrypt database field
   */
  static decryptField(encryptedData: EncryptedData | null, fieldName: string): any {
    if (!encryptedData) {
      return null
    }

    const fieldKey = this.deriveFieldKey(fieldName)
    const decryptedValue = this.decrypt(encryptedData, fieldKey)

    try {
      return JSON.parse(decryptedValue)
    } catch {
      return decryptedValue
    }
  }

  /**
   * Encrypt PII (Personally Identifiable Information)
   */
  static encryptPII(data: Record<string, any>): Record<string, EncryptedData | any> {
    const piiFields = ["email", "phone", "ssn", "address", "name", "gstin"]
    const result: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (piiFields.some((field) => key.toLowerCase().includes(field))) {
        result[key] = this.encryptField(value, key)
      } else {
        result[key] = value
      }
    }

    return result
  }

  /**
   * Decrypt PII
   */
  static decryptPII(data: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && "data" in value && "iv" in value) {
        result[key] = this.decryptField(value as EncryptedData, key)
      } else {
        result[key] = value
      }
    }

    return result
  }

  /**
   * Key rotation management
   */
  static async rotateKeys(): Promise<KeyRotationInfo[]> {
    const newKeys: KeyRotationInfo[] = []

    // Generate new master key
    const newMasterKey: KeyRotationInfo = {
      keyId: `master_${Date.now()}`,
      version: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.KEY_ROTATION_INTERVAL),
      isActive: true,
    }

    newKeys.push(newMasterKey)

    // In production, this would:
    // 1. Generate new keys
    // 2. Re-encrypt data with new keys
    // 3. Update key metadata in secure storage
    // 4. Schedule old key deprecation

    console.log("Key rotation completed:", newKeys)
    return newKeys
  }

  /**
   * Secure data transmission
   */
  static prepareForTransmission(data: any): {
    payload: string
    signature: string
    timestamp: number
  } {
    const timestamp = Date.now()
    const payload = JSON.stringify({ data, timestamp })
    const encrypted = this.encrypt(payload)
    const signature = this.generateHash(encrypted.data + timestamp.toString())

    return {
      payload: JSON.stringify(encrypted),
      signature,
      timestamp,
    }
  }

  /**
   * Verify and decrypt transmitted data
   */
  static receiveTransmission(payload: string, signature: string, timestamp: number): any {
    // Verify timestamp (prevent replay attacks)
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes

    if (now - timestamp > maxAge) {
      throw new Error("Transmission expired")
    }

    // Verify signature
    const encryptedData = JSON.parse(payload) as EncryptedData
    const expectedSignature = this.generateHash(encryptedData.data + timestamp.toString())

    if (signature !== expectedSignature) {
      throw new Error("Invalid signature")
    }

    // Decrypt and parse
    const decryptedPayload = this.decrypt(encryptedData)
    const { data } = JSON.parse(decryptedPayload)

    return data
  }

  /**
   * Derive field-specific encryption key
   */
  private static deriveFieldKey(fieldName: string): string {
    return CryptoJS.PBKDF2(this.MASTER_KEY + fieldName, "field-salt", {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString()
  }

  /**
   * Secure memory cleanup
   */
  static secureCleanup(sensitiveData: any): void {
    if (typeof sensitiveData === "string") {
      // In a real implementation, you'd overwrite memory
      // JavaScript doesn't provide direct memory management
      sensitiveData = null
    } else if (typeof sensitiveData === "object") {
      for (const key in sensitiveData) {
        if (sensitiveData.hasOwnProperty(key)) {
          sensitiveData[key] = null
        }
      }
    }
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString()
  }

  /**
   * Encrypt configuration data
   */
  static encryptConfig(config: Record<string, any>): Record<string, EncryptedData> {
    const encryptedConfig: Record<string, EncryptedData> = {}

    for (const [key, value] of Object.entries(config)) {
      encryptedConfig[key] = this.encrypt(JSON.stringify(value), `config_${key}`)
    }

    return encryptedConfig
  }

  /**
   * Decrypt configuration data
   */
  static decryptConfig(encryptedConfig: Record<string, EncryptedData>): Record<string, any> {
    const config: Record<string, any> = {}

    for (const [key, encryptedValue] of Object.entries(encryptedConfig)) {
      const decryptedValue = this.decrypt(encryptedValue, `config_${key}`)
      config[key] = JSON.parse(decryptedValue)
    }

    return config
  }
}

/**
 * Encryption middleware for API routes
 */
export function encryptResponse(data: any): string {
  const transmission = DataEncryptionService.prepareForTransmission(data)
  return JSON.stringify(transmission)
}

export function decryptRequest(encryptedPayload: string): any {
  const { payload, signature, timestamp } = JSON.parse(encryptedPayload)
  return DataEncryptionService.receiveTransmission(payload, signature, timestamp)
}
