"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"

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

export function SettingsManager() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "legal-eagle-settings.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and system configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

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
            </CardContent>
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Communication</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
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
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSettings("notifications", "smsNotifications", checked)}
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
            </CardContent>
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
                  <Button variant="outline" onClick={handleExportData}>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
