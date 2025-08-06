import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  Dumbbell,
  BookOpen,
  TrendingUp,
  Target,
  Settings,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from './theme-provider'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'exercises', label: 'Exercises', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">FitTracker</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    activeTab === item.id && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-full justify-start gap-3"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
      </div>
    </div>
  )
}
