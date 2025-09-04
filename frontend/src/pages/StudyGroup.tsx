import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Send, 
  ArrowLeft,
  Settings,
  UserPlus,
  Crown,
  Shield,
  MoreHorizontal,
  Phone,
  Video,
  Calendar,
  BookOpen,
  Pin,
  Search,
  Smile,
  Paperclip,
  Hash,
  Bell,
  BellOff,
  Star,
  Edit,
  Trash2,
  Reply,
  Copy,
  Flag
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock group data
const mockGroupData = {
  'cybersecurity': {
    id: '1',
    name: 'Cyber Security Study Group',
    description: 'Learn cybersecurity fundamentals together through hands-on labs and discussions.',
    category: 'Security',
    memberCount: 12,
    isPrivate: false,
    avatar: 'CS',
    color: 'bg-red-100 text-red-600',
    createdAt: '2024-01-15',
    members: [
      { id: '1', name: 'John Doe', avatar: 'JD', role: 'admin', status: 'online', joinedAt: '2024-01-15' },
      { id: '2', name: 'Sarah Chen', avatar: 'SC', role: 'moderator', status: 'online', joinedAt: '2024-01-16' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ', role: 'member', status: 'away', joinedAt: '2024-01-18' },
      { id: '4', name: 'Emma Wilson', avatar: 'EW', role: 'member', status: 'online', joinedAt: '2024-01-20' },
      { id: '5', name: 'Alex Rodriguez', avatar: 'AR', role: 'member', status: 'offline', joinedAt: '2024-01-22' },
      { id: '6', name: 'Lisa Park', avatar: 'LP', role: 'member', status: 'online', joinedAt: '2024-01-25' }
    ],
    activeRoadmaps: ['Cybersecurity Fundamentals', 'Ethical Hacking Basics'],
    channels: [
      { id: '1', name: 'general', description: 'General discussion' },
      { id: '2', name: 'resources', description: 'Share learning resources' },
      { id: '3', name: 'labs', description: 'Hands-on lab discussions' }
    ]
  }
}

const mockMessages = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'SC',
    content: 'Hey everyone! Just finished the Network Security module. The packet analysis lab was really insightful!',
    timestamp: '2024-03-04T10:30:00Z',
    type: 'text',
    reactions: [{ emoji: '👍', count: 3, users: ['1', '3', '4'] }]
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'JD',
    content: 'Great work Sarah! Did you try the advanced Wireshark exercises?',
    timestamp: '2024-03-04T10:32:00Z',
    type: 'text'
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: 'EW',
    content: 'I found this great resource on network protocols: https://example.com/network-protocols-guide',
    timestamp: '2024-03-04T10:35:00Z',
    type: 'text'
  },
  {
    id: '4',
    userId: '3',
    userName: 'Mike Johnson',
    userAvatar: 'MJ',
    content: 'Thanks Emma! Also sharing my notes from the cryptography section.',
    timestamp: '2024-03-04T10:40:00Z',
    type: 'text',
    attachment: { name: 'crypto-notes.pdf', size: '2.3 MB' }
  },
  {
    id: '5',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'SC',
    content: 'Should we schedule a group study session for the incident response module?',
    timestamp: '2024-03-04T11:00:00Z',
    type: 'text',
    reactions: [{ emoji: '✅', count: 4, users: ['1', '3', '4', '6'] }]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Crown
    case 'moderator': return Shield
    default: return null
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString()
  }
}

export default function StudyGroup() {
  const { groupname } = useParams()
  const navigate = useNavigate()
  const [activeChannel, setActiveChannel] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [activeTab, setActiveTab] = useState('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const group = mockGroupData[groupname as keyof typeof mockGroupData]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
          <p className="text-muted-foreground mb-4">The study group you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'You',
      userAvatar: 'YO',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text' as const
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const onlineMembers = group.members.filter(m => m.status === 'online')
  const offlineMembers = group.members.filter(m => m.status !== 'online')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/groups')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.color}`}>
              <span className="font-bold">{group.avatar}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground">{group.memberCount} members • {onlineMembers.length} online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pin className="w-4 h-4 mr-2" />
                  Pinned Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Group Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border flex flex-col">
          {/* Channels */}
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold mb-3 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Channels
            </h3>
            <div className="space-y-1">
              {group.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeChannel === channel.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-3 h-3" />
                    <span>{channel.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold mb-3">Members</h3>
            <div className="space-y-4">
              {onlineMembers.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Online — {onlineMembers.length}
                  </p>
                  <div className="space-y-2">
                    {onlineMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role)
                      return (
                        <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <p className="text-sm font-medium truncate">{member.name}</p>
                              {RoleIcon && <RoleIcon className="w-3 h-3 text-yellow-600" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {offlineMembers.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Offline — {offlineMembers.length}
                  </p>
                  <div className="space-y-2">
                    {offlineMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role)
                      return (
                        <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer opacity-60">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <p className="text-sm font-medium truncate">{member.name}</p>
                              {RoleIcon && <RoleIcon className="w-3 h-3 text-yellow-600" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border px-6 py-2">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-3 group">
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="text-xs">{message.userAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-semibold">{message.userName}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-2xl">
                          <p className="text-sm">{message.content}</p>
                          {message.attachment && (
                            <div className="mt-2 p-2 bg-background rounded border flex items-center space-x-2">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{message.attachment.name}</span>
                              <span className="text-xs text-muted-foreground">({message.attachment.size})</span>
                            </div>
                          )}
                        </div>
                        {message.reactions && (
                          <div className="flex space-x-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                className="flex items-center space-x-1 px-2 py-1 bg-muted rounded-full text-xs hover:bg-muted/80"
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Reply className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Smile className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder={`Message #${group.channels.find(c => c.id === activeChannel)?.name}`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roadmaps" className="flex-1 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Roadmaps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.activeRoadmaps.map((roadmap, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{roadmap}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-muted-foreground">Shared roadmap</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="flex-1 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shared Resources</h3>
                <p className="text-muted-foreground">Resources shared by group members will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
