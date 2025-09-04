import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Map, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Star,
  Share2,
  Archive,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock roadmaps data
const mockUserRoadmaps = [
  {
    id: '1',
    title: 'Cybersecurity Fundamentals',
    description: 'Master essential cybersecurity concepts from network security to incident response.',
    category: 'Security',
    difficulty: 'Intermediate',
    progress: 65,
    totalModules: 6,
    completedModules: 4,
    estimatedTime: '12-16 weeks',
    timeSpent: '45 hours',
    status: 'in-progress',
    createdAt: '2024-01-15',
    lastAccessed: '2 hours ago',
    isPublic: false,
    studyGroup: 'Cyber Security Study Group',
    studyGroupMembers: 12,
    nextModule: 'Incident Response and Forensics',
    achievements: ['Network Security Expert', 'Cryptography Basics'],
    rating: 4.8
  },
  {
    id: '2',
    title: 'Full Stack Web Development',
    description: 'Complete roadmap covering frontend, backend, databases, and deployment.',
    category: 'Development',
    difficulty: 'Advanced',
    progress: 30,
    totalModules: 8,
    completedModules: 2,
    estimatedTime: '16-20 weeks',
    timeSpent: '28 hours',
    status: 'in-progress',
    createdAt: '2024-02-01',
    lastAccessed: '1 day ago',
    isPublic: true,
    studyGroup: 'React Developers',
    studyGroupMembers: 8,
    nextModule: 'Backend API Development',
    achievements: ['HTML/CSS Master'],
    rating: 4.9
  },
  {
    id: '3',
    title: 'Data Science & Machine Learning',
    description: 'Comprehensive path from statistics to advanced ML algorithms and deployment.',
    category: 'Data Science',
    difficulty: 'Advanced',
    progress: 85,
    totalModules: 10,
    completedModules: 8,
    estimatedTime: '20-24 weeks',
    timeSpent: '120 hours',
    status: 'in-progress',
    createdAt: '2023-11-10',
    lastAccessed: '3 hours ago',
    isPublic: true,
    studyGroup: 'AI/ML Enthusiasts',
    studyGroupMembers: 15,
    nextModule: 'Model Deployment & MLOps',
    achievements: ['Python Expert', 'Statistics Pro', 'ML Fundamentals', 'Deep Learning Basics'],
    rating: 4.7
  },
  {
    id: '4',
    title: 'UI/UX Design Mastery',
    description: 'Design thinking, user research, prototyping, and design systems.',
    category: 'Design',
    difficulty: 'Intermediate',
    progress: 45,
    totalModules: 7,
    completedModules: 3,
    estimatedTime: '10-14 weeks',
    timeSpent: '35 hours',
    status: 'in-progress',
    createdAt: '2024-01-20',
    lastAccessed: '5 hours ago',
    isPublic: false,
    nextModule: 'User Research Methods',
    achievements: ['Design Thinking', 'Figma Basics'],
    rating: 4.6
  },
  {
    id: '5',
    title: 'DevOps Engineering',
    description: 'CI/CD, containerization, monitoring, and infrastructure as code.',
    category: 'DevOps',
    difficulty: 'Advanced',
    progress: 100,
    totalModules: 9,
    completedModules: 9,
    estimatedTime: '14-18 weeks',
    timeSpent: '95 hours',
    status: 'completed',
    createdAt: '2023-09-15',
    lastAccessed: '1 week ago',
    isPublic: true,
    studyGroup: 'DevOps Masters',
    studyGroupMembers: 6,
    achievements: ['Docker Expert', 'Kubernetes Pro', 'CI/CD Master', 'AWS Certified', 'DevOps Champion'],
    rating: 4.9,
    completedAt: '2024-01-10'
  },
  {
    id: '6',
    title: 'Cloud Architecture (AWS)',
    description: 'Learn cloud computing, serverless architecture, and AWS services.',
    category: 'Cloud',
    difficulty: 'Intermediate',
    progress: 15,
    totalModules: 8,
    completedModules: 1,
    estimatedTime: '12-16 weeks',
    timeSpent: '12 hours',
    status: 'paused',
    createdAt: '2024-02-15',
    lastAccessed: '2 days ago',
    isPublic: false,
    nextModule: 'EC2 and Compute Services',
    achievements: ['Cloud Basics'],
    rating: 4.5
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-700'
    case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
    case 'Advanced': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600'
    case 'in-progress': return 'text-blue-600'
    case 'paused': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle
    case 'in-progress': return Play
    case 'paused': return Pause
    default: return Clock
  }
}

