import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  MessageCircle,
  BookOpen,
  Calendar,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Globe,
  Lock,
  Star,
  TrendingUp,
  Activity,
  Eye,
  Edit,
  UserMinus,
  Share2,
  Archive,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock groups data
const mockGroups = [
  {
    id: '1',
    name: 'Cyber Security Study Group',
    description: 'Learn cybersecurity fundamentals together through hands-on labs and discussions.',
    category: 'Security',
    memberCount: 12,
    maxMembers: 20,
    isPrivate: false,
    role: 'admin',
    createdAt: '2024-01-15',
    lastActivity: '2 hours ago',
    activeRoadmaps: ['Cybersecurity Fundamentals', 'Ethical Hacking Basics'],
    upcomingEvents: 2,
    weeklyMessages: 45,
    avatar: 'CS',
    color: 'bg-red-100 text-red-600',
    members: [
      { id: '1', name: 'John Doe', avatar: 'JD', role: 'admin', lastSeen: 'online' },
      { id: '2', name: 'Sarah Chen', avatar: 'SC', role: 'moderator', lastSeen: '2h ago' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ', role: 'member', lastSeen: '1d ago' },
      { id: '4', name: 'Emma Wilson', avatar: 'EW', role: 'member', lastSeen: 'online' }
    ]
  },
  {
    id: '2',
    name: 'React Developers',
    description: 'Master React.js and modern frontend development with fellow developers.',
    category: 'Development',
    memberCount: 8,
    maxMembers: 15,
    isPrivate: false,
    role: 'member',
    createdAt: '2024-02-01',
    lastActivity: '1 day ago',
    activeRoadmaps: ['Full Stack Web Development', 'React Advanced Patterns'],
    upcomingEvents: 1,
    weeklyMessages: 28,
    avatar: 'RD',
    color: 'bg-blue-100 text-blue-600',
    members: [
      { id: '5', name: 'Alex Rodriguez', avatar: 'AR', role: 'admin', lastSeen: '1h ago' },
      { id: '6', name: 'Lisa Park', avatar: 'LP', role: 'member', lastSeen: 'online' },
      { id: '7', name: 'David Kim', avatar: 'DK', role: 'member', lastSeen: '3h ago' }
    ]
  },
  {
    id: '3',
    name: 'AI/ML Enthusiasts',
    description: 'Explore artificial intelligence and machine learning concepts together.',
    category: 'Data Science',
    memberCount: 15,
    maxMembers: 25,
    isPrivate: false,
    role: 'moderator',
    createdAt: '2023-11-10',
    lastActivity: '3 hours ago',
    activeRoadmaps: ['Data Science & Machine Learning', 'Deep Learning Fundamentals'],
    upcomingEvents: 3,
    weeklyMessages: 67,
    avatar: 'AI',
    color: 'bg-purple-100 text-purple-600',
    members: [
      { id: '8', name: 'Dr. Maria Garcia', avatar: 'MG', role: 'admin', lastSeen: 'online' },
      { id: '9', name: 'James Wilson', avatar: 'JW', role: 'moderator', lastSeen: '1h ago' },
      { id: '10', name: 'Anna Lee', avatar: 'AL', role: 'member', lastSeen: '2h ago' }
    ]
  },
  {
    id: '4',
    name: 'UI/UX Design Circle',
    description: 'Share design insights, get feedback, and improve your design skills.',
    category: 'Design',
    memberCount: 6,
    maxMembers: 12,
    isPrivate: true,
    role: 'member',
    createdAt: '2024-01-20',
    lastActivity: '5 hours ago',
    activeRoadmaps: ['UI/UX Design Mastery'],
    upcomingEvents: 1,
    weeklyMessages: 22,
    avatar: 'UX',
    color: 'bg-pink-100 text-pink-600',
    members: [
      { id: '11', name: 'Sophie Turner', avatar: 'ST', role: 'admin', lastSeen: '4h ago' },
      { id: '12', name: 'Ryan Cooper', avatar: 'RC', role: 'member', lastSeen: '1d ago' }
    ]
  },
  {
    id: '5',
    name: 'DevOps Masters',
    description: 'Learn DevOps practices, tools, and methodologies in a collaborative environment.',
    category: 'DevOps',
    memberCount: 6,
    maxMembers: 10,
    isPrivate: false,
    role: 'member',
    createdAt: '2023-09-15',
    lastActivity: '1 week ago',
    activeRoadmaps: ['DevOps Engineering', 'Kubernetes Mastery'],
    upcomingEvents: 0,
    weeklyMessages: 12,
    avatar: 'DO',
    color: 'bg-green-100 text-green-600',
    members: [
      { id: '13', name: 'Tom Anderson', avatar: 'TA', role: 'admin', lastSeen: '1w ago' },
      { id: '14', name: 'Rachel Green', avatar: 'RG', role: 'member', lastSeen: '3d ago' }
    ]
  }
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Crown
    case 'moderator': return Shield
    default: return Users
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'text-yellow-600'
    case 'moderator': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('my-groups')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newGroupCategory, setNewGroupCategory] = useState('')
  const [newGroupPrivacy, setNewGroupPrivacy] = useState('public')
  const navigate = useNavigate()

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'my-groups' || 
                      (activeTab === 'admin' && group.role === 'admin') ||
                      (activeTab === 'discover' && !group.isPrivate)
    
    return matchesSearch && matchesTab
  })

  const handleCreateGroup = () => {
    // Simulate group creation
    console.log('Creating group:', { newGroupName, newGroupDescription, newGroupCategory, newGroupPrivacy })
    setShowCreateDialog(false)
    setNewGroupName('')
    setNewGroupDescription('')
    setNewGroupCategory('')
    setNewGroupPrivacy('public')
  }

  const stats = {
    totalGroups: mockGroups.length,
    adminGroups: mockGroups.filter(g => g.role === 'admin').length,
    totalMembers: mockGroups.reduce((acc, g) => acc + g.memberCount, 0),
    activeGroups: mockGroups.filter(g => g.lastActivity.includes('hour')).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Study Groups</h1>
                <p className="text-muted-foreground">Collaborate and learn together with fellow learners</p>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                  <DialogDescription>
                    Start a new study group to learn and collaborate with others.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group Name</label>
                    <Input
                      placeholder="e.g., Python Beginners"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="What will your group focus on?"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newGroupCategory} onValueChange={setNewGroupCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Privacy</label>
                    <Select value={newGroupPrivacy} onValueChange={setNewGroupPrivacy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>Public - Anyone can join</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Private - Invite only</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">My Groups</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalGroups}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Admin</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.adminGroups}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Members</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalMembers}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Active Today</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.activeGroups}</p>
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
                placeholder="Search groups..."
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
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Join or create a study group to start collaborating'}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => {
                  const RoleIcon = getRoleIcon(group.role)
                  
                  return (
                    <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${group.color}`}>
                              <span className="font-bold text-sm">{group.avatar}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                {group.isPrivate ? (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <Globe className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <RoleIcon className={`w-4 h-4 ${getRoleColor(group.role)}`} />
                                <Badge variant="outline" className="text-xs">
                                  {group.role}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {group.category}
                                </Badge>
                              </div>
                            </div>
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
                                View Group
                              </DropdownMenuItem>
                              {group.role === 'admin' && (
                                <DropdownMenuItem>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Group Settings
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Invite Members
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <UserMinus className="w-4 h-4 mr-2" />
                                Leave Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

                        {/* Members */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Members</span>
                            <span className="font-medium">{group.memberCount}/{group.maxMembers}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {group.members.slice(0, 4).map((member) => (
                                <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                                </Avatar>
                              ))}
                              {group.memberCount > 4 && (
                                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">+{group.memberCount - 4}</span>
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
                              <UserPlus className="w-3 h-3 mr-1" />
                              Invite
                            </Button>
                          </div>
                        </div>

                        {/* Active Roadmaps */}
                        {group.activeRoadmaps.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Active Roadmaps</p>
                            <div className="space-y-1">
                              {group.activeRoadmaps.slice(0, 2).map((roadmap, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs">
                                  <BookOpen className="w-3 h-3 text-blue-500" />
                                  <span className="truncate">{roadmap}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activity Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Messages</p>
                            <p className="text-sm font-medium">{group.weeklyMessages}/week</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Events</p>
                            <p className="text-sm font-medium">{group.upcomingEvents} upcoming</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Active</p>
                            <p className="text-sm font-medium">{group.lastActivity}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1" 
                            size="sm"
                            onClick={() => navigate(`/group/${group.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open Chat
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </div>
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
