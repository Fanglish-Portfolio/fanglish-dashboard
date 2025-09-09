import React from "react";
import { BarChart3, TrendingUp, Users, Eye, Calendar } from "lucide-react";

export default function Analytics() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600">
          Track performance and user engagement metrics
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-400 mr-2" />
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Custom range</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-semibold text-gray-900">94,521</p>
              <p className="text-sm text-green-600 mt-1">+18% from last week</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unique Visitors
              </p>
              <p className="text-2xl font-semibold text-gray-900">12,847</p>
              <p className="text-sm text-green-600 mt-1">+12% from last week</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Conversion Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900">3.2%</p>
              <p className="text-sm text-green-600 mt-1">
                +0.8% from last week
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-semibold text-gray-900">42.1%</p>
              <p className="text-sm text-red-600 mt-1">-2.3% from last week</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <BarChart3 size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Traffic Overview
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Engagement
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're building comprehensive analytics features including real-time
          data, custom reports, and advanced visualization tools.
        </p>
      </div>
    </div>
  );
}
