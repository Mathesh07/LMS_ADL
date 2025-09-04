import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export interface LearningContent {
  id: string
  title: string
  description: string
  type: 'course' | 'page' | 'quiz' | 'assignment' | 'path'
  category: string
  priority: 'Urgent' | 'Not Urgent'
  assignedCount: number
  progress: number
  lastEdited: string
  status: 'completed' | 'in-progress' | 'not-started'
  imageUrl?: string
}

interface LearningContentCardProps {
  content: LearningContent
}

const getTypeStyles = (type: LearningContent['type']) => {
  const styles = {
    course: 'bg-content-course text-white',
    page: 'bg-content-page text-white', 
    quiz: 'bg-content-quiz text-white',
    assignment: 'bg-content-assignment text-white',
    path: 'bg-content-path text-white'
  }
  return styles[type] || styles.course
}

const getTypeGradient = (type: LearningContent['type']) => {
  const gradients = {
    course: 'from-purple-400 via-purple-500 to-purple-600',
    page: 'from-orange-400 via-orange-500 to-orange-600',
    quiz: 'from-green-400 via-green-500 to-green-600', 
    assignment: 'from-blue-400 via-blue-500 to-blue-600',
    path: 'from-pink-400 via-pink-500 to-pink-600'
  }
  return gradients[type] || gradients.course
}

export function LearningContentCard({ content }: LearningContentCardProps) {
  const navigate = useNavigate()
  const {
    id,
    title,
    description,
    type,
    category,
    priority,
    assignedCount,
    progress,
    lastEdited,
    status
  } = content

  const handleCardClick = () => {
    navigate(`/learning-path/${id}`)
  }

  return (
    <Card 
      className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-whitesmoke border-black cursor-pointer" 
      onClick={handleCardClick}
    >
      {/* Header Image/Gradient */}
      <div className={`h-24 bg-gradient-to-br ${getTypeGradient(type)} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {assignedCount} Assigned
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3 bg-transparent">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-card-foreground">{category}</span>
            <Badge 
              variant={priority === 'Urgent' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {priority}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{assignedCount}</span>
          </div>
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-card-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Edited {lastEdited}</span>
          </div>
          <div className="flex items-center space-x-1">
            {status === 'completed' && (
              <div className="w-2 h-2 bg-success rounded-full" />
            )}
            {status === 'in-progress' && (
              <div className="w-2 h-2 bg-warning rounded-full" />
            )}
            {status === 'not-started' && (
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            )}
            <span className="text-xs text-muted-foreground capitalize">
              {status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}