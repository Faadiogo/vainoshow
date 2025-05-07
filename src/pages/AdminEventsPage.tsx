
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Edit, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { allEvents } from '@/data/events';

const AdminEventsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (eventId: string, eventTitle: string) => {
    // Simulação de exclusão
    toast({
      title: "Evento removido",
      description: `O evento "${eventTitle}" foi removido com sucesso.`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">Gerenciamento de eventos e lotes de ingressos</p>
        </div>
        <Button asChild>
          <Link to="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>
      
      <div className="flex mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar eventos..." 
            className="pl-10 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[250px]">Evento</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Ingressos</TableHead>
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const isUpcoming = new Date(event.date) > new Date();
                const totalTickets = event.ticketBatches.reduce((sum, batch) => sum + batch.quantity, 0);
                const availableTickets = event.ticketBatches.reduce((sum, batch) => sum + batch.available, 0);
                const soldTickets = totalTickets - availableTickets;
                const percentageSold = totalTickets > 0 
                  ? Math.round((soldTickets / totalTickets) * 100) 
                  : 0;
                
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.featured && (
                            <div className="text-xs text-muted-foreground">Em destaque</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${isUpcoming 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"}`}
                      >
                        {isUpcoming ? "Programado" : "Finalizado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {soldTickets}/{totalTickets} vendidos
                        </span>
                        <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${percentageSold}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/events/${event.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(event.id, event.title)}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <p className="text-muted-foreground">
                    Nenhum evento encontrado para "{searchTerm}"
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Total de eventos: {filteredEvents.length}
      </div>
    </div>
  );
};

export default AdminEventsPage;
