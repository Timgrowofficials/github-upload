import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare, 
  UserPlus, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Gift,
  Zap
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'signup' | 'milestone' | 'promotion';
  title: string;
  description: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  client?: string;
  amount?: number;
  rating?: number;
  unread?: boolean;
}

export default function RealTimeFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [showAllDialog, setShowAllDialog] = useState(false);

  // Fetch real-time data from the API
  const { data: upcomingBookings } = useQuery<any[]>({
    queryKey: ["/api/bookings/upcoming"],
  });

  const { data: analytics } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"],
  });

  // Generate activities based on real data
  useEffect(() => {
    const generateActivities = () => {
      const newActivities: ActivityItem[] = [];

      // Add booking activities
      if (upcomingBookings && Array.isArray(upcomingBookings) && upcomingBookings.length > 0) {
        const recentBooking = upcomingBookings[0];
        if (recentBooking) {
          newActivities.push({
            id: `booking-${recentBooking.id}`,
            type: 'booking',
            title: 'New Booking Confirmed',
            description: `${recentBooking.client?.firstName || 'Customer'} booked ${recentBooking.service?.name || 'service'}`,
            time: 'Just now',
            priority: 'high',
            client: `${recentBooking.client?.firstName || ''} ${recentBooking.client?.lastName || ''}`.trim(),
            unread: true
          });
        }
      }

      // Add analytics-based activities
      if (analytics && typeof analytics === 'object') {
        if (analytics.monthlyRevenue && analytics.monthlyRevenue > 0) {
          newActivities.push({
            id: 'revenue-update',
            type: 'milestone',
            title: 'Revenue Update',
            description: `Monthly revenue: $${analytics.monthlyRevenue.toLocaleString()}`,
            time: '1 hour ago',
            priority: 'medium',
            amount: analytics.monthlyRevenue,
            unread: false
          });
        }

        if (analytics.weekBookings && analytics.weekBookings > 0) {
          newActivities.push({
            id: 'booking-stats',
            type: 'milestone',
            title: 'Weekly Progress',
            description: `${analytics.weekBookings} bookings this week`,
            time: '2 hours ago',
            priority: 'low',
            unread: false
          });
        }

        if (analytics.avgRating && analytics.avgRating > 0) {
          newActivities.push({
            id: 'rating-update',
            type: 'review',
            title: 'Customer Satisfaction',
            description: `Average rating: ${analytics.avgRating.toFixed(1)} stars`,
            time: '3 hours ago',
            priority: 'medium',
            rating: analytics.avgRating,
            unread: false
          });
        }
      }

      // Add default activities if no real data
      if (newActivities.length === 0) {
        newActivities.push({
          id: 'welcome',
          type: 'milestone',
          title: 'Welcome to Tim Grow!',
          description: 'Your booking platform is ready to accept appointments',
          time: 'Today',
          priority: 'medium',
          unread: false
        });
      }

      // Add promotional activity
      newActivities.push({
        id: 'promotion-active',
        type: 'promotion',
        title: 'Booking Portal Active',
        description: 'Your online booking system is ready for clients',
        time: 'Today',
        priority: 'low',
        unread: false
      });

      setActivities(newActivities.slice(0, 6));
    };

    generateActivities();
  }, [upcomingBookings, analytics]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'payment': return DollarSign;
      case 'review': return Star;
      case 'message': return MessageSquare;
      case 'signup': return UserPlus;
      case 'milestone': return TrendingUp;
      case 'promotion': return Gift;
      default: return Bell;
    }
  };

  const getActivityColor = (type: ActivityItem['type'], priority: ActivityItem['priority']) => {
    if (priority === 'high') return 'bg-red-100 text-red-600 border-red-200';
    
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'payment': return 'bg-green-100 text-green-600 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'milestone': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'promotion': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, unread: false } : activity
    ));
  };

  const markAllAsRead = () => {
    setActivities(prev => prev.map(activity => ({ ...activity, unread: false })));
  };

  const unreadCount = activities.filter(a => a.unread).length;

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Live Activity
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type, activity.priority);
                  
                  return (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {activity.title}
                            {activity.unread && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-2"></span>}
                          </h4>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {activity.amount && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              ${activity.amount}
                            </Badge>
                          )}
                          {activity.rating && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                              {activity.rating} ⭐
                            </Badge>
                          )}
                          {activity.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.slice(0, 6).map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type, activity.priority);
          
          return (
            <div 
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-gray-50 ${
                activity.unread ? 'bg-blue-50/50 border border-blue-100' : ''
              }`}
              onClick={() => markAsRead(activity.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${activity.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {activity.title}
                    {activity.unread && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-2"></span>}
                  </h4>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                
                {/* Additional context based on activity type */}
                <div className="flex items-center gap-2 mt-2">
                  {activity.amount && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      ${activity.amount}
                    </Badge>
                  )}
                  {activity.rating && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                      {activity.rating} ⭐
                    </Badge>
                  )}
                  {activity.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Quick Actions */}
        <div className="border-t pt-3 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-3 w-3 mr-2" />
              Mark All Read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Zap className="h-3 w-3 mr-2" />
              View Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}