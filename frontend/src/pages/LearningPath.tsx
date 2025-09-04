import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Upload, 
  Users, 
  Settings,
  Play,
  Clock,
  CheckCircle,
  Plus,
  Edit3,
  MoreHorizontal
} from "lucide-react"

// Mock data for learning paths
const mockLearningPaths = {
  '1': {
    id: '1',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the principles of user interface and experience design',
    category: 'Design & User Experience',
    progress: 65,
    totalModules: 8,
    completedModules: 5,
    enrolledStudents: 24,
    lastUpdated: '2 hours ago',
    status: 'published',
    modules: [
      { id: '1', title: 'Introduction to Design Thinking', type: 'course', duration: '45 min', completed: true },
      { id: '2', title: 'User Research Methods', type: 'course', duration: '60 min', completed: true },
      { id: '3', title: 'Wireframing Basics', type: 'assignment', duration: '30 min', completed: true },
      { id: '4', title: 'Design Systems Quiz', type: 'quiz', duration: '15 min', completed: true },
      { id: '5', title: 'Prototyping Workshop', type: 'course', duration: '90 min', completed: true },
      { id: '6', title: 'Usability Testing', type: 'assignment', duration: '45 min', completed: false },
      { id: '7', title: 'Design Critique Session', type: 'course', duration: '60 min', completed: false },
      { id: '8', title: 'Final Project Submission', type: 'assignment', duration: '120 min', completed: false }
    ]
  },
  '2': {
    id: '2',
    title: 'React Development Best Practices',
    description: 'Learn modern React development patterns and best practices',
    category: 'Frontend Development',
    progress: 40,
    totalModules: 10,
    completedModules: 4,
    enrolledStudents: 18,
    lastUpdated: '1 day ago',
    status: 'published',
    modules: [
      { id: '1', title: 'React Fundamentals', type: 'course', duration: '75 min', completed: true },
      { id: '2', title: 'Component Architecture', type: 'course', duration: '60 min', completed: true },
      { id: '3', title: 'State Management Quiz', type: 'quiz', duration: '20 min', completed: true },
      { id: '4', title: 'Hooks Deep Dive', type: 'course', duration: '90 min', completed: true },
      { id: '5', title: 'Custom Hooks Assignment', type: 'assignment', duration: '45 min', completed: false },
      { id: '6', title: 'Context API Workshop', type: 'course', duration: '60 min', completed: false },
      { id: '7', title: 'Performance Optimization', type: 'course', duration: '75 min', completed: false },
      { id: '8', title: 'Testing React Components', type: 'assignment', duration: '60 min', completed: false },
      { id: '9', title: 'Advanced Patterns Quiz', type: 'quiz', duration: '25 min', completed: false },
      { id: '10', title: 'Final Project', type: 'assignment', duration: '180 min', completed: false }
    ]
  },
  '3': {
    id: '3',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive guide to data structures and algorithmic thinking',
    category: 'Computer Science',
    progress: 25,
    totalModules: 12,
    completedModules: 3,
    enrolledStudents: 32,
    lastUpdated: '3 days ago',
    status: 'draft',
    modules: [
      { id: '1', title: 'Big O Notation', type: 'course', duration: '50 min', completed: true },
      { id: '2', title: 'Arrays and Strings', type: 'course', duration: '65 min', completed: true },
      { id: '3', title: 'Basic Algorithms Quiz', type: 'quiz', duration: '30 min', completed: true },
      { id: '4', title: 'Linked Lists', type: 'course', duration: '70 min', completed: false },
      { id: '5', title: 'Stacks and Queues', type: 'course', duration: '60 min', completed: false },
      { id: '6', title: 'Tree Structures', type: 'course', duration: '80 min', completed: false },
      { id: '7', title: 'Graph Algorithms', type: 'course', duration: '90 min', completed: false },
      { id: '8', title: 'Sorting Algorithms', type: 'assignment', duration: '45 min', completed: false },
      { id: '9', title: 'Search Algorithms', type: 'assignment', duration: '40 min', completed: false },
      { id: '10', title: 'Dynamic Programming', type: 'course', duration: '100 min', completed: false },
      { id: '11', title: 'Advanced Data Structures', type: 'course', duration: '85 min', completed: false },
      { id: '12', title: 'Capstone Project', type: 'assignment', duration: '240 min', completed: false }
    ]
  }
}

