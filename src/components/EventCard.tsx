
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  const [lowestPrice, setLowestPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEventPricing = async () => {
      setLoading(true);
      
      try {
        // Buscar lotes de ingressos disponíveis
        const { data: batchesData, error: batchesError } = await supabase
          .from('ticket_batches')
          .select('price, available')
          .eq('event_id', event.id)
          .gt('available', 0);
          
        if (batchesError) throw batchesError;
        
        // Calcular o menor preço entre os lotes disponíveis
        if (batchesData && batchesData.length > 0) {
          const prices = batchesData
            .filter(batch => batch.available > 0)
            .map(batch => batch.price);
            
          if (prices.length > 0) {
            const min = Math.min(...prices);
            setLowestPrice(min);
          } else {
            setLowestPrice(null);
          }
        } else {
          setLowestPrice(null);
        }
        
      } catch (error) {
        console.error('Erro ao buscar preços:', error);
        setLowestPrice(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (event?.id) {
      fetchEventPricing();
    }
  }, [event.id]);
  
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Data não definida';
    
    if (endDate && endDate !== startDate) {
      return `${format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR })} à ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    return format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR });
  };
  
  const hasTickets = lowestPrice !== null;
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
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imagem+Indisponível";
          }}
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
              {formatDateRange(event.start_date, event.end_date)}
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
            {loading ? (
              <span className="text-muted-foreground">Carregando...</span>
            ) : hasTickets ? (
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
