"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Shield, Bell, Palette, CreditCard, Save, RefreshCw, Trash2, Download, Upload, Eye, EyeOff } from 'lucide-react'
// Updated import to the consolidated provider
import { useAuth } from "@/components/providers/auth-provider"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

interface UserSettings {
  profile: {
    name: string
    email: string
    phone: string
    organization: string
    role: string
    bio: string
  }
  security: {
    twoFactorEnabled: boolean
    passwordChangeRequired: boolean
    sessionTimeout: number
    loginNotifications: boolean
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    weeklyReports: boolean
    complianceAlerts: boolean
    documentUpdates: boolean
  }
  appearance: {
    theme: string
    language: string
    timezone: string
    dateFormat: string
    compactMode: boolean
  }
  privacy: {
    profileVisibility: string
    activityTracking: boolean
    dataSharing: boolean
    analyticsOptOut: boolean
  }
}

const defaultSettings: UserSettings = {
  profile: {
    name: "John Doe",
    email: "john.doe@legaleagle.com",
    phone: "+1 (555) 123-4567",
    organization: "Legal Eagle Law Firm",
    role: "Senior Partner",
    bio: "Experienced legal professional specializing in corporate law and compliance.",
  },
  security: {
    twoFactorEnabled: true,
    passwordChangeRequired: false,
    sessionTimeout: 30,
    loginNotifications: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    complianceAlerts: true,
    documentUpdates: true,
  },
  appearance: {
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    compactMode: false,
  },
  privacy: {
    profileVisibility: "team",
    activityTracking: true,
    dataSharing: false,
    analyticsOptOut: false,
  },
}

type ProfileForm = {
  name: string
  email: string
}