const getModuleIcon = (type: string) => {
  switch (type) {
    case 'course': return BookOpen
    case 'assignment': return FileText
    case 'quiz': return HelpCircle
    case 'upload': return Upload
    default: return FileText
  }
}

const getModuleColor = (type: string) => {
  switch (type) {
    case 'course': return 'bg-content-course text-white'
    case 'assignment': return 'bg-content-assignment text-white'
    case 'quiz': return 'bg-content-quiz text-white'
    case 'upload': return 'bg-muted text-muted-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function LearningPath() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [learningPath, setLearningPath] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (id && mockLearningPaths[id]) {
      setLearningPath(mockLearningPaths[id])
    }
  }, [id])

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Learning Path Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested learning path could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{learningPath.title}</h1>
              <p className="text-sm text-muted-foreground">{learningPath.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={learningPath.status === 'published' ? 'default' : 'secondary'}>
              {learningPath.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              {learningPath.status === 'published' ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Progress value={learningPath.progress} className="w-32" />
            <span className="text-sm font-medium">{learningPath.progress}%</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {learningPath.completedModules} of {learningPath.totalModules} modules completed
          </div>
          <div className="text-sm text-muted-foreground">
            <Users className="w-4 h-4 inline mr-1" />
            {learningPath.enrolledStudents} enrolled
          </div>
          <div className="text-sm text-muted-foreground">
            <Clock className="w-4 h-4 inline mr-1" />
            Updated {learningPath.lastUpdated}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b border-border px-6">
          <TabsList className="grid w-full grid-cols-6 bg-transparent h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Modules
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Notes
            </TabsTrigger>
            <TabsTrigger value="customize" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Customize
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Learning Path Overview</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{learningPath.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Modules</p>
                          <p className="font-medium">{learningPath.totalModules}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Enrolled Students</p>
                          <p className="font-medium">{learningPath.enrolledStudents}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Completion Rate</p>
                          <p className="font-medium">{learningPath.progress}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm font-medium">Module completed</p>
                          <p className="text-xs text-muted-foreground">Prototyping Workshop - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">New enrollment</p>
                          <p className="text-xs text-muted-foreground">3 new students joined - 1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('modules')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View All Modules
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate(`/learning-path/${id}/notes`)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Open Notes
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('customize')}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Customize Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Learning Modules</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
            
            <div className="grid gap-4">
              {learningPath.modules.map((module, index) => (
                <Card key={module.id} className="group hover:shadow-card transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className={`w-8 h-8 ${getModuleColor(module.type)} rounded-lg flex items-center justify-center`}>
                          {(() => {
                            const Icon = getModuleIcon(module.type)
                            return <Icon className="w-4 h-4" />
                          })()}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{module.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="capitalize">{module.type}</span>
                              <span>{module.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {module.completed ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Assignments</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
            
            <div className="grid gap-4">
              {learningPath.modules.filter(module => module.type === 'assignment').map((assignment, index) => (
                <Card key={assignment.id} className="group hover:shadow-card transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-content-assignment text-white rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">Duration: {assignment.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={assignment.completed ? 'default' : 'secondary'}>
                          {assignment.completed ? 'Completed' : 'Pending'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quizzes</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            </div>
            
            <div className="grid gap-4">
              {learningPath.modules.filter(module => module.type === 'quiz').map((quiz, index) => (
                <Card key={quiz.id} className="group hover:shadow-card transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-content-quiz text-white rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">Duration: {quiz.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={quiz.completed ? 'default' : 'secondary'}>
                          {quiz.completed ? 'Completed' : 'Pending'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notes</h2>
              <Button onClick={() => navigate(`/learning-path/${id}/notes`)}>
                <FileText className="w-4 h-4 mr-2" />
                Open Notes Editor
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Take Notes</h3>
                <p className="text-muted-foreground mb-4">
                  Create and organize your learning notes with our Notion-like editor.
                </p>
                <Button onClick={() => navigate(`/learning-path/${id}/notes`)}>
                  Start Taking Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Customize Learning Path</h2>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input 
                        type="text" 
                        value={learningPath.title}
                        className="w-full mt-1 p-2 border border-border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea 
                        value={learningPath.description}
                        className="w-full mt-1 p-2 border border-border rounded-md h-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <input 
                        type="text" 
                        value={learningPath.category}
                        className="w-full mt-1 p-2 border border-border rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-save progress</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Allow comments</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Track completion</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable certificates</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
