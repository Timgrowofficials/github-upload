import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  User,
  DollarSign
} from "lucide-react";

export default function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample booking data
  const bookings = [
    { id: 1, date: new Date(2025, 0, 5), title: 'Hair Cut', client: 'Sarah J.', time: '10:00 AM', status: 'confirmed' },
    { id: 2, date: new Date(2025, 0, 5), title: 'Massage', client: 'Mike C.', time: '2:00 PM', status: 'pending' },
    { id: 3, date: new Date(2025, 0, 8), title: 'Facial', client: 'Emma W.', time: '11:30 AM', status: 'confirmed' },
    { id: 4, date: new Date(2025, 0, 12), title: 'Manicure', client: 'Lisa R.', time: '3:00 PM', status: 'confirmed' },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const dayBookings = isCurrentMonth ? getBookingsForDate(date) : [];

      days.push(
        <div
          key={i}
          className={`h-20 p-1 border border-gray-100 cursor-pointer transition-all ${
            isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
          } ${isSelected ? 'ring-2 ring-tim-green' : ''}`}
          onClick={() => isCurrentMonth && setSelectedDate(date)}
        >
          {isCurrentMonth && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-tim-green' : 'text-gray-700'
                }`}>
                  {dayNumber}
                </span>
                {isToday && (
                  <div className="w-2 h-2 bg-tim-green rounded-full"></div>
                )}
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className={`text-xs px-2 py-1 rounded-md truncate ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.time} - {booking.title}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayBookings.length - 2} more
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-tim-green hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 border border-gray-200 rounded-lg overflow-hidden">
          {renderCalendarDays()}
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <div className="space-y-2">
              {getBookingsForDate(selectedDate).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-tim-green rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium">{booking.title}</h5>
                      <p className="text-sm text-gray-600">{booking.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.time}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {getBookingsForDate(selectedDate).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No appointments scheduled for this date
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-xs text-green-600">Confirmed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.length}
            </div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}