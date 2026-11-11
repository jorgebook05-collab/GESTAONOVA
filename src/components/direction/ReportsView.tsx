import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  CheckCircle, 
  BarChart3, 
  PieChart, 
  Layers,
  Calendar,
  Building2
} from 'lucide-react';
import { Resource, Booking, SchoolClass, SchoolMetrics } from '../../types';

interface ReportsViewProps {
  resources: Resource[];
  bookings: Booking[];
  classes: SchoolClass[];
  metrics: SchoolMetrics;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  resources,
  bookings,
  classes,
  metrics,
}) => {
  const [reportType, setReportType] = useState<'resources' | 'classes' | 'bookings'>('resources');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Calcula estatísticas de uso de recursos
  const resourceStats = resources.map((r) => {
    const totalBookings = bookings.filter((b) => b.resourceId === r.id && b.status === 'approved').length;
    const priorityLocks = bookings.filter((b) => b.resourceId === r.id && b.isPriorityLock).length;
    // Ocupação estimada (baseada nos dias do mês)
    const occupancyRate = Math.min(100, Math.round((totalBookings / 12) * 100));

    return {
      resource: r,
      totalBookings,
      priorityLocks,
      occupancyRate,
    };
  });

  // Função para exportar CSV nativo
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'resources') {
      csvContent += 'Recurso,Categoria,Codigo,Local,Total de Reservas,Bloqueios Direcao,Taxa de Ocupacao (%)\n';
      resourceStats.forEach((item) => {
        csvContent += `"${item.resource.name}","${item.resource.category}","${item.resource.code}","${item.resource.location}",${item.totalBookings},${item.priorityLocks},${item.occupancyRate}%\n`;
      });
    } else if (reportType === 'classes') {
      csvContent += 'Turma,Segmento,Turno,Total Alunos,Frequencia (%),Media de Notas,Sala Padrao\n';
      classes.forEach((c) => {
        csvContent += `"${c.name}","${c.gradeLevel}","${c.period}",${c.totalStudents},${c.attendanceRate}%,${c.averageGrade},"${c.defaultRoom}"\n`;
      });
    } else {
      csvContent += 'ID,Data,Horario Inicio,Horario Fim,Recurso,Solicitante,Finalidade,Prioridade,Status\n';
      bookings.forEach((b) => {
        const res = resources.find((r) => r.id === b.resourceId)?.name || 'Recurso';
        csvContent += `"${b.id}","${b.date}","${b.startTime}","${b.endTime}","${res}","${b.userName}","${b.purpose}",${b.isPriorityLock ? 'Sim' : 'Nao'},"${b.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edugestao_relatorio_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('Relatório CSV exportado com sucesso!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-2xl border border-blue-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
                Relatórios Gerenciais & Auditoria
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Análise de alocação de recursos pedagógicos, frequência escolar e conformidade de espaços
              </p>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#16324F] bg-[#F5F7FB] hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#64748B]" />
            <span>Imprimir / PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Excel (CSV)</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl text-[#16A34A] text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#16A34A]" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/90 w-fit text-xs shadow-xs">
        <button
          onClick={() => setReportType('resources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            reportType === 'resources'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Uso de Salas & Recursos</span>
        </button>
        <button
          onClick={() => setReportType('classes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            reportType === 'classes'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Frequência & Turmas</span>
        </button>
        <button
          onClick={() => setReportType('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            reportType === 'bookings'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#16324F]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Histórico de Agendamentos</span>
        </button>
      </div>

      {/* Table 1: Recursos */}
      {reportType === 'resources' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#16324F]">
                Ocupação e Demandas de Espaços Pedagógicos
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Dados consolidados do mês de Outubro/2026
              </p>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-blue-200">
              Média Geral: {metrics.resourcesOccupancyRate}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Recurso / Equipamento</th>
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Localização</th>
                  <th className="py-3 px-3 text-right">Total Agendamentos</th>
                  <th className="py-3 px-3 text-right">Bloqueios Direção</th>
                  <th className="py-3 px-3 text-right">Taxa de Ocupação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {resourceStats.map((item) => (
                  <tr key={item.resource.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#16324F]">
                      {item.resource.name}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#64748B]">
                      {item.resource.code}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">
                      {item.resource.location}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-bold text-[#16324F]">
                      {item.totalBookings}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-bold text-[#2563EB]">
                      {item.priorityLocks}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-extrabold text-[#16324F]">
                          {item.occupancyRate}%
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.occupancyRate > 75
                                ? 'bg-[#DC2626]'
                                : item.occupancyRate > 40
                                ? 'bg-[#2563EB]'
                                : 'bg-[#16A34A]'
                            }`}
                            style={{ width: `${item.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 2: Turmas e Frequência */}
      {reportType === 'classes' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#16324F]">
                Frequência e Desempenho por Turma
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitoramento pedagógico contínuo do ano letivo
              </p>
            </div>
            <span className="text-xs font-bold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
              Frequência Geral: {metrics.generalAttendance}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3">Segmento</th>
                  <th className="py-3 px-3">Turno</th>
                  <th className="py-3 px-3 text-right">Alunos</th>
                  <th className="py-3 px-3 text-right">Frequência (%)</th>
                  <th className="py-3 px-3 text-right">Média de Notas</th>
                  <th className="py-3 px-3">Sala Fixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#16324F]">
                      {cls.name}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">{cls.gradeLevel}</td>
                    <td className="py-3.5 px-3 text-[#64748B] capitalize">{cls.period}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-bold text-[#16324F]">
                      {cls.totalStudents}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-bold text-[#16A34A]">
                      {cls.attendanceRate}%
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
      )}

      {/* Table 3: Agendamentos */}
      {reportType === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#16324F]">
                Histórico Geral de Reservas & Ocorrências
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Auditoria de alocação de equipamentos e deliberações da direção
              </p>
            </div>
            <span className="text-xs font-bold text-[#16324F] bg-[#F5F7FB] px-2.5 py-1 rounded-md border border-slate-200">
              Total: {bookings.length} registros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Horário</th>
                  <th className="py-3 px-3">Recurso</th>
                  <th className="py-3 px-3">Docente</th>
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3">Finalidade</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => {
                  const res = resources.find((r) => r.id === b.resourceId);
                  return (
                    <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-[#16324F] font-bold">
                        {b.date}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#64748B]">
                        {b.startTime} - {b.endTime}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#16324F]">
                        {res?.name}
                      </td>
                      <td className="py-3.5 px-3 text-[#16324F] font-semibold">{b.userName}</td>
                      <td className="py-3.5 px-3 text-[#64748B]">{b.className || 'Uso Geral'}</td>
                      <td className="py-3.5 px-3 text-[#64748B] max-w-xs truncate">{b.purpose}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            b.status === 'approved'
                              ? 'bg-green-100 text-[#16A34A]'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-[#EAB308]'
                              : 'bg-red-100 text-[#DC2626]'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
