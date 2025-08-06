import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UserProfile } from '@/types/fitness'
import { useTheme } from './theme-provider'
import { User, Settings as SettingsIcon, Bell, Palette, Save } from 'lucide-react'
import { useState } from 'react'

interface SettingsProps {
  userProfile: UserProfile
  onUpdateProfile: (profile: Partial<UserProfile>) => void
}

export function Settings({ userProfile, onUpdateProfile }: SettingsProps) {
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState(userProfile)
  const [hasChanges, setHasChanges] = useState(false)

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updatePreferences = (field: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }))
    setHasChanges(true)
  }

  const saveChanges = () => {
    onUpdateProfile(profile)
    setHasChanges(false)
  }

  const resetChanges = () => {
    setProfile(userProfile)
    setHasChanges(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetChanges}>
              Reset
            </Button>
            <Button onClick={saveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => updateProfile('age', Number(e.target.value))}
                  placeholder="Age"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight ({profile.preferences.units === 'metric' ? 'kg' : 'lbs'})</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => updateProfile('weight', Number(e.target.value))}
                  placeholder="Weight"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="height">Height ({profile.preferences.units === 'metric' ? 'cm' : 'inches'})</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => updateProfile('height', Number(e.target.value))}
                placeholder="Height"
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Units</Label>
              <Select
                value={profile.preferences.units}
                onValueChange={(value: 'metric' | 'imperial') => updatePreferences('units', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive workout reminders and progress updates
                </p>
              </div>
              <Switch
                checked={profile.preferences.notifications}
                onCheckedChange={(checked) => updatePreferences('notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme or use system setting
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">
                Download your workout data and progress
              </p>
              <Button variant="outline" className="w-full">
                Export Workout Data
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Clear Data</h4>
              <p className="text-sm text-muted-foreground">
                Remove all workout data and reset the app
              </p>
              <Button variant="destructive" className="w-full">
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{userProfile.goals.length}</p>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.age}</p>
              <p className="text-sm text-muted-foreground">Age</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profile.weight} {profile.preferences.units === 'metric' ? 'kg' : 'lbs'}
              </p>
              <p className="text-sm text-muted-foreground">Weight</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profile.height} {profile.preferences.units === 'metric' ? 'cm' : 'in'}
              </p>
              <p className="text-sm text-muted-foreground">Height</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
