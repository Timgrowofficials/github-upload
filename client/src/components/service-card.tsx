import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Service } from "@shared/schema";
import { Clock, Scissors, Palette, Edit, Trash } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  className?: string;
}

export default function ServiceCard({ 
  service, 
  isSelected = false, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  className = ""
}: ServiceCardProps) {
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('color') || name.includes('paint') || name.includes('dye')) {
      return <Palette className="h-5 w-5 tim-green" />;
    }
    return <Scissors className="h-5 w-5 tim-green" />;
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${
        isSelected 
          ? "border-tim-green bg-tim-green bg-opacity-5 shadow-md" 
          : "border-border hover:border-tim-green"
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Service Image */}
        {service.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-tim-green bg-opacity-10 rounded-lg flex items-center justify-center">
            {getServiceIcon(service.name)}
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="hover:bg-tim-green hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg text-tim-charcoal mb-2 line-clamp-1">
          {service.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {service.description || "Professional service"}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tim-green">
            ${parseFloat(service.price).toFixed(0)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{service.duration} min</span>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-tim-green text-white">
              Selected
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
