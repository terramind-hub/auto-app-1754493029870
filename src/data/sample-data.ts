import { WorkoutData, Exercise, UserProfile } from '../types/fitness'

export const sampleExercises: Exercise[] = [
  // Strength exercises
  {
    id: '1',
    name: 'Bench Press',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    instructions: 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up'
  },
  {
    id: '2',
    name: 'Squats',
    category: 'strength',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: 'barbell',
    instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing'
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'strength',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'traps'],
    equipment: 'barbell',
    instructions: 'Stand with feet hip-width apart, grip bar, lift by extending hips and knees'
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'strength',
    muscleGroups: ['lats', 'biceps', 'rhomboids'],
    equipment: 'pull-up bar',
    instructions: 'Hang from bar with overhand grip, pull body up until chin clears bar'
  },
  {
    id: '5',
    name: 'Push-ups',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight',
    instructions: 'Start in plank position, lower body to ground, push back up'
  },
  // Cardio exercises
  {
    id: '6',
    name: 'Running',
    category: 'cardio',
    muscleGroups: ['legs', 'cardiovascular'],
    equipment: 'none',
    instructions: 'Maintain steady pace, focus on breathing and form'
  },
  {
    id: '7',
    name: 'Cycling',
    category: 'cardio',
    muscleGroups: ['legs', 'cardiovascular'],
    equipment: 'bicycle',
    instructions: 'Maintain consistent cadence, adjust resistance as needed'
  },
  {
    id: '8',
    name: 'Rowing',
    category: 'cardio',
    muscleGroups: ['back', 'legs', 'arms', 'cardiovascular'],
    equipment: 'rowing machine',
    instructions: 'Drive with legs, lean back slightly, pull handle to chest'
  },
  // Flexibility exercises
  {
    id: '9',
    name: 'Yoga Flow',
    category: 'flexibility',
    muscleGroups: ['full body'],
    equipment: 'yoga mat',
    instructions: 'Flow through poses with controlled breathing'
  },
  {
    id: '10',
    name: 'Static Stretching',
    category: 'flexibility',
    muscleGroups: ['full body'],
    equipment: 'none',
    instructions: 'Hold stretches for 30-60 seconds, breathe deeply'
  }
]

export const sampleWorkouts: WorkoutData[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    name: 'Upper Body Strength',
    exercises: [
      {
        exerciseId: '1',
        exerciseName: 'Bench Press',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 175 }
        ]
      },
      {
        exerciseId: '4',
        exerciseName: 'Pull-ups',
        sets: [
          { reps: 8 },
          { reps: 6 },
          { reps: 5 }
        ]
      },
      {
        exerciseId: '5',
        exerciseName: 'Push-ups',
        sets: [
          { reps: 20 },
          { reps: 18 },
          { reps: 15 }
        ]
      }
    ],
    duration: 45,
    caloriesBurned: 320
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    name: 'Cardio Session',
    exercises: [
      {
        exerciseId: '6',
        exerciseName: 'Running',
        sets: [
          { duration: 30, distance: 5 }
        ]
      }
    ],
    duration: 30,
    caloriesBurned: 350
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    name: 'Lower Body Strength',
    exercises: [
      {
        exerciseId: '2',
        exerciseName: 'Squats',
        sets: [
          { reps: 12, weight: 185 },
          { reps: 10, weight: 205 },
          { reps: 8, weight: 225 }
        ]
      },
      {
        exerciseId: '3',
        exerciseName: 'Deadlift',
        sets: [
          { reps: 8, weight: 225 },
          { reps: 6, weight: 245 },
          { reps: 4, weight: 265 }
        ]
      }
    ],
    duration: 50,
    caloriesBurned: 380
  }
]

export const defaultUserProfile: UserProfile = {
  name: 'John Doe',
  age: 28,
  weight: 175,
  height: 70,
  goals: [
    {
      id: '1',
      title: 'Lose 10 pounds',
      target: 10,
      current: 3,
      unit: 'lbs',
      deadline: '2024-06-01',
      category: 'weight'
    },
    {
      id: '2',
      title: 'Run 5K in under 25 minutes',
      target: 25,
      current: 28,
      unit: 'minutes',
      deadline: '2024-05-01',
      category: 'cardio'
    },
    {
      id: '3',
      title: 'Bench press bodyweight',
      target: 175,
      current: 155,
      unit: 'lbs',
      deadline: '2024-07-01',
      category: 'strength'
    }
  ],
  preferences: {
    units: 'imperial',
    theme: 'light',
    notifications: true
  }
}
