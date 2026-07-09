import { useMemo, useState } from 'react';
import {
  Users,
  DollarSign,
  Award,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { BranchStat } from '../types';

const BRANCH_COLORS: Record<string, string> = {
  'CSE': '#0ea5e9',
  'IT': '#06b6d4',
  'ECE': '#14b8a6',
  'EE': '#22c55e',
  'ME': '#eab308',
  'CE': '#f97316',
  'CSE (AI/ML)': '#8b5cf6',
  'CSE (Data Science)': '#ec4899',
  'CSE (Cyber Security)': '#f43f5e',
  'ECE (VLSI)': '#a855f7',
  'ECE (Embedded)': '#d946ef',
  'Biotechnology': '#84cc16',
};

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1e2e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: 'white',
  fontSize: 12,
};

interface BranchAnalyticsProps {
  branchStats: BranchStat[];
}

export function BranchAnalytics({ branchStats }: BranchAnalyticsProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const years = useMemo(() => {
    return Array.from(new Set(branchStats.map((b) => b.year))).sort((a, b) => b - a);
  }, [branchStats]);

  const yearStats = useMemo(() => {
    return branchStats.filter((b) => b.year === selectedYear);
  }, [branchStats, selectedYear]);

  const totalPlaced = useMemo(() => {
    return yearStats.reduce((sum, b) => sum + b.students_placed, 0);
  }, [yearStats]);

  const totalStudents = useMemo(() => {
    return yearStats.reduce((sum, b) => sum + b.total_students, 0);
  }, [yearStats]);

  const overallPlacementRate = totalStudents > 0 ? ((totalPlaced / totalStudents) * 100).toFixed(1) : 0;

  const topPayingBranches = useMemo(() => {
    return [...yearStats].sort((a, b) => b.avg_package - a.avg_package).slice(0, 5);
  }, [yearStats]);

  const getRankBadge = (idx: number) => {
    if (idx === 0) return { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', shadow: 'rgba(251,191,36,0.3)' };
    if (idx === 1) return { bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', shadow: 'rgba(148,163,184,0.3)' };
    if (idx === 2) return { bg: 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)', shadow: 'rgba(205,127,50,0.3)' };
    return { bg: 'rgba(56,189,248,0.1)', shadow: 'transparent' };
  };

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Branch Comparison</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Year-wise placement statistics by branch</p>
        </div>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              appearance: 'none',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 40px 10px 14px',
              fontSize: 14,
              color: 'white',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {years.map((year) => (
              <option key={year} value={year} style={{ background: '#12151f' }}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: 'rgba(56,189,248,0.1)', borderRadius: 8, padding: 6 }}>
              <Users className="w-4 h-4" style={{ color: '#38bdf8' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Students Placed</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalPlaced.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: 'rgba(52,211,153,0.1)', borderRadius: 8, padding: 6 }}>
              <Users className="w-4 h-4" style={{ color: '#34d399' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total Students</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStudents.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: 'rgba(56,189,248,0.1)', borderRadius: 8, padding: 6 }}>
              <Award className="w-4 h-4" style={{ color: '#38bdf8' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Placement Rate</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#38bdf8' }}>{overallPlacementRate}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: 'rgba(251,191,36,0.1)', borderRadius: 8, padding: 6 }}>
              <Briefcase className="w-4 h-4" style={{ color: '#fbbf24' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total Offers</span>
          </div>
          <p className="text-2xl font-bold text-white">{yearStats.reduce((sum, b) => sum + b.total_offers, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Package Comparison */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Average Package</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>By branch (LPA)</p>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.1)', borderRadius: 8, padding: 8 }}>
              <DollarSign className="w-4 h-4" style={{ color: '#38bdf8' }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsBarChart data={yearStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis dataKey="branch" type="category" stroke="rgba(255,255,255,0.4)" width={90} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value} LPA`, 'Avg Package']} />
              <Bar dataKey="avg_package" radius={[0, 6, 6, 0]}>
                {yearStats.map((entry) => (
                  <Cell key={entry.branch} fill={BRANCH_COLORS[entry.branch] || '#0ea5e9'} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Highest Package Comparison */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Highest Package</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>By branch (LPA)</p>
            </div>
            <div style={{ background: 'rgba(251,191,36,0.1)', borderRadius: 8, padding: 8 }}>
              <Award className="w-4 h-4" style={{ color: '#fbbf24' }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsBarChart data={yearStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis dataKey="branch" type="category" stroke="rgba(255,255,255,0.4)" width={90} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value} LPA`, 'Highest Package']} />
              <Bar dataKey="highest_package" radius={[0, 6, 6, 0]}>
                {yearStats.map((entry) => (
                  <Cell key={entry.branch} fill={BRANCH_COLORS[entry.branch] || '#0ea5e9'} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Placed Pie */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Students Placed</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Distribution by branch</p>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.1)', borderRadius: 8, padding: 8 }}>
              <Users className="w-4 h-4" style={{ color: '#38bdf8' }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={yearStats}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="students_placed"
                nameKey="branch"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {yearStats.map((entry) => (
                  <Cell key={entry.branch} fill={BRANCH_COLORS[entry.branch] || '#0ea5e9'} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Total Offers Bar */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Total Offers</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Received by branch</p>
            </div>
            <div style={{ background: 'rgba(52,211,153,0.1)', borderRadius: 8, padding: 8 }}>
              <Briefcase className="w-4 h-4" style={{ color: '#34d399' }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsBarChart data={yearStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="branch" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={70} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="total_offers" radius={[6, 6, 0, 0]}>
                {yearStats.map((entry) => (
                  <Cell key={entry.branch} fill={BRANCH_COLORS[entry.branch] || '#0ea5e9'} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Paying Branches */}
      <div className="chart-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Top Paying Branches</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Highest average packages</p>
          </div>
          <div style={{ background: 'rgba(52,211,153,0.1)', borderRadius: 8, padding: 8 }}>
            <DollarSign className="w-4 h-4" style={{ color: '#34d399' }} />
          </div>
        </div>
        <div className="space-y-2">
          {topPayingBranches.map((branch, idx) => {
            const badge = getRankBadge(idx);
            return (
              <div key={branch.id} className="rank-row">
                <div
                  className="flex items-center justify-center font-bold text-white"
                  style={{
                    width: 36,
                    height: 36,
                    background: badge.bg,
                    borderRadius: 10,
                    fontSize: 14,
                    boxShadow: idx < 3 ? `0 4px 12px ${badge.shadow}` : 'none',
                  }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{branch.branch}</h4>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {branch.students_placed}/{branch.total_students} placed
                  </p>
                </div>
                <div className="flex-1 hidden sm:block">
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(branch.students_placed / branch.total_students) * 100}%`,
                        height: '100%',
                        background: BRANCH_COLORS[branch.branch] || '#0ea5e9',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right" style={{ minWidth: 70 }}>
                  <div className="font-bold" style={{ fontSize: 15, color: '#38bdf8' }}>{branch.avg_package} LPA</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>avg</div>
                </div>
                <div className="text-right" style={{ minWidth: 70 }}>
                  <div className="font-bold" style={{ fontSize: 15, color: '#fbbf24' }}>{branch.highest_package} LPA</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>highest</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Branch Cards */}
      <div className="chart-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Detailed Branch Statistics</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Complete breakdown by branch</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {yearStats.map((branch) => (
            <div key={branch.id} className="company-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center font-bold text-white"
                  style={{
                    width: 40,
                    height: 40,
                    background: BRANCH_COLORS[branch.branch] || '#0ea5e9',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                >
                  {branch.branch.substring(0, 3).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{branch.branch}</h4>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{branch.companies_visited} companies</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Placed</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{branch.students_placed}/{branch.total_students}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(branch.students_placed / branch.total_students) * 100}%`,
                        height: '100%',
                        background: BRANCH_COLORS[branch.branch] || '#0ea5e9',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="mini-stat">
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Avg Pkg</span>
                    <div className="font-semibold" style={{ fontSize: 13, color: '#38bdf8' }}>{branch.avg_package} LPA</div>
                  </div>
                  <div className="mini-stat">
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>High Pkg</span>
                    <div className="font-semibold" style={{ fontSize: 13, color: '#fbbf24' }}>{branch.highest_package} LPA</div>
                  </div>
                </div>
                <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }} className="flex justify-between items-center">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Offers</span>
                  <span className="font-semibold text-white text-sm">{branch.total_offers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
