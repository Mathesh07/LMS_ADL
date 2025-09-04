import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  ClipboardList, 
  Route, 
  Library,
  Sparkles,
  Clock,
  Users,
  BookMarked
} from "lucide-react"

interface CreateContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contentTypes = [
  {
    id: 'course',
    title: 'Course',
    description: 'Create and publish educational content for learners.',
    icon: BookOpen,
    color: 'bg-content-course-secondary text-content-course',
    featured: false
  },
  {
    id: 'page',
    title: 'Page', 
    description: 'Create a standalone pages containing educational content.',
    icon: FileText,
    color: 'bg-content-page-secondary text-content-page',
    featured: true
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Create an assessment that evaluate learners understanding of the material.',
    icon: HelpCircle,
    color: 'bg-content-quiz-secondary text-content-quiz',
    featured: false
  },
  {
    id: 'assignment',
    title: 'Assignment',
    description: 'Create assignments for learners to do within a certain deadline.',
    icon: ClipboardList,
    color: 'bg-content-assignment-secondary text-content-assignment',
    featured: false
  },
  {
    id: 'learning-path',
    title: 'Learning Path',
    description: 'Create a structured and sequenced journey for learners to follow.',
    icon: Route,
    color: 'bg-content-path-secondary text-content-path',
    featured: false
  },
  {
    id: 'wiki',
    title: 'Wiki',
    description: 'Create a knowledge base where information related to the course.',
    icon: Library,
    color: 'bg-muted text-muted-foreground',
    featured: true
  }
]

export function CreateContentModal({ open, onOpenChange }: CreateContentModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleCreateContent = (typeId: string) => {
    setSelectedType(typeId)
    // Handle content creation logic here
    console.log('Creating content of type:', typeId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create new content</DialogTitle>
          <DialogDescription>
            Choose the type of content you want to create for your learners.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {contentTypes.map((type) => (
            <div
              key={type.id}
              className="relative group cursor-pointer rounded-lg border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 p-4 space-y-3"
              onClick={() => handleCreateContent(type.id)}
            >
              {type.featured && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-primary text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Powered</span>
                  </div>
                </div>
              )}

              <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                <type.icon className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {type.description}
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>5-10 min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Multi-user</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}