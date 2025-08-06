import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkoutData } from '@/types/fitness'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, Calendar, Flame, Activity } from 'lucide-react'

interface ProgressChartsProps {
  workouts: WorkoutData[]
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  // Prepare data for different charts
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  const dailyData = last30Days.map(date => {
    const dayWorkouts = workouts.filter(w => w.date === date)
    const totalCalories = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    const totalDuration = dayWorkouts.reduce((sum, w) => sum + w.duration, 0)
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: totalCalories,
      duration: totalDuration,
      workouts: dayWorkouts.length
    }
  })

  // Weekly aggregation
  const weeklyData = []
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i * 7 + 6))
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - (i * 7))
    
    const weekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekStart && workoutDate <= weekEnd
    })
    
    weeklyData.unshift({
      week: `Week ${4 - i}`,
      workouts: weekWorkouts.length,
      calories: weekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      duration: weekWorkouts.reduce((sum, w) => sum + w.duration, 0)
    })
  }

  // Exercise category distribution
  const exerciseCategories = workouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      // Simple categorization based on exercise name
      let category = 'Other'
      const name = exercise.exerciseName.toLowerCase()
      
      if (name.includes('run') || name.includes('cardio') || name.includes('cycling')) {
        category = 'Cardio'
      } else if (name.includes('press') || name.includes('squat') || name.includes('deadlift') || name.includes('pull')) {
        category = 'Strength'
      } else if (name.includes('yoga') || name.includes('stretch')) {
        category = 'Flexibility'
      }
      
      acc[category] = (acc[category] || 0) + exercise.sets.length
    })
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(exerciseCategories).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  // Weight progression (mock data for demonstration)
  const weightProgressionData = [
    { date: 'Week 1', benchPress: 135, squat: 185, deadlift: 225 },
    { date: 'Week 2', benchPress: 140, squat: 190, deadlift: 235 },
    { date: 'Week 3', benchPress: 145, squat: 195, deadlift: 245 },
    { date: 'Week 4', benchPress: 150, squat: 200, deadlift: 255 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Charts</h1>
        <p className="text-muted-foreground">Visualize your fitness journey and track improvements</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Daily Workout Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="workouts" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Workouts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Daily Calories Burned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#ff6b6b" 
                      strokeWidth={2}
                      dot={{ fill: '#ff6b6b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Calories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weightProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="benchPress" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Bench Press"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="squat" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Squat"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deadlift" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    name="Deadlift"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workout Duration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
