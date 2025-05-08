
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  const [lowestPrice, setLowestPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const calculateLowestPrice = () => {
      setLoading(true);
      
      try {
        // Verificar lotes disponíveis no evento
        const availableBatches = event.ticketBatches?.filter(batch => batch.available > 0) || [];
        
        if (availableBatches.length > 0) {
          // Encontrar o menor preço entre os lotes disponíveis
          const prices = availableBatches.map(batch => batch.price);
          setLowestPrice(Math.min(...prices));
        } else {
          setLowestPrice(null);
        }
      } catch (error) {
        console.error('Erro ao calcular preços:', error);
        setLowestPrice(null);
      } finally {
        setLoading(false);
      }
    };
    
    calculateLowestPrice();
  }, [event]);
  
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Data não definida';
    
    if (endDate && endDate !== startDate) {
      return `${format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR })} à ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    return format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR });
  };
  
  const hasTickets = lowestPrice !== null;
  const formattedPrice = hasTickets ? 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lowestPrice) : 
    'Esgotado';

  return (
    <Link 
      to={`/events/${event.id}`} 
      className={cn("event-card flex flex-col h-full rounded-lg border border-border overflow-hidden bg-card transition-all hover:shadow-md", className)}
    >
      <div className="aspect-[16/9] w-full overflow-hidden relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imagem+Indisponível";
          }}
        />
        
        {event.featured && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs rounded-md font-medium">
            Destaque
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
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
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className={cn(
            "font-medium",
            !hasTickets && "text-destructive"
          )}>
            {loading ? (
              <span className="text-muted-foreground">Carregando...</span>
            ) : hasTickets ? (
              <span>A partir de <span className="text-purple-600">{formattedPrice}</span></span>
            ) : (
              formattedPrice
            )}
          </div>
          
          <div className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
            {hasTickets ? "Disponível" : "Esgotado"}
          </div>
        </div>
      </div>
    </Link>
  );
}
