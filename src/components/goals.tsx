import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { UserProfile, Goal } from '@/types/fitness'
import { Target, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react'

interface GoalsProps {
  userProfile: UserProfile
  onUpdateProfile: (profile: Partial<UserProfile>) => void
}

export function Goals({ userProfile, onUpdateProfile }: GoalsProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    category: 'general' as Goal['category']
  })

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal
    }

    onUpdateProfile({
      goals: [...userProfile.goals, goal]
    })

    setNewGoal({
      title: '',
      target: 0,
      current: 0,
      unit: '',
      deadline: '',
      category: 'general'
    })
    setIsAddingGoal(false)
  }

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = userProfile.goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    )
    onUpdateProfile({ goals: updatedGoals })
  }

  const deleteGoal = (goalId: string) => {
    const updatedGoals = userProfile.goals.filter(goal => goal.id !== goalId)
    onUpdateProfile({ goals: updatedGoals })
  }

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'weight':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'cardio':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'strength':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals & Targets</h1>
          <p className="text-muted-foreground">Set and track your fitness goals</p>
        </div>
        <Button onClick={() => setIsAddingGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add New Goal Form */}
      {isAddingGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Lose 10 pounds"
                />
              </div>
              <div>
                <Label htmlFor="goal-category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value: Goal['category']) => setNewGoal(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal-target">Target</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="goal-unit">Unit</Label>
                <Input
                  id="goal-unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., lbs, minutes, reps"
                />
              </div>
              <div>
                <Label htmlFor="goal-current">Current Progress</Label>
                <Input
                  id="goal-current"
                  type="number"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, current: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="goal-deadline">Deadline</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addGoal}>Add Goal</Button>
              <Button variant="outline" onClick={() => setIsAddingGoal(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProfile.goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const daysLeft = getDaysUntilDeadline(goal.deadline)
          const isOverdue = daysLeft < 0
          const isNearDeadline = daysLeft <= 7 && daysLeft >= 0

          return (
            <Card key={goal.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      {isNearDeadline && (
                        <Badge variant="outline" className="text-orange-600">
                          Due Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGoal(goal.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isOverdue 
                        ? `${Math.abs(daysLeft)} days overdue`
                        : daysLeft === 0 
                        ? 'Due today'
                        : `${daysLeft} days left`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {progress >= 100 ? 'Complete!' : 'In Progress'}
                    </span>
                  </div>
                </div>

                {editingGoal === goal.id && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor={`current-${goal.id}`}>Update Progress</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`current-${goal.id}`}
                        type="number"
                        value={goal.current}
                        onChange={(e) => updateGoal(goal.id, { current: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => setEditingGoal(null)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {userProfile.goals.length === 0 && !isAddingGoal && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No goals set yet</h3>
            <p className="text-muted-foreground mb-4">
              Set your first fitness goal to start tracking your progress
            </p>
            <Button onClick={() => setIsAddingGoal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
