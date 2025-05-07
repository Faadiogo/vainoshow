
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CalendarPlus, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  LogOut, 
  Settings, 
  Ticket, 
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    eventos: false,
  });

  if (!user?.isAdmin) return null;

  const initials = user?.name 
    ? user.name.split(' ').map(name => name[0]).join('').toUpperCase()
    : 'A';

  const toggleExpand = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      icon: Home, 
      text: 'Dashboard', 
      path: '/admin' 
    },
    { 
      icon: CalendarPlus, 
      text: 'Eventos',
      path: '/admin/events',
      expandable: true,
      section: 'eventos',
      subItems: [
        { text: 'Todos os Eventos', path: '/admin/events' },
        { text: 'Adicionar Evento', path: '/admin/events/new' },
        { text: 'Lotes de Ingressos', path: '/admin/ticket-batches' }
      ]
    },
    { 
      icon: Ticket, 
      text: 'Vendas', 
      path: '/admin/sales' 
    },
    { 
      icon: Users, 
      text: 'Usuários', 
      path: '/admin/users' 
    },
    { 
      icon: Settings, 
      text: 'Configurações', 
      path: '/admin/settings' 
    }
  ];

  return (
    <aside className="hidden md:flex h-screen flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2 text-sidebar-foreground">
          <div className="space-x-2 w-8 h-8 rounded-md flex items-center justify-center">
            <img src="https://i.ibb.co/ynfY6q7V/vainoshow-icon-bco.png" alt="vainoshow-icon-bco" className='h-8' />
            <span className="font-bold text-lg">VaiNoShow</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, idx) => (
            <div key={idx}>
              {item.expandable ? (
                <div>
                  <Button 
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => toggleExpand(item.section)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.text}
                    {expanded[item.section] ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                  
                  {expanded[item.section] && item.subItems && (
                    <div className="ml-6 mt-1 grid gap-1">
                      {item.subItems.map((subItem, subIdx) => (
                        <Button
                          key={subIdx}
                          variant="ghost"
                          asChild
                          className={cn(
                            "justify-start h-9 pl-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            location.pathname === subItem.path && 
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          <NavLink to={subItem.path}>
                            {subItem.text}
                          </NavLink>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <NavLink to={item.path}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.text}
                  </NavLink>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-sidebar-foreground font-medium truncate max-w-[120px]">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
