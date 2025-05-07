
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Map } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EventMap from '@/components/EventMap';
import { allEvents } from '@/data/events';

// Import new components
import EventHeader from '@/components/event/EventHeader';
import AboutEventTab from '@/components/event/AboutEventTab';
import VenueTab from '@/components/event/VenueTab';
import RulesTab from '@/components/event/RulesTab';
import TicketPurchase from '@/components/event/TicketPurchase';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Encontrar o evento pelo ID
  const event = allEvents.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Evento não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O evento que você está procurando não existe ou foi removido.
        </p>
        <Button asChild>
          <Link to="/events">Ver todos os eventos</Link>
        </Button>
      </div>
    );
  }
  
  // Handler para seleção de setor do mapa
  const handleMapSectorSelect = (sectorId: string) => {
    setSelectedSectorId(sectorId);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-4">
        <div className="container">
          <Button variant="ghost" asChild>
            <Link to="/events" className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para eventos
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna da esquerda - Imagem e detalhes */}
          <div className="md:col-span-2 space-y-6">
            <EventHeader
              title={event.title}
              date={event.date}
              location={event.location}
              image={event.image}
              featured={event.featured}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="about" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2"
                >
                  Sobre o Evento
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Mapa e Setores
                </TabsTrigger>
                <TabsTrigger 
                  value="venue" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2"
                >
                  Local
                </TabsTrigger>
                <TabsTrigger 
                  value="rules" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2"
                >
                  Regras
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <AboutEventTab description={event.description} />
              </TabsContent>

              <TabsContent value="map" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Mapa do Evento e Setores</h3>
                  
                  {event.sectors && event.sectors.length > 0 ? (
                    <EventMap 
                      sectors={event.sectors} 
                      selectedSector={selectedSectorId || undefined}
                      onSectorSelect={handleMapSectorSelect}
                      mapImageUrl={event.mapImage}
                    />
                  ) : (
                    <div className="p-8 text-center bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">Este evento não possui setores definidos.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="venue" className="mt-4">
                <VenueTab location={event.location} />
              </TabsContent>
              
              <TabsContent value="rules" className="mt-4">
                <RulesTab />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Coluna da direita - Compra de ingressos */}
          <div>
            <TicketPurchase event={event} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
