import { useQuery } from '@tanstack/react-query';
import type { TicketData } from '../types/ticket';
import api from '../services/api';

export const useJiraTicket = (key: string) => {
  return useQuery<TicketData>({
    queryKey: ["jira-ticket", key],
    queryFn: async () => {
      const { data } = await api.get(`/jira/issue/${key}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: !!key, 
  });
};

export const useSheetsTickets = () => {
  return useQuery<TicketData[]>({
    queryKey: ["sheets-tickets"],
    queryFn: async () => {
      try {
        const res = await api.get("/sheets");

        console.log(res)
        return res?.data?.data ?? [];
      } catch (err) {
        console.error("Erro ao buscar tickets do Sheets:", err);
        return []; 
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useTickets = () => {
  return useQuery({
    queryKey: ['sheets-tickets'],
    queryFn: async () => {
      const { data } = await api.get('/sheets');
      return data.data.map((t: any) => ({
        id: t['Carimbo de data/hora'] + t['Qual é o seu usuário?'],
        status: t['Status'] ?? 'Desconhecido',
        type: t['Tipo do reporte'] ?? 'Outros',
        description: t['Descreva qual era a sua ação quando ocorreu o erro.'] ?? '',
        user: t['Qual é o seu usuário?'] ?? '',
        email: t['Qual é o email do seu usuário?'] ?? '',
        unit: t['Qual é a Unidade?'] ?? '',
        jira: t['Item no JIRA'] ?? '',
        image: t['Adicione uma imagem ou um pequeno vídeo.'] ?? '',
      }));
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};