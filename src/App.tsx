import React, { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Role, 
  User, 
  Booking, 
  Resource, 
  ResourceStatus,
  SchoolClass, 
  SchoolMetrics, 
  MasterScheduleItem, 
  Announcement, 
  ClassDiaryEntry 
} from './types';
import { 
  DIRECTOR_USER, 
  TEACHER_USER, 
  INITIAL_RESOURCES, 
  INITIAL_CLASSES, 
  INITIAL_METRICS, 
  INITIAL_BOOKINGS, 
  MASTER_SCHEDULE, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CLASS_DIARIES 
} from './data/mockData';
import { getStoredUsers } from './services/authService';

// Layout & Components
import { AppLayout } from './components/layout/AppLayout';
import { LoginView } from './components/auth/LoginView';
import { TeacherBookingForm } from './components/teacher/TeacherBookingForm';
import { DatabaseArchitectureView } from './components/shared/DatabaseArchitectureView';

// Director Pages
import { DirectorDashboard } from './pages/director/DirectorDashboard';
import { DirectorBookings } from './pages/director/DirectorBookings';
import { DirectorEquipment } from './pages/director/DirectorEquipment';
import { DirectorClassesTeachers } from './pages/director/DirectorClassesTeachers';
import { ReportsView } from './components/direction/ReportsView';
import { GlobalAnnouncements } from './components/direction/GlobalAnnouncements';

// Teacher Pages
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { TeacherBookingPage } from './pages/teacher/TeacherBookingPage';
import { TeacherMyBookingsPage } from './pages/teacher/TeacherMyBookingsPage';
import { TeacherSchedulePage } from './pages/teacher/TeacherSchedulePage';
import { TeacherDiaryPage } from './pages/teacher/TeacherDiaryPage';
import { TeacherAnnouncementsPage } from './pages/teacher/TeacherAnnouncementsPage';

import { CheckCircle2, AlertCircle } from 'lucide-react';

function EduGestaoApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(DIRECTOR_USER);
  const [currentRole, setCurrentRole] = useState<Role>('direction');

  // Core Data States with LocalStorage support
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('edugestao_local_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem('edugestao_local_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [classes] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [metrics] = useState<SchoolMetrics>(INITIAL_METRICS);
  const [scheduleItems] = useState<MasterScheduleItem[]>(MASTER_SCHEDULE);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('edugestao_local_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [classDiaries, setClassDiaries] = useState<ClassDiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('edugestao_local_diaries');
      return saved ? JSON.parse(saved) : INITIAL_CLASS_DIARIES;
    } catch {
      return INITIAL_CLASS_DIARIES;
    }
  });

  // Modal State for New Booking
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [modalInitialDate, setModalInitialDate] = useState<string>('2026-10-20');
  const [modalInitialResourceId, setModalInitialResourceId] = useState<string | undefined>();

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronizers with LocalStorage
  const updateBookingsWithStorage = (updater: (prev: Booking[]) => Booking[]) => {
    setBookings((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('edugestao_local_bookings', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateResourcesWithStorage = (updater: (prev: Resource[]) => Resource[]) => {
    setResources((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('edugestao_local_resources', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateDiariesWithStorage = (updater: (prev: ClassDiaryEntry[]) => ClassDiaryEntry[]) => {
    setClassDiaries((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('edugestao_local_diaries', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    if (user.role === 'direction') {
      navigate('/diretor/dashboard');
    } else {
      navigate('/professor/dashboard');
    }
    showToast(`Bem-vindo(a) ao EduGestão, ${user.name}!`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
    showToast('Sessão encerrada com sucesso.');
  };

  // Booking Modal Helper
  const handleOpenBookingModal = (initialDate?: string, initialResourceId?: string) => {
    if (initialDate) setModalInitialDate(initialDate);
    if (initialResourceId) setModalInitialResourceId(initialResourceId);
    setIsBookingModalOpen(true);
  };

  // Booking Actions
  const handleApproveBooking = (id: string) => {
    updateBookingsWithStorage((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'approved' } : b))
    );
    showToast('Reserva de equipamento aprovada com sucesso!');
  };

  const handleRejectBooking = (id: string, reason?: string) => {
    updateBookingsWithStorage((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'rejected', rejectionReason: reason } : b))
    );
    showToast('Solicitação recusada pela diretoria.', 'info');
  };

  const handleCancelBooking = (id: string) => {
    updateBookingsWithStorage((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
    showToast('Agendamento cancelado.');
  };

  const handleSaveNewBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newId = `bk_${Date.now()}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: newId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    updateBookingsWithStorage((prev) => [newBooking, ...prev]);
    setIsBookingModalOpen(false);

    if (newBooking.isPriorityLock) {
      showToast('Bloqueio prioritário institucional registrado com sucesso!');
    } else if (newBooking.status === 'approved') {
      showToast('Reserva confirmada no calendário!');
    } else {
      showToast('Solicitação enviada para deliberação da Diretoria!');
    }
  };

  // Equipment Actions
  const handleAddResource = (newRes: Omit<Resource, 'id'>) => {
    const newId = `res_${Date.now()}`;
    const fullRes: Resource = {
      ...newRes,
      id: newId,
    };
    updateResourcesWithStorage((prev) => [...prev, fullRes]);
    showToast('Novo equipamento cadastrado com sucesso!');
  };

  const handleUpdateEquipmentStatus = (id: string, newStatus: ResourceStatus) => {
    updateResourcesWithStorage((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: newStatus, isAvailable: newStatus === 'available' }
          : r
      )
    );
    showToast(`Status do equipamento atualizado para "${newStatus === 'available' ? 'Disponível' : newStatus === 'in_use' ? 'Em Uso' : 'Manutenção'}".`);
  };

  // Announcement Actions
  const handleAddAnnouncement = (newAnc: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newId = `anc_${Date.now()}`;
    const fullAnc: Announcement = {
      ...newAnc,
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAnnouncements((prev) => [fullAnc, ...prev]);
    showToast('Novo comunicado oficial publicado no mural da escola!');
  };

  // Class Diary Actions
  const handleAddDiaryEntry = (entry: Omit<ClassDiaryEntry, 'id'>) => {
    const newId = `cd_${Date.now()}`;
    const fullEntry: ClassDiaryEntry = {
      ...entry,
      id: newId,
    };
    updateDiariesWithStorage((prev) => [fullEntry, ...prev]);
    showToast('Aula registrada no diário de classe!');
  };

  // If on login route or unauthenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#16324F] text-white shadow-xl border border-slate-700 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginView onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Root Redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={currentRole === 'direction' ? '/diretor/dashboard' : '/professor/dashboard'}
              replace
            />
          }
        />

        {/* DIRECTOR ROUTES */}
        <Route
          path="/diretor/*"
          element={
            <AppLayout
              currentUser={currentUser}
              currentRole="direction"
              activePath={location.pathname}
              onNavigate={(path) => navigate(path)}
              onLogout={handleLogout}
              announcements={announcements}
              resources={resources}
              classes={classes}
              onOpenBookingModal={handleOpenBookingModal}
            >
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <DirectorDashboard
                      metrics={metrics}
                      classes={classes}
                      bookings={bookings}
                      resources={resources}
                      onApproveBooking={handleApproveBooking}
                      onRejectBooking={handleRejectBooking}
                      onNavigate={(path) => navigate(path)}
                      onOpenPriorityModal={() => handleOpenBookingModal()}
                    />
                  }
                />
                <Route
                  path="agendamentos"
                  element={
                    <DirectorBookings
                      bookings={bookings}
                      resources={resources}
                      currentUser={currentUser}
                      onOpenBookingModal={handleOpenBookingModal}
                      onApproveBooking={handleApproveBooking}
                      onRejectBooking={handleRejectBooking}
                      onCancelBooking={handleCancelBooking}
                    />
                  }
                />
                <Route
                  path="equipamentos"
                  element={
                    <DirectorEquipment
                      resources={resources}
                      onAddResource={handleAddResource}
                      onUpdateStatus={handleUpdateEquipmentStatus}
                    />
                  }
                />
                <Route
                  path="turmas-professores"
                  element={
                    <DirectorClassesTeachers
                      classes={classes}
                      scheduleItems={scheduleItems}
                    />
                  }
                />
                <Route
                  path="comunicados"
                  element={
                    <GlobalAnnouncements
                      announcements={announcements}
                      currentUser={currentUser}
                      onAddAnnouncement={handleAddAnnouncement}
                    />
                  }
                />
                <Route
                  path="relatorios"
                  element={
                    <ReportsView
                      resources={resources}
                      bookings={bookings}
                      classes={classes}
                      metrics={metrics}
                    />
                  }
                />
                <Route
                  path="arquitetura"
                  element={<DatabaseArchitectureView />}
                />
                <Route path="*" element={<Navigate to="/diretor/dashboard" replace />} />
              </Routes>
            </AppLayout>
          }
        />

        {/* TEACHER ROUTES */}
        <Route
          path="/professor/*"
          element={
            <AppLayout
              currentUser={currentUser}
              currentRole="teacher"
              activePath={location.pathname}
              onNavigate={(path) => navigate(path)}
              onLogout={handleLogout}
              announcements={announcements}
              resources={resources}
              classes={classes}
              onOpenBookingModal={handleOpenBookingModal}
            >
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <TeacherDashboardPage
                      currentUser={currentUser}
                      bookings={bookings}
                      resources={resources}
                      scheduleItems={scheduleItems}
                      announcements={announcements}
                      onOpenBookingModal={() => handleOpenBookingModal()}
                      onNavigate={(path) => navigate(path)}
                    />
                  }
                />
                <Route
                  path="reservar"
                  element={
                    <TeacherBookingPage
                      resources={resources}
                      classes={classes}
                      bookings={bookings}
                      currentUser={currentUser}
                      onSaveBooking={handleSaveNewBooking}
                      onOpenBookingModal={handleOpenBookingModal}
                      onApproveBooking={handleApproveBooking}
                      onRejectBooking={handleRejectBooking}
                      onCancelBooking={handleCancelBooking}
                    />
                  }
                />
                <Route
                  path="minhas-reservas"
                  element={
                    <TeacherMyBookingsPage
                      bookings={bookings}
                      resources={resources}
                      currentUser={currentUser}
                      onCancelBooking={handleCancelBooking}
                      onOpenNewBookingModal={() => handleOpenBookingModal()}
                    />
                  }
                />
                <Route
                  path="horarios"
                  element={
                    <TeacherSchedulePage
                      scheduleItems={scheduleItems}
                      currentUser={currentUser}
                    />
                  }
                />
                <Route
                  path="diario"
                  element={
                    <TeacherDiaryPage
                      diaryEntries={classDiaries}
                      classes={classes}
                      currentUser={currentUser}
                      onAddDiaryEntry={handleAddDiaryEntry}
                    />
                  }
                />
                <Route
                  path="comunicados"
                  element={
                    <TeacherAnnouncementsPage
                      announcements={announcements}
                      currentUser={currentUser}
                    />
                  }
                />
                <Route
                  path="arquitetura"
                  element={<DatabaseArchitectureView />}
                />
                <Route path="*" element={<Navigate to="/professor/dashboard" replace />} />
              </Routes>
            </AppLayout>
          }
        />

        {/* Global Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (currentRole === 'direction' ? '/diretor/dashboard' : '/professor/dashboard') : '/login'}
              replace
            />
          }
        />
      </Routes>

      {/* Floating Modal: Quick Equipment Booking / Priority Lock */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <TeacherBookingForm
              resources={resources}
              classes={classes}
              allBookings={bookings}
              currentUser={currentUser}
              onSaveBooking={handleSaveNewBooking}
              onClose={() => setIsBookingModalOpen(false)}
              initialDate={modalInitialDate}
              initialResourceId={modalInitialResourceId}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <EduGestaoApp />
    </BrowserRouter>
  );
}
