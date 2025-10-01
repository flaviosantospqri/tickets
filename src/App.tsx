import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { StatusChart } from "./components/StatusChart";
import { TicketTypeChart } from "./components/TicketTypeChart";
import { TicketsTable } from "./components/TicketsTable";
import { useTickets } from "./hooks/useTickets";
import { calculateStats, getStatusChartData, getTypeChartData } from "./utils/ticketStats";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function Dashboard() {
  const { data: tickets = [], isLoading, error } = useTickets();

  const stats = calculateStats(tickets);
  const statusChartData = getStatusChartData(tickets);
  const typeChartData = getTypeChartData(tickets);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Tickets</h1>
            <p className="text-sm text-gray-600">Acompanhamento e análise de tickets</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total de Tickets" value={stats.total} icon={BarChart3} color="bg-blue-600" />
              <StatCard title="Em Andamento" value={stats.inProgress} icon={Clock} color="bg-blue-500" />
              <StatCard title="Liberados" value={stats.liberado} icon={CheckCircle} color="bg-green-600" />
              <StatCard title="Passificados" value={stats.aguardando} icon={AlertCircle} color="bg-yellow-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <StatusChart data={statusChartData} />
              <TicketTypeChart data={typeChartData} />
            </div>
            <TicketsTable tickets={tickets} />
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
