import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, CalendarRange, Users, Settings, Ticket, DollarSign } from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<any>;
  submenu?: { title: string; href: string }[];
}

const AdminSidebar = () => {
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: BarChart,
    },
    {
      title: 'Eventos',
      href: '/admin/events',
      icon: CalendarRange,
    },
    {
      title: 'Ingressos',
      icon: Ticket,
      submenu: [
        {
          title: 'Lotes',
          href: '/admin/ticket-batches',
        },
        {
          title: 'Criar Ingressos',
          href: '/admin/tickets/create',
        },
        {
          title: 'Validar Ingressos',
          href: '/admin/tickets/validate',
        },
      ],
    },
    {
      title: 'Vendas',
      href: '/admin/sales',
      icon: DollarSign,
    },
    {
      title: 'Usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Configurações',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700 w-64">
      <div className="px-4 py-6">
        <Link to="/admin" className="flex items-center space-x-2 font-semibold">
          <img src="https://i.ibb.co/ynfY6q7V/vainoshow-icon-bco.png" alt="VaiNoShow" className="h-8" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item, index) => (
          item.submenu ? (
            <div key={index} className="space-y-1">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-400 flex items-center space-x-2">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              <div className="ml-4 space-y-1">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.href}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={index}
              to={item.href || '#'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
