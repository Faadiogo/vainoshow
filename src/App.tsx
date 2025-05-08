
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/HomePage';
import EventsPage from '@/pages/EventsPage';
import AboutPage from '@/pages/AboutPage';
import FAQPage from '@/pages/FAQPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import MyTicketsPage from '@/pages/MyTicketsPage';
import EventDetailsPage from '@/pages/EventDetailsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminEventsPage from '@/pages/admin/AdminEventsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import TicketCreationPage from '@/pages/admin/TicketCreationPage';
import TicketValidationPage from '@/pages/admin/TicketValidationPage';
import TicketBatchesPage from '@/pages/admin/TicketBatchesPage';
import SalesPage from '@/pages/admin/SalesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="events/:eventId" element={<EventDetailsPage />} />
          </Route>

          {/* Admin Layout Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="tickets/create" element={<TicketCreationPage />} />
            <Route path="tickets/validate" element={<TicketValidationPage />} />
            <Route path="ticket-batches" element={<TicketBatchesPage />} />
            <Route path="sales" element={<SalesPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
