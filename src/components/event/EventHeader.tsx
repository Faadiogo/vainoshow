
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  date: Date;
  location: string;
  image: string;
  featured?: boolean;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  date,
  location,
  image,
  featured
}) => {
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' Y", { locale: ptBR });
  };
  
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };
  
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={title} 
          className="w-full aspect-[16/9] object-cover"
        />
        
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-event-purple hover:bg-event-purple/90">Destaque</Badge>
          </div>
        )}
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        
        <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{formatTime(date)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
