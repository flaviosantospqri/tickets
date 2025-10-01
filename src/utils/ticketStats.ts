import type { TicketData, DashboardStats, ChartData } from '../types/ticket';

export const calculateStats = (tickets: TicketData[]): DashboardStats => {
  const stats: DashboardStats = {
    total: tickets.length,
    inProgress: 0,
    completed: 0,
    pending: 0,
    aguardando: 0,
    liberado: 0,
    cancelado: 0,
  };

  tickets.forEach(ticket => {
    const statusLower = (ticket.status ?? '').toLowerCase();

    if (statusLower.includes('concluido')) {
      stats.liberado++;
    } else if (statusLower.includes('concluido') || statusLower.includes('Concluido')) {
      stats.completed++;
    } else if (statusLower.includes('pendente') || statusLower.includes('progress')) {
      stats.inProgress++;
    } else if (statusLower.includes('passificado') || statusLower.includes('waiting')) {
      stats.aguardando++;
    } else if (statusLower.includes('cancelado') || statusLower.includes('canceled')) {
      stats.cancelado++;
    } else {
      stats.pending++;
    }
  });

  return stats;
};

export const getStatusChartData = (tickets: TicketData[]): ChartData[] => {
  const statusMap = new Map<string, number>();

  tickets.forEach(ticket => {
    const status = ticket.status ?? 'Desconhecido';
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  const colorMap: Record<string, string> = {
    'liberado': '#10b981',
    'concluido': '#10b981',
    'done': '#10b981',
    'em andamento': '#3b82f6',
    'in progress': '#3b82f6',
    'aguardando': '#f59e0b',
    'pendente': '#f59e0b',
    'passificado': '#3b82f6',
    'canceled': '#ef4444',
  };

  return Array.from(statusMap.entries()).map(([name, value]) => {
    const nameLower = name.toLowerCase();
    const color = Object.keys(colorMap).find(key => nameLower.includes(key));
    return {
      name,
      value,
      color: color ? colorMap[color] : '#6b7280',
    };
  });
};

export const getTypeChartData = (tickets: TicketData[]): ChartData[] => {
  const typeMap = new Map<string, number>();

  tickets.forEach(ticket => {
    const type = ticket.type || 'Outros';
    typeMap.set(type, (typeMap.get(type) || 0) + 1);
  });

  return Array.from(typeMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
};
