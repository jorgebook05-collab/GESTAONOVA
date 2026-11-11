import React from 'react';
import { GlobalAnnouncements } from '../../components/direction/GlobalAnnouncements';
import { Announcement, User } from '../../types';

interface TeacherAnnouncementsPageProps {
  announcements: Announcement[];
  currentUser: User;
}

export const TeacherAnnouncementsPage: React.FC<TeacherAnnouncementsPageProps> = ({
  announcements,
  currentUser,
}) => {
  return (
    <div className="space-y-6">
      <GlobalAnnouncements
        announcements={announcements}
        currentUser={currentUser}
        onAddAnnouncement={() => {}}
      />
    </div>
  );
};
