
import { useState } from "react";
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

// Dados simulados para demonstração de ingressos do usuário
const mockTickets = [
  {
    id: "ticket1",
    userId: "2",
    eventId: "1",
    batchId: "batch1",
    purchaseDate: new Date("2024-10-15T14:30:00"),
    qrCode: "ticket1_qrcode_data",
    used: false,
    event: {
      id: "1",
      title: "Festival de Verão 2025",
      description: "O maior festival de música do verão com as melhores bandas!",
      date: new Date("2025-01-15T18:00:00"),
      location: "Praia de Copacabana, Rio de Janeiro",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
      ticketBatches: [],
    },
    batch: {
      id: "batch1",
      name: "1º Lote",
      eventId: "1",
      price: 120,
      quantity: 1000,
      available: 500,
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-11-15"),
    }
  },
  {
    id: "ticket2",
    userId: "2",
    eventId: "5",
    batchId: "batch8",
    purchaseDate: new Date("2024-10-20T10:15:00"),
    qrCode: "ticket2_qrcode_data",
    used: false,
    event: {
      id: "5",
      title: "Tributo ao Queen",
      description: "Uma noite de homenagem à lendária banda Queen.",
      date: new Date("2024-11-25T20:00:00"),
      location: "Teatro Municipal, São Paulo",
      image: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=2066&auto=format&fit=crop",
      ticketBatches: [],
    },
    batch: {
      id: "batch8",
      name: "1º Lote",
      eventId: "5",
      price: 100,
      quantity: 500,
      available: 100,
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-11-15"),
    }
  },
  {
    id: "ticket3",
    userId: "2",
    eventId: "6",
    batchId: "batch9",
    purchaseDate: new Date("2024-10-18T11:45:00"),
    qrCode: "ticket3_qrcode_data",
    used: true,
    event: {
      id: "6",
      title: "Festival de Jazz",
      description: "Os melhores artistas de jazz em um só lugar.",
      date: new Date("2024-12-15T19:00:00"),
      location: "Bourbon Street, Salvador",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
      ticketBatches: [],
    },
    batch: {
      id: "batch9",
      name: "Lote Promocional",
      eventId: "6",
      price: 80,
      quantity: 300,
      available: 150,
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-11-30"),
    }
  }
];

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
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

  const userTickets = mockTickets.filter(ticket => ticket.userId === user.id);
  
  const upcomingTickets = userTickets.filter(
    ticket => new Date(ticket.event.date) > new Date() && !ticket.used
  );
  
  const pastTickets = userTickets.filter(
    ticket => new Date(ticket.event.date) <= new Date() || ticket.used
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
                        src={ticket.event.image}
                        alt={ticket.event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle>{ticket.event.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Data</div>
                            <div className="font-medium">{formatDate(ticket.event.date)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Horário de início</div>
                            <div className="font-medium">{formatTime(ticket.event.date)}</div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">Local</div>
                          <div className="font-medium">{ticket.event.location}</div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-muted-foreground">Ingresso</div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{ticket.batch.name}</span>
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
                      src={ticket.event.image}
                      alt={ticket.event.title}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle>{ticket.event.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Data</div>
                          <div className="font-medium">{formatDate(ticket.event.date)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Horário de início</div>
                          <div className="font-medium">{formatTime(ticket.event.date)}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-muted-foreground">Local</div>
                        <div className="font-medium">{ticket.event.location}</div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-muted-foreground">Ingresso</div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{ticket.batch.name}</span>
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
