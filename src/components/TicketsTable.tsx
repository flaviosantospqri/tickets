import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import type { TicketData } from '../types/ticket';
import { TicketDetailsModal } from './TicketDetailsModal';
import { parseSpreadsheetDateTime } from '../utils/calculateDuration';
import { TicketsFilter } from './TicketsFilter';

interface TicketsTableProps {
  tickets: TicketData[];
}

export const TicketsTable: React.FC<TicketsTableProps> = ({ tickets }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const normalizeTicketDate = (ticketId: string) => {
    const match = ticketId.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const ticketDate = normalizeTicketDate(ticket.id);
    if (filters.status && !ticket.status?.toLowerCase().includes(filters.status.toLowerCase())) return false;
    if (filters.type && !ticket.type?.toLowerCase().includes(filters.type.toLowerCase())) return false;
    if (filters.startDate && ticketDate && new Date(ticketDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && ticketDate && new Date(ticketDate) > new Date(filters.endDate)) return false;
    return true;
  });

  const totalFiltered = filteredTickets.length;
  const totalConcluidosFiltered = filteredTickets.filter((t) =>
    t.status?.toLowerCase().includes('concluido')
  ).length;

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const getStatusColor = (status?: string) => {
    const statusLower = (status ?? '').toLowerCase();
    if (statusLower.includes('liberado') || statusLower.includes('concluido')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('andamento') || statusLower.includes('progress')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('pendente') || statusLower.includes('waiting')) return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('passificado')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TicketsFilter
          status={filters.status}
          type={filters.type}
          startDate={filters.startDate}
          endDate={filters.endDate}
          total={totalFiltered}
          totalConcluidos={totalConcluidosFiltered}
          onChange={handleFilterChange}
          onClear={() => setFilters({ status: '', type: '', startDate: '', endDate: '' })}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Chamado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.jira?.split("/").pop() || "Não encontrado"}</div>
                        <div className="text-sm text-gray-500 max-w-md truncate">{ticket.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{ticket.type || 'Não Informado'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {parseSpreadsheetDateTime(ticket.id)?.toString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" /> Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum ticket encontrado</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-3 mt-6 px-6 py-2 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>

              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>

      <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </>
  );
};
