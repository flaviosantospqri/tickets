import React from 'react';

interface TicketsFilterProps {
    status: string;
    type: string;
    startDate: string;
    endDate: string;
    total: number;
    totalConcluidos: number,
    onChange: (field: string, value: string) => void;
    onClear: () => void;
}

export const TicketsFilter: React.FC<TicketsFilterProps> = ({
    status,
    type,
    total,
    startDate,
    endDate,
    totalConcluidos,
    onChange,
    onClear,
}) => {

    return (
        <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-6 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => onChange('status', e.target.value)}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="andamento">Andamento</option>
                        <option value="pendente">Pendente</option>
                        <option value="concluido">Concluído</option>
                        <option value="passificado">Passificado</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        value={type}
                        onChange={(e) => onChange('type', e.target.value)}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="bug">Bug</option>
                        <option value="melhoria">Melhoria</option>
                        <option value="não informado">Não Informado</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onChange('startDate', e.target.value)}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Data Final</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onChange('endDate', e.target.value)}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    />
                </div>

                <button
                    type="button"
                    onClick={onClear}
                    className="mt-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                    Limpar Filtros
                </button>
            </div>

            <div className="text-sm text-gray-700 mt-2">
                Tickets filtrados: {total} | Concluídos: {totalConcluidos}
            </div>
        </div>
    );
};
