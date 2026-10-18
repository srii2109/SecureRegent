import React, { useState } from 'react';
import { FilterState, Department } from '../types';
import { mockDepartments, mockUsers } from '../data/mockData';
import { Calendar, Download, Users, Briefcase, Filter, ChevronDown, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  dateRangeLabel: string;
  onOpenExport: () => void;
  onOpenExplorer: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  dateRangeLabel,
  onOpenExport,
  onOpenExplorer,
  onRefresh,
  isRefreshing,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStart, setCustomStart] = useState('2026-10-01');
  const [customEnd, setCustomEnd] = useState('2026-10-18');

  const handleApplyCustomDates = () => {
    onFilterChange({
      dateFilter: 'custom',
      customStartDate: customStart,
      customEndDate: customEnd,
    });
    setShowDatePicker(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                SR
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  Business Performance &amp; Revenue Analytics
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track your leads, conversions, quotations, deals, revenue and operations in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Date, User, Dept, Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Date Range Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-2xs"
                title="Filter by date range"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{dateRangeLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Preset Date Ranges
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <button
                      onClick={() => {
                        onFilterChange({ dateFilter: 'today' });
                        setShowDatePicker(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                        filters.dateFilter === 'today'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        onFilterChange({ dateFilter: '7days' });
                        setShowDatePicker(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                        filters.dateFilter === '7days'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => {
                        onFilterChange({ dateFilter: '30days' });
                        setShowDatePicker(false);
                      }}
                      className={`col-span-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                        filters.dateFilter === '30days'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Last 30 Days (Oct 1 - Oct 31, 2026)
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Custom Date Range
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-slate-500 block">Start Date</label>
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block">End Date</label>
                        <input
                          type="date"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-800"
                        />
                      </div>
                      <button
                        onClick={handleApplyCustomDates}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                      >
                        Apply Range
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Filter Dropdown */}
            <div className="relative">
              <select
                value={filters.user}
                onChange={(e) => onFilterChange({ user: e.target.value })}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 pl-8 pr-7 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
                title="Filter by user"
              >
                {mockUsers.map((u) => (
                  <option key={u.name} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <Users className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Department Filter Dropdown */}
            <div className="relative">
              <select
                value={filters.department}
                onChange={(e) => onFilterChange({ department: e.target.value as Department })}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 pl-8 pr-7 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
                title="Filter by department"
              >
                {mockDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Relational Data Explorer Button */}
            <button
              onClick={onOpenExplorer}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-2xs"
              title="Explore Lead -> Quote -> Deal -> Order -> Payment hierarchy"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Data Relationships</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Export Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs"
              title="Export analytics report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Active Filters Tag Bar */}
        {(filters.user !== 'All Users' || filters.department !== 'All Departments' || filters.dateFilter !== '30days') && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <Filter className="w-3 h-3" /> Active Filters:
            </span>
            {filters.dateFilter !== '30days' && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                Period: {dateRangeLabel}
                <button
                  onClick={() => onFilterChange({ dateFilter: '30days' })}
                  className="hover:text-blue-900 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filters.user !== 'All Users' && (
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                User: {filters.user}
                <button
                  onClick={() => onFilterChange({ user: 'All Users' })}
                  className="hover:text-indigo-900 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filters.department !== 'All Departments' && (
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                Dept: {filters.department}
                <button
                  onClick={() => onFilterChange({ department: 'All Departments' })}
                  className="hover:text-purple-900 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => onFilterChange({ dateFilter: '30days', user: 'All Users', department: 'All Departments' })}
              className="text-slate-400 hover:text-slate-700 underline text-[11px] ml-auto"
            >
              Reset all
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
