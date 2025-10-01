import React, { useMemo } from 'react';
import { X, User, Calendar, Clock, AlertCircle, Tag } from 'lucide-react';
import type { TicketData } from '../types/ticket';
import { useJiraTicket } from '../hooks/useTickets';
import { calculateDuration } from '../utils/calculateDuration';

interface TicketDetailsModalProps {
  ticket: TicketData | null;
  onClose: () => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const issueKey = useMemo(() => ticket.jira?.split("/").pop() || null, [ticket.jira]);
  const { data: jiraData } = useJiraTicket(issueKey || "");

  if (!jiraData) return null;

  const fields = jiraData.fields;

  const assignee = fields.assignee;
  const creator = fields.creator;
  const priority = fields.priority;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    const statusLower = (status ?? '').toLowerCase();
    if (statusLower.includes('liberado') || statusLower.includes('concluí') || statusLower.includes('done')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('andamento') || statusLower.includes('progress')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (statusLower.includes('aguardando')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (statusLower.includes('cancelado')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{jiraData.key}</h2>
              <p className="text-sm text-gray-600 mt-1">{fields.summary || 'N/A'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" /> Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                    {ticket.status || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Responsável
                  </label>
                  <div className="flex items-center gap-3">
                    {assignee?.avatarUrls ? (
                      <img src={assignee.avatarUrls['16x16']} alt={assignee.displayName || ''} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{assignee?.displayName || 'Não atribuído'}</p>
                      {assignee?.emailAddress && <p className="text-sm text-gray-500">{assignee.emailAddress}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Criador
                  </label>
                  <div>
                    <p className="font-medium text-gray-900">{creator?.displayName || 'N/A'}</p>
                    {creator?.emailAddress && <p className="text-sm text-gray-500">{creator.emailAddress}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" /> Prioridade
                  </label>
                  <p className="text-gray-900 font-medium">{priority?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" /> Tipo
                  </label>
                  <p className="text-gray-900 font-medium">{ticket.type || 'Não Informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" /> Criado em
                  </label>
                  <p className="text-gray-900">{formatDate(fields.created)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" /> Atualizado em
                  </label>
                  <p className="text-gray-900">{formatDate(fields.updated)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" /> Tempo até a conclusão:
                </label>
                <p className="text-gray-900">
                  {calculateDuration(ticket.id, fields.updated || '')}
                </p>
              </div>
            </div>
            {ticket.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Descrição</label>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>
            )}
          </div>
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
