import React from 'react';
import { InteractiveCalendar } from '../../components/calendar/InteractiveCalendar';
import { Booking, Resource, User } from '../../types';

interface DirectorBookingsProps {
  bookings: Booking[];
  resources: Resource[];
  currentUser: User;
  onOpenBookingModal: (initialDate?: string, initialResourceId?: string) => void;
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string, reason?: string) => void;
  onCancelBooking: (id: string) => void;
}

export const DirectorBookings: React.FC<DirectorBookingsProps> = (props) => {
  return (
    <div className="space-y-4">
      <InteractiveCalendar {...props} />
    </div>
  );
};
