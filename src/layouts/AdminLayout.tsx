
import { ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/layout/AdminSidebar';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  
  // Verificar se o usuário é admin
  if (!user || !user.is_admin) {
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
