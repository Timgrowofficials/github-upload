import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  excludeDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export default function CalendarPicker({ 
  selectedDate, 
  onDateSelect, 
  disabled = false,
  minDate,
  maxDate,
  excludeDays = [0] // Exclude Sundays by default
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    if (disabled) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (date < today) return false;
    
    // Check if date is before minDate
    if (minDate && date < minDate) return false;
    
    // Check if date is after maxDate
    if (maxDate && date > maxDate) return false;
    
    // Check if day is excluded
    if (excludeDays.includes(date.getDay())) return false;
    
    return true;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return formatDateString(date) === selectedDate;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <Card className={disabled ? "opacity-50" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-poppins text-xl text-tim-charcoal">
            Select Date
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('prev')}
              disabled={disabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('next')}
              disabled={disabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-lg font-medium text-center">{monthName}</p>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            const available = isDateAvailable(date);
            const selected = isSelected(date);
            
            return (
              <div key={index} className="aspect-square">
                {date ? (
                  <Button
                    variant={selected ? "default" : "ghost"}
                    className={`w-full h-full p-1 text-sm ${
                      selected
                        ? "bg-tim-green hover:bg-green-600 text-white"
                        : available
                          ? "hover:bg-tim-green hover:text-white hover:border-tim-green"
                          : "text-muted-foreground cursor-not-allowed opacity-40"
                    }`}
                    onClick={() => available && onDateSelect(formatDateString(date))}
                    disabled={!available}
                  >
                    {date.getDate()}
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-tim-green bg-opacity-10 rounded-lg text-center">
            <p className="text-sm text-tim-charcoal">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
