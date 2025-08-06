export interface Exercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility'
  muscleGroups: string[]
  equipment?: string
  instructions?: string
}

export interface WorkoutSet {
  reps: number
  weight?: number
  duration?: number
  distance?: number
}

export interface WorkoutExercise {
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
  notes?: string
}

export interface WorkoutData {
  id: string
  date: string
  name: string
  exercises: WorkoutExercise[]
  duration: number
  caloriesBurned: number
  notes?: string
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  category: 'weight' | 'cardio' | 'strength' | 'general'
}

export interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  goals: Goal[]
  preferences: {
    units: 'metric' | 'imperial'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export interface DashboardMetrics {
  totalWorkouts: number
  caloriesBurned: number
  activeDays: number
  currentStreak: number
}
