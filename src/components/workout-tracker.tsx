import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Exercise, WorkoutData, WorkoutExercise, WorkoutSet } from '@/types/fitness'
import { calculateCaloriesBurned } from '@/lib/utils'
import { Plus, Trash2, Save, Timer } from 'lucide-react'

interface WorkoutTrackerProps {
  exercises: Exercise[]
  onAddWorkout: (workout: WorkoutData) => void
}

export function WorkoutTracker({ exercises, onAddWorkout }: WorkoutTrackerProps) {
  const [workoutName, setWorkoutName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([])
  const [duration, setDuration] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const addExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId)
    if (!exercise) return

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [{ reps: 0, weight: 0 }],
      notes: ''
    }

    setSelectedExercises(prev => [...prev, newExercise])
  }

  const removeExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index))
  }

  const updateExercise = (exerciseIndex: number, field: keyof WorkoutExercise, value: any) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex ? { ...exercise, [field]: value } : exercise
    ))
  }

  const addSet = (exerciseIndex: number) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex 
        ? { ...exercise, sets: [...exercise.sets, { reps: 0, weight: 0 }] }
        : exercise
    ))
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex 
        ? { ...exercise, sets: exercise.sets.filter((_, j) => j !== setIndex) }
        : exercise
    ))
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: number) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex 
        ? {
            ...exercise,
            sets: exercise.sets.map((set, j) => 
              j === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ))
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    setStartTime(new Date())
  }

  const stopTimer = () => {
    if (startTime) {
      const endTime = new Date()
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
      setDuration(durationMinutes)
    }
    setIsTimerRunning(false)
    setStartTime(null)
  }

  const saveWorkout = () => {
    if (!workoutName || selectedExercises.length === 0) return

    const caloriesBurned = calculateCaloriesBurned(duration, 'medium')
    
    const workout: WorkoutData = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      name: workoutName,
      exercises: selectedExercises,
      duration,
      caloriesBurned,
      notes: ''
    }

    onAddWorkout(workout)
    
    // Reset form
    setWorkoutName('')
    setSelectedExercises([])
    setDuration(0)
    setIsTimerRunning(false)
    setStartTime(null)
  }

  const availableExercises = exercises.filter(
    exercise => !selectedExercises.some(se => se.exerciseId === exercise.id)
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workout Tracker</h1>
        <p className="text-muted-foreground">Log your workout and track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Setup */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Timer</Label>
                  <Button
                    variant={isTimerRunning ? "destructive" : "default"}
                    onClick={isTimerRunning ? stopTimer : startTimer}
                    className="flex items-center gap-2"
                  >
                    <Timer className="h-4 w-4" />
                    {isTimerRunning ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Add Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={addExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {availableExercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      <div className="flex items-center gap-2">
                        <span>{exercise.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {exercise.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Selected Exercises */}
          {selectedExercises.map((exercise, exerciseIndex) => (
            <Card key={exerciseIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{exercise.exerciseName}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exerciseIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-12">Set {setIndex + 1}</span>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Reps</Label>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Weight (lbs)</Label>
                        <Input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      disabled={exercise.sets.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exerciseIndex)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workout Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exercises:</span>
                  <span className="font-medium">{selectedExercises.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sets:</span>
                  <span className="font-medium">
                    {selectedExercises.reduce((total, exercise) => total + exercise.sets.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">{duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Calories:</span>
                  <span className="font-medium">{calculateCaloriesBurned(duration, 'medium')}</span>
                </div>
              </div>
              
              <Button
                onClick={saveWorkout}
                disabled={!workoutName || selectedExercises.length === 0}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
