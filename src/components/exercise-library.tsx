import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Exercise } from '@/types/fitness'
import { Search, Dumbbell, Heart, Zap } from 'lucide-react'

interface ExerciseLibraryProps {
  exercises: Exercise[]
}

export function ExerciseLibrary({ exercises }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(group => 
                           group.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <Dumbbell className="h-4 w-4" />
      case 'cardio':
        return <Heart className="h-4 w-4" />
      case 'flexibility':
        return <Zap className="h-4 w-4" />
      default:
        return <Dumbbell className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'cardio':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'flexibility':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const strengthExercises = filteredExercises.filter(e => e.category === 'strength')
  const cardioExercises = filteredExercises.filter(e => e.category === 'cardio')
  const flexibilityExercises = filteredExercises.filter(e => e.category === 'flexibility')

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
            {getCategoryIcon(exercise.category)}
            {exercise.category}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Muscle Groups</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.map((group, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        </div>
        
        {exercise.equipment && (
          <div>
            <h4 className="text-sm font-medium mb-1">Equipment</h4>
            <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
          </div>
        )}
        
        {exercise.instructions && (
          <div>
            <h4 className="text-sm font-medium mb-1">Instructions</h4>
            <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground">Browse and learn about different exercises</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises or muscle groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredExercises.length})</TabsTrigger>
          <TabsTrigger value="strength">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Strength ({strengthExercises.length})
            </div>
          </TabsTrigger>
          <TabsTrigger value="cardio">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Cardio ({cardioExercises.length})
            </div>
          </TabsTrigger>
          <TabsTrigger value="flexibility">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Flexibility ({flexibilityExercises.length})
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strength" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengthExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cardio" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardioExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flexibility" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flexibilityExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exercises found matching your search.</p>
        </div>
      )}
    </div>
  )
}
