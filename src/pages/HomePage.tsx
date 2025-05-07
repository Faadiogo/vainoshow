import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { Event, TicketBatch } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { FaTheaterMasks, FaMusic, FaTicketAlt, FaApple } from "react-icons/fa";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, description, location, image, map_image, start_date, end_date, featured,
          ticket_batches ( id, name, event_id, price, quantity, available, start_sales_date, end_sales_date )
        `)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar eventos:', error);
      } else {
        const mapped: Event[] = (data ?? []).map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description ?? '',
          location: event.location ?? '',
          image: event.image ?? '',
          mapImage: event.map_image ?? '',
          start_date: event.start_date,
          end_date: event.end_date,
          featured: event.featured ?? false,
          ticketBatches: (event.ticket_batches ?? []).map((b: any): TicketBatch => ({
            id: b.id,
            name: b.name,
            eventId: b.event_id,
            price: b.price,
            quantity: b.quantity,
            available: b.available,
            startDate: new Date(b.start_sales_date),
            endDate: new Date(b.end_sales_date),
          })),
          sectors: []
        }));
        setEvents(mapped);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.location?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-event py-20 md:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img 
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop" 
            alt="Concert" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Sua Agenda de Diversão Começa Aqui!
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in">
              Compre ingressos para os eventos mais esperados com apenas alguns cliques.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 mb-2">
                <Input 
                  type="text"
                  placeholder="Procure por eventos, artistas ou locais..."
                  className="border-none bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="ml-2 bg-white text-primary hover:bg-white/90">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-4 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Categorias</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/events?category=music" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-border hover:border-primary/30 transition-all hover:shadow-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FaMusic className="h-5 w-5 text-primary " />
              </div>
              <span className="font-medium text-sm">Música</span>
            </Link>

            <Link to="/events?category=festivals" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-border hover:border-primary/30 transition-all hover:shadow-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FaTicketAlt className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-sm">Festivais</span>
            </Link>

            <Link to="/events?category=theater" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-border hover:border-primary/30 transition-all hover:shadow-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FaTheaterMasks className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-sm">Teatro</span>           
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Próximos Eventos</h2>
            <Button variant="ghost" asChild>
              <Link to="/events" className="flex items-center">
                Ver todos
                <Calendar className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum evento encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="bg-gradient-event rounded-xl overflow-hidden">
            <div className="md:flex items-center">
              <div className="md:w-1/2 py-10 px-6 md:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Organize seu próprio evento</h2>
                <p className="mb-6 text-white/80">
                  Quer vender ingressos para o seu evento? Nossa plataforma oferece
                  todas as ferramentas que você precisa para criar e gerenciar eventos de sucesso.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  Saiba Mais
                </Button>
              </div>
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
                  alt="Event Organizer" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-event-purple/80 to-transparent md:hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Download App Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="relative max-w-xs mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1970&auto=format&fit=crop" 
                  alt="Mobile App" 
                  className="mx-auto rounded-3xl shadow-xl"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 order-1 md:order-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Compre ingressos pelo celular</h2>
              <p className="text-muted-foreground mb-6">
                Baixe nosso aplicativo para comprar ingressos em qualquer lugar,
                acessar seus ingressos offline e receber notificações sobre eventos.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button variant="outline" type="button" className="flex items-center gap-2">
                  <img
                    className="w-6 h-6"
                    alt="Google Play"
                    src="https://www.gstatic.com/marketing-cms/assets/images/76/88/fd33cad04fa7af4f975d18632065/google-play.webp=s48-fcrop64=1,00000000ffffffff-rw"
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                  <span>Play Store</span>
                </Button>
                <Button type="button" className="flex items-center gap-2 bg-black hover:bg-gray-800 hover:text-white text-white">
                  <FaApple className='w-10 h-10' style={{ width: '1.5rem', height: '1.5rem' }} />
                  App Store
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
