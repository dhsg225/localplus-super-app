// [2024-12-15 23:35] - Analytics Charts Component
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Users, DollarSign, MapPin } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface AnalyticsData {
  discoveryStats: {
    labels: string[];
    approved: number[];
    pending: number[];
    rejected: number[];
  };
  monthlyTrends: {
    labels: string[];
    discoveries: number[];
    costs: number[];
  };
  categoryBreakdown: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  geographicData: {
    regions: string[];
    counts: number[];
  };
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
  loading?: boolean;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, loading = false }) => {
  // Business Discovery Trends (Line Chart)
  const discoveryTrendsData = {
    labels: data.monthlyTrends.labels,
    datasets: [
      {
        label: 'New Discoveries',
        data: data.monthlyTrends.discoveries,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const discoveryTrendsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Business Discovery Trends' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Business Status Breakdown (Bar Chart)
  const statusBreakdownData = {
    labels: data.discoveryStats.labels,
    datasets: [
      {
        label: 'Approved',
        data: data.discoveryStats.approved,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Pending Review',
        data: data.discoveryStats.pending,
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
      },
      {
        label: 'Rejected',
        data: data.discoveryStats.rejected,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const statusBreakdownOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Business Approval Status' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  // Category Distribution (Doughnut Chart)
  const categoryData = {
    labels: data.categoryBreakdown.labels,
    datasets: [
      {
        data: data.categoryBreakdown.values,
        backgroundColor: data.categoryBreakdown.colors,
        borderColor: data.categoryBreakdown.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Business Categories' },
    },
  };

  // Cost Analysis (Line Chart)
  const costAnalysisData = {
    labels: data.monthlyTrends.labels,
    datasets: [
      {
        label: 'Monthly API Costs ($)',
        data: data.monthlyTrends.costs,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const costAnalysisOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'API Cost Trends' },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Approved</p>
              <p className="text-2xl font-bold">
                {data.discoveryStats.approved.reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <Users size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Review</p>
              <p className="text-2xl font-bold">
                {data.discoveryStats.pending.reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <TrendingUp size={32} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Monthly Cost</p>
              <p className="text-2xl font-bold">
                ${data.monthlyTrends.costs[data.monthlyTrends.costs.length - 1]?.toFixed(2) || '0.00'}
              </p>
            </div>
            <DollarSign size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Locations</p>
              <p className="text-2xl font-bold">{data.geographicData.regions.length}</p>
            </div>
            <MapPin size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovery Trends */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <Line data={discoveryTrendsData} options={discoveryTrendsOptions} />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <Bar data={statusBreakdownData} options={statusBreakdownOptions} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <Doughnut data={categoryData} options={categoryOptions} />
        </div>

        {/* Cost Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <Line data={costAnalysisData} options={costAnalysisOptions} />
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="space-y-3">
          {data.geographicData.regions.map((region, index) => {
            const count = data.geographicData.counts[index];
            const total = data.geographicData.counts.reduce((a, b) => a + b, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            
            return (
              <div key={region} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium">{region}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600">{count} ({percentage}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Sample data generator for testing
export const generateSampleAnalyticsData = (): AnalyticsData => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    discoveryStats: {
      labels,
      approved: [45, 52, 48, 61, 55, 67],
      pending: [12, 15, 8, 19, 22, 18],
      rejected: [8, 6, 12, 4, 7, 9],
    },
    monthlyTrends: {
      labels,
      discoveries: [65, 73, 68, 84, 84, 94],
      costs: [1.11, 1.24, 1.16, 1.43, 1.43, 1.60],
    },
    categoryBreakdown: {
      labels: ['Restaurants', 'Hotels', 'Shopping', 'Entertainment', 'Transportation'],
      values: [35, 25, 20, 15, 5],
      colors: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 191, 36, 0.8)',
      ],
    },
    geographicData: {
      regions: ['Hua Hin Center', 'Beach Area', 'Golf Course District', 'Market District', 'Train Station Area'],
      counts: [42, 28, 15, 12, 8],
    },
  };
}; 