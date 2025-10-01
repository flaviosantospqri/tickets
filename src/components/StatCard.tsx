import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: typeof LucideIcon;
  color: string;
  percentage?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, percentage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {percentage !== undefined && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {percentage >= 0 ? '+' : ''}{percentage}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
