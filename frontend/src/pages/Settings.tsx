import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Lock,
  Key,
  Database,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react'

const mockSettings = {
  profile: {
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'America/New_York',
    language: 'en',
    profileVisibility: 'public'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    roadmapUpdates: true,
    groupMessages: true,
    achievements: true,
    weeklyDigest: true,
    marketingEmails: false,
    soundEnabled: true,
    desktopNotifications: true
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showProgress: true,
    showAchievements: true,
    allowGroupInvites: true,
    allowDirectMessages: true,
    dataCollection: true,
    analyticsTracking: false
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    highContrast: false,
    reducedMotion: false
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: '24h',
    loginAlerts: true,
    deviceTracking: true,
    passwordLastChanged: '2024-02-15'
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.profile.displayName}
                      onChange={(e) => updateSetting('profile', 'displayName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.profile.timezone} onValueChange={(value) => updateSetting('profile', 'timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.profile.language} onValueChange={(value) => updateSetting('profile', 'language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Notifications</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Push Notifications</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Group Messages</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">Notifications for study group messages</p>
                    </div>
                    <Switch
                      checked={settings.notifications.groupMessages}
                      onCheckedChange={(checked) => updateSetting('notifications', 'groupMessages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <span>Sound Notifications</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'soundEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select value={settings.privacy.profileVisibility} onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private - Only me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Display email on your public profile</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) => updateSetting('privacy', 'showEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Learning Progress</Label>
                      <p className="text-sm text-muted-foreground">Display roadmap progress publicly</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showProgress}
                      onCheckedChange={(checked) => updateSetting('privacy', 'showProgress', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow Group Invites</Label>
                      <p className="text-sm text-muted-foreground">Let others invite you to study groups</p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowGroupInvites}
                      onCheckedChange={(checked) => updateSetting('privacy', 'allowGroupInvites', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.appearance.theme} onValueChange={(value) => updateSetting('appearance', 'theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center space-x-2">
                            <Sun className="w-4 h-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center space-x-2">
                            <Moon className="w-4 h-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center space-x-2">
                            <Monitor className="w-4 h-4" />
                            <span>System</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={settings.appearance.fontSize} onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable interface animations</p>
                    </div>
                    <Switch
                      checked={settings.appearance.showAnimations}
                      onCheckedChange={(checked) => updateSetting('appearance', 'showAnimations', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <Key className="w-4 h-4" />
                        <span>Two-Factor Authentication</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {settings.security.twoFactorEnabled ? (
                        <Badge variant="default">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select value={settings.security.sessionTimeout} onValueChange={(value) => updateSetting('security', 'sessionTimeout', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="8h">8 Hours</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={settings.security.loginAlerts}
                      onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Password</Label>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Export Data</Label>
                    <p className="text-sm text-muted-foreground">Download all your data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
