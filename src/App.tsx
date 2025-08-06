import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { Sidebar } from './components/sidebar'
import { Dashboard } from './components/dashboard'
import { WorkoutTracker } from './components/workout-tracker'
import { ExerciseLibrary } from './components/exercise-library'
import { ProgressCharts } from './components/progress-charts'
import { Goals } from './components/goals'
import { Settings } from './components/settings'
import { useLocalStorage } from './hooks/use-local-storage'
import { WorkoutData, UserProfile, Exercise } from './types/fitness'
import { sampleWorkouts, sampleExercises, defaultUserProfile } from './data/sample-data'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [workouts, setWorkouts] = useLocalStorage<WorkoutData[]>('fitness-workouts', sampleWorkouts)
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('fitness-profile', defaultUserProfile)
  const [exercises] = useLocalStorage<Exercise[]>('fitness-exercises', sampleExercises)

  const addWorkout = (workout: WorkoutData) => {
    setWorkouts(prev => [workout, ...prev])
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }))
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard workouts={workouts} userProfile={userProfile} />
      case 'workout':
        return <WorkoutTracker exercises={exercises} onAddWorkout={addWorkout} />
      case 'exercises':
        return <ExerciseLibrary exercises={exercises} />
      case 'progress':
        return <ProgressCharts workouts={workouts} />
      case 'goals':
        return <Goals userProfile={userProfile} onUpdateProfile={updateUserProfile} />
      case 'settings':
        return <Settings userProfile={userProfile} onUpdateProfile={updateUserProfile} />
      default:
        return <Dashboard workouts={workouts} userProfile={userProfile} />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="fitness-theme">
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
