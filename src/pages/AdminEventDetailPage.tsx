
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event, EventDate } from '@/types';
import { Calendar, Clock, Edit, Plus, Trash } from 'lucide-react';

const AdminEventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventDates, setEventDates] = useState<EventDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [newDate, setNewDate] = useState<{
    date: string;
    artist: string;
    startTime: string;
  }>({
    date: '',
    artist: '',
    startTime: '19:00',
  });
  
  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventDetails = async () => {
      setLoading(true);
      
      // Buscar detalhes do evento
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (eventError) {
        console.error('Erro ao buscar evento:', eventError);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do evento.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      // Buscar datas do evento
      const { data: datesData, error: datesError } = await supabase
        .from('event_dates')
        .select('*')
        .eq('event_id', eventId)
        .order('date', { ascending: true });
      
      if (datesError) {
        console.error('Erro ao buscar datas do evento:', datesError);
      }
      
      // Buscar lotes de ingressos
      const { data: batchesData, error: batchesError } = await supabase
        .from('ticket_batches')
        .select('*')
        .eq('event_id', eventId);
      
      if (batchesError) {
        console.error('Erro ao buscar lotes de ingressos:', batchesError);
      }
      
      // Buscar setores
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('sectors')
        .select('*')
        .eq('event_id', eventId);
      
      if (sectorsError) {
        console.error('Erro ao buscar setores:', sectorsError);
      }
      
      // Formatar os dados para o formato esperado pela interface
      const formattedEvent: Event = {
        ...eventData,
        ticketBatches: batchesData?.map(batch => ({
          id: batch.id,
          name: batch.name,
          eventId: batch.event_id,
          price: batch.price,
          quantity: batch.quantity,
          available: batch.available,
          startDate: new Date(batch.start_date),
          endDate: new Date(batch.end_date)
        })) || [],
        sectors: sectorsData?.map(sector => ({
          id: sector.id,
          name: sector.name,
          eventId: sector.event_id,
          price: sector.price,
          capacity: sector.capacity,
          available: sector.available,
          color: sector.color,
          position: sector.position
        })) || []
      };
      
      const formattedDates: EventDate[] = datesData?.map(date => ({
        id: date.id,
        eventId: date.event_id,
        date: new Date(date.date),
        artist: date.artist,
        startTime: date.start_time
      })) || [];
      
      setEvent(formattedEvent);
      setEventDates(formattedDates);
      setLoading(false);
    };
    
    fetchEventDetails();
  }, [eventId, toast]);
  
  const handleAddDate = async () => {
    if (!eventId || !newDate.date || !newDate.artist || !newDate.startTime) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }
    
    const { data, error } = await supabase
      .from('event_dates')
      .insert([{
        event_id: eventId,
        date: new Date(newDate.date).toISOString(),
        artist: newDate.artist,
        start_time: newDate.startTime
      }])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a data ao evento.',
        variant: 'destructive',
      });
      return;
    }
    
    // Adicionar a nova data à lista
    if (data && data.length > 0) {
      const newEventDate: EventDate = {
        id: data[0].id,
        eventId: data[0].event_id,
        date: new Date(data[0].date),
        artist: data[0].artist,
        startTime: data[0].start_time
      };
      
      setEventDates([...eventDates, newEventDate]);
      
      // Resetar o formulário
      setNewDate({
        date: '',
        artist: '',
        startTime: '19:00',
      });
      
      setIsAddingDate(false);
      
      toast({
        title: 'Data adicionada',
        description: `A data para ${newEventDate.artist} foi adicionada com sucesso.`,
      });
    }
  };
  
  const handleDeleteDate = async (dateId: string) => {
    const { error } = await supabase
      .from('event_dates')
      .delete()
      .eq('id', dateId);
    
    if (error) {
      console.error('Erro ao excluir data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a data do evento.',
        variant: 'destructive',
      });
      return;
    }
    
    // Atualizar a lista de datas
    setEventDates(eventDates.filter(date => date.id !== dateId));
    
    toast({
      title: 'Data excluída',
      description: 'A data do evento foi excluída com sucesso.',
    });
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Carregando detalhes do evento...</h1>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Evento não encontrado</h1>
        </div>
        <Button asChild>
          <Link to="/admin/events">Voltar para lista de eventos</Link>
        </Button>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground">{event.location}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/events">Voltar para lista</Link>
          </Button>
          <Button asChild>
            <Link to={`/admin/events/${eventId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Evento
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full aspect-video rounded-md overflow-hidden mb-4">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="mt-1">{event.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Local</p>
                <p className="mt-1">{event.location}</p>
              </div>
              
              {event.start_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="mt-1">
                    {event.end_date && event.end_date !== event.start_date
                      ? `${format(new Date(event.start_date), "dd/MM/yyyy", { locale: ptBR })} até ${format(new Date(event.end_date), "dd/MM/yyyy", { locale: ptBR })}`
                      : format(new Date(event.start_date), "dd/MM/yyyy", { locale: ptBR })
                    }
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Em destaque</p>
                <p className="mt-1">{event.featured ? 'Sim' : 'Não'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="dates" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="dates">Datas do Evento</TabsTrigger>
              <TabsTrigger value="batches">Lotes de Ingressos</TabsTrigger>
              <TabsTrigger value="sectors">Setores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dates" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Datas do Evento</CardTitle>
                  <Dialog open={isAddingDate} onOpenChange={setIsAddingDate}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Data</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Data</Label>
                          <Input 
                            id="date" 
                            type="date" 
                            value={newDate.date}
                            onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="artist">Artista/Atração</Label>
                          <Input 
                            id="artist" 
                            value={newDate.artist}
                            onChange={(e) => setNewDate({ ...newDate, artist: e.target.value })}
                            placeholder="Nome do artista ou atração"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Horário de Início</Label>
                          <Input 
                            id="startTime" 
                            type="time" 
                            value={newDate.startTime}
                            onChange={(e) => setNewDate({ ...newDate, startTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingDate(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddDate}>Salvar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {eventDates.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Artista/Atração</TableHead>
                          <TableHead>Horário</TableHead>
                          <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventDates.map((date) => (
                          <TableRow key={date.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(date.date)}
                              </div>
                            </TableCell>
                            <TableCell>{date.artist}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                {date.startTime}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteDate(date.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma data cadastrada para este evento.</p>
                      <p className="mt-2">Clique em "Adicionar Data" para cadastrar uma nova data.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="batches" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Lotes de Ingressos</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Lote
                  </Button>
                </CardHeader>
                <CardContent>
                  {event.ticketBatches && event.ticketBatches.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Disponíveis</TableHead>
                          <TableHead>Período de Vendas</TableHead>
                          <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {event.ticketBatches.map((batch) => (
                          <TableRow key={batch.id}>
                            <TableCell>{batch.name}</TableCell>
                            <TableCell>R$ {batch.price.toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell>{batch.available} / {batch.quantity}</TableCell>
                            <TableCell>
                              {formatDate(batch.startDate)} até {formatDate(batch.endDate)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum lote de ingresso cadastrado para este evento.</p>
                      <p className="mt-2">Clique em "Adicionar Lote" para cadastrar um novo lote.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sectors" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Setores</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Setor
                  </Button>
                </CardHeader>
                <CardContent>
                  {event.sectors && event.sectors.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Capacidade</TableHead>
                          <TableHead>Cor</TableHead>
                          <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {event.sectors.map((sector) => (
                          <TableRow key={sector.id}>
                            <TableCell>{sector.name}</TableCell>
                            <TableCell>R$ {sector.price.toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell>{sector.available} / {sector.capacity}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{backgroundColor: sector.color}}
                                />
                                {sector.color}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum setor cadastrado para este evento.</p>
                      <p className="mt-2">Clique em "Adicionar Setor" para cadastrar um novo setor.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetailPage;
