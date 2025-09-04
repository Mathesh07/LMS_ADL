import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Search,
  Filter,
  Settings,
  ArrowLeft,
  Clock,
  CheckCircle,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { type Notification } from '@/components/NotificationDropdown'

// Extended mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'friend_request',
    title: 'Friend Request',
    message: 'Sarah Chen sent you a friend request',
    sender: {
      id: 'user1',
      name: 'Sarah Chen',
      avatar: 'SC'
    },
    timestamp: '2 minutes ago',
    read: false,
    actionRequired: true
  },
  {
    id: '2',
    type: 'group_invite',
    title: 'Group Invitation',
    message: 'You have been invited to join "UI/UX Design Study Group"',
    sender: {
      id: 'user2',
      name: 'Alex Rodriguez',
      avatar: 'AR'
    },
    group: {
      id: 'group1',
      name: 'UI/UX Design Study Group'
    },
    timestamp: '1 hour ago',
    read: false,
    actionRequired: true
  },
  {
    id: '3',
    type: 'friend_request',
    title: 'Friend Request',
    message: 'Mike Johnson sent you a friend request',
    sender: {
      id: 'user3',
      name: 'Mike Johnson',
      avatar: 'MJ'
    },
    timestamp: '3 hours ago',
    read: true,
    actionRequired: true
  },
  {
    id: '4',
    type: 'group_invite',
    title: 'Group Invitation',
    message: 'You have been invited to join "React Developers"',
    sender: {
      id: 'user4',
      name: 'Emma Wilson',
      avatar: 'EW'
    },
    group: {
      id: 'group2',
      name: 'React Developers'
    },
    timestamp: '1 day ago',
    read: true,
    actionRequired: false
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    message: 'New features have been added to the learning platform',
    timestamp: '2 days ago',
    read: true,
    actionRequired: false
  },
  {
    id: '6',
    type: 'friend_request',
    title: 'Friend Request',
    message: 'Jessica Taylor wants to connect with you',
    sender: {
      id: 'user5',
      name: 'Jessica Taylor',
      avatar: 'JT'
    },
    timestamp: '3 days ago',
    read: false,
    actionRequired: true
  },
  {
    id: '7',
    type: 'group_invite',
    title: 'Group Invitation',
    message: 'You have been invited to join "Data Science Enthusiasts"',
    sender: {
      id: 'user6',
      name: 'David Kim',
      avatar: 'DK'
    },
    group: {
      id: 'group3',
      name: 'Data Science Enthusiasts'
    },
    timestamp: '1 week ago',
    read: true,
    actionRequired: false
  },
  {
    id: '8',
    type: 'system',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance will occur this weekend',
    timestamp: '1 week ago',
    read: false,
    actionRequired: false
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'friend_request': return UserPlus
    case 'group_invite': return Users
    case 'system': return Settings
    default: return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'friend_request': return 'text-blue-500'
    case 'group_invite': return 'text-green-500'
    case 'system': return 'text-purple-500'
    default: return 'text-muted-foreground'
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const navigate = useNavigate()

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.sender?.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.read) ||
                      (activeTab === 'action-required' && notification.actionRequired && !notification.read) ||
                      (activeTab === notification.type)
    
    return matchesSearch && matchesTab
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length
  const friendRequestCount = notifications.filter(n => n.type === 'friend_request' && !n.read).length
  const groupInviteCount = notifications.filter(n => n.type === 'group_invite' && !n.read).length

  const handleAcceptFriendRequest = (notificationId: string, senderId: string) => {
    console.log('Accepting friend request from:', senderId)
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, actionRequired: false, read: true }
          : n
      )
    )
  }

  const handleRejectFriendRequest = (notificationId: string, senderId: string) => {
    console.log('Rejecting friend request from:', senderId)
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const handleAcceptGroupInvite = (notificationId: string, groupId: string) => {
    console.log('Accepting group invitation for:', groupId)
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, actionRequired: false, read: true }
          : n
      )
    )
  }

  const handleRejectGroupInvite = (notificationId: string, groupId: string) => {
    console.log('Rejecting group invitation for:', groupId)
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read: true }
          : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const deleteSelectedNotifications = () => {
    setNotifications(prev => 
      prev.filter(n => !selectedNotifications.includes(n.id))
    )
    setSelectedNotifications([])
  }

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id)
    setSelectedNotifications(visibleIds)
  }

  const clearSelection = () => {
    setSelectedNotifications([])
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
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                Manage your friend requests, group invitations, and system updates
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark all read ({unreadCount})
              </Button>
            )}
            {selectedNotifications.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={deleteSelectedNotifications}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete selected ({selectedNotifications.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {notifications.length} total notifications
            </span>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-primary font-medium">
                {unreadCount} unread
              </span>
            </div>
          )}
          {actionRequiredCount > 0 && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600 font-medium">
                {actionRequiredCount} action required
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            {filteredNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectedNotifications.length === filteredNotifications.length ? clearSelection : selectAllVisible}
                >
                  {selectedNotifications.length === filteredNotifications.length ? 'Clear selection' : 'Select all visible'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b border-border px-6">
          <TabsList className="grid w-full grid-cols-6 bg-transparent h-12">
            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="action-required" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Action Required
              {actionRequiredCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-2">
                  {actionRequiredCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="friend_request" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Friend Requests
              {friendRequestCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {friendRequestCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="group_invite" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Group Invites
              {groupInviteCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {groupInviteCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              System
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const iconColor = getNotificationColor(notification.type)
                  const isSelected = selectedNotifications.includes(notification.id)
                  
                  return (
                    <Card 
                      key={notification.id} 
                      className={`transition-all hover:shadow-md cursor-pointer ${
                        !notification.read ? 'border-primary/20 bg-primary/5' : ''
                      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => toggleSelectNotification(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectNotification(notification.id)}
                              className="rounded border-border"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${iconColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                                {notification.actionRequired && !notification.read && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  {notification.timestamp}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {notification.message}
                            </p>
                            
                            {notification.sender && (
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                  {notification.sender.avatar}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {notification.sender.name}
                                </span>
                                {notification.group && (
                                  <>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">
                                      {notification.group.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-xs"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Mark as read
                                </Button>
                              )}
                              
                              {notification.actionRequired && !notification.read && (
                                <>
                                  {notification.type === 'friend_request' && (
                                    <>
                                      <Button 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleAcceptFriendRequest(notification.id, notification.sender!.id)
                                        }}
                                        className="text-xs"
                                      >
                                        <Check className="w-3 h-3 mr-1" />
                                        Accept
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRejectFriendRequest(notification.id, notification.sender!.id)
                                        }}
                                        className="text-xs"
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                  
                                  {notification.type === 'group_invite' && (
                                    <>
                                      <Button 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleAcceptGroupInvite(notification.id, notification.group!.id)
                                        }}
                                        className="text-xs"
                                      >
                                        <Check className="w-3 h-3 mr-1" />
                                        Join Group
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRejectGroupInvite(notification.id, notification.group!.id)
                                        }}
                                        className="text-xs"
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
