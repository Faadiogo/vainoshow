
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Event, TicketBatch } from '@/types';

const TicketBatchesPage = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketBatches, setTicketBatches] = useState<TicketBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (selectedEventId) {
      fetchTicketBatches(selectedEventId);
    } else {
      setTicketBatches([]);
    }
  }, [selectedEventId]);
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setEvents(data || []);
      
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTicketBatches = async (eventId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ticket_batches')
        .select('*')
        .eq('event_id', eventId)
        .order('start_date');
      
      if (error) throw error;
      
      const formattedBatches = data?.map(batch => ({
        ...batch,
        id: batch.id,
        name: batch.name,
        eventId: batch.event_id,
        price: batch.price,
        quantity: batch.quantity,
        available: batch.available,
        startDate: new Date(batch.start_date),
        endDate: new Date(batch.end_date)
      })) || [];
      
      setTicketBatches(formattedBatches);
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os lotes de ingressos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setPrice(0);
    setQuantity(0);
    setStartDate(new Date());
    setEndDate(new Date());
    setCurrentBatchId(null);
    setIsEditing(false);
  };
  
  const handleEditBatch = (batch: TicketBatch) => {
    setIsEditing(true);
    setCurrentBatchId(batch.id);
    setName(batch.name);
    setPrice(batch.price);
    setQuantity(batch.quantity);
    setStartDate(batch.startDate);
    setEndDate(batch.endDate);
  };
  
  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este lote?')) return;
    
    try {
      const { error } = await supabase
        .from('ticket_batches')
        .delete()
        .eq('id', batchId);
      
      if (error) throw error;
      
      setTicketBatches(ticketBatches.filter(batch => batch.id !== batchId));
      
      toast({
        title: 'Sucesso',
        description: 'Lote excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o lote.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !quantity || !startDate || !endDate || !selectedEventId) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const batchData = {
        name,
        price,
        quantity,
        available: isEditing ? undefined : quantity, // Só atualiza available se for um novo lote
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        event_id: selectedEventId
      };
      
      if (isEditing && currentBatchId) {
        // Atualizar lote existente
        const { data, error } = await supabase
          .from('ticket_batches')
          .update(batchData)
          .eq('id', currentBatchId)
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          const updatedBatch: TicketBatch = {
            id: data[0].id,
            name: data[0].name,
            eventId: data[0].event_id,
            price: data[0].price,
            quantity: data[0].quantity,
            available: data[0].available,
            startDate: new Date(data[0].start_date),
            endDate: new Date(data[0].end_date)
          };
          
          setTicketBatches(prevBatches => 
            prevBatches.map(batch => 
              batch.id === currentBatchId ? updatedBatch : batch
            )
          );
        }
        
        toast({
          title: 'Sucesso',
          description: 'Lote atualizado com sucesso.',
        });
      } else {
        // Criar novo lote
        const { data, error } = await supabase
          .from('ticket_batches')
          .insert([batchData])
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          const newBatch: TicketBatch = {
            id: data[0].id,
            name: data[0].name,
            eventId: data[0].event_id,
            price: data[0].price,
            quantity: data[0].quantity,
            available: data[0].available,
            startDate: new Date(data[0].start_date),
            endDate: new Date(data[0].end_date)
          };
          
          setTicketBatches([...ticketBatches, newBatch]);
        }
        
        toast({
          title: 'Sucesso',
          description: 'Novo lote criado com sucesso.',
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o lote.',
        variant: 'destructive',
      });
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="p-6">
      <Helmet>
        <title>Gerenciar Lotes - VaiNoShow</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Lotes de Ingressos</h1>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Selecione um Evento</label>
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Selecione um evento" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedEventId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow p-4 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Lotes Disponíveis</h2>
              
              {loading ? (
                <p className="text-center py-4">Carregando lotes...</p>
              ) : ticketBatches.length === 0 ? (
                <p className="text-center py-4">Não há lotes cadastrados para este evento.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Disponíveis</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Fim</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ticketBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell>{batch.name}</TableCell>
                          <TableCell>{formatCurrency(batch.price)}</TableCell>
                          <TableCell>{batch.quantity}</TableCell>
                          <TableCell>{batch.available}</TableCell>
                          <TableCell>{format(batch.startDate, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{format(batch.endDate, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleEditBatch(batch)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteBatch(batch.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Editar Lote' : 'Novo Lote'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Lote</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="1º Lote, Lote Promocional, etc"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))} 
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quantidade Total</label>
                  <Input 
                    type="number" 
                    min="1"
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))} 
                    placeholder="100"
                    required
                    disabled={isEditing}
                  />
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      A quantidade total não pode ser alterada após a criação.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Início</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PP', { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Término</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PP', { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date < new Date() || (startDate && date < startDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="w-full">
                    {isEditing ? 'Atualizar' : 'Criar'} Lote
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketBatchesPage;
