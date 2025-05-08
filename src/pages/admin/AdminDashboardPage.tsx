
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { featuredEvents, allEvents } from '@/data/events';

const AdminDashboardPage = () => {
  const [salesData] = useState([
    { name: 'Janeiro', vendas: 400 },
    { name: 'Fevereiro', vendas: 300 },
    { name: 'Março', vendas: 550 },
    { name: 'Abril', vendas: 780 },
    { name: 'Maio', vendas: 690 },
    { name: 'Junho', vendas: 1100 },
  ]);

  const [statusData] = useState([
    { name: 'Ativos', value: 8 },
    { name: 'Encerrados', value: 3 },
    { name: 'Cancelados', value: 1 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const upcomingEvents = allEvents.slice(0, 5);

  return (
    <div className="p-6">
      <Helmet>
        <title>Dashboard - VaiNoShow</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEvents.length}</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+5% desde o último mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45,678</div>
            <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% desde o último mês</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status dos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Lista de próximos eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Evento</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Data</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Local</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Ingressos Vendidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {upcomingEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={event.image} 
                            alt={event.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{event.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {event.start_date ? new Date(event.start_date).toLocaleDateString('pt-BR') : 'A definir'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {event.location}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {Math.floor(Math.random() * 1000)} / {Math.floor(Math.random() * 2000)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
