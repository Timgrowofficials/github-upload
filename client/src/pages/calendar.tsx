import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/navigation";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus,
  Filter,
  Download,
  Search
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
  });

  // Generate time slots from 7 AM to 9 PM
  const timeSlots = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getDayBookings = (date: Date) => {
    if (!bookings || !Array.isArray(bookings)) return [];
    return bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.appointmentDate);
      return isSameDay(bookingDate, date);
    });
  };

  const getBookingAtTime = (date: Date, timeSlot: string) => {
    const dayBookings = getDayBookings(date);
    return dayBookings.find((booking: any) => {
      const bookingTime = new Date(booking.appointmentDate);
      // Format time as HH:mm in EST timezone to match time slot format
      const hours = parseInt(bookingTime.toLocaleString('en-US', { 
        hour: '2-digit', 
        hour12: false, 
        timeZone: 'America/New_York' 
      })).toString().padStart(2, '0');
      const minutes = parseInt(bookingTime.toLocaleString('en-US', { 
        minute: '2-digit', 
        timeZone: 'America/New_York' 
      })).toString().padStart(2, '0');
      const bookingTimeStr = `${hours}:${minutes}`;
      return bookingTimeStr === timeSlot;
    });
  };

  const getServiceColor = (serviceId: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
    ];
    return colors[serviceId % colors.length];
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = viewMode === 'week' ? 7 : 1;
    setSelectedDate(prev => direction === 'next' ? addDays(prev, days) : subDays(prev, days));
  };

  const weekDays = viewMode === 'week' ? getWeekDays() : [selectedDate];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              Calendar
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {viewMode === 'week' 
                ? `Week of ${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
                : format(selectedDate, 'EEEE, MMMM d, yyyy')
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="hidden md:flex"
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Filter</span>
                </Button>
                <Button className="bg-tim-green hover:bg-green-600" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">New Booking</span>
                  <span className="md:hidden">Add</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b bg-gray-50">
                  <div className="p-3 text-sm font-medium text-gray-500 border-r">
                    Time
                  </div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="p-3 text-center border-r last:border-r-0">
                      <div className="text-sm font-medium text-gray-900">
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg font-bold mt-1 ${
                        isSameDay(day, new Date()) ? 'text-tim-green' : 'text-gray-700'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getDayBookings(day).length} bookings
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="max-h-[600px] overflow-y-auto">
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <div key={timeSlot} className={`grid grid-cols-8 border-b hover:bg-gray-50 ${
                      timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}>
                      {/* Time Column */}
                      <div className="p-3 text-sm text-gray-600 border-r font-medium">
                        {timeSlot}
                      </div>
                      
                      {/* Day Columns */}
                      {weekDays.map((day, dayIndex) => {
                        const booking = getBookingAtTime(day, timeSlot);
                        return (
                          <div 
                            key={dayIndex} 
                            className="border-r last:border-r-0 min-h-[60px] relative group hover:bg-blue-50 cursor-pointer"
                          >
                            {booking ? (
                              <div className={`m-1 p-2 rounded-lg text-white text-xs ${
                                getServiceColor(booking.serviceId)
                              } shadow-sm`}>
                                <div className="font-medium truncate">
                                  {booking.service?.name || 'Service'}
                                </div>
                                <div className="flex items-center gap-1 mt-1 opacity-90">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">
                                    {booking.client?.firstName} {booking.client?.lastName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-90">
                                  <Clock className="h-3 w-3" />
                                  <span>{booking.service?.duration || 60}min</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule Summary (Mobile) */}
        <div className="md:hidden mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getDayBookings(new Date()).length > 0 ? (
                getDayBookings(new Date()).map((booking: any) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getServiceColor(booking.serviceId)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {booking.service?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(booking.appointmentDate), 'h:mm a')} • {booking.client?.firstName} {booking.client?.lastName}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No bookings today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}