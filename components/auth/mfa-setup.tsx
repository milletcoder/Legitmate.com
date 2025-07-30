"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, Smartphone, Mail, Key, QrCode, Copy, Check, AlertTriangle, Download, RefreshCw } from "lucide-react"
import { MFAService, type TOTPSetup, type MFAMethod } from "@/lib/auth/mfa"
import { useToast } from "@/hooks/use-toast"

interface MFASetupProps {
  userId: string
  userEmail: string
  onComplete?: () => void
}

export function MFASetup({ userId, userEmail, onComplete }: MFASetupProps) {
  const [methods, setMethods] = useState<MFAMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totpSetup, setTotpSetup] = useState<TOTPSetup | null>(null)
  const [showTotpSetup, setShowTotpSetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMFAMethods()
  }, [userId])

  const loadMFAMethods = async () => {
    try {
      setIsLoading(true)
      const userMethods = await MFAService.getUserMFAMethods(userId)
      setMethods(userMethods)
    } catch (error) {
      console.error("Failed to load MFA methods:", error)
      toast({
        title: "Error",
        description: "Failed to load MFA methods",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupTOTP = async () => {
    try {
      setIsLoading(true)
      const setup = await MFAService.generateTOTPSetup(userEmail)
      setTotpSetup(setup)
      setShowTotpSetup(true)
    } catch (error) {
      console.error("Failed to setup TOTP:", error)
      toast({
        title: "Error",
        description: "Failed to setup authenticator app",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyTOTP = async () => {
    if (!totpSetup || !verificationCode) return

    try {
      setIsVerifying(true)
      const isValid = MFAService.verifyTOTP(verificationCode, totpSetup.secret)

      if (isValid) {
        await MFAService.enableMFAMethod(userId, "totp", {
          secret: totpSetup.secret,
          backupCodes: totpSetup.backupCodes,
        })

        toast({
          title: "Success",
          description: "Authenticator app has been enabled successfully",
        })

        setShowTotpSetup(false)
        setVerificationCode("")
        await loadMFAMethods()
        onComplete?.()
      } else {
        toast({
          title: "Invalid Code",
          description: "Please check your authenticator app and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("TOTP verification failed:", error)
      toast({
        title: "Error",
        description: "Failed to verify authenticator code",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSetupSMS = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const result = await MFAService.sendSMSCode(phoneNumber)

      if (result.success) {
        toast({
          title: "Code Sent",
          description: "Verification code has been sent to your phone",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send SMS code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("SMS setup failed:", error)
      toast({
        title: "Error",
        description: "Failed to setup SMS verification",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableMethod = async (methodId: string) => {
    try {
      setIsLoading(true)
      const success = await MFAService.disableMFAMethod(userId, methodId)

      if (success) {
        toast({
          title: "Success",
          description: "MFA method has been disabled",
        })
        await loadMFAMethods()
      } else {
        toast({
          title: "Error",
          description: "Failed to disable MFA method",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to disable MFA method:", error)
      toast({
        title: "Error",
        description: "Failed to disable MFA method",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    })
  }

  const copyBackupCodes = () => {
    if (totpSetup) {
      const codesText = totpSetup.backupCodes.join("\n")
      navigator.clipboard.writeText(codesText)
      setCopiedBackupCodes(true)
      toast({
        title: "Backup Codes Copied",
        description: "Save these codes in a secure location",
      })
    }
  }

  const downloadBackupCodes = () => {
    if (totpSetup) {
      const codesText = totpSetup.backupCodes.join("\n")
      const blob = new Blob([codesText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "legal-eagle-backup-codes.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setCopiedBackupCodes(true)
    }
  }

  if (isLoading && methods.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>Loading your security settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="authenticator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="authenticator" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Authenticator App
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Backup Codes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="authenticator" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Authenticator App</h3>
                      <p className="text-sm text-muted-foreground">Use Google Authenticator, Authy, or similar apps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {methods.find((m) => m.type === "totp" && m.enabled) ? (
                      <>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const method = methods.find((m) => m.type === "totp")
                            if (method) handleDisableMethod(method.id)
                          }}
                        >
                          Disable
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleSetupTOTP} disabled={isLoading}>
                        Setup
                      </Button>
                    )}
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Authenticator apps provide the highest level of security and work offline. We recommend using Google
                    Authenticator, Authy, or Microsoft Authenticator.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">SMS Verification</h3>
                      <p className="text-sm text-muted-foreground">Receive verification codes via text message</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {methods.find((m) => m.type === "sms" && m.enabled) ? (
                      <>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const method = methods.find((m) => m.type === "sms")
                            if (method) handleDisableMethod(method.id)
                          }}
                        >
                          Disable
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-40"
                        />
                        <Button onClick={handleSetupSMS} disabled={isLoading}>
                          Setup
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    SMS verification is less secure than authenticator apps and may not work in all countries. Use as a
                    backup method only.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Backup Codes</h3>
                      <p className="text-sm text-muted-foreground">One-time use codes for account recovery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {methods.find((m) => m.type === "backup_codes" && m.enabled) ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Generated
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Generated</Badge>
                    )}
                  </div>
                </div>

                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Backup codes are automatically generated when you enable an authenticator app. Store them securely -
                    each code can only be used once.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* TOTP Setup Dialog */}
      <Dialog open={showTotpSetup} onOpenChange={setShowTotpSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Setup Authenticator App
            </DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the verification code
            </DialogDescription>
          </DialogHeader>

          {totpSetup && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <img
                    src={totpSetup.qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code for TOTP setup"
                    className="w-48 h-48"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Can't scan? Enter this code manually:</p>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-sm">
                    <span className="flex-1">{totpSetup.manualEntryKey}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(totpSetup.secret)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <Button
                  onClick={handleVerifyTOTP}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enable"
                  )}
                </Button>
              </div>

              {/* Backup Codes */}
              <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">Save Your Backup Codes</h4>
                </div>

                <p className="text-sm text-yellow-700">
                  These codes can be used to access your account if you lose your authenticator device. Each code can
                  only be used once.
                </p>

                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {totpSetup.backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-center">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyBackupCodes} className="flex-1 bg-transparent">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Codes
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadBackupCodes} className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                {copiedBackupCodes && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Backup codes saved! Store them in a secure location separate from your device.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
