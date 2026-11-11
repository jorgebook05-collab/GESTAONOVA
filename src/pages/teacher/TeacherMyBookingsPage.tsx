import React from 'react';
import { MyBookingsView } from '../../components/teacher/MyBookingsView';
import { Booking, Resource, User } from '../../types';

interface TeacherMyBookingsPageProps {
  bookings: Booking[];
  resources: Resource[];
  currentUser: User;
  onCancelBooking: (id: string) => void;
  onOpenNewBookingModal: () => void;
}

export const TeacherMyBookingsPage: React.FC<TeacherMyBookingsPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <MyBookingsView {...props} />
    </div>
  );
};
