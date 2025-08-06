import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WorkoutData, UserProfile } from '@/types/fitness'
import { calculateStreak, getActiveDays, formatDate } from '@/lib/utils'
import {
  Activity,
  Calendar,
  Flame,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardProps {
  workouts: WorkoutData[]
  userProfile: UserProfile
}

export function Dashboard({ workouts, userProfile }: DashboardProps) {
  const totalWorkouts = workouts.length
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0)
  const activeDays = getActiveDays(workouts)
  const currentStreak = calculateStreak(workouts)

  // Prepare chart data for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayWorkouts = workouts.filter(w => w.date === dateStr)
    const calories = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      calories,
      workouts: dayWorkouts.length
    }
  })

  const recentWorkouts = workouts.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile.name}!</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +180 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDays}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No workouts yet. Start your fitness journey!
                </p>
              ) : (
                recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(workout.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {workout.duration}m
                        </Badge>
                        <Badge variant="outline">
                          <Flame className="h-3 w-3 mr-1" />
                          {workout.caloriesBurned}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userProfile.goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{goal.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.current} {goal.unit}</span>
                      <span>{goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
