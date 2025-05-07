
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Calendar as CalendarIcon, Check, Plus, Trash, Grid3X3, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event, Sector } from '@/types';
import { allEvents } from '@/data/events';

const AdminEventFormPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Encontrar evento existente ou criar novo
  const existingEvent = eventId ? allEvents.find(e => e.id === eventId) : null;
  
  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [location, setLocation] = useState(existingEvent?.location || '');
  const [date, setDate] = useState<Date | undefined>(existingEvent?.date);
  const [time, setTime] = useState(
    existingEvent ? format(existingEvent.date, 'HH:mm') : '19:00'
  );
  const [imageUrl, setImageUrl] = useState(existingEvent?.image || '');
  const [mapImageUrl, setMapImageUrl] = useState(existingEvent?.mapImage || '');
  const [featured, setFeatured] = useState(existingEvent?.featured || false);
  
  // Estado para gerenciar lotes
  const [ticketBatches, setTicketBatches] = useState(
    existingEvent?.ticketBatches || []
  );

  // Estado para gerenciar setores
  const [sectors, setSectors] = useState<Sector[]>(
    existingEvent?.sectors || []
  );
  
  // Estado para novo lote
  const [newBatch, setNewBatch] = useState({
    name: '',
    price: 0,
    quantity: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
  });

  // Estado para novo setor
  const [newSector, setNewSector] = useState({
    name: '',
    price: 0,
    capacity: 100,
    color: '#3B82F6',
  });
  
  const handleBatchAdd = () => {
    if (!newBatch.name || newBatch.price <= 0 || newBatch.quantity <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Preencha todos os campos do lote corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    const batchId = `batch_${Date.now()}`;
    
    setTicketBatches([...ticketBatches, {
      ...newBatch,
      id: batchId,
      eventId: eventId || 'new',
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

  const handleSectorAdd = () => {
    if (!newSector.name || newSector.price <= 0 || newSector.capacity <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Preencha todos os campos do setor corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    const sectorId = `sector_${Date.now()}`;
    
    setSectors([...sectors, {
      ...newSector,
      id: sectorId,
      eventId: eventId || 'new',
      available: newSector.capacity,
    }]);
    
    // Reset form
    setNewSector({
      name: '',
      price: 0,
      capacity: 100,
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // Gerar cor aleatória
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !date || !time || !imageUrl) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (ticketBatches.length === 0) {
      toast({
        title: "Sem lotes de ingressos",
        description: "Adicione pelo menos um lote de ingressos.",
        variant: "destructive",
      });
      return;
    }
    
    // Combinar data e hora
    const [hours, minutes] = time.split(':').map(Number);
    const eventDateTime = new Date(date);
    eventDateTime.setHours(hours, minutes);
    
    // Simular salvamento do evento
    toast({
      title: "Evento salvo",
      description: `Evento "${title}" foi salvo com sucesso!`,
    });
    
    // Redirecionar para lista de eventos
    setTimeout(() => {
      navigate('/admin/events');
    }, 1000);
  };

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
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="details">Informações</TabsTrigger>
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
                    <Label htmlFor="date">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário de início *</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)} 
                      required
                    />
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
                          e.currentTarget.src = "https://placehold.co/600x400?text=Imagem+Inválida";
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
                          e.currentTarget.src = "https://placehold.co/600x400?text=Mapa+Inválido";
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
                        <Label>Data de Início</Label>
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
                        <Label>Data de Término</Label>
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
          >
            Cancelar
          </Button>
          <Button type="submit">
            <Check className="mr-2 h-4 w-4" />
            Salvar Evento
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;