export default function MyRoadmaps() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()

  const filteredRoadmaps = mockUserRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'in-progress' && roadmap.status === 'in-progress') ||
                      (activeTab === 'completed' && roadmap.status === 'completed') ||
                      (activeTab === 'paused' && roadmap.status === 'paused')
    
    return matchesSearch && matchesTab
  })

  const stats = {
    total: mockUserRoadmaps.length,
    inProgress: mockUserRoadmaps.filter(r => r.status === 'in-progress').length,
    completed: mockUserRoadmaps.filter(r => r.status === 'completed').length,
    paused: mockUserRoadmaps.filter(r => r.status === 'paused').length,
    totalHours: mockUserRoadmaps.reduce((acc, r) => acc + parseInt(r.timeSpent.split(' ')[0]), 0),
    totalAchievements: mockUserRoadmaps.reduce((acc, r) => acc + r.achievements.length, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Learning Roadmaps</h1>
                <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/roadmap-generator')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Roadmap
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Map className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Pause className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Paused</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.paused}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Hours</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalHours}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Achievements</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.totalAchievements}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="in-progress">Active ({stats.inProgress})</TabsTrigger>
            <TabsTrigger value="completed">Done ({stats.completed})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({stats.paused})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredRoadmaps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">No roadmaps found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Start your learning journey by creating your first roadmap'}
                </p>
                <Button onClick={() => navigate('/roadmap-generator')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Roadmap
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map((roadmap) => {
                  const StatusIcon = getStatusIcon(roadmap.status)
                  
                  return (
                    <Card key={roadmap.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`w-4 h-4 ${getStatusColor(roadmap.status)}`} />
                              <Badge variant="outline" className={getDifficultyColor(roadmap.difficulty)}>
                                {roadmap.difficulty}
                              </Badge>
                              {roadmap.isPublic && (
                                <Badge variant="secondary">
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Public
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg leading-tight">{roadmap.title}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">{roadmap.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Roadmap
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{roadmap.progress}%</span>
                          </div>
                          <Progress value={roadmap.progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{roadmap.completedModules}/{roadmap.totalModules} modules</span>
                            <span>{roadmap.timeSpent} spent</span>
                          </div>
                        </div>

                        {/* Next Module */}
                        {roadmap.nextModule && roadmap.status !== 'completed' && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Next Module</p>
                            <p className="text-sm font-medium">{roadmap.nextModule}</p>
                          </div>
                        )}

                        {/* Study Group */}
                        {roadmap.studyGroup && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{roadmap.studyGroup}</span>
                            <span>•</span>
                            <span>{roadmap.studyGroupMembers} members</span>
                          </div>
                        )}

                        {/* Achievements */}
                        {roadmap.achievements.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Recent Achievements</p>
                            <div className="flex flex-wrap gap-1">
                              {roadmap.achievements.slice(0, 3).map((achievement, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {achievement}
                                </Badge>
                              ))}
                              {roadmap.achievements.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{roadmap.achievements.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Last accessed {roadmap.lastAccessed}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-muted-foreground">{roadmap.rating}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          variant={roadmap.status === 'completed' ? 'outline' : 'default'}
                        >
                          {roadmap.status === 'completed' ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Review Roadmap
                            </>
                          ) : roadmap.status === 'paused' ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume Learning
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Continue Learning
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
