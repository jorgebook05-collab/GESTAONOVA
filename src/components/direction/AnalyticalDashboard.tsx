import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Percent, 
  Award, 
  AlertCircle, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Laptop, 
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { SchoolMetrics, SchoolClass, Booking, Resource } from '../../types';
import { StatsCard } from '../common/StatsCard';
import { getStoredUsers } from '../../services/authService';

interface AnalyticalDashboardProps {
  metrics: SchoolMetrics;
  classes: SchoolClass[];
  bookings: Booking[];
  resources: Resource[];
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string, reason?: string) => void;
  onNavigateToCalendar: () => void;
  onOpenPriorityLockModal: () => void;
}

export const AnalyticalDashboard: React.FC<AnalyticalDashboardProps> = ({
  metrics,
  classes,
  bookings,
  resources,
  onApproveBooking,
  onRejectBooking,
  onNavigateToCalendar,
  onOpenPriorityLockModal,
}) => {
  // Filtros
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [selectedGrade, setSelectedGrade] = useState<string>('todos');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Filtragem dinâmica das turmas
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchPeriod = selectedPeriod === 'todos' || cls.period === selectedPeriod;
      const matchGrade = selectedGrade === 'todos' || cls.gradeLevel.includes(selectedGrade);
      const matchYear = cls.year === selectedYear;
      return matchPeriod && matchGrade && matchYear;
    });
  }, [classes, selectedPeriod, selectedGrade, selectedYear]);

  // Médias calculadas dinamicamente com base no filtro
  const calculatedStats = useMemo(() => {
    if (filteredClasses.length === 0) {
      return {
        totalFilteredStudents: 0,
        avgAttendance: 0,
        avgGrade: 0,
      };
    }
    const totalFilteredStudents = filteredClasses.reduce((acc, c) => acc + c.totalStudents, 0);
    const avgAttendance = (
      filteredClasses.reduce((acc, c) => acc + c.attendanceRate, 0) / filteredClasses.length
    ).toFixed(1);
    const avgGrade = (
      filteredClasses.reduce((acc, c) => acc + c.averageGrade, 0) / filteredClasses.length
    ).toFixed(1);

    return { totalFilteredStudents, avgAttendance, avgGrade };
  }, [filteredClasses]);

  // Agendamentos pendentes de aprovação da diretoria
  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'pending');
  }, [bookings]);

  // Professores registrados no sistema (auto-cadastro)
  const registeredTeachers = useMemo(() => {
    return getStoredUsers().filter((u) => u.role === 'teacher');
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Direction Actions */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F2036] via-[#16324F] to-[#1E3A5F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Governança Pedagógica & Gestão Executiva</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Panorama Analítico Escolar
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Supervisão centralizada de indicadores acadêmicos, índice de frequência, adimplência e regulação prioritária de espaços e recursos didáticos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenPriorityLockModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Bloqueio Prioritário de Sala</span>
            </button>
            <button
              onClick={onNavigateToCalendar}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>Ver Calendário Geral</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16324F]">
          <Filter className="w-4 h-4 text-[#2563EB]" />
          <span>Filtros do Panorama:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Período */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#64748B] font-medium">Período:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-semibold text-xs focus:outline-[#2563EB]"
            >
              <option value="todos">Todos os turnos</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="integral">Integral</option>
            </select>
          </div>

          {/* Segmento */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#64748B] font-medium">Segmento:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-semibold text-xs focus:outline-[#2563EB]"
            >
              <option value="todos">Todos os segmentos</option>
              <option value="Ensino Médio">Ensino Médio</option>
              <option value="Ensino Fundamental">Ensino Fundamental</option>
              <option value="Pré-Vestibular">Pré-Vestibular</option>
            </select>
          </div>

          {/* Ano Letivo */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#64748B] font-medium">Ano Letivo:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-semibold text-xs focus:outline-[#2563EB]"
            >
              <option value={2026}>2026 (Atual)</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          {(selectedPeriod !== 'todos' || selectedGrade !== 'todos') && (
            <button
              onClick={() => {
                setSelectedPeriod('todos');
                setSelectedGrade('todos');
              }}
              className="text-xs text-[#2563EB] hover:underline font-bold"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de KPIs Institucionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Alunos Matriculados"
          value={calculatedStats.totalFilteredStudents || metrics.totalStudents}
          subtitle={`Em ${filteredClasses.length} turmas monitoradas`}
          icon={Users}
          trend={{ value: '+4.2% vs 2025', isPositive: true }}
          variant="blue"
        />
        <StatsCard
          title="Índice de Frequência Geral"
          value={`${calculatedStats.avgAttendance || metrics.generalAttendance}%`}
          subtitle="Meta institucional: >= 90%"
          icon={Percent}
          trend={{ value: '+1.4% este mês', isPositive: true }}
          variant="green"
        />
        <StatsCard
          title="Média de Desempenho / Notas"
          value={calculatedStats.avgGrade || metrics.averageGrade}
          subtitle="Escala de 0.0 a 10.0"
          icon={Award}
          trend={{ value: 'Acima da meta (7.0)', isPositive: true }}
          variant="blue"
        />
        <StatsCard
          title="Inadimplência & Evasão"
          value={`${metrics.defaultRate}% / ${metrics.evasionRate}%`}
          subtitle="Taxa histórica mais baixa da rede"
          icon={AlertCircle}
          trend={{ value: '-0.6% evasão', isPositive: true }}
          variant="navy"
        />
      </div>

      {/* 2-Column Split: Desempenho por Turma & Solicitações Pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Panorama e Tabela das Turmas */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#16324F]">
                Detalhamento Acadêmico por Turma
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Frequência em tempo real, desempenho de avaliações e capacidade de sala
              </p>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-blue-100">
              {filteredClasses.length} turmas listadas
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3">Segmento / Turno</th>
                  <th className="py-3 px-3 text-right">Alunos</th>
                  <th className="py-3 px-3 text-right">Frequência</th>
                  <th className="py-3 px-3 text-right">Média</th>
                  <th className="py-3 px-3">Sala Fixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#16324F]">
                      {cls.name}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>{cls.gradeLevel}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="capitalize">{cls.period}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#16324F] tabular-nums">
                      {cls.totalStudents}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <span className={`font-bold ${
                        cls.attendanceRate >= 95 ? 'text-[#16A34A]' : cls.attendanceRate >= 92 ? 'text-[#16324F]' : 'text-[#EAB308]'
                      }`}>
                        {cls.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-extrabold text-[#2563EB]">
                      {cls.averageGrade}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B] font-mono text-[11px]">
                      {cls.defaultRoom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna 3: Fila de Solicitações de Agendamento dos Professores */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#16324F]">
                  Solicitações Pendentes
                </h2>
              </div>
              <span className="text-xs font-bold text-[#EAB308] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80 tabular-nums">
                {pendingBookings.length} aguardando
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {pendingBookings.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#64748B]">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-[#16A34A] mb-2 opacity-80" />
                  Nenhuma solicitação pendente no momento. Todas foram deliberadas!
                </div>
              ) : (
                pendingBookings.map((b) => {
                  const res = resources.find((r) => r.id === b.resourceId);
                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-extrabold text-[#16324F] block">
                            {res?.name || 'Recurso'}
                          </span>
                          <span className="text-[11px] text-[#64748B] block mt-0.5">
                            {b.userName} · {b.className || 'Uso Pedagógico'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#16324F] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-[#64748B] line-clamp-2 italic bg-white p-2 rounded-lg border border-slate-100">
                        &quot;{b.purpose}&quot;
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#64748B] font-mono">
                          Data: {b.date}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onRejectBooking(b.id, 'Recurso indisponível ou evento institucional sobreposto.')}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#DC2626] hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            Recusar
                          </button>
                          <button
                            onClick={() => onApproveBooking(b.id)}
                            className="px-3 py-1 text-[11px] font-bold text-white bg-[#16A34A] hover:bg-green-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Aprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToCalendar}
            className="w-full mt-4 py-2.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] hover:bg-blue-100/70 rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver mapa de ocupação completo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Seção: Professores Cadastrados no Sistema (Auto-registro de Docentes) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="pb-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-extrabold text-[#16324F]">
              Corpo Docente & Contas Cadastradas ({registeredTeachers.length})
            </h2>
          </div>
          <span className="text-xs text-[#64748B]">
            Acesso da Diretoria: <strong className="text-[#16324F]">Pré-definido</strong> · Contas de Professores: <strong className="text-[#2563EB]">Criadas individualmente</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {registeredTeachers.map((prof) => (
            <div
              key={prof.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] hover:bg-blue-50/40 transition-colors flex items-center gap-3.5"
            >
              <img
                src={prof.avatarUrl}
                alt={prof.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2563EB] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden text-xs">
                <span className="font-bold text-[#16324F] block truncate">
                  {prof.name}
                </span>
                <span className="text-[11px] text-[#2563EB] font-bold block truncate">
                  {prof.title}
                </span>
                <span className="text-[10px] text-[#64748B] font-mono block truncate">
                  {prof.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
