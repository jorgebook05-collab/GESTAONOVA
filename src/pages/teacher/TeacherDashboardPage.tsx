import React from 'react';
import { TeacherDashboard } from '../../components/teacher/TeacherDashboard';
import { User, Booking, Resource, MasterScheduleItem, Announcement } from '../../types';

interface TeacherDashboardPageProps {
  currentUser: User;
  bookings: Booking[];
  resources: Resource[];
  scheduleItems: MasterScheduleItem[];
  announcements: Announcement[];
  onOpenBookingModal: () => void;
  onNavigate: (path: string) => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
  currentUser,
  bookings,
  resources,
  scheduleItems,
  announcements,
  onOpenBookingModal,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <TeacherDashboard
        currentUser={currentUser}
        bookings={bookings}
        resources={resources}
        scheduleItems={scheduleItems}
        announcements={announcements}
        onOpenBookingModal={onOpenBookingModal}
        onNavigateTab={(tab) => {
          if (tab === 'teacher_schedule') onNavigate('/professor/horarios');
          else if (tab === 'my_bookings') onNavigate('/professor/minhas-reservas');
          else if (tab === 'class_diary') onNavigate('/professor/diario');
          else onNavigate('/professor/reservar');
        }}
      />
    </div>
  );
};
