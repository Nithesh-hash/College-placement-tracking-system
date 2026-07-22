import { useState, useMemo } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CompanyRepository } from './components/CompanyRepository';
import { BranchAnalytics } from './components/BranchAnalytics';
import {
  BarChart3, Building2, Users, GraduationCap,
  LogOut, ChevronDown, Menu, X,
} from 'lucide-react';
import type { Company, BranchStat, PlacementTrend, PackageDist } from './types';

type TabType = 'dashboard' | 'companies' | 'branches';

const TABS = [
  { id: 'dashboard' as TabType, label: 'Placement Dashboard', icon: BarChart3 },
  { id: 'companies' as TabType, label: 'Company Repository', icon: Building2 },
  { id: 'branches' as TabType, label: 'Branch Analytics', icon: Users },
];

// Mock Data so the application renders cleanly without Supabase
const MOCK_TRENDS: PlacementTrend[] = [
  {
    id: '1',
    year: 2026,
    total_offers: 3200,
    total_companies: 145,
    highest_package: 54,
    avg_package: 9.2,
    median_package: 8.5,
    highest_stipend: 120000,
    avg_stipend: 35000,
    placement_rate: 88,
  }
];

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Microsoft',
    category: 'Super Dream',
    package: 51,
    stipend: 125000,
    roles: ['SDE-1', 'PM'],
    branches_eligible: ['CSE', 'ECE', 'IT'],
    cgpa_cutoff: 8.5,
    offers_count: 42,
    visit_date: '2025-08-10',
  },
  {
    id: '2',
    name: 'Amazon',
    category: 'Super Dream',
    package: 45,
    stipend: 110000,
    roles: ['SDE-1'],
    branches_eligible: ['CSE', 'ECE', 'EEE', 'IT'],
    cgpa_cutoff: 8.0,
    offers_count: 85,
    visit_date: '2025-08-15',
  }
];

const MOCK_BRANCH_STATS: BranchStat[] = [
  {
    id: '1',
    branch: 'CSE',
    year: 2026,
    total_students: 1200,
    placed_students: 1080,
    avg_package: 11.5,
    highest_package: 54,
  },
  {
    id: '2',
    branch: 'ECE',
    year: 2026,
    total_students: 800,
    placed_students: 680,
    avg_package: 8.8,
    highest_package: 32,
  }
];

const MOCK_PACKAGE_DIST: PackageDist[] = [
  { id: '1', range_label: '< 6 LPA', range_start: 0, count: 450 },
  { id: '2', range_label: '6 - 10 LPA', range_start: 6, count: 1200 },
  { id: '3', range_label: '10 - 20 LPA', range_start: 10, count: 950 },
  { id: '4', range_label: '> 20 LPA', range_start: 20, count: 600 },
];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = 'Nithesh';

  const currentYearStats = useMemo(() => {
    const latest = MOCK_TRENDS[0];
    if (!latest) return null;
    return {
      totalOffers: latest.total_offers,
      totalCompanies: latest.total_companies,
      highestPackage: latest.highest_package,
      avgPackage: latest.avg_package,
      medianPackage: latest.median_package,
      highestStipend: latest.highest_stipend,
      avgStipend: latest.avg_stipend,
      placementRate: latest.placement_rate,
    };
  }, []);

  // If user is not logged in, show AuthPage
  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 10, padding: 8, flexShrink: 0 }}>
            <GraduationCap className="w-5 h-5" style={{ color: '#38bdf8' }} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Placement Tracker</p>
            <p style={{ fontSize: 11, color: '#6b7191' }}>VIT Vellore 2026</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '14px 12px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#3d4260', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 8 }}>
          Main Menu
        </p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
            className={`nav-item w-full${activeTab === tab.id ? ' active' : ''}`}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{username[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{username}</p>
            <p style={{ fontSize: 11, color: '#6b7191' }}>Student</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="nav-item w-full"
          style={{ color: '#f87171' }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className="fixed inset-y-0 left-0 z-50 lg:hidden"
        style={{
          width: 240,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" style={{ color: '#38bdf8' }} />
            <span className="text-white font-semibold text-sm">Menu</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ color: '#6b7191', padding: 4 }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar (Always visible) */}
      <aside
        className="hidden lg:flex"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          flexDirection: 'column',
          zIndex: 30,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:ml-[240px]" style={{ minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            background: 'rgba(11,13,20,0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 20px',
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              style={{ color: '#6b7191', padding: 4 }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-semibold" style={{ fontSize: 16 }}>{activeTabMeta.label}</h1>
              <p style={{ fontSize: 12, color: '#6b7191' }}>Academic Year 2025–26</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: 8,
                padding: '5px 12px',
                fontSize: 12,
                color: '#38bdf8',
                fontWeight: 500,
              }}
            >
              Live 2026
            </div>
            <div className="hidden sm:flex items-center gap-2 cursor-pointer" style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{username[0]?.toUpperCase()}</span>
              </div>
              <span style={{ fontSize: 13, color: '#8892aa' }}>{username}</span>
              <ChevronDown className="w-3 h-3" style={{ color: '#6b7191' }} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: '20px', flex: 1, overflowY: 'auto' }} className="fade-up lg:p-7">
          {activeTab === 'dashboard' && (
            <Dashboard stats={currentYearStats} trends={MOCK_TRENDS} packageDist={MOCK_PACKAGE_DIST} companies={MOCK_COMPANIES} />
          )}
          {activeTab === 'companies' && <CompanyRepository companies={MOCK_COMPANIES} />}
          {activeTab === 'branches' && <BranchAnalytics branchStats={MOCK_BRANCH_STATS} />}
        </main>
      </div>
    </div>
  );
}

export default App;
