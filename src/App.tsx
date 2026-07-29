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
  { year: 2026, total_offers: 3520, total_companies: 158, highest_package: 54, avg_package: 9.6, median_package: 8.8, highest_stipend: 150000, avg_stipend: 38000, placement_rate: 91 },
  { year: 2025, total_offers: 2850, total_companies: 130, highest_package: 48, avg_package: 8.7, median_package: 7.9, highest_stipend: 100000, avg_stipend: 32000, placement_rate: 85 },
  { year: 2024, total_offers: 2500, total_companies: 115, highest_package: 44, avg_package: 8.1, median_package: 7.2, highest_stipend: 90000, avg_stipend: 28000, placement_rate: 82 },
  { year: 2023, total_offers: 2200, total_companies: 98, highest_package: 40, avg_package: 7.5, median_package: 6.8, highest_stipend: 80000, avg_stipend: 25000, placement_rate: 80 },
  { year: 2022, total_offers: 1950, total_companies: 85, highest_package: 36, avg_package: 7.1, median_package: 6.3, highest_stipend: 75000, avg_stipend: 22000, placement_rate: 78 }
];

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Microsoft', package: 51, stipend: 125000, role: 'SDE-1', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'EEE', 'CSE (AI/ML)', 'CSE (Data Science)', 'CSE (Cyber Security)'], num_offers: 42, year: 2026 },
  { id: '2', name: 'Amazon', package: 45, stipend: 110000, role: 'SDE-1', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'CSE (AI/ML)', 'CSE (Data Science)'], num_offers: 85, year: 2026 },
  { id: '3', name: 'Google', package: 54, stipend: 150000, role: 'Software Engineer', offer_type: 'FTE', branches: ['CSE', 'IT', 'CSE (AI/ML)', 'CSE (Data Science)'], num_offers: 15, year: 2026 },
  { id: '4', name: 'Uber', package: 48, stipend: 130000, role: 'SDE-1', offer_type: 'FTE', branches: ['CSE', 'IT', 'CSE (AI/ML)'], num_offers: 10, year: 2026 },
  { id: '5', name: 'Goldman Sachs', package: 28, stipend: 90000, role: 'Analyst', offer_type: 'Intern', branches: ['CSE', 'ECE', 'EEE', 'IT', 'CSE (AI/ML)', 'CSE (Data Science)'], num_offers: 30, year: 2026 },
  { id: '6', name: 'JPMorgan Chase', package: 18, stipend: 75000, role: 'Software Engineer Program', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE', 'CSE (AI/ML)'], num_offers: 120, year: 2026 },
  { id: '7', name: 'Adobe', package: 40, stipend: 100000, role: 'Product Engineer', offer_type: 'FTE', branches: ['CSE', 'IT', 'CSE (AI/ML)'], num_offers: 12, year: 2026 },
  { id: '8', name: 'Nvidia', package: 42, stipend: 120000, role: 'ASIC Design Engineer', offer_type: 'FTE', branches: ['ECE', 'EEE', 'ECE (VLSI)', 'ECE (Embedded)'], num_offers: 8, year: 2026 },
  { id: '9', name: 'Salesforce', package: 36, stipend: 95000, role: 'AMTS', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 18, year: 2026 },
  { id: '10', name: 'Atlassian', package: 52, stipend: 110000, role: 'Graduate SDE', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 7, year: 2026 },
  { id: '11', name: 'Oracle', package: 22, stipend: 60000, role: 'MTS', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 45, year: 2026 },
  { id: '12', name: 'TCS', package: 3.6, stipend: 15000, role: 'Ninja Developer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE', 'Biotechnology', 'Chemical Engineering'], num_offers: 450, year: 2026 },
  { id: '13', name: 'TCS Digital', package: 7.2, stipend: 25000, role: 'Systems Engineer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'CSE (AI/ML)'], num_offers: 150, year: 2026 },
  { id: '14', name: 'Infosys', package: 4.0, stipend: 15000, role: 'Systems Engineer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE', 'Chemical Engineering'], num_offers: 320, year: 2026 },
  { id: '15', name: 'Infosys Power Programmer', package: 9.5, stipend: 30000, role: 'Specialist Programmer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 75, year: 2026 },
  { id: '16', name: 'Cognizant', package: 4.2, stipend: 12000, role: 'GenC', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE'], num_offers: 280, year: 2026 },
  { id: '17', name: 'Accenture', package: 4.5, stipend: 15000, role: 'Associate SDE', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE', 'Biotechnology', 'Chemical Engineering'], num_offers: 350, year: 2026 },
  { id: '18', name: 'Cisco', package: 26, stipend: 80000, role: 'Technical Consulting Engineer', offer_type: 'Intern', branches: ['CSE', 'ECE', 'EEE', 'IT'], num_offers: 25, year: 2026 },
  { id: '19', name: 'AMD', package: 32, stipend: 85000, role: 'Silicon Design Engineer', offer_type: 'FTE', branches: ['ECE', 'EEE', 'ECE (VLSI)', 'ECE (Embedded)'], num_offers: 14, year: 2026 },
  { id: '20', name: 'Qualcomm', package: 34, stipend: 90000, role: 'Hardware Engineer', offer_type: 'FTE', branches: ['ECE', 'EEE', 'ECE (VLSI)', 'ECE (Embedded)'], num_offers: 22, year: 2026 },
  { id: '21', name: 'DE Shaw', package: 53, stipend: 150000, role: 'MTS', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 5, year: 2026 },
  { id: '22', name: 'Morgan Stanley', package: 25, stipend: 85000, role: 'Technology Analyst', offer_type: 'Intern', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 20, year: 2026 },
  { id: '23', name: 'Intel', package: 20, stipend: 50000, role: 'Graduate Technical Intern', offer_type: 'Intern', branches: ['ECE', 'EEE', 'CSE', 'ECE (VLSI)', 'ECE (Embedded)'], num_offers: 40, year: 2026 },
  { id: '24', name: 'Samsung R&D', package: 24, stipend: 70000, role: 'Research Engineer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 35, year: 2026 },
  { id: '25', name: 'Walmart Global Tech', package: 27, stipend: 85000, role: 'SDE Intern', offer_type: 'Intern', branches: ['CSE', 'ECE', 'IT', 'CSE (AI/ML)'], num_offers: 28, year: 2026 },
  { id: '26', name: 'Wipro', package: 3.8, stipend: 15000, role: 'Project Engineer', offer_type: 'FTE', branches: ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE'], num_offers: 210, year: 2026 },
  { id: '27', name: 'Biocon', package: 6.5, stipend: 25000, role: 'Research Associate', offer_type: 'FTE', branches: ['Biotechnology'], num_offers: 12, year: 2026 },
  { id: '28', name: 'Dr. Reddy\'s', package: 7.0, stipend: 30000, role: 'Management Trainee', offer_type: 'FTE', branches: ['Biotechnology', 'Chemical Engineering'], num_offers: 18, year: 2026 },
  { id: '29', name: 'Larsen & Toubro (L&T)', package: 6.0, stipend: 20000, role: 'Graduate Engineer Trainee', offer_type: 'FTE', branches: ['CE', 'ME', 'EEE', 'ECE'], num_offers: 85, year: 2026 },
  { id: '30', name: 'Tata Motors', package: 8.5, stipend: 28000, role: 'Graduate Engineer Trainee', offer_type: 'FTE', branches: ['ME', 'EEE'], num_offers: 32, year: 2026 },
  { id: '31', name: 'Reliance Industries', package: 7.5, stipend: 22000, role: 'Graduate Trainee', offer_type: 'FTE', branches: ['Chemical Engineering', 'ME', 'CE', 'EEE'], num_offers: 48, year: 2026 },
  { id: '32', name: 'Schlumberger', package: 16.0, stipend: 55000, role: 'Petro-technical Engineer', offer_type: 'FTE', branches: ['Chemical Engineering', 'ME', 'EEE'], num_offers: 15, year: 2026 }
];

const MOCK_BRANCH_STATS: BranchStat[] = [
  { id: '1', branch: 'CSE', year: 2026, total_students: 1200, students_placed: 1140, avg_package: 12.8, highest_package: 54, companies_visited: 112, total_offers: 1280 },
  { id: '2', branch: 'ECE', year: 2026, total_students: 800, students_placed: 712, avg_package: 9.2, highest_package: 42, companies_visited: 85, total_offers: 780 },
  { id: '3', branch: 'IT', year: 2026, total_students: 400, students_placed: 376, avg_package: 10.5, highest_package: 52, companies_visited: 74, total_offers: 410 },
  { id: '4', branch: 'EEE', year: 2026, total_students: 350, students_placed: 298, avg_package: 8.1, highest_package: 34, companies_visited: 62, total_offers: 320 },
  { id: '5', branch: 'ME', year: 2026, total_students: 500, students_placed: 390, avg_package: 6.8, highest_package: 18, companies_visited: 48, total_offers: 415 },
  { id: '6', branch: 'CE', year: 2026, total_students: 300, students_placed: 210, avg_package: 5.9, highest_package: 18, companies_visited: 32, total_offers: 220 },
  { id: '7', branch: 'CSE (AI/ML)', year: 2026, total_students: 240, students_placed: 232, avg_package: 13.5, highest_package: 54, companies_visited: 98, total_offers: 260 },
  { id: '8', branch: 'CSE (Data Science)', year: 2026, total_students: 180, students_placed: 171, avg_package: 12.1, highest_package: 51, companies_visited: 82, total_offers: 195 },
  { id: '9', branch: 'CSE (Cyber Security)', year: 2026, total_students: 120, students_placed: 111, avg_package: 11.8, highest_package: 51, companies_visited: 68, total_offers: 125 },
  { id: '10', branch: 'ECE (VLSI)', year: 2026, total_students: 100, students_placed: 92, avg_package: 10.2, highest_package: 42, companies_visited: 45, total_offers: 98 },
  { id: '11', branch: 'ECE (Embedded)', year: 2026, total_students: 80, students_placed: 73, avg_package: 9.8, highest_package: 34, companies_visited: 40, total_offers: 78 },
  { id: '12', branch: 'Biotechnology', year: 2026, total_students: 150, students_placed: 128, avg_package: 6.2, highest_package: 7, companies_visited: 25, total_offers: 135 },
  { id: '13', branch: 'Chemical Engineering', year: 2026, total_students: 120, students_placed: 98, avg_package: 7.1, highest_package: 16, companies_visited: 30, total_offers: 104 }
];

const MOCK_PACKAGE_DIST: PackageDist[] = [
  { id: '1', label: '< 6 LPA', range_start: 0, range_end: 6, count: 1625, year: 2026 },
  { id: '2', label: '6 - 10 LPA', range_start: 6, range_end: 10, count: 1045, year: 2026 },
  { id: '3', label: '10 - 20 LPA', range_start: 10, range_end: 20, count: 520, year: 2026 },
  { id: '4', label: '> 20 LPA', range_start: 20, range_end: 100, count: 330, year: 2026 }
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
