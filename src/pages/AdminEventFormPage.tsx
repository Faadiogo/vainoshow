
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Calendar as CalendarIcon, Check, Plus, Trash, Grid3X3, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const AdminEventFormPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Formulário principal do evento
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('19:00');
  const [imageUrl, setImageUrl] = useState('');
  const [mapImageUrl, setMapImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // Estado para gerenciar lotes
  const [ticketBatches, setTicketBatches] = useState<any[]>([]);

  // Estado para gerenciar setores
  const [sectors, setSectors] = useState<any[]>([]);
  
  // Estado para gerenciar datas do evento
  const [eventDates, setEventDates] = useState<any[]>([]);
  
  // Estado para novo lote
  const [newBatch, setNewBatch] = useState({
    name: '',
    price: 0,
    quantity: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
  });
  
  // Estado para nova data de evento
  const [newEventDate, setNewEventDate] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    artist: '',
    startTime: '19:00',
  });

  // Estado para novo setor
  const [newSector, setNewSector] = useState({
    name: '',
    price: 0,
    capacity: 100,
    color: '#3B82F6',
  });
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      setLoading(true);
      
      try {
        // Buscar detalhes do evento
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
        if (eventError) throw eventError;
        
        // Preencher os campos do formulário
        setTitle(eventData.title);
        setDescription(eventData.description || '');
        setLocation(eventData.location || '');
        if (eventData.start_date) setStartDate(new Date(eventData.start_date));
        if (eventData.end_date) setEndDate(new Date(eventData.end_date));
        setImageUrl(eventData.image || '');
        setMapImageUrl(eventData.map_image || '');
        setFeatured(eventData.featured || false);
        
        // Buscar lotes de ingressos
        const { data: batchesData, error: batchesError } = await supabase
          .from('ticket_batches')
          .select('*')
          .eq('event_id', eventId);
        
        if (batchesError) throw batchesError;
        
        setTicketBatches(batchesData.map(batch => ({
          id: batch.id,
          name: batch.name,
          price: batch.price,
          quantity: batch.quantity,
          available: batch.available,
          startDate: new Date(batch.start_date),
          endDate: new Date(batch.end_date),
        })));
        
        // Buscar setores
        const { data: sectorsData, error: sectorsError } = await supabase
          .from('sectors')
          .select('*')
          .eq('event_id', eventId);
        
        if (sectorsError) throw sectorsError;
        
        setSectors(sectorsData.map(sector => ({
          id: sector.id,
          name: sector.name,
          price: sector.price,
          capacity: sector.capacity,
          available: sector.available,
          color: sector.color,
          position: sector.position,
        })));
        
        // Buscar datas do evento
        const { data: datesData, error: datesError } = await supabase
          .from('event_dates')
          .select('*')
          .eq('event_id', eventId);
        
        if (datesError) throw datesError;
        
        setEventDates(datesData.map(date => ({
          id: date.id,
          date: format(new Date(date.date), 'yyyy-MM-dd'),
          artist: date.artist,
          startTime: date.start_time,
        })));
        
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do evento.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId, toast]);
  
  const handleBatchAdd = () => {
    if (!newBatch.name || newBatch.price <= 0 || newBatch.quantity <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Preencha todos os campos do lote corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    setTicketBatches([...ticketBatches, {
      ...newBatch,
      id: `temp_${Date.now()}`,
      available: newBatch.quantity,
    }]);
    
    // Reset form
    setNewBatch({
      name: '',
      price: 0,
      quantity: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    
    toast({
      title: "Lote adicionado",
      description: `Lote "${newBatch.name}" adicionado com sucesso.`,
    });
  };
  
  const handleBatchRemove = (batchId: string) => {
    setTicketBatches(ticketBatches.filter(batch => batch.id !== batchId));
    
    toast({
      title: "Lote removido",
      description: "Lote removido com sucesso.",
    });
  };
  
  const handleEventDateAdd = () => {
    if (!newEventDate.date || !newEventDate.artist || !newEventDate.startTime) {
      toast({
        title: "Dados inválidos",
        description: "Preencha todos os campos da data corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    setEventDates([...eventDates, {
      ...newEventDate,
      id: `temp_${Date.now()}`,
    }]);
    
    // Reset form
    setNewEventDate({
      date: format(new Date(), 'yyyy-MM-dd'),
      artist: '',
      startTime: '19:00',
    });
    
    toast({
      title: "Data adicionada",
      description: `Data para "${newEventDate.artist}" adicionada com sucesso.`,
    });
  };
  
  const handleEventDateRemove = (dateId: string) => {
    setEventDates(eventDates.filter(date => date.id !== dateId));
    
    toast({
      title: "Data removida",
      description: "Data do evento removida com sucesso.",
    });
  };

  const handleSectorAdd = () => {
    if (!newSector.name || newSector.price <= 0 || newSector.capacity <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Preencha todos os campos do setor corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    setSectors([...sectors, {
      ...newSector,
      id: `temp_${Date.now()}`,
      available: newSector.capacity,
    }]);
    
    // Reset form
    setNewSector({
      name: '',
      price: 0,
      capacity: 100,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    });
    
    toast({
      title: "Setor adicionado",
      description: `Setor "${newSector.name}" adicionado com sucesso.`,
    });
  };
  
  const handleSectorRemove = (sectorId: string) => {
    setSectors(sectors.filter(sector => sector.id !== sectorId));
    
    toast({
      title: "Setor removido",
      description: "Setor removido com sucesso.",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !imageUrl) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Não autorizado",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // Preparar dados do evento
      const eventData = {
        title,
        description,
        location,
        image: imageUrl,
        map_image: mapImageUrl,
        featured,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null,
      };
      
      let savedEventId = eventId;
      
      // Criar ou atualizar evento
      if (eventId) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId);
        
        if (error) throw error;
      } else {
        // Criar novo evento
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select();
        
        if (error) throw error;
        savedEventId = data[0].id;
      }
      
      if (!savedEventId) throw new Error('Erro ao salvar o evento');
      
      // Processar lotes de ingressos
      for (const batch of ticketBatches) {
        const batchData = {
          event_id: savedEventId,
          name: batch.name,
          price: batch.price,
          quantity: batch.quantity,
          available: batch.available,
          start_date: batch.startDate.toISOString(),
          end_date: batch.endDate.toISOString(),
        };
        
        if (batch.id.toString().startsWith('temp_')) {
          // Criar novo lote
          await supabase.from('ticket_batches').insert([batchData]);
        } else {
          // Atualizar lote existente
          await supabase
            .from('ticket_batches')
            .update(batchData)
            .eq('id', batch.id);
        }
      }
      
      // Processar setores
      for (const sector of sectors) {
        const sectorData = {
          event_id: savedEventId,
          name: sector.name,
          price: sector.price,
          capacity: sector.capacity,
          available: sector.available,
          color: sector.color,
          position: sector.position,
        };
        
        if (sector.id.toString().startsWith('temp_')) {
          // Criar novo setor
          await supabase.from('sectors').insert([sectorData]);
        } else {
          // Atualizar setor existente
          await supabase
            .from('sectors')
            .update(sectorData)
            .eq('id', sector.id);
        }
      }
      
      // Processar datas do evento
      for (const date of eventDates) {
        const dateData = {
          event_id: savedEventId,
          date: new Date(date.date).toISOString(),
          artist: date.artist,
          start_time: date.startTime,
        };
        
        if (date.id.toString().startsWith('temp_')) {
          // Criar nova data
          await supabase.from('event_dates').insert([dateData]);
        } else {
          // Atualizar data existente
          await supabase
            .from('event_dates')
            .update(dateData)
            .eq('id', date.id);
        }
      }
      
      toast({
        title: "Evento salvo",
        description: `Evento "${title}" foi salvo com sucesso!`,
      });
      
      // Redirecionar para lista de eventos
      setTimeout(() => {
        navigate('/admin/events');
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
        <p className="mb-4">Você precisa estar logado como administrador para acessar esta página.</p>
        <Button asChild>
          <Link to="/login">Fazer login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{eventId ? 'Editar Evento' : 'Novo Evento'}</h1>
        <p className="text-muted-foreground">
          {eventId ? 'Atualize os detalhes do evento' : 'Crie um novo evento e defina lotes de ingressos e setores'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="details">Informações</TabsTrigger>
            <TabsTrigger value="dates">Datas</TabsTrigger>
            <TabsTrigger value="tickets">Lotes de Ingressos</TabsTrigger>
            <TabsTrigger value="sectors">Setores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Nome do Evento *</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Digite o nome do evento"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Descreva o evento"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Local *</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Onde será realizado o evento"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="startDate"
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="endDate"
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem Principal *</Label>
                  <Input 
                    id="image" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                  
                  {imageUrl && (
                    <div className="mt-2 rounded-md overflow-hidden aspect-video w-full">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imagem+Inválida";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mapImage">URL do Mapa do Evento</Label>
                  <Input 
                    id="mapImage" 
                    value={mapImageUrl} 
                    onChange={(e) => setMapImageUrl(e.target.value)} 
                    placeholder="https://exemplo.com/mapa.jpg"
                  />
                  
                  {mapImageUrl && (
                    <div className="mt-2 rounded-md overflow-hidden aspect-video w-full">
                      <img 
                        src={mapImageUrl} 
                        alt="Mapa do Evento" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Mapa+Inválido";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={featured} 
                    onCheckedChange={(checked) => setFeatured(checked as boolean)} 
                  />
                  <Label htmlFor="featured">
                    Destacar evento na página inicial
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Datas do Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {eventDates.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Datas Cadastradas</h3>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Artista/Atração</TableHead>
                          <TableHead>Horário de Início</TableHead>
                          <TableHead className="w-[80px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventDates.map((date) => (
                          <TableRow key={date.id}>
                            <TableCell>{format(new Date(date.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                            <TableCell>{date.artist}</TableCell>
                            <TableCell>{date.startTime}</TableCell>
                            <TableCell>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                type="button"
                                onClick={() => handleEventDateRemove(date.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma data cadastrada. Adicione uma data abaixo.
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Adicionar Nova Data</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Data</Label>
                        <Input 
                          id="event-date" 
                          type="date"
                          value={newEventDate.date}
                          onChange={(e) => setNewEventDate({...newEventDate, date: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Horário de Início</Label>
                        <Input 
                          id="event-time" 
                          type="time"
                          value={newEventDate.startTime}
                          onChange={(e) => setNewEventDate({...newEventDate, startTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-artist">Artista/Atração</Label>
                      <Input 
                        id="event-artist" 
                        value={newEventDate.artist}
                        onChange={(e) => setNewEventDate({...newEventDate, artist: e.target.value})}
                        placeholder="Nome do artista ou atração"
                      />
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleEventDateAdd}
                      className="w-full mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lotes de Ingressos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketBatches.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Lotes Cadastrados</h3>
                    
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm py-2 border-b">
                      <div>Nome do Lote</div>
                      <div>Preço</div>
                      <div>Quantidade</div>
                      <div>Período</div>
                    </div>
                    
                    {ticketBatches.map((batch) => (
                      <div key={batch.id} className="grid grid-cols-4 gap-4 items-center py-2 border-b">
                        <div>{batch.name}</div>
                        <div>R$ {batch.price.toFixed(2).replace('.', ',')}</div>
                        <div>{batch.quantity}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {format(batch.startDate, "dd/MM/yyyy")} - {format(batch.endDate, "dd/MM/yyyy")}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            type="button"
                            onClick={() => handleBatchRemove(batch.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum lote cadastrado. Adicione um lote abaixo.
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Adicionar Novo Lote</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="batch-name">Nome do Lote</Label>
                        <Input 
                          id="batch-name" 
                          value={newBatch.name} 
                          onChange={(e) => setNewBatch({...newBatch, name: e.target.value})} 
                          placeholder="Ex: 1º Lote, VIP, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="batch-price">Preço (R$)</Label>
                        <Input 
                          id="batch-price" 
                          type="number"
                          min="0"
                          step="0.01"
                          value={newBatch.price || ''}
                          onChange={(e) => setNewBatch({...newBatch, price: parseFloat(e.target.value) || 0})} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="batch-quantity">Quantidade de Ingressos</Label>
                      <Input 
                        id="batch-quantity" 
                        type="number"
                        min="1"
                        value={newBatch.quantity || ''}
                        onChange={(e) => setNewBatch({...newBatch, quantity: parseInt(e.target.value) || 0})} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Início das Vendas</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(newBatch.startDate, "PPP", { locale: ptBR })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newBatch.startDate}
                              onSelect={(date) => date && setNewBatch({...newBatch, startDate: date})}
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Data de Término das Vendas</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(newBatch.endDate, "PPP", { locale: ptBR })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newBatch.endDate}
                              onSelect={(date) => date && setNewBatch({...newBatch, endDate: date})}
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleBatchAdd}
                      className="w-full mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Lote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Grid3X3 className="mr-2 h-5 w-5" />
                  Setores do Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {sectors.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Setores Cadastrados</h3>
                    
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm py-2 border-b">
                      <div>Nome do Setor</div>
                      <div>Preço</div>
                      <div>Capacidade</div>
                      <div>Cor</div>
                    </div>
                    
                    {sectors.map((sector) => (
                      <div key={sector.id} className="grid grid-cols-4 gap-4 items-center py-2 border-b">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2"
                            style={{backgroundColor: sector.color}}
                          />
                          {sector.name}
                        </div>
                        <div>R$ {sector.price.toFixed(2).replace('.', ',')}</div>
                        <div>{sector.capacity}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 border rounded"
                              style={{backgroundColor: sector.color}}
                            />
                            <span className="ml-2 text-xs">{sector.color}</span>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            type="button"
                            onClick={() => handleSectorRemove(sector.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum setor cadastrado. Adicione setores abaixo.
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Adicionar Novo Setor</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sector-name">Nome do Setor</Label>
                        <Input 
                          id="sector-name" 
                          value={newSector.name} 
                          onChange={(e) => setNewSector({...newSector, name: e.target.value})} 
                          placeholder="Ex: VIP, Pista, Camarote, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sector-price">Preço (R$)</Label>
                        <Input 
                          id="sector-price" 
                          type="number"
                          min="0"
                          step="0.01"
                          value={newSector.price || ''}
                          onChange={(e) => setNewSector({...newSector, price: parseFloat(e.target.value) || 0})} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sector-capacity">Capacidade</Label>
                        <Input 
                          id="sector-capacity" 
                          type="number"
                          min="1"
                          value={newSector.capacity || ''}
                          onChange={(e) => setNewSector({...newSector, capacity: parseInt(e.target.value) || 0})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sector-color">Cor do Setor</Label>
                        <div className="flex">
                          <input
                            type="color"
                            id="sector-color"
                            className="h-10 w-10 border rounded-l p-1"
                            value={newSector.color}
                            onChange={(e) => setNewSector({...newSector, color: e.target.value})}
                          />
                          <Input
                            className="rounded-l-none"
                            value={newSector.color}
                            onChange={(e) => {
                              const color = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                              setNewSector({...newSector, color})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleSectorAdd}
                      className="w-full mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Setor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/events')}
            disabled={saveLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saveLoading}>
            {saveLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvar Evento
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;

interface Link {
  children: React.ReactNode;
  to: string;
}

function Link({ children, to }: Link) {
  return <a href={to}>{children}</a>;
}
