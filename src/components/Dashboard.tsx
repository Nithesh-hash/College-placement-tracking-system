import { useMemo } from 'react';
import {
  TrendingUp, DollarSign, Award, Briefcase, ArrowUpRight, Building2, Users, BarChart,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, Legend, BarChart as RechartsBarChart, Bar,
} from 'recharts';
import type { Company, PlacementTrend, PackageDist } from '../types';

const C = ['#38bdf8','#34d399','#fbbf24','#f472b6','#a78bfa','#22d3ee','#fb923c'];
const BRANCH_C: Record<string, string> = {
  'CSE':'#38bdf8','IT':'#34d399','ECE':'#fbbf24','EE':'#a78bfa',
  'ME':'#f472b6','CE':'#fb923c','CSE (AI/ML)':'#22d3ee','CSE (Data Science)':'#818cf8',
};

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1e2e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: 'white',
  fontSize: 12,
};

interface DashboardProps {
  stats: {
    totalOffers: number; totalCompanies: number; highestPackage: number;
    avgPackage: number; medianPackage: number; highestStipend: number;
    avgStipend: number; placementRate: number;
  } | null;
  trends: PlacementTrend[];
  packageDist: PackageDist[];
  companies: Company[];
}

export function Dashboard({ stats, trends, packageDist, companies }: DashboardProps) {
  const topByPackage   = useMemo(() => [...companies].sort((a,b)=>(b.package||0)-(a.package||0)).slice(0,6), [companies]);
  const topByStipend   = useMemo(() => companies.filter(c=>c.stipend&&c.stipend>0).sort((a,b)=>(b.stipend||0)-(a.stipend||0)).slice(0,6), [companies]);
  const topByHires     = useMemo(() => [...companies].filter(c=>c.num_offers>0).sort((a,b)=>b.num_offers-a.num_offers).slice(0,10), [companies]);

  const branchOffers = useMemo(() => {
    const m = new Map<string,number>();
    companies.forEach(c => c.branches?.forEach(b => m.set(b,(m.get(b)||0)+(c.num_offers||0))));
    return Array.from(m.entries()).map(([branch,offers])=>({branch,offers})).sort((a,b)=>b.offers-a.offers).slice(0,8);
  }, [companies]);

  const stipendRanges = useMemo(() => {
    const src = companies.filter(c=>c.stipend&&c.stipend>0);
    const r = [
      {label:'0-25K',count:0,color:'#6366f1'},{label:'25-50K',count:0,color:'#38bdf8'},
      {label:'50-75K',count:0,color:'#34d399'},{label:'75-100K',count:0,color:'#fbbf24'},{label:'100K+',count:0,color:'#f472b6'},
    ];
    src.forEach(c=>{const s=c.stipend||0; if(s>=100000)r[4].count++; else if(s>=75000)r[3].count++; else if(s>=50000)r[2].count++; else if(s>=25000)r[1].count++; else r[0].count++;});
    return r.filter(x=>x.count>0);
  }, [companies]);

  const chartData = trends.slice().reverse();

  const getRankStyle = (idx: number) => {
    if (idx===0) return { background:'linear-gradient(135deg,#fbbf24,#f97316)' };
    if (idx===1) return { background:'linear-gradient(135deg,#94a3b8,#cbd5e1)' };
    if (idx===2) return { background:'linear-gradient(135deg,#b45309,#d97706)' };
    return { background:'rgba(56,189,248,0.15)', color:'#38bdf8' };
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Total Offers', val: stats?.totalOffers?.toLocaleString()||'0', icon:<Briefcase className="w-5 h-5"/>, color:'#38bdf8', bg:'rgba(56,189,248,0.1)', trend:14.3 },
          { label:'Companies', val: stats?.totalCompanies?.toString()||'0', icon:<Building2 className="w-5 h-5"/>, color:'#34d399', bg:'rgba(52,211,153,0.1)', trend:16.0 },
          { label:'Highest Package', val:`${stats?.highestPackage||0} LPA`, icon:<Award className="w-5 h-5"/>, color:'#fbbf24', bg:'rgba(251,191,36,0.1)', sub:'Jane Street' },
          { label:'Avg Package', val:`${stats?.avgPackage||0} LPA`, icon:<DollarSign className="w-5 h-5"/>, color:'#a78bfa', bg:'rgba(167,139,250,0.1)', trend:21.6 },
        ].map((k) => (
          <div key={k.label} className="stat-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ background:k.bg, borderRadius:10, padding:8, color:k.color }}>{k.icon}</div>
              {k.trend && (
                <span className="pill pill-up flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />{k.trend}%
                </span>
              )}
            </div>
            <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}>{k.label}</p>
            <p style={{ fontSize:22, fontWeight:800, color:'white', letterSpacing:'-0.02em' }}>{k.val}</p>
            {k.sub && <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Median Package', val:`${stats?.medianPackage||0} LPA`, color:'#38bdf8' },
          { label:'Placement Rate', val:`${stats?.placementRate||0}%`, color:'#34d399' },
          { label:'Highest Stipend', val:`₹${(stats?.highestStipend||0).toLocaleString()}`, color:'#fbbf24' },
          { label:'Avg Stipend', val:`₹${(stats?.avgStipend||0).toLocaleString()}/mo`, color:'#a78bfa' },
        ].map((k) => (
          <div key={k.label} className="stat-card" style={{ padding:'16px 20px' }}>
            <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:6 }}>{k.label}</p>
            <p style={{ fontSize:20, fontWeight:700, color:k.color }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="chart-card">
          <SectionHeader title="Placement Trend" sub="Year-wise offers & companies" icon={<TrendingUp className="w-4 h-4"/>} />
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#3d4260" tick={{fontSize:11}} />
              <YAxis stroke="#3d4260" tick={{fontSize:11}} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line type="monotone" dataKey="total_offers" stroke="#38bdf8" strokeWidth={2.5} dot={false} name="Total Offers" />
              <Line type="monotone" dataKey="total_companies" stroke="#34d399" strokeWidth={2.5} dot={false} name="Companies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <SectionHeader title="Package Growth" sub="Average & highest per year" icon={<BarChart className="w-4 h-4"/>} />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#3d4260" tick={{fontSize:11}} />
              <YAxis stroke="#3d4260" tick={{fontSize:11}} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Area type="monotone" dataKey="avg_package" stroke="#38bdf8" strokeWidth={2} fill="url(#gA)" name="Avg (LPA)" />
              <Area type="monotone" dataKey="highest_package" stroke="#34d399" strokeWidth={2} fill="url(#gH)" name="Highest (LPA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="chart-card">
          <SectionHeader title="Package Distribution" sub="Offers by salary range" icon={<DollarSign className="w-4 h-4"/>} />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={packageDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="count" nameKey="label" label={({name,percent})=>`${name} ${((percent||0)*100).toFixed(0)}%`} labelLine={false}>
                {packageDist.map((_,i)=><Cell key={i} fill={C[i%C.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <SectionHeader title="Stipend Distribution" sub="By monthly range" icon={<Award className="w-4 h-4"/>} />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={stipendRanges} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="count" nameKey="label" label={({name,percent})=>`${name} ${((percent||0)*100).toFixed(0)}%`} labelLine={false}>
                {stipendRanges.map((e,i)=><Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch offers bar */}
      <div className="chart-card">
        <SectionHeader title="Branch-wise Offers" sub="Total offers per branch" icon={<Users className="w-4 h-4"/>} />
        <ResponsiveContainer width="100%" height={220}>
          <RechartsBarChart data={branchOffers}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="branch" stroke="#3d4260" tick={{fontSize:10}} angle={-20} textAnchor="end" height={50} />
            <YAxis stroke="#3d4260" tick={{fontSize:11}} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="offers" radius={[4,4,0,0]}>
              {branchOffers.map((e,i)=><Cell key={i} fill={BRANCH_C[e.branch]||C[i%C.length]} />)}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Rank lists */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="chart-card">
          <SectionHeader title="Top Package Offers" sub="Highest paying companies" icon={<Award className="w-4 h-4"/>} />
          <div style={{ marginTop:16 }}>
            {topByPackage.map((c,i)=>(
              <div key={c.id} className="rank-row">
                <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0, ...getRankStyle(i) }}>
                  {i+1}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                  <p style={{ fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.role}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#38bdf8' }}>{c.package} LPA</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)' }}>{c.num_offers} offers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <SectionHeader title="Top Stipend Companies" sub="Highest paying internships" icon={<DollarSign className="w-4 h-4"/>} />
          <div style={{ marginTop:16 }}>
            {topByStipend.map((c,i)=>(
              <div key={c.id} className="rank-row">
                <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0, ...getRankStyle(i) }}>
                  {i+1}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                  <p style={{ fontSize:11, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.role}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#34d399' }}>₹{((c.stipend||0)/1000).toFixed(0)}K/mo</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)' }}>{c.package||'-'} LPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Hiring chart */}
      <div className="chart-card">
        <SectionHeader title="Top Hiring Companies" sub="By number of offers" icon={<Building2 className="w-4 h-4"/>} />
        <ResponsiveContainer width="100%" height={320}>
          <RechartsBarChart data={topByHires} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" stroke="#3d4260" tick={{fontSize:11}} />
            <YAxis dataKey="name" type="category" stroke="#3d4260" width={100} tick={{fontSize:11}} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v,_,p)=>[v,`${p.payload.name} — ${p.payload.package||'N/A'} LPA`]} />
            <Bar dataKey="num_offers" radius={[0,5,5,0]}>
              {topByHires.map((_,i)=><Cell key={i} fill={C[i%C.length]} />)}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getRankStyle(idx: number): React.CSSProperties {
  if (idx===0) return { background:'linear-gradient(135deg,#fbbf24,#f97316)' };
  if (idx===1) return { background:'linear-gradient(135deg,#94a3b8,#cbd5e1)', color:'#0f172a' };
  if (idx===2) return { background:'linear-gradient(135deg,#b45309,#d97706)' };
  return { background:'rgba(255,255,255,0.06)', color:'#6b7191' };
}

function SectionHeader({ title, sub, icon }: { title: string; sub: string; icon: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
      <div>
        <h3 style={{ fontSize:15, fontWeight:700, color:'white' }}>{title}</h3>
        <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{sub}</p>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:8, padding:7, color:'var(--text-secondary)' }}>{icon}</div>
    </div>
  );
}
