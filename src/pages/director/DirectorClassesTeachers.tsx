import React, { useState } from 'react';
import { Users, School, Clock, GraduationCap, MapPin, Search } from 'lucide-react';
import { SchoolClass, MasterScheduleItem, User } from '../../types';
import { MasterScheduleView } from '../../components/direction/MasterScheduleView';
import { getStoredUsers } from '../../services/authService';

interface DirectorClassesTeachersProps {
  classes: SchoolClass[];
  scheduleItems: MasterScheduleItem[];
}

export const DirectorClassesTeachers: React.FC<DirectorClassesTeachersProps> = ({
  classes,
  scheduleItems,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'classes' | 'teachers'>('schedule');
  const [searchTerm, setSearchTerm] = useState('');

  const teachers = getStoredUsers().filter((u) => u.role === 'teacher');

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/90 w-fit text-xs shadow-xs">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Grade Master Semanal</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Turmas Escolares (42)</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Corpo Docente ({teachers.length})</span>
        </button>
      </div>

      {activeTab === 'schedule' && (
        <MasterScheduleView scheduleItems={scheduleItems} classes={classes} />
      )}

      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#16324F]">
                Turmas Cadastradas na Instituição
              </h2>
              <p className="text-xs text-[#64748B]">
                Organização por segmento, turno e capacidade de alunos
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3">Turma</th>
                  <th className="py-2.5 px-3">Segmento</th>
                  <th className="py-2.5 px-3">Turno</th>
                  <th className="py-2.5 px-3 text-right">Alunos</th>
                  <th className="py-2.5 px-3 text-right">Frequência</th>
                  <th className="py-2.5 px-3 text-right">Média</th>
                  <th className="py-2.5 px-3">Sala Fixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-[#16324F]">{c.name}</td>
                    <td className="py-3 px-3 text-[#64748B]">{c.gradeLevel}</td>
                    <td className="py-3 px-3 text-[#16324F] capitalize">{c.period}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-800">{c.totalStudents}</td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#16A34A]">{c.attendanceRate}%</td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#16324F]">{c.averageGrade}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{c.defaultRoom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#16324F]">
                Corpo Docente & Professores Ativos
              </h2>
              <p className="text-xs text-[#64748B]">
                Professores com acesso autenticado ao sistema EduGestão
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {teachers.map((prof) => (
              <div
                key={prof.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-[#F5F7FB] flex items-center gap-3"
              >
                <img
                  src={prof.avatarUrl}
                  alt={prof.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#2563EB] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden text-xs">
                  <span className="font-bold text-[#16324F] block truncate">{prof.name}</span>
                  <span className="text-[11px] text-[#2563EB] font-medium block truncate">{prof.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">{prof.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
