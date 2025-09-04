import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Edit, 
  Save,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Award,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  Star,
  Trophy,
  Zap,
  Brain,
  Code,
  Shield,
  Palette
} from 'lucide-react'

// Mock user data
const mockUserData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'JD',
  title: 'Full Stack Developer & Cybersecurity Enthusiast',
  bio: 'Passionate about learning new technologies and sharing knowledge with the community. Currently focusing on cybersecurity and AI/ML.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  phone: '+1 (555) 123-4567',
  joinedDate: '2024-01-15',
  social: {
    github: 'johndoe',
    linkedin: 'john-doe-dev',
    twitter: 'johndoe_dev'
  },
  stats: {
    roadmapsCompleted: 3,
    roadmapsInProgress: 4,
    totalHoursLearned: 245,
    achievementsEarned: 12,
    groupsJoined: 5,
    notesCreated: 28,
    streakDays: 45
  },
  skills: [
    { name: 'JavaScript', level: 85, category: 'Programming' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Programming' },
    { name: 'Cybersecurity', level: 65, category: 'Security' },
    { name: 'AWS', level: 70, category: 'Cloud' },
    { name: 'Docker', level: 75, category: 'DevOps' },
    { name: 'UI/UX Design', level: 60, category: 'Design' }
  ],
  achievements: [
    { id: '1', name: 'First Roadmap', description: 'Completed your first learning roadmap', icon: Trophy, color: 'text-yellow-600', earnedDate: '2024-01-20' },
    { id: '2', name: 'Network Security Expert', description: 'Mastered network security fundamentals', icon: Shield, color: 'text-blue-600', earnedDate: '2024-02-15' },
    { id: '3', name: 'Python Master', description: 'Achieved advanced proficiency in Python', icon: Code, color: 'text-green-600', earnedDate: '2024-02-28' },
    { id: '4', name: 'Team Player', description: 'Joined 5 study groups', icon: Users, color: 'text-purple-600', earnedDate: '2024-03-01' },
    { id: '5', name: 'Learning Streak', description: '30-day learning streak', icon: Zap, color: 'text-orange-600', earnedDate: '2024-03-10' },
    { id: '6', name: 'AI Enthusiast', description: 'Completed ML fundamentals', icon: Brain, color: 'text-pink-600', earnedDate: '2024-03-15' }
  ],
  recentActivity: [
    { id: '1', type: 'roadmap_progress', title: 'Completed "Incident Response" module', roadmap: 'Cybersecurity Fundamentals', timestamp: '2 hours ago' },
    { id: '2', type: 'achievement', title: 'Earned "Network Security Expert" badge', timestamp: '1 day ago' },
    { id: '3', type: 'group_join', title: 'Joined "AI/ML Enthusiasts" study group', timestamp: '2 days ago' },
    { id: '4', type: 'note_created', title: 'Created notes for "Cryptography Basics"', timestamp: '3 days ago' },
    { id: '5', type: 'roadmap_start', title: 'Started "Data Science & Machine Learning" roadmap', timestamp: '1 week ago' }
  ]
}

const getSkillColor = (level: number) => {
  if (level >= 80) return 'bg-green-500'
  if (level >= 60) return 'bg-blue-500'
  if (level >= 40) return 'bg-yellow-500'
  return 'bg-gray-500'
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Programming': return Code
    case 'Frontend': return Palette
    case 'Backend': return Code
    case 'Security': return Shield
    case 'Cloud': return Globe
    case 'DevOps': return Target
    case 'Design': return Palette
    default: return BookOpen
  }
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(mockUserData)
  const [activeTab, setActiveTab] = useState('overview')

  const handleSave = () => {
    // Simulate saving data
    console.log('Saving profile data:', editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(mockUserData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl font-bold">{mockUserData.avatar}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedData.name}
                      onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                      className="text-2xl font-bold"
                    />
                    <Input
                      value={editedData.title}
                      onChange={(e) => setEditedData({...editedData, title: e.target.value})}
                      className="text-lg"
                    />
                    <Textarea
                      value={editedData.bio}
                      onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-foreground">{mockUserData.name}</h1>
                    <p className="text-lg text-muted-foreground">{mockUserData.title}</p>
                    <p className="text-sm text-muted-foreground max-w-2xl">{mockUserData.bio}</p>
                  </>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mockUserData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(mockUserData.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{mockUserData.stats.streakDays} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.roadmapsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.roadmapsInProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.totalHoursLearned}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.achievementsEarned}</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.groupsJoined}</p>
                  <p className="text-xs text-muted-foreground">Groups</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Edit className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.notesCreated}</p>
                  <p className="text-xs text-muted-foreground">Notes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUserData.stats.streakDays}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Input
                          value={editedData.email}
                          onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <Input
                          value={editedData.phone}
                          onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Input
                          value={editedData.website}
                          onChange={(e) => setEditedData({...editedData, website: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockUserData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockUserData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a href={mockUserData.website} className="text-sm text-blue-600 hover:underline">
                          {mockUserData.website}
                        </a>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-muted-foreground" />
                    <a href={`https://github.com/${mockUserData.social.github}`} className="text-sm text-blue-600 hover:underline">
                      github.com/{mockUserData.social.github}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <a href={`https://linkedin.com/in/${mockUserData.social.linkedin}`} className="text-sm text-blue-600 hover:underline">
                      linkedin.com/in/{mockUserData.social.linkedin}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                    <a href={`https://twitter.com/${mockUserData.social.twitter}`} className="text-sm text-blue-600 hover:underline">
                      twitter.com/{mockUserData.social.twitter}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockUserData.skills.map((skill, index) => {
                    const CategoryIcon = getCategoryIcon(skill.category)
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{skill.name}</span>
                            <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                          </div>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUserData.achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${achievement.color}`} />
                      <h3 className="font-semibold mb-2">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        {activity.roadmap && (
                          <p className="text-xs text-muted-foreground">in {activity.roadmap}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
