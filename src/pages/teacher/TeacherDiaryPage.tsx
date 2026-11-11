import React from 'react';
import { ClassDiaryView } from '../../components/teacher/ClassDiaryView';
import { ClassDiaryEntry, SchoolClass, User } from '../../types';

interface TeacherDiaryPageProps {
  diaryEntries: ClassDiaryEntry[];
  classes: SchoolClass[];
  currentUser: User;
  onAddDiaryEntry: (entry: Omit<ClassDiaryEntry, 'id'>) => void;
}

export const TeacherDiaryPage: React.FC<TeacherDiaryPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <ClassDiaryView {...props} />
    </div>
  );
};
