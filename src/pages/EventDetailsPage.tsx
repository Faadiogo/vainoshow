
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { allEvents } from '@/data/events';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const event = allEvents.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>{event.title} - VaiNoShow</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">{event.title}</h1>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">{event.description}</p>
            <p className="mb-2"><strong>Local:</strong> {event.location}</p>
            <p className="mb-4"><strong>Data:</strong> {event.start_date ? new Date(event.start_date).toLocaleDateString('pt-BR') : 'A definir'}</p>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Lotes disponíveis</h2>
              {event.ticketBatches && event.ticketBatches.length > 0 ? (
                <div className="space-y-2">
                  {event.ticketBatches.map(batch => (
                    <div key={batch.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {batch.available > 0 ? `${batch.available} disponíveis` : 'Esgotado'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(batch.price)}
                        </p>
                      </div>
                    </div>
                  ))}
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

export default EventDetailsPage;
