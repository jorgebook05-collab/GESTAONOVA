import React from 'react';
import { TeacherBookingForm } from '../../components/teacher/TeacherBookingForm';
import { InteractiveCalendar } from '../../components/calendar/InteractiveCalendar';
import { Resource, Booking, SchoolClass, User } from '../../types';

interface TeacherBookingPageProps {
  resources: Resource[];
  classes: SchoolClass[];
  bookings: Booking[];
  currentUser: User;
  onSaveBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onOpenBookingModal: (initialDate?: string, initialResourceId?: string) => void;
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string, reason?: string) => void;
  onCancelBooking: (id: string) => void;
}

export const TeacherBookingPage: React.FC<TeacherBookingPageProps> = ({
  resources,
  classes,
  bookings,
  currentUser,
  onSaveBooking,
  onOpenBookingModal,
  onApproveBooking,
  onRejectBooking,
  onCancelBooking,
}) => {
  return (
    <div className="space-y-8">
      {/* Real-time booking form */}
      <div>
        <TeacherBookingForm
          resources={resources}
          classes={classes}
          allBookings={bookings}
          currentUser={currentUser}
          onSaveBooking={onSaveBooking}
        />
      </div>

      {/* Calendar for full visibility */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-base font-bold text-[#16324F] mb-3">
          Mapa de Ocupação e Disponibilidade Geral
        </h3>
        <InteractiveCalendar
          bookings={bookings}
          resources={resources}
          currentUser={currentUser}
          onOpenBookingModal={onOpenBookingModal}
          onApproveBooking={onApproveBooking}
          onRejectBooking={onRejectBooking}
          onCancelBooking={onCancelBooking}
        />
      </div>
    </div>
  );
};
