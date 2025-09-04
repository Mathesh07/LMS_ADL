import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Bell, 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Eye,
  Clock,
  Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface Notification {
  id: string
  type: 'friend_request' | 'group_invite' | 'system'
  title: string
  message: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
  group?: {
    id: string
    name: string
  }
  timestamp: string
  read: boolean
  actionRequired: boolean
}

// Mock notifications data
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

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length

  const handleAcceptFriendRequest = (notificationId: string, senderId: string) => {
    // TODO: Implement API call to accept friend request
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
    // TODO: Implement API call to reject friend request
    console.log('Rejecting friend request from:', senderId)
    
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const handleAcceptGroupInvite = (notificationId: string, groupId: string) => {
    // TODO: Implement API call to accept group invitation
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
    // TODO: Implement API call to reject group invitation
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

  const handleViewAllNotifications = () => {
    setIsOpen(false)
    navigate('/notifications')
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleViewAllNotifications}
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View all
                </Button>
              </div>
            </div>
            {actionRequiredCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <Clock className="w-4 h-4" />
                <span>{actionRequiredCount} action{actionRequiredCount > 1 ? 's' : ''} required</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.slice(0, 5).map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const iconColor = getNotificationColor(notification.type)
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                          
                          {notification.actionRequired && !notification.read && (
                            <div className="flex items-center space-x-2 mt-3">
                              {notification.type === 'friend_request' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="h-7 px-3 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAcceptFriendRequest(notification.id, notification.sender!.id)
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Accept
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 px-3 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRejectFriendRequest(notification.id, notification.sender!.id)
                                    }}
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
                                    className="h-7 px-3 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAcceptGroupInvite(notification.id, notification.group!.id)
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Join
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 px-3 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRejectGroupInvite(notification.id, notification.group!.id)
                                    }}
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Decline
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
