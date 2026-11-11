import React, { useState, useMemo } from 'react';
import { Clock, Filter, AlertTriangle, CheckCircle2, UserCheck, BookOpen } from 'lucide-react';
import { MasterScheduleItem, SchoolClass } from '../../types';

interface MasterScheduleViewProps {
  scheduleItems: MasterScheduleItem[];
  classes: SchoolClass[];
}

export const MasterScheduleView: React.FC<MasterScheduleViewProps> = ({
  scheduleItems,
  classes,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default Terça
  const [teacherFilter, setTeacherFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  const daysOfWeek = [
    { id: 1, name: 'Segunda-feira' },
    { id: 2, name: 'Terça-feira' },
    { id: 3, name: 'Quarta-feira' },
    { id: 4, name: 'Quinta-feira' },
    { id: 5, name: 'Sexta-feira' },
  ];

  // Distinct teachers list
  const teachersList = useMemo(() => {
    const map = new Map<string, string>();
    scheduleItems.forEach((item) => {
      map.set(item.teacherId, item.teacherName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [scheduleItems]);

  // Filtered schedule for selected day
  const filteredSchedule = useMemo(() => {
    return scheduleItems
      .filter((item) => {
        const matchDay = item.dayOfWeek === selectedDay;
        const matchTeacher = teacherFilter === 'all' || item.teacherId === teacherFilter;
        const matchClass = classFilter === 'all' || item.classId === classFilter;
        return matchDay && matchTeacher && matchClass;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [scheduleItems, selectedDay, teacherFilter, classFilter]);

  // Checagem de choque de horários na grade
  const detectedConflicts = useMemo(() => {
    const conflicts: { itemA: MasterScheduleItem; itemB: MasterScheduleItem; reason: string }[] = [];
    const dayItems = scheduleItems.filter((i) => i.dayOfWeek === selectedDay);

    for (let i = 0; i < dayItems.length; i++) {
      for (let j = i + 1; j < dayItems.length; j++) {
        const a = dayItems[i];
        const b = dayItems[j];

        const overlap = a.startTime < b.endTime && a.endTime > b.startTime;
        if (overlap) {
          if (a.teacherId === b.teacherId) {
            conflicts.push({
              itemA: a,
              itemB: b,
              reason: `Professor ${a.teacherName} alocado simultaneamente na ${a.className} e na ${b.className}`,
            });
          }
          if (a.classId === b.classId) {
            conflicts.push({
              itemA: a,
              itemB: b,
              reason: `Turma ${a.className} com duas aulas simultâneas (${a.subject} e ${b.subject})`,
            });
          }
        }
      }
    }
    return conflicts;
  }, [scheduleItems, selectedDay]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-2xl border border-blue-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
                Grade Master de Horários & Corpo Docente
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Planejamento escolar unificado, alocação de salas e prevenção de conflitos pedagógicos
              </p>
            </div>
          </div>
        </div>

        {/* Validation Status Indicator */}
        <div className="flex items-center gap-2">
          {detectedConflicts.length === 0 ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-green-50 text-[#16A34A] border border-green-200 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Grade 100% Consistente · Sem Choques</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 text-[#DC2626] border border-red-200 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              <span>{detectedConflicts.length} Choque(s) Detectados</span>
            </div>
          )}
        </div>
      </div>

      {/* Day Selector & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        {/* Day of Week Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          {daysOfWeek.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedDay === d.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#16324F] hover:bg-[#F5F7FB]'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-[#64748B] font-medium">Filtrar por Professor:</label>
              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-bold text-xs focus:outline-[#2563EB]"
              >
                <option value="all">Todos os professores</option>
                {teachersList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-[#64748B] font-medium">Filtrar por Turma:</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-bold text-xs focus:outline-[#2563EB]"
              >
                <option value="all">Todas as turmas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-[#64748B] font-bold text-xs">
            {filteredSchedule.length} aula(s) mapeada(s) neste dia
          </span>
        </div>
      </div>

      {/* Conflicts Alert if any */}
      {detectedConflicts.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-[#DC2626] font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            <span>Atenção: Choque de Horários Encontrado na Grade</span>
          </div>
          <ul className="list-disc pl-5 text-xs text-red-900 space-y-1">
            {detectedConflicts.map((c, i) => (
              <li key={i}>{c.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Master Schedule Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Turma</th>
                <th className="py-3 px-4">Disciplina</th>
                <th className="py-3 px-4">Professor Responsável</th>
                <th className="py-3 px-4">Sala Alocada</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSchedule.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B]">
                    Nenhuma aula cadastrada com os filtros selecionados para este dia.
                  </td>
                </tr>
              ) : (
                filteredSchedule.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#16324F]">
                      {item.startTime} - {item.endTime}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#16324F]">
                      {item.className}
                    </td>
                    <td className="py-3.5 px-4 text-[#2563EB] font-bold">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-[#16324F] font-semibold">
                      {item.teacherName}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                      {item.room}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                        Confirmado
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
