import React from 'react';
import { TeacherScheduleView } from '../../components/teacher/TeacherScheduleView';
import { MasterScheduleItem, User } from '../../types';

interface TeacherSchedulePageProps {
  scheduleItems: MasterScheduleItem[];
  currentUser: User;
}

export const TeacherSchedulePage: React.FC<TeacherSchedulePageProps> = (props) => {
  return (
    <div className="space-y-6">
      <TeacherScheduleView {...props} />
    </div>
  );
};
