import React, { useState } from 'react';
import { Clock, BookOpen, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { MasterScheduleItem, User } from '../../types';

interface TeacherScheduleViewProps {
  scheduleItems: MasterScheduleItem[];
  currentUser: User;
}

export const TeacherScheduleView: React.FC<TeacherScheduleViewProps> = ({
  scheduleItems,
  currentUser,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default Terça-feira

  const daysOfWeek = [
    { id: 1, name: 'Segunda-feira' },
    { id: 2, name: 'Terça-feira' },
    { id: 3, name: 'Quarta-feira' },
    { id: 4, name: 'Quinta-feira' },
    { id: 5, name: 'Sexta-feira' },
  ];

  // Aulas exclusivas do professor logado
  const mySchedule = scheduleItems.filter((i) => i.teacherId === currentUser.id);

  // Aulas do dia selecionado
  const daySchedule = mySchedule
    .filter((i) => i.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Total de horas semanais
  const totalWeeklyClasses = mySchedule.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
              Minha Grade Horária Docente
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Horários de aula fixados, salas designadas e turmas atribuídas para o semestre letivo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1.5 rounded-xl border border-blue-200">
            Carga Horária: {totalWeeklyClasses} aulas semanais
          </span>
        </div>
      </div>

      {/* Weekday Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs">
        {daysOfWeek.map((d) => {
          const count = mySchedule.filter((i) => i.dayOfWeek === d.id).length;
          const isSelected = selectedDay === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#16324F] hover:bg-[#F5F7FB]'
              }`}
            >
              <span>{d.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes Timeline for the day */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="pb-3.5 border-b border-slate-100 flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#16324F]">
            Aulas Programadas — {daysOfWeek.find((d) => d.id === selectedDay)?.name}
          </h2>
          <span className="text-xs text-[#64748B] font-semibold">
            {daySchedule.length} horários cadastrados
          </span>
        </div>

        {daySchedule.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            Nenhuma aula atribuída para este dia da semana.
          </div>
        ) : (
          <div className="space-y-3">
            {daySchedule.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] hover:bg-blue-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center w-24 shrink-0 shadow-2xs">
                    <span className="text-xs font-bold font-mono text-[#16324F] block">
                      {item.startTime}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono block">
                      {item.endTime}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#16324F]">
                        {item.subject}
                      </span>
                      <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-blue-100">
                        {item.className}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-md border border-green-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Confirmada
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
