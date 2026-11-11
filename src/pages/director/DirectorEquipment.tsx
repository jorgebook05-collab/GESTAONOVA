import React, { useState, useMemo } from 'react';
import { 
  Laptop, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Tag, 
  Building2,
  Trash2,
  Edit2,
  LayoutGrid,
  List,
  Sparkles,
  Info,
  Layers,
  X
} from 'lucide-react';
import { Resource, ResourceStatus, ResourceCategory } from '../../types';

interface DirectorEquipmentProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateStatus: (id: string, newStatus: ResourceStatus) => void;
}

export const DirectorEquipment: React.FC<DirectorEquipmentProps> = ({
  resources,
  onAddResource,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ResourceStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailEquipment, setDetailEquipment] = useState<Resource | null>(null);

  // Form State for new equipment
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('datashow');
  const [code, setCode] = useState('');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Categories definition
  const categoryChips = [
    { id: 'all', label: 'Todos os Recursos' },
    { id: 'datashow', label: 'DataShows / Projetores' },
    { id: 'lab_informatica', label: 'Laboratórios STEM' },
    { id: 'kit_midia', label: 'Tablets & Kits Mídia' },
    { id: 'auditorio', label: 'Auditório & Som' },
    { id: 'lab_ciencias', label: 'Maker & Robótica' },
  ];

  // Filtering
  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.brand && r.brand.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [resources, searchTerm, statusFilter, selectedCategory]);

  const availableCount = resources.filter((r) => r.status === 'available').length;
  const inUseCount = resources.filter((r) => r.status === 'in_use').length;
  const maintenanceCount = resources.filter((r) => r.status === 'maintenance').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    onAddResource({
      name,
      category,
      code,
      brand,
      serialNumber,
      location,
      description,
      isAvailable: true,
      status: 'available',
      features: ['Catalogado no Sistema'],
    });

    setName('');
    setCode('');
    setBrand('');
    setSerialNumber('');
    setLocation('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
              Catálogo & Gestão de Equipamentos Escolares
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Controle de patrimônio, status de disponibilidade em tempo real e regulação para aulas
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Equipamento</span>
        </button>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Total no Catálogo</span>
          <div className="text-3xl font-black text-[#16324F] tabular-nums mt-1">{resources.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Patrimônios ativos</span>
        </div>

        <div 
          onClick={() => setStatusFilter('available')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'available'
              ? 'border-green-400 ring-2 ring-green-100 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">Disponíveis</span>
          <div className="text-3xl font-black text-[#16A34A] tabular-nums mt-1">{availableCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Prontos para reserva</span>
        </div>

        <div 
          onClick={() => setStatusFilter('in_use')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'in_use'
              ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">Em Uso Agora</span>
          <div className="text-3xl font-black text-[#2563EB] tabular-nums mt-1">{inUseCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Em sala ou evento</span>
        </div>

        <div 
          onClick={() => setStatusFilter('maintenance')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'maintenance'
              ? 'border-red-400 ring-2 ring-red-100 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider block">Em Manutenção</span>
          <div className="text-3xl font-black text-[#DC2626] tabular-nums mt-1">{maintenanceCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Aguardando reparo técnico</span>
        </div>
      </div>

      {/* Category Filter Chips Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categoryChips.map((chip) => {
          const isSelected = selectedCategory === chip.id;
          const count = chip.id === 'all' 
            ? resources.length 
            : resources.filter((r) => r.category === chip.id).length;

          return (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#16324F] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:text-[#16324F] hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, código patrimonial, marca ou sala..."
            className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl py-2 pl-10 pr-8 text-xs text-[#16324F] focus:outline-[#2563EB]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#64748B] font-bold">
            {filtered.length} equipamento(s) exibido(s)
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F5F7FB] rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-[#16324F] shadow-xs' : 'text-slate-400 hover:text-[#16324F]'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-[#16324F] shadow-xs' : 'text-slate-400 hover:text-[#16324F]'
              }`}
              title="Visualização em Grade de Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment View: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F5F7FB] text-[#64748B] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Equipamento / Espaço</th>
                  <th className="py-3.5 px-4">Código / Série</th>
                  <th className="py-3.5 px-4">Localização Fixa</th>
                  <th className="py-3.5 px-4">Status Atual</th>
                  <th className="py-3.5 px-4 text-center">Alternar Status em 1 Clique</th>
                  <th className="py-3.5 px-4 text-right">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-[#16324F] text-xs block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] block mt-0.5 line-clamp-1">
                        {item.description}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <span className="font-bold text-[#16324F] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.code}
                      </span>
                      {item.serialNumber && (
                        <span className="text-[10px] text-slate-400 block mt-1 font-sans">{item.serialNumber}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#64748B]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {item.status === 'available' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Disponível
                        </span>
                      )}
                      {item.status === 'in_use' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          <Clock className="w-3 h-3" />
                          Em Uso
                        </span>
                      )}
                      {item.status === 'maintenance' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                          <Wrench className="w-3 h-3" />
                          Manutenção
                        </span>
                      )}
                    </td>

                    {/* Quick 1-Click Status Switcher */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center p-1 bg-[#F5F7FB] rounded-xl border border-slate-200 gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(item.id, 'available')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            item.status === 'available'
                              ? 'bg-[#16A34A] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-[#16A34A] hover:bg-green-50'
                          }`}
                          title="Definir como Disponível"
                        >
                          Disponível
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(item.id, 'in_use')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            item.status === 'in_use'
                              ? 'bg-[#2563EB] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-[#2563EB] hover:bg-blue-50'
                          }`}
                          title="Definir como Em Uso"
                        >
                          Em Uso
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(item.id, 'maintenance')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            item.status === 'maintenance'
                              ? 'bg-[#DC2626] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-[#DC2626] hover:bg-red-50'
                          }`}
                          title="Definir em Manutenção"
                        >
                          Manutenção
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDetailEquipment(item)}
                        className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment View: Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="font-mono text-xs font-bold bg-[#F5F7FB] text-[#16324F] px-2 py-0.5 rounded-md border border-slate-200">
                    {item.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      item.status === 'available'
                        ? 'bg-green-100 text-[#16A34A]'
                        : item.status === 'in_use'
                        ? 'bg-blue-100 text-[#2563EB]'
                        : 'bg-red-100 text-[#DC2626]'
                    }`}
                  >
                    {item.status === 'available' ? 'Disponível' : item.status === 'in_use' ? 'Em Uso' : 'Manutenção'}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-[#16324F]">
                  {item.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                  {item.brand && (
                    <span className="font-semibold text-[#16324F]">{item.brand}</span>
                  )}
                </div>
              </div>

              {/* Status Switcher in Card */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                  Alterar Status Rápido:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'available')}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.status === 'available'
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'bg-[#F5F7FB] text-[#64748B] border-slate-200 hover:text-[#16A34A]'
                    }`}
                  >
                    Disponível
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'in_use')}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.status === 'in_use'
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F5F7FB] text-[#64748B] border-slate-200 hover:text-[#2563EB]'
                    }`}
                  >
                    Em Uso
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'maintenance')}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.status === 'maintenance'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-[#F5F7FB] text-[#64748B] border-slate-200 hover:text-[#DC2626]'
                    }`}
                  >
                    Manutenção
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Equipment Modal */}
      {detailEquipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                  Ficha Técnica do Recurso
                </span>
                <h3 className="text-base font-extrabold text-[#16324F] mt-0.5">
                  {detailEquipment.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailEquipment(null)}
                className="text-slate-400 hover:text-[#16324F] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 bg-[#F5F7FB] rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Código Patrimonial:</span>
                  <span className="font-mono font-bold text-[#16324F]">{detailEquipment.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Localização:</span>
                  <span className="font-bold text-[#16324F]">{detailEquipment.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Marca / Modelo:</span>
                  <span className="font-bold text-[#16324F]">{detailEquipment.brand || 'Institucional'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status Atual:</span>
                  <span className="font-bold text-[#2563EB] uppercase">{detailEquipment.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#16324F] block mb-1">Descrição e Especificações:</span>
                <p className="text-xs text-[#64748B] leading-relaxed bg-[#F5F7FB] p-3 rounded-xl border border-slate-200">
                  {detailEquipment.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailEquipment(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#16324F]">
                Cadastrar Novo Equipamento Escolar
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Nome do Equipamento / Recurso *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Projetor Epson PowerLite 4K - Sala 12"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Código Patrimonial *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: PAT-DS-012"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] font-mono focus:outline-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  >
                    <option value="datashow">DataShow / Projetor</option>
                    <option value="lab_informatica">Laboratório de Informática</option>
                    <option value="kit_midia">Kit Mídia / Tablets</option>
                    <option value="auditorio">Auditório & Som</option>
                    <option value="lab_ciencias">Laboratório Maker / STEM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Marca / Fabricante
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Epson / BenQ / Dell"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Localização Física Fixa *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Bloco B - Armário Multimídia 2"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Descrição e Recursos Inclusos
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cabos HDMI, controle remoto, adaptador USB-C incluso, suporte teto..."
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#64748B] hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
