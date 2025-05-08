
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Calendar, MapPin, Ticket } from 'lucide-react';
import QRCode from '@/components/QRCode';
import { mockTickets } from '@/data/events';
import { TicketWithDetails } from '@/types';

const MyTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingTickets = mockTickets.filter(ticket => !ticket.used);
  const usedTickets = mockTickets.filter(ticket => ticket.used);

  const tickets = activeTab === 'upcoming' ? upcomingTickets : usedTickets;

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Meus Ingressos - VaiNoShow</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meus Ingressos</h1>
        <p className="text-muted-foreground">Gerencie seus ingressos para eventos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="used">Utilizados</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.length > 0 ? (
          tickets.map((ticket: TicketWithDetails) => (
            <Card key={ticket.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20">
                <img 
                  src={ticket.event.image} 
                  alt={ticket.event.title} 
                  className="w-full h-full object-cover"
                />
                {ticket.used && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-full">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{ticket.event.title}</h3>
                    {ticket.eventDate ? (
                      <p className="text-sm text-muted-foreground">
                        {ticket.eventDate.artist} - {ticket.eventDate.date.toLocaleDateString('pt-BR')}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.event.start_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  {ticket.sector && (
                    <div 
                      className="px-2 py-1 rounded text-xs font-semibold" 
                      style={{backgroundColor: `${ticket.sector.color}20`, color: ticket.sector.color}}
                    >
                      {ticket.sector.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {ticket.eventDate 
                      ? `${ticket.eventDate.date.toLocaleDateString('pt-BR')} às ${ticket.eventDate.startTime}`
                      : new Date(ticket.event.start_date).toLocaleDateString('pt-BR')
                    }
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {ticket.event.location}
                  </div>
                  {ticket.batch && (
                    <div className="flex items-center text-sm">
                      <Ticket className="h-4 w-4 mr-2" />
                      {ticket.batch.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticket.batch.price)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <QRCode value={ticket.qrCode} size={150} />
                </div>
                
                <div className="text-xs text-center text-muted-foreground mb-4">
                  {ticket.qrCode}
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button className="flex-1" variant="outline">Transferir</Button>
                  <Button className="flex-1">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum ingresso encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'upcoming' 
                ? 'Você não possui ingressos para eventos futuros.' 
                : 'Você não possui ingressos utilizados.'}
            </p>
            <Button>Explorar Eventos</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
