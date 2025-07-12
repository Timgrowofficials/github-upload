import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bell,
  Calendar,
  User,
  DollarSign,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  data?: any;
}

interface NotificationsPanelProps {
  children: React.ReactNode;
}

export default function NotificationsPanel({ children }: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from backend
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: isOpen, // Only fetch when panel is opened
  });

  // Mock data until backend is ready
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking',
      message: 'Sarah Johnson booked Hair Cut for tomorrow at 2:00 PM',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high',
      actionUrl: '/calendar'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $75 received from Mike Chen',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review',
      message: 'Emma Wilson left a 5-star review for your service',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium',
      data: { rating: 5 }
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // In a real app, this would call an API to mark as read
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, this would call an API to mark all as read
    console.log('Mark all as read');
  };

  const removeNotification = (id: string) => {
    // In a real app, this would call an API to delete notification
    console.log('Remove notification:', id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <CheckCircle className="h-4 w-4 text-tim-green" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
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
                <Badge variant="secondary" className="text-xs">
                  {notifications.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <ScrollArea className="h-96">
            <CardContent className="pt-0 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                displayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </span>
                            <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </ScrollArea>
          
          {displayNotifications.length > 0 && (
            <div className="p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}