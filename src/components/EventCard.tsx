
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Event } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' Y", { locale: ptBR });
  };
  
  const lowestPrice = event.ticketBatches.reduce((lowest, batch) => {
    if (batch.available > 0 && batch.price < lowest) {
      return batch.price;
    }
    return lowest;
  }, Infinity);
  
  const hasTickets = lowestPrice !== Infinity;
  const formattedPrice = hasTickets ? 
    `R$ ${lowestPrice.toFixed(2).replace('.', ',')}` : 
    'Esgotado';

  return (
    <Link 
      to={`/events/${event.id}`} 
      className={cn("event-card flex flex-col h-full", className)}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {event.featured && (
        <div className="event-badge">
          Destaque
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.start_date
                ? (event.end_date && event.end_date !== event.start_date
                    ? `${format(new Date(event.start_date), "dd/MM/yyyy", { locale: ptBR })} à ${format(new Date(event.end_date), "dd/MM/yyyy", { locale: ptBR })}`
                    : format(new Date(event.start_date), "dd/MM/yyyy", { locale: ptBR }))
                : 'Data não definida'}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className={cn(
            "font-medium",
            !hasTickets && "text-destructive"
          )}>
            {hasTickets ? (
              <span>A partir de <span className="text-event-purple">{formattedPrice}</span></span>
            ) : (
              formattedPrice
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
