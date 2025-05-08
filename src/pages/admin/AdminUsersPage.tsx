
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

// Mock data dos usuários
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    status: 'ativo',
    role: 'admin',
    lastLogin: '2024-06-01T15:30:00Z',
    ticketsPurchased: 8,
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria@example.com',
    status: 'ativo',
    role: 'user',
    lastLogin: '2024-05-28T09:15:00Z',
    ticketsPurchased: 4,
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@example.com',
    status: 'inativo',
    role: 'user',
    lastLogin: '2024-04-15T11:20:00Z',
    ticketsPurchased: 2,
  },
  {
    id: '4',
    name: 'Ana Ferreira',
    email: 'ana@example.com',
    status: 'ativo',
    role: 'user',
    lastLogin: '2024-06-03T16:45:00Z',
    ticketsPurchased: 6,
  },
  {
    id: '5',
    name: 'Roberto Santos',
    email: 'roberto@example.com',
    status: 'ativo',
    role: 'user',
    lastLogin: '2024-05-30T14:10:00Z',
    ticketsPurchased: 3,
  },
];

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = searchTerm
    ? mockUsers.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockUsers;

  return (
    <div className="p-6">
      <Helmet>
        <title>Gerenciar Usuários - VaiNoShow</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ingressos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.status === 'ativo' ? (
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span>Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Inativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{user.ticketsPurchased}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar usuário</DropdownMenuItem>
                        <DropdownMenuItem>Ver ingressos</DropdownMenuItem>
                        {user.status === 'ativo' ? (
                          <DropdownMenuItem className="text-red-600">
                            Desativar usuário
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            Ativar usuário
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