export function SettingsManager() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, logout, updateProfile } = useAuth()
  const { theme, setTheme, systemTheme } = useTheme()
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<ProfileForm>({
    name: user?.name ?? "",
    email: user?.email ?? "",
  })
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    inApp: true,
  })
  const [saving, setSaving] = React.useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email] = useState(user?.email || "")
  const [enableEmails, setEnableEmails] = useState(true)
  const [enablePush, setEnablePush] = useState(true)

  useEffect(() => {
    setFirstName(user?.firstName || "")
    setLastName(user?.lastName || "")
  }, [user])

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const onSave = async () => {
    await updateProfile?.({ firstName, lastName })
    toast({
      title: "Settings saved",
      description: "Your profile and preferences have been updated.",
    })
  }

  const onExport = () => {
    const data = {
      user: { firstName, lastName, email },
      preferences: { theme: theme === "system" ? systemTheme : theme, enableEmails, enablePush },
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "legal-eagle-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Could show a toast here if desired
  }

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  const handleSaveProfile = () => {
    // In a real app, call a server action / API. Here we just confirm the action.
    toast({
      title: "Profile updated",
      description: `Display name set to "${profile.name || "—"}".`,
    });
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: `Email: ${notifications.email ? "On" : "Off"} · SMS: ${notifications.sms ? "On" : "Off"}`,
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and system configuration</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" onClick={onSave}>Save changes</Button>
          <Button type="button" variant="outline" onClick={onExport}>Export settings</Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              logout?.()
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your profile, preferences, and notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                type="button"
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates and reminders over email.</p>
              </div>
              <Switch checked={enableEmails} onCheckedChange={setEnableEmails} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Push notifications</Label>
                <p className="text-sm text-muted-foreground">Receive in-app and push notifications.</p>
              </div>
              <Switch checked={enablePush} onCheckedChange={setEnablePush} />
            </div>
          </section>

          <Separator />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings("profile", "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings("profile", "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.profile.phone}
                        onChange={(e) => updateSettings("profile", "phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={settings.profile.organization}
                        onChange={(e) => updateSettings("profile", "organization", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={settings.profile.role}
                      onValueChange={(value) => updateSettings("profile", "role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Senior Partner">Senior Partner</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="Paralegal">Paralegal</SelectItem>
                        <SelectItem value="Legal Assistant">Legal Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.profile.bio}
                      onChange={(e) => updateSettings("profile", "bio", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>Save Profile</Button>
                    <Button variant="outline" onClick={logout}>
                      Log out
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="secondary" onClick={onExport}>
                    Export Data
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.security.twoFactorEnabled}
                        onCheckedChange={(checked) => updateSettings("security", "twoFactorEnabled", checked)}
                      />
                      <Badge variant={settings.security.twoFactorEnabled ? "default" : "secondary"}>
                        {settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Change Password</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="Enter new password" />
                      </div>
                    </div>
                    <Button>Update Password</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                      </div>
                      <Select
                        value={settings.security.sessionTimeout.toString()}
                        onValueChange={(value) => updateSettings("security", "sessionTimeout", Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        checked={settings.security.loginNotifications}
                        onCheckedChange={(checked) => updateSettings("security", "loginNotifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Communication</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={setNotifications}
                          aria-label="Toggle email notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                        </div>
                        <Switch
                          checked={settings.notifications.pushNotifications}
                          onCheckedChange={(checked) => updateSettings("notifications", "pushNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={setNotifications}
                          aria-label="Toggle SMS notifications"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Content</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Receive weekly activity summaries</p>
                        </div>
                        <Switch
                          checked={settings.notifications.weeklyReports}
                          onCheckedChange={(checked) => updateSettings("notifications", "weeklyReports", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Compliance Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about compliance deadlines</p>
                        </div>
                        <Switch
                          checked={settings.notifications.complianceAlerts}
                          onCheckedChange={(checked) => updateSettings("notifications", "complianceAlerts", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Document Updates</Label>
                          <p className="text-sm text-muted-foreground">Notifications when documents are updated</p>
                        </div>
                        <Switch
                          checked={settings.notifications.documentUpdates}
                          onCheckedChange={(checked) => updateSettings("notifications", "documentUpdates", checked)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => logout()}>
                    Log out
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Appearance & Localization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.appearance.theme}
                        onValueChange={(value) => {
                          updateSettings("appearance", "theme", value)
                          setTheme(value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={settings.appearance.language}
                        onValueChange={(value) => updateSettings("appearance", "language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={settings.appearance.timezone}
                        onValueChange={(value) => updateSettings("appearance", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select
                        value={settings.appearance.dateFormat}
                        onValueChange={(value) => updateSettings("appearance", "dateFormat", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSettings("appearance", "compactMode", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => logout()}>
                    Log out
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy & Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => updateSettings("privacy", "profileVisibility", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="team">Team Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Activity Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow tracking of your activity for analytics</p>
                      </div>
                      <Switch
                        checked={settings.privacy.activityTracking}
                        onCheckedChange={(checked) => updateSettings("privacy", "activityTracking", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share anonymized data to improve the platform</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) => updateSettings("privacy", "dataSharing", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Analytics Opt-out</Label>
                        <p className="text-sm text-muted-foreground">Opt out of all analytics and tracking</p>
                      </div>
                      <Switch
                        checked={settings.privacy.analyticsOptOut}
                        onCheckedChange={(checked) => updateSettings("privacy", "analyticsOptOut", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={onExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Settings
                      </Button>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => logout()}>
                    Log out
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Billing & Subscription</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Current Plan</h4>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Enterprise Plan</span>
                          <Badge>Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Full access to all features and unlimited users
                        </p>
                        <div className="text-2xl font-bold">$99/month</div>
                        <p className="text-sm text-muted-foreground">Next billing date: February 15, 2024</p>
                      </div>
                      <Button className="w-full">Manage Subscription</Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Usage This Month</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Documents Processed</span>
                          <span className="font-medium">1,247 / Unlimited</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI Queries</span>
                          <span className="font-medium">3,456 / Unlimited</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Storage Used</span>
                          <span className="font-medium">2.4 GB / 100 GB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team Members</span>
                          <span className="font-medium">12 / Unlimited</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Method</h4>
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Billing History</h4>
                    <div className="space-y-2">
                      {[
                        { date: "Jan 15, 2024", amount: "$99.00", status: "Paid" },
                        { date: "Dec 15, 2023", amount: "$99.00", status: "Paid" },
                        { date: "Nov 15, 2023", amount: "$99.00", status: "Paid" },
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.date}</p>
                            <p className="text-sm text-muted-foreground">Enterprise Plan</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{invoice.amount}</p>
                            <Badge variant="secondary">{invoice.status}</Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => logout()}>
                    Log out
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsManager;
