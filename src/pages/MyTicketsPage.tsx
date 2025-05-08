
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCode from "@/components/QRCode";
import { supabase } from "@/lib/supabaseClient";
import { Ticket, Event, TicketBatch, Sector, EventDate } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            event_id,
            batch_id,
            sector_id,
            event_date_id,
            purchase_date,
            qr_code,
            custom_code,
            is_used,
            events:event_id (
              id,
              title,
              description,
              location,
              image
            ),
            ticket_batches:batch_id (
              id,
              name,
              price
            ),
            sectors:sector_id (
              id,
              name,
              price,
              color
            ),
            event_dates:event_date_id (
              id,
              date,
              artist,
              start_time
            )
          `)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });
          
        if (error) throw error;
        
        // Transformar dados para o formato esperado
        const formattedTickets: Ticket[] = data.map(item => {
          const event: Event = {
            id: item.events.id,
            title: item.events.title,
            description: item.events.description,
            location: item.events.location,
            image: item.events.image
          };
          
          const batch: TicketBatch | undefined = item.ticket_batches ? {
            id: item.ticket_batches.id,
            name: item.ticket_batches.name,
            price: item.ticket_batches.price,
            eventId: item.events.id,
            quantity: 0,
            available: 0,
            startDate: new Date(),
            endDate: new Date()
          } : undefined;
          
          const sector: Sector | undefined = item.sectors ? {
            id: item.sectors.id,
            name: item.sectors.name,
            price: item.sectors.price,
            eventId: item.events.id,
            capacity: 0,
            available: 0,
            color: item.sectors.color
          } : undefined;
          
          const eventDate: EventDate | undefined = item.event_dates ? {
            id: item.event_dates.id,
            eventId: item.events.id,
            date: new Date(item.event_dates.date),
            artist: item.event_dates.artist,
            startTime: item.event_dates.start_time
          } : undefined;
          
          return {
            id: item.id,
            userId: user.id,
            eventId: item.event_id,
            batchId: item.batch_id,
            sectorId: item.sector_id,
            eventDateId: item.event_date_id,
            purchaseDate: new Date(item.purchase_date),
            qrCode: item.qr_code,
            customCode: item.custom_code,
            used: item.is_used,
            event,
            batch,
            sector,
            eventDate
          };
        });
        
        setTickets(formattedTickets);
      } catch (error) {
        console.error('Erro ao buscar ingressos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserTickets();
  }, [user]);
  
  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-6">Você precisa estar logado para ver seus ingressos</h1>
        <Button asChild>
          <Link to="/login">Entrar</Link>
        </Button>
      </div>
    );
  }

  const upcomingTickets = tickets.filter(
    ticket => 
      (ticket.eventDate 
        ? new Date(ticket.eventDate.date) > new Date() 
        : true) && 
      !ticket.used
  );
  
  const pastTickets = tickets.filter(
    ticket => 
      (ticket.eventDate 
        ? new Date(ticket.eventDate.date) <= new Date() 
        : false) || 
      ticket.used
  );
  
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' Y", { locale: ptBR });
  };
  
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };
  
  const handleTicketClick = (ticketId: string) => {
    if (selectedTicket === ticketId) {
      setSelectedTicket(null);
    } else {
      setSelectedTicket(ticketId);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meus Ingressos</h1>
          <p className="text-muted-foreground">
            Carregando seus ingressos...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[16/9] w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meus Ingressos</h1>
        <p className="text-muted-foreground">
          Acesse seus ingressos adquiridos
        </p>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="upcoming" className="flex-1">
            Próximos Eventos
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Eventos Passados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTickets.length > 0 ? (
              upcomingTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className={`${selectedTicket === ticket.id ? 'scale-100' : 'scale-95 hover:scale-100'} transition-all duration-300`}
                >
                  <Card 
                    className="overflow-hidden h-full cursor-pointer relative"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={ticket.event?.image}
                        alt={ticket.event?.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imagem+Indisponível";
                        }}
                      />
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle>{ticket.event?.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {ticket.eventDate && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Data</div>
                              <div className="font-medium">{formatDate(ticket.eventDate.date)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Horário de início</div>
                              <div className="font-medium">{ticket.eventDate.startTime}</div>
                            </div>
                          </div>
                        )}
                        
                        {ticket.eventDate && (
                          <div className="text-sm">
                            <div className="text-muted-foreground">Artista/Atração</div>
                            <div className="font-medium">{ticket.eventDate.artist}</div>
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">Local</div>
                          <div className="font-medium">{ticket.event?.location}</div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">Ingresso</div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {ticket.batch?.name}
                              {ticket.sector && ` - ${ticket.sector.name}`}
                            </span>
                            <Badge variant="outline">
                              {ticket.used ? "Utilizado" : "Válido"}
                            </Badge>
                          </div>
                        </div>
                        
                        {selectedTicket === ticket.id && (
                          <div className="pt-4 flex flex-col items-center animate-fade-in">
                            <div className="mb-2 font-medium text-sm">
                              QR Code de Entrada
                            </div>
                            
                            <QRCode 
                              value={ticket.qrCode}
                              size={180}
                            />
                            
                            {ticket.customCode && (
                              <div className="mt-2 text-sm text-center">
                                <span className="text-muted-foreground">Código: </span>
                                <span className="font-medium">{ticket.customCode}</span>
                              </div>
                            )}
                            
                            <div className="mt-4 w-full">
                              <Button variant="outline" className="w-full" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Compartilhar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-6">
                  Você não possui ingressos para eventos futuros.
                </p>
                <Button asChild>
                  <Link to="/events">Ver Eventos Disponíveis</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTickets.length > 0 ? (
              pastTickets.map(ticket => (
                <Card key={ticket.id} className="overflow-hidden h-full opacity-80">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={ticket.event?.image}
                      alt={ticket.event?.title}
                      className="h-full w-full object-cover grayscale"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imagem+Indisponível";
                      }}
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle>{ticket.event?.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {ticket.eventDate && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Data</div>
                            <div className="font-medium">{formatDate(ticket.eventDate.date)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Horário de início</div>
                            <div className="font-medium">{ticket.eventDate.startTime}</div>
                          </div>
                        </div>
                      )}
                      
                      {ticket.eventDate && (
                        <div className="text-sm">
                          <div className="text-muted-foreground">Artista/Atração</div>
                          <div className="font-medium">{ticket.eventDate.artist}</div>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <div className="text-muted-foreground">Local</div>
                        <div className="font-medium">{ticket.event?.location}</div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-muted-foreground">Ingresso</div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {ticket.batch?.name}
                            {ticket.sector && ` - ${ticket.sector.name}`}
                          </span>
                          <Badge variant="secondary">
                            Evento Finalizado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Você não possui histórico de eventos passados.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTicketsPage;
