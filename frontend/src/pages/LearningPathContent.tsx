import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  ArrowRight, 
  X,
  Plus,
  FileText,
  BookOpen,
  HelpCircle,
  Upload,
  Library,
  GripVertical,
  Edit,
  MoreHorizontal,
  Calendar,
  Users
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const contentTypes = [
  { id: 'stage', title: 'Stage', icon: GripVertical, color: 'bg-muted text-muted-foreground' },
  { id: 'course', title: 'Course', icon: BookOpen, color: 'bg-content-course text-white' },
  { id: 'page', title: 'Page', icon: FileText, color: 'bg-content-page text-white' },
  { id: 'quiz', title: 'Quiz', icon: HelpCircle, color: 'bg-content-quiz text-white' },
  { id: 'upload', title: 'Upload', icon: Upload, color: 'bg-muted text-muted-foreground' },
  { id: 'library', title: 'Library', icon: Library, color: 'bg-muted text-muted-foreground' }
]

const mockContentItems = [
  {
    id: '1',
    type: 'page',
    title: 'Consistantbility Margin and padding',
    description: 'Enhance button accessibility for improved user interface.',
    chapters: 10,
    updatedAt: '28 Aug 2022',
    status: 'published'
  },
  {
    id: '2', 
    type: 'page',
    title: 'Good Space to design element card',
    description: 'Ample Space for Crafting Stylish Element Cards',
    chapters: 8,
    updatedAt: '28 Aug 2022',
    status: 'published'
  },
  {
    id: '3',
    type: 'page',
    title: 'Creating More Attractive Designs',
    description: 'In this course, you will learn the principles and techniques behind creating more attractive designs',
    chapters: 3,
    updatedAt: '28 Aug 2022',
    status: 'published'
  },
  {
    id: '4',
    type: 'quiz',
    title: 'How to layouting clean design',
    description: 'Test your understanding of button design principles and methodology in this interactive quiz for the course.',
    questions: 24,
    updatedAt: '28 Aug 2022',
    status: 'published'
  }
]

export default function LearningPathContent() {
  const navigate = useNavigate()
  const [newStageName, setNewStageName] = useState('')

  const handleContinue = () => {
    navigate('/learning-path/assign-learners')
  }

  const getTypeIcon = (type: string) => {
    const contentType = contentTypes.find(t => t.id === type)
    return contentType ? contentType.icon : FileText
  }

  const getTypeColor = (type: string) => {
    const colors = {
      page: 'bg-content-page',
      quiz: 'bg-content-quiz',
      course: 'bg-content-course',
      assignment: 'bg-content-assignment'
    }
    return colors[type as keyof typeof colors] || 'bg-muted'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/learning-path/overview')}
            >
              <X className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Create Learning Path</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Next: <span className="font-medium">Assign Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/learning-path/overview')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleContinue}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              2
            </div>
            <span className="font-medium text-primary">Add Content</span>
          </div>
          <div className="flex-1 h-1 bg-muted rounded-full">
            <div className="h-full w-2/3 bg-gradient-primary rounded-full" />
          </div>
          <div className="text-sm text-muted-foreground">Step 2 of 3</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Path Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-content-path rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-medium">Learning Path</h2>
                    <h3 className="text-lg font-semibold">General Knowledge & Methodology - Layout & Spacing</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Combining good layout design and spacing design in Figma will result in a more professional, structured, and aesthetic design, ensuring a better user experience when using a product or website.
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">Prototyping</Badge>
                    <Badge variant="outline" className="text-xs">Not Urgent</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Estimated 1 Weeks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>English</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Types */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">CONTENT</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {contentTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className="cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mx-auto`}>
                        <type.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{type.title}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Items */}
            <div className="space-y-4">
              {/* Junior Stage Header */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Junior</span>
                </div>
              </div>

              {/* Content List */}
              <div className="space-y-3">
                {mockContentItems.map((item, index) => (
                  <div key={item.id}>
                    <Card className="group hover:shadow-card transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                            <div className={`w-8 h-8 ${getTypeColor(item.type)} rounded-lg flex items-center justify-center`}>
                              {React.createElement(getTypeIcon(item.type), { className: "w-4 h-4 text-white" })}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-card-foreground">{item.title}</h4>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-success/10 text-success"
                                >
                                  {item.type === 'page' ? 'Page' : 'Quiz'}
                                </Badge>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-success/10 text-success"
                                >
                                  Published
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate('/learning-path/notes')}
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                {item.type === 'quiz' ? `${item.questions} questions` : `${item.chapters} Chapter`}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Updated {item.updatedAt}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {index < mockContentItems.length - 1 && (
                      <div className="flex justify-center py-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Stage */}
              <div className="flex items-center space-x-2 pt-4">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Add stage name"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="max-w-xs"
                />
                {newStageName && (
                  <Button size="sm" variant="outline">
                    Add Stage
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Content Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total items</span>
                    <span className="font-medium">4 items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pages</span>
                    <span className="font-medium">3 pages</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quizzes</span>
                    <span className="font-medium">1 quiz</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Est. duration</span>
                    <span className="font-medium">2-3 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Setup Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Add content and assign learners to complete setup
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}