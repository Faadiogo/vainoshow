import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback} from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Ticket, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const initials = user?.name 
    ? user.name.split(' ').map(name => name[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="space-x-2 w-8 h-8 rounded-md flex items-center justify-center">
            <img src="https://i.ibb.co/ynfY6q7V/vainoshow-icon-bco.png" alt="vainoshow-icon-bco" className='h-8' />
            <span className="font-bold text-lg">VaiNoShow</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/events">Eventos</Link>
          </Button>
          {user && (
            <Button variant="ghost" asChild>
              <Link to="/my-tickets">Meus Ingressos</Link>
            </Button>
          )}
          {user?.is_admin && (
            <Button variant="ghost" asChild>
              <Link to="/admin">Painel Admin</Link>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          {user ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 py-4">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 mt-4 space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/my-tickets" onClick={() => setIsOpen(false)}>
                        <Ticket className="mr-2 h-4 w-4" />
                        Meus Ingressos
                      </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/account" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Minha Conta
                      </Link>
                    </Button>
                    
                    {user?.is_admin && (
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Menu className="mr-2 h-4 w-4" />
                          Painel Admin
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-auto w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-4">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-gradient-event w-8 h-8 rounded-md flex items-center justify-center">
                    <Ticket className="text-white h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">VaiNoShow</span>
                </Link>
                
                <div className="grid gap-2">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/events">Eventos</Link>
                  </Button>
                  
                  {user && (
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/my-tickets">Meus Ingressos</Link>
                    </Button>
                  )}
                  
                  {user?.is_admin&& (
                    <Button asChild variant="ghost" className="justify-start">
                      <Link to="/admin">Painel Admin</Link>
                    </Button>
                  )}
                  
                  {!user && (
                    <Button asChild className="justify-start">
                      <Link to="/login">Entrar</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
