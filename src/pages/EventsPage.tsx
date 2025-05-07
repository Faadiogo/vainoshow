
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { Event } from '@/types';
import { allEvents } from '@/data/events'; 

export default function EventsPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const categoryParam = searchParams.get('category');
  
  // Use o parâmetro da URL para definir a categoria inicial
  useState(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
    }
  });
  
  const filteredEvents = allEvents.filter(event => {
    // Aplicar filtro de busca
    const searchMatch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoria
    let categoryMatch = activeTab === 'all';
    
    if (activeTab === 'music') {
      categoryMatch = event.title.toLowerCase().includes('show') || 
                      event.title.toLowerCase().includes('festival') ||
                      event.title.toLowerCase().includes('music');
    } else if (activeTab === 'festivals') {
      categoryMatch = event.title.toLowerCase().includes('festival');
    } else if (activeTab === 'theater') {
      categoryMatch = event.title.toLowerCase().includes('teatro') ||
                      event.location.toLowerCase().includes('teatro');
    } else if (activeTab === 'sports') {
      categoryMatch = event.title.toLowerCase().includes('esporte') || 
                      event.title.toLowerCase().includes('campeonato');
    } else if (activeTab === 'featured') {
      categoryMatch = !!event.featured;
    }
    
    return searchMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/30 py-6">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Eventos</h1>
            <p className="text-muted-foreground mb-4">
              Descubra os melhores eventos e garanta seu ingresso!
            </p>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Busque por evento, local ou artista..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs e Eventos */}
      <section>
        <div className="container">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full mb-16"
          >
            <div className="border-b">
              <div className="overflow-auto">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="featured">Destaques</TabsTrigger>
                  <TabsTrigger value="music">Música</TabsTrigger>
                  <TabsTrigger value="festivals">Festivais</TabsTrigger>
                  <TabsTrigger value="theater">Teatro</TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="featured" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="music" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="festivals" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="theater" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sports" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou busque por outros termos.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
