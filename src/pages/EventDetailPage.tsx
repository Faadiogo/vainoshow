
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { allEvents } from '@/data/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const event = allEvents.find(e => e.id === eventId);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  // Format date function
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Data não definida';
    
    if (endDate && endDate !== startDate) {
      return `${format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR })} à ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`;
    }
    
    return format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR });
  };
  
  const handlePurchase = () => {
    if (!selectedBatch) {
      toast.error("Selecione um lote para continuar");
      return;
    }
    
    toast.success("Ingresso comprado com sucesso! O QRCode está disponível na seção 'Meus Ingressos'.");
  };

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>{event.title} - VaiNoShow</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDateRange(event.start_date, event.end_date)}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {event.location}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border shadow overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-[300px] object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre o evento</h2>
              <p className="text-muted-foreground">{event.description}</p>
              
              {event.eventDates && event.eventDates.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Programação:</h3>
                  <div className="space-y-3">
                    {event.eventDates.map(date => (
                      <div key={date.id} className="flex items-center gap-2 border-l-2 border-primary/50 pl-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{date.artist}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(date.date, "dd/MM/yyyy", { locale: ptBR })} às {date.startTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {event.mapImage && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Mapa do Evento:</h3>
                  <img 
                    src={event.mapImage} 
                    alt="Mapa do evento" 
                    className="w-full rounded-md border" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg border shadow sticky top-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                Comprar Ingressos
              </h2>
              
              {event.ticketBatches && event.ticketBatches.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Selecione o Lote:</label>
                    <div className="space-y-2">
                      {event.ticketBatches.map(batch => (
                        <div 
                          key={batch.id}
                          onClick={() => batch.available > 0 ? setSelectedBatch(batch.id) : null}
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedBatch === batch.id 
                              ? 'border-primary bg-primary/5'
                              : batch.available > 0
                                ? 'hover:border-primary/50'
                                : 'cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{batch.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {batch.available > 0 ? `${batch.available} disponíveis` : 'Esgotado'}
                              </p>
                            </div>
                            <p className="font-bold text-right">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(batch.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {event.sectors && event.sectors.length > 0 && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Selecione o Setor:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {event.sectors.map(sector => (
                          <div
                            key={sector.id}
                            onClick={() => sector.available > 0 ? setSelectedSector(sector.id) : null}
                            className={`p-2 rounded-md border text-center cursor-pointer transition-colors ${
                              selectedSector === sector.id 
                                ? 'border-primary bg-primary/5'
                                : sector.available > 0
                                  ? 'hover:border-primary/50'
                                  : 'cursor-not-allowed opacity-60'
                            }`}
                            style={{ borderColor: selectedSector === sector.id ? sector.color : undefined }}
                          >
                            <div className="text-sm font-medium" style={{ color: sector.color }}>
                              {sector.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {sector.available} disp.
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Quantidade:</label>
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="px-3 py-1 font-bold" 
                        onClick={() => setTicketQuantity(prev => Math.max(prev - 1, 1))}
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">{ticketQuantity}</div>
                      <button 
                        className="px-3 py-1 font-bold" 
                        onClick={() => setTicketQuantity(prev => Math.min(prev + 1, 5))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        {selectedBatch ? 
                          new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(
                            event.ticketBatches.find(b => b.id === selectedBatch)!.price * ticketQuantity
                          ) : 
                          'R$ 0,00'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span>Taxa de serviço:</span>
                      <span className="font-medium">
                        {selectedBatch ? 
                          new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(
                            event.ticketBatches.find(b => b.id === selectedBatch)!.price * 0.1 * ticketQuantity
                          ) : 
                          'R$ 0,00'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>
                        {selectedBatch ? 
                          new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(
                            event.ticketBatches.find(b => b.id === selectedBatch)!.price * 1.1 * ticketQuantity
                          ) : 
                          'R$ 0,00'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    onClick={handlePurchase}
                    disabled={!selectedBatch}
                  >
                    Comprar Agora
                  </Button>
                </div>
              ) : (
                <p>Não há lotes disponíveis no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
