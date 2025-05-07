
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Calendar, Ticket, TrendingUp, Users } from "lucide-react";
import { allEvents } from "@/data/events";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardPage = () => {
  const salesData = {
    week: [
      { day: 'Seg', Vendas: 120 },
      { day: 'Ter', Vendas: 98 },
      { day: 'Qua', Vendas: 150 },
      { day: 'Qui', Vendas: 80 },
      { day: 'Sex', Vendas: 170 },
      { day: 'Sáb', Vendas: 200 },
      { day: 'Dom', Vendas: 140 },
    ],
    month: [
      { week: 'Semana 1', Vendas: 500 },
      { week: 'Semana 2', Vendas: 620 },
      { week: 'Semana 3', Vendas: 710 },
      { week: 'Semana 4', Vendas: 430 },
    ],
    year: [
      { month: 'Jan', Vendas: 2200 },
      { month: 'Fev', Vendas: 1800 },
      { month: 'Mar', Vendas: 2100 },
      { month: 'Abr', Vendas: 2500 },
      { month: 'Mai', Vendas: 1900 },
      { month: 'Jun', Vendas: 2300 },
      { month: 'Jul', Vendas: 2600 },
      { month: 'Ago', Vendas: 2400 },
      { month: 'Set', Vendas: 2000 },
      { month: 'Out', Vendas: 2800 },
      { month: 'Nov', Vendas: 3000 },
      { month: 'Dez', Vendas: 3200 },
    ]
  };
  
  const [timeRange, setTimeRange] = useState("week");
  
  // Calcular estatísticas
  const totalEvents = allEvents.length;
  
  const ticketsSold = allEvents.reduce((total, event) => {
    const sold = event.ticketBatches.reduce((batchTotal, batch) => 
      batchTotal + (batch.quantity - batch.available), 0);
    return total + sold;
  }, 0);
  
  const upcomingEvents = allEvents.filter(event => event.date > new Date()).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua plataforma de eventos</p>
        </div>
        <div>
          <Button>Exportar Relatório</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +{upcomingEvents} eventos planejados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsSold}</div>
            <p className="text-xs text-muted-foreground">
              +12.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ 1.356.789,60
            </div>
            <p className="text-xs text-muted-foreground">
              +8.5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,546</div>
            <p className="text-xs text-muted-foreground">
              +24 novos usuários hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        {/* Gráfico principal */}
        <Card className="col-span-7 lg:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Análise de Vendas</CardTitle>
              <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
                <TabsList>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="year">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              Visão geral das vendas de ingressos
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData[timeRange]}>
                  <XAxis dataKey={timeRange === 'year' ? 'month' : timeRange === 'month' ? 'week' : 'day'} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Vendas" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Últimos eventos */}
        <Card className="col-span-7 lg:col-span-2">
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>
              Últimos eventos adicionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas vendas e top eventos */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
            <CardDescription>
              Transações de ingressos recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <Ticket className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Usuário {10000 + i}</p>
                      <p className="text-xs text-muted-foreground">
                        {i} ingresso(s) • {new Date().toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    + R$ {(i * 120).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos Populares</CardTitle>
            <CardDescription>
              Eventos com mais ingressos vendidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allEvents.slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold w-5 text-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {(500 - index * 70)} ingressos vendidos
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${100 - index * 15}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
