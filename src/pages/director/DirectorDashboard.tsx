import React, { useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  School, 
  Laptop, 
  CalendarCheck, 
  Wrench, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Calendar, 
  Plus, 
  BellRing,
  Clock,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { SchoolMetrics, SchoolClass, Booking, Resource } from '../../types';

interface DirectorDashboardProps {
  metrics: SchoolMetrics;
  classes: SchoolClass[];
  bookings: Booking[];
  resources: Resource[];
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string, reason?: string) => void;
  onNavigate: (path: string) => void;
  onOpenPriorityModal: () => void;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  metrics,
  classes,
  bookings,
  resources,
  onApproveBooking,
  onRejectBooking,
  onNavigate,
  onOpenPriorityModal,
}) => {
  // Solicitações pendentes para aprovação
  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'pending');
  }, [bookings]);

  // Dados para Gráfico 1: Reservas por dia da semana (Segunda a Sexta)
  const weeklyBookingsData = [
    { dia: 'Segunda', reservas: 14, prioritarias: 2 },
    { dia: 'Terça', reservas: 18, prioritarias: 4 },
    { dia: 'Quarta', reservas: 16, prioritarias: 1 },
    { dia: 'Quinta', reservas: 12, prioritarias: 3 },
    { dia: 'Sexta', reservas: 20, prioritarias: 5 },
  ];

  // Dados para Gráfico 2: Distribuição de Equipamentos por Categoria
  const equipmentCategoryData = [
    { name: 'DataShows / Projetores', total: 64, color: '#2563EB' },
    { name: 'Laboratórios STEM', total: 42, color: '#16324F' },
    { name: 'Tablets Educacionais', total: 30, color: '#16A34A' },
    { name: 'Kits Mídia / Podcast', total: 12, color: '#EAB308' },
    { name: 'Auditório / Som', total: 8, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* WELCOME HERO BANNER (Modern Executive Aesthetic) */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F2036] via-[#16324F] to-[#1E3A5F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Painel Executivo · Ano Letivo 2026 Ativo</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Governança Escolar & Gestão de Recursos
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Supervisão centralizada de 156 equipamentos multimídia, ocupação em tempo real de laboratórios STEM e regulação prioritária de espaços institucionais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenPriorityModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Novo Bloqueio Prioritário</span>
            </button>
            <button
              onClick={() => onNavigate('/diretor/agendamentos')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all"
            >
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>Central de Reservas</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6.1 INDICADORES PRINCIPAIS (Cards Exatos do Requisito) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total de alunos: 1.248 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total de Alunos</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#16324F] tabular-nums">
            {metrics.totalStudents.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#16A34A] font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% matrículas ativas</span>
          </div>
        </div>

        {/* Total de professores: 87 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16324F] to-slate-700 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Professores</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#16324F] flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#16324F] tabular-nums">
            {metrics.totalTeachers}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium mt-1 block">
            Corpo docente regular
          </span>
        </div>

        {/* Total de turmas: 42 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total de Turmas</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#16324F] tabular-nums">
            {metrics.totalClasses}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium mt-1 block">
            Fundamental & Médio
          </span>
        </div>

        {/* Total de equipamentos: 156 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Equipamentos</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#16324F] tabular-nums">
            {metrics.totalEquipments}
          </div>
          <span className="text-[11px] text-[#16A34A] font-semibold mt-1 block">
            Patrimônio catalogado
          </span>
        </div>

        {/* Reservas para hoje: 18 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Reservas Hoje</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center font-bold">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#16A34A] tabular-nums">
            {metrics.bookingsToday}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium mt-1 block">
            Agendamentos ativos
          </span>
        </div>

        {/* Equipamentos em manutenção: 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-80" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Em Manutenção</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-[#DC2626] tabular-nums">
            {metrics.equipmentsInMaintenance}
          </div>
          <span className="text-[11px] text-[#DC2626] font-semibold mt-1 block">
            1 projetor · 2 tablets
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6.2 GRÁFICOS RECHARTS (Bespoke Gradient Charts) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Quantidade de Reservas por Dia da Semana */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#16324F]">
                Fluxo Semanal de Reservas & Bloqueios
              </h2>
              <p className="text-xs text-[#64748B]">
                Comparativo de agendamentos docentes vs. eventos prioritários da direção
              </p>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              Média: 16/dia
            </span>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyBookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barYellowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity={1} />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16324F', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="reservas" name="Reservas Docentes" fill="url(#barBlueGradient)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="prioritarias" name="Bloqueios Institucionais" fill="url(#barYellowGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribuição de Equipamentos por Categoria */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#16324F]">
                Composição do Inventário Escolar (156 Itens)
              </h2>
              <p className="text-xs text-[#64748B]">
                Equipamentos multimídia, laboratórios STEM e kits de mídia disponíveis
              </p>
            </div>
            <button
              onClick={() => onNavigate('/diretor/equipamentos')}
              className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1"
            >
              <span>Catálogo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 mt-2 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="total"
                >
                  {equipmentCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16324F', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN SPLIT: TURMAS & FILA DE APROVAÇÕES */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Desempenho e Frequência das Turmas */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#16324F]">
                Frequência e Desempenho por Turma
              </h2>
              <p className="text-xs text-[#64748B]">
                Dados consolidados para auditoria do Conselho de Classe
              </p>
            </div>
            <button
              onClick={() => onNavigate('/diretor/turmas-professores')}
              className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1"
            >
              <span>Ver 42 turmas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3">Turma</th>
                  <th className="py-2.5 px-3">Segmento / Turno</th>
                  <th className="py-2.5 px-3 text-right">Alunos</th>
                  <th className="py-2.5 px-3 text-right">Frequência</th>
                  <th className="py-2.5 px-3 text-right">Média</th>
                  <th className="py-2.5 px-3">Sala Fixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#16324F]">
                      {cls.name}
                    </td>
                    <td className="py-3 px-3 text-[#64748B]">
                      {cls.gradeLevel} · <span className="capitalize">{cls.period}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800 tabular-nums">
                      {cls.totalStudents}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span className={`font-bold ${
                        cls.attendanceRate >= 95 ? 'text-[#16A34A]' : cls.attendanceRate >= 92 ? 'text-[#16324F]' : 'text-amber-600'
                      }`}>
                        {cls.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-extrabold text-[#16324F]">
                      {cls.averageGrade}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {cls.defaultRoom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna 3: Fila de Solicitações Pendentes dos Professores */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-extrabold text-[#16324F]">
                  Aprovações Pendentes
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 tabular-nums">
                {pendingBookings.length} aguardando
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {pendingBookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-[#16A34A] mb-2 opacity-80" />
                  Nenhuma solicitação de reserva pendente no momento!
                </div>
              ) : (
                pendingBookings.map((b) => {
                  const res = resources.find((r) => r.id === b.resourceId);
                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl border border-slate-200/90 bg-[#F5F7FB] hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-[#16324F] block">
                            {res?.name || 'Equipamento'}
                          </span>
                          <span className="text-[11px] text-[#64748B] block mt-0.5 font-medium">
                            {b.userName} · {b.className || 'Uso Docente'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0 shadow-2xs">
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 italic">
                        "{b.purpose}"
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">
                          Data: {b.date}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onRejectBooking(b.id, 'Recurso indisponível ou evento institucional sobreposto.')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#DC2626] hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Recusar
                          </button>
                          <button
                            onClick={() => onApproveBooking(b.id)}
                            className="px-3 py-1 text-[11px] font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
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
            onClick={() => onNavigate('/diretor/agendamentos')}
            className="w-full mt-4 py-2.5 text-xs font-bold text-[#2563EB] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Ver mapa de reservas completo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
