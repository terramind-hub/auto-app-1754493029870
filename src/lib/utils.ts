import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function calculateCaloriesBurned(duration: number, intensity: 'low' | 'medium' | 'high' = 'medium'): number {
  const baseRate = {
    low: 5,
    medium: 8,
    high: 12
  }
  return Math.round(duration * baseRate[intensity])
}

export function calculateStreak(workouts: { date: string }[]): number {
  if (workouts.length === 0) return 0
  
  const sortedDates = workouts
    .map(w => new Date(w.date))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const workoutDate of sortedDates) {
    workoutDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
      streak++
      currentDate = new Date(workoutDate)
    } else {
      break
    }
  }
  
  return streak
}

export function getActiveDays(workouts: { date: string }[]): number {
  const uniqueDates = new Set(workouts.map(w => w.date))
  return uniqueDates.size
}
