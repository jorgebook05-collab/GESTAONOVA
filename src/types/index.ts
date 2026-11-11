export type Role = 'direction' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  title: string;
  avatarUrl: string;
  department?: string;
  subjects?: string[];
  registeredAt?: string;
}

export type ResourceCategory = 
  | 'datashow'
  | 'lab_informatica'
  | 'auditorio'
  | 'lab_ciencias'
  | 'kit_midia';

export type ResourceStatus = 'available' | 'in_use' | 'maintenance';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  code: string;
  location: string;
  capacity?: number;
  description: string;
  isAvailable: boolean;
  status: ResourceStatus;
  brand?: string;
  serialNumber?: string;
  features: string[];
}

export type BookingStatus = 'approved' | 'pending' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  userRole: Role;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  classId?: string;
  className?: string;
  status: BookingStatus;
  isPriorityLock: boolean; // Reserva prioritária da Direção
  createdAt: string;
  notes?: string;
  rejectionReason?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string; // e.g., '1º Ano Médio', '9º Ano Fundamental'
  period: 'manha' | 'tarde' | 'integral';
  year: number;
  totalStudents: number;
  attendanceRate: number; // 0 - 100
  averageGrade: number; // 0 - 10
  defaultRoom: string;
}

export interface MasterScheduleItem {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subject: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5; // 1 = Segunda, 5 = Sexta
  startTime: string; // e.g., '07:30'
  endTime: string; // e.g., '08:20'
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: Role;
  targetAudience: 'all' | 'teachers';
  isPinned: boolean;
  createdAt: string;
  category: 'institucional' | 'pedagogico' | 'urgente' | 'evento';
}

export interface ClassDiaryEntry {
  id: string;
  teacherId: string;
  classId: string;
  className: string;
  date: string;
  topic: string;
  lessonPlan: string;
  absentStudentsCount: number;
  assessmentDate?: string;
  assessmentTitle?: string;
  homeworkAssigned?: string;
}

export interface SchoolMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalEquipments: number;
  bookingsToday: number;
  equipmentsInMaintenance: number;
  generalAttendance: number;
  averageGrade: number;
  defaultRate: number; // inadimplência
  evasionRate: number; // evasão
  totalBookingsThisMonth: number;
  resourcesOccupancyRate: number;
}
