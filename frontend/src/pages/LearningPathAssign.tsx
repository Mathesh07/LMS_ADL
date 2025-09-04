import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  ArrowRight, 
  X,
  Search,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Settings,
  Mail
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const mockLearners = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'UX Designer',
    department: 'Design Team',
    avatar: 'SJ',
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    role: 'Product Designer', 
    department: 'Product Team',
    avatar: 'MC',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.r@company.com',
    role: 'Visual Designer',
    department: 'Marketing',
    avatar: 'ER',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'd.kim@company.com',
    role: 'Design Lead',
    department: 'Design Team',
    avatar: 'DK',
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.w@company.com',
    role: 'UI Designer',
    department: 'Design Team', 
    avatar: 'LW',
    status: 'active'
  }
]

export default function LearningPathAssign() {
  const navigate = useNavigate()
  const [selectedLearners, setSelectedLearners] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleLearnerToggle = (learnerId: string) => {
    setSelectedLearners(prev => 
      prev.includes(learnerId) 
        ? prev.filter(id => id !== learnerId)
        : [...prev, learnerId]
    )
  }

  const handlePublish = () => {
    // Handle publish logic here
    console.log('Publishing learning path with assigned learners:', selectedLearners)
    navigate('/')
  }

  const filteredLearners = mockLearners.filter(learner =>
    learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    learner.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    learner.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/learning-path/content')}
            >
              <X className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Create Learning Path</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Final Step: <span className="font-medium">Review & Publish</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/learning-path/content')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                onClick={handlePublish}
                disabled={selectedLearners.length === 0}
              >
                Publish Path
                <CheckCircle2 className="w-4 h-4 ml-2" />
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
              3
            </div>
            <span className="font-medium text-primary">Assign Learners</span>
          </div>
          <div className="flex-1 h-1 bg-muted rounded-full">
            <div className="h-full w-full bg-gradient-primary rounded-full" />
          </div>
          <div className="text-sm text-muted-foreground">Step 3 of 3</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Path Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-content-path rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-medium">Learning Path</h2>
                    <h3 className="text-lg font-semibold">General Knowledge & Methodology - Layout & Spacing</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>1 Week</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>4 Content Items</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>3 Pages, 1 Quiz</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Ready to Publish</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Settings */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Assignment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Due Date</label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Completion Requirement</label>
                    <select className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background">
                      <option>All content must be completed</option>
                      <option>80% completion required</option>
                      <option>Custom completion criteria</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifications" className="rounded" />
                  <label htmlFor="notifications" className="text-sm">
                    Send email notifications to assigned learners
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Learner Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Assign to Learners</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search learners..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite New
                  </Button>
                </div>
              </div>

              {selectedLearners.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedLearners.length} learner(s) selected
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedLearners([])}
                      >
                        Clear all
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {filteredLearners.map((learner) => (
                  <Card 
                    key={learner.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedLearners.includes(learner.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleLearnerToggle(learner.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedLearners.includes(learner.id)}
                          onChange={() => handleLearnerToggle(learner.id)}
                          className="rounded"
                        />
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {learner.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{learner.name}</h4>
                              <p className="text-sm text-muted-foreground">{learner.email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{learner.role}</div>
                              <div className="text-xs text-muted-foreground">{learner.department}</div>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={learner.status === 'active' ? 'secondary' : 'outline'}
                          className={learner.status === 'active' ? 'bg-success/10 text-success' : ''}
                        >
                          {learner.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLearners.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-medium text-card-foreground">No learners found</h4>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Publishing Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Content ready</span>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Learners selected</span>
                    <span className="font-medium">{selectedLearners.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due date set</span>
                    <span className="font-medium">{dueDate || 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Next Steps</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <span>Learners will receive email notifications</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Settings className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <span>You can modify assignments later</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <span>Track progress in the dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Setup Complete</h3>
                <Progress value={100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Your learning path is ready to publish!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}