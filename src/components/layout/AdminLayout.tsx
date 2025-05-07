
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Navigate } from 'react-router-dom';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  
  // Verificar se o usuário é admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AdminLayout;
