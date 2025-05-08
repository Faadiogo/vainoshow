
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Ticket, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();

  const navItems = [
    { label: 'Página Inicial', path: '/' },
    { label: 'Eventos', path: '/events' },
    { label: 'Sobre Nós', path: '/about' },
    { label: 'FAQ', path: '/faq' },
  ];

  const userMenuItems = [
    { label: 'Meus Ingressos', icon: Ticket, path: '/my-tickets' },
    { label: 'Minha Conta', icon: User, path: '/profile' },
  ];

  const footerLinks = [
    { label: 'Termos de Uso', path: '/terms' },
    { label: 'Privacidade', path: '/privacy' },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://i.ibb.co/ynfY6q7V/vainoshow-icon-bco.png" alt="VaiNoShow" className="h-8" />
            <span className="font-bold text-xl hidden sm:inline-block">VaiNoShow</span>
          </Link>

          {/* Links de navegação para desktop */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* Menu para usuário logado */}
          {user ? (
            <>
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline-block">{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item, i) => (
                      <DropdownMenuItem key={i} asChild>
                        <Link to={item.path} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {user.is_admin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Administração</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <Button asChild variant="default" size={isMobile ? "sm" : "default"}>
              <Link to="/login">Entrar</Link>
            </Button>
          )}

          {/* Menu mobile */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navegue pelo site VaiNoShow
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 flex flex-col space-y-1">
                  {navItems.map((item, i) => (
                    <SheetClose key={i} asChild>
                      <Link
                        to={item.path}
                        className="py-2 px-3 rounded-md hover:bg-accent transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  
                  {/* Divider */}
                  <div className="h-px bg-border my-2" />
                  
                  {user ? (
                    <>
                      <div className="flex items-center px-3 py-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      
                      {userMenuItems.map((item, i) => (
                        <SheetClose key={i} asChild>
                          <Link
                            to={item.path}
                            className="py-2 px-3 rounded-md hover:bg-accent transition-colors flex items-center"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                      
                      {user.is_admin && (
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className="py-2 px-3 rounded-md hover:bg-accent transition-colors flex items-center"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Administração
                          </Link>
                        </SheetClose>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="justify-start px-3"
                        onClick={() => logout()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Button asChild className="mt-2">
                        <Link to="/login">Entrar</Link>
                      </Button>
                    </SheetClose>
                  )}
                  
                  {/* Footer links */}
                  <div className="h-px bg-border my-2" />
                  <div className="flex flex-wrap gap-x-4 px-3 pt-2">
                    {footerLinks.map((link, i) => (
                      <SheetClose key={i} asChild>
                        <Link 
                          to={link.path}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
