import { useMemo, useState } from 'react';
import {
  Building2, Search, SortAsc, SortDesc, ChevronDown,
  Users, X, SlidersHorizontal, Award, Briefcase, TrendingUp, LayoutGrid, LayoutList,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { Company } from '../types';

const C = ['#38bdf8','#34d399','#fbbf24','#f472b6','#a78bfa','#22d3ee','#fb923c','#4ade80'];
const TOOLTIP_STYLE = { backgroundColor:'#1a1e2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'white', fontSize:12 };

export function CompanyRepository({ companies }: { companies: Company[] }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'package'|'name'|'num_offers'>('package');
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc');
  const [filters, setFilters] = useState({ offerType:[] as string[], minPackage:null as number|null, maxPackage:null as number|null, branches:[] as string[] });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'cards'|'table'>('cards');

  const allBranches = useMemo(()=>{const s=new Set<string>(); companies.forEach(c=>c.branches?.forEach(b=>s.add(b))); return Array.from(s).sort();}, [companies]);
  const offerTypes  = useMemo(()=>Array.from(new Set(companies.map(c=>c.offer_type).filter(Boolean))), [companies]);

  const filteredCompanies = useMemo(()=>{
    let r=[...companies];
    if(search){const sl=search.toLowerCase(); r=r.filter(c=>c.name.toLowerCase().includes(sl)||c.role?.toLowerCase().includes(sl)||c.offer_type?.toLowerCase().includes(sl));}
    if(filters.offerType.length>0) r=r.filter(c=>filters.offerType.includes(c.offer_type));
    if(filters.minPackage!==null) r=r.filter(c=>(c.package||0)>=filters.minPackage!);
    if(filters.maxPackage!==null) r=r.filter(c=>(c.package||0)<=filters.maxPackage!);
    if(filters.branches.length>0) r=r.filter(c=>c.branches?.some(b=>filters.branches.includes(b)));
    r.sort((a,b)=>{
      let av:any,bv:any;
      if(sortField==='name'){av=a.name.toLowerCase();bv=b.name.toLowerCase();}
      else if(sortField==='package'){av=a.package||0;bv=b.package||0;}
      else{av=a.num_offers||0;bv=b.num_offers||0;}
      return sortOrder==='asc'?(av>bv?1:-1):(av<bv?1:-1);
    });
    return r;
  },[companies,search,sortField,sortOrder,filters]);

  const totalOffers     = useMemo(()=>companies.reduce((s,c)=>s+(c.num_offers||0),0),[companies]);
  const activeRecruiters= useMemo(()=>companies.filter(c=>c.num_offers>0).length,[companies]);
  const topHiring       = useMemo(()=>[...companies].filter(c=>c.num_offers>0).sort((a,b)=>b.num_offers-a.num_offers).slice(0,12),[companies]);

  const offerTypeDist   = useMemo(()=>{
    const m=new Map<string,number>(); companies.forEach(c=>{if(c.offer_type) m.set(c.offer_type,(m.get(c.offer_type)||0)+c.num_offers);});
    return Array.from(m.entries()).map(([type,count])=>({type,count})).sort((a,b)=>b.count-a.count);
  },[companies]);

  const tiers = useMemo(()=>{
    const t={
      'T1 (40+ LPA)':{c:0,o:0,color:'#38bdf8'},
      'T2 (20-40 LPA)':{c:0,o:0,color:'#34d399'},
      'T3 (10-20 LPA)':{c:0,o:0,color:'#fbbf24'},
      'T4 (<10 LPA)':{c:0,o:0,color:'#a78bfa'},
    };
    companies.forEach(c=>{
      const p=c.package||0; const o=c.num_offers||0;
      if(p>=40){t['T1 (40+ LPA)'].c++;t['T1 (40+ LPA)'].o+=o;}
      else if(p>=20){t['T2 (20-40 LPA)'].c++;t['T2 (20-40 LPA)'].o+=o;}
      else if(p>=10){t['T3 (10-20 LPA)'].c++;t['T3 (10-20 LPA)'].o+=o;}
      else{t['T4 (<10 LPA)'].c++;t['T4 (<10 LPA)'].o+=o;}
    });
    return Object.entries(t).map(([name,d])=>({name, companies:d.c, offers:d.o, color:d.color}));
  },[companies]);

  const branchRecruit = useMemo(()=>{
    const m=new Map<string,{offers:number,cCount:number}>();
    companies.forEach(c=>{ c.branches?.forEach(b=>{ if(!m.has(b)) m.set(b,{offers:0,cCount:0}); const s=m.get(b)!; s.offers+=c.num_offers||0; s.cCount++; }); });
    return Array.from(m.entries()).map(([branch,s])=>({branch,offers:s.offers,companies:s.cCount})).sort((a,b)=>b.offers-a.offers).slice(0,10);
  },[companies]);

  const clearFilters = ()=>{ setFilters({offerType:[],minPackage:null,maxPackage:null,branches:[]}); setSearch(''); };
  const hasFilters = filters.offerType.length>0||filters.minPackage!==null||filters.maxPackage!==null||filters.branches.length>0||search.length>0;

  const toggleOT = (t:string)=>setFilters(f=>({...f,offerType:f.offerType.includes(t)?f.offerType.filter(x=>x!==t):[...f.offerType,t]}));
  const toggleBr = (b:string)=>setFilters(f=>({...f,branches:f.branches.includes(b)?f.branches.filter(x=>x!==b):[...f.branches,b]}));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          {label:'Total Offers',val:totalOffers.toLocaleString(),icon:<Briefcase className="w-5 h-5"/>,c:'#38bdf8',bg:'rgba(56,189,248,0.1)'},
          {label:'Active Recruiters',val:activeRecruiters.toString(),icon:<Building2 className="w-5 h-5"/>,c:'#34d399',bg:'rgba(52,211,153,0.1)'},
          {label:'Avg per Company',val:(totalOffers/(activeRecruiters||1)).toFixed(1),icon:<TrendingUp className="w-5 h-5"/>,c:'#fbbf24',bg:'rgba(251,191,36,0.1)'},
          {label:'Top Recruiter',val:topHiring[0]?.num_offers?.toString()||'0',icon:<Award className="w-5 h-5"/>,c:'#a78bfa',bg:'rgba(167,139,250,0.1)',sub:topHiring[0]?.name},
        ].map(k=>(
          <div key={k.label} className="stat-card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div style={{background:k.bg,borderRadius:10,padding:8,color:k.c}}>{k.icon}</div>
            </div>
            <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{k.label}</p>
            <p style={{fontSize:22,fontWeight:800,color:'white'}}>{k.val}</p>
            {k.sub&&<p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="chart-card">
          <h3 style={{fontSize:14,fontWeight:700,color:'white',marginBottom:4}}>Top Hiring Companies</h3>
          <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:16}}>By number of offers</p>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsBarChart data={topHiring} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#3d4260" tick={{fontSize:10}} />
              <YAxis dataKey="name" type="category" stroke="#3d4260" width={85} tick={{fontSize:10}} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v,_,p)=>[v,p.payload.name]} />
              <Bar dataKey="num_offers" radius={[0,5,5,0]}>
                {topHiring.map((_,i)=><Cell key={i} fill={C[i%C.length]} />)}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 style={{fontSize:14,fontWeight:700,color:'white',marginBottom:4}}>Offer Type Distribution</h3>
          <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:16}}>FTE vs Intern vs PPO</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={offerTypeDist} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="type" label={({name,percent})=>`${name} ${((percent||0)*100).toFixed(0)}%`} labelLine={false}>
                {offerTypeDist.map((_,i)=><Cell key={i} fill={C[i%C.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tier Analysis */}
      <div className="chart-card">
        <h3 style={{fontSize:14,fontWeight:700,color:'white',marginBottom:4}}>Company Tier Analysis</h3>
        <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:16}}>Companies and offers by package range</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {tiers.map((t,i)=>(
            <div key={t.name} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'16px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:t.color+'20', border:`1px solid ${t.color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:t.color }}>T{i+1}</span>
                </div>
                <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{t.name}</p>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>Companies</span>
                <span style={{ fontSize:13, fontWeight:700, color:'white' }}>{t.companies}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>Total Offers</span>
                <span style={{ fontSize:13, fontWeight:700, color:t.color }}>{t.offers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Branch chart */}
      <div className="chart-card">
        <h3 style={{fontSize:14,fontWeight:700,color:'white',marginBottom:4}}>Branch-wise Recruitment</h3>
        <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:16}}>Offers and companies by branch</p>
        <ResponsiveContainer width="100%" height={240}>
          <RechartsBarChart data={branchRecruit}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="branch" stroke="#3d4260" tick={{fontSize:9}} angle={-20} textAnchor="end" height={50} />
            <YAxis stroke="#3d4260" tick={{fontSize:11}} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="offers" name="Offers" fill="#38bdf8" radius={[4,4,0,0]} />
            <Bar dataKey="companies" name="Companies" fill="#34d399" radius={[4,4,0,0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Search & Filter Bar */}
      <div className="chart-card" style={{ padding:'16px 20px' }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:220, position:'relative' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search companies or roles…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
              className="field"
              style={{ paddingLeft:38 }}
            />
          </div>

          <div style={{ position:'relative' }}>
            <select value={sortField} onChange={e=>setSortField(e.target.value as any)} className="field" style={{ paddingRight:32, width:'auto', cursor:'pointer' }}>
              <option value="package">Sort: Package</option>
              <option value="name">Sort: Name</option>
              <option value="num_offers">Sort: Offers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:'var(--text-secondary)' }} />
          </div>

          <button onClick={()=>setSortOrder(s=>s==='asc'?'desc':'asc')} className="field" style={{ width:42, display:'flex', alignItems:'center', justifyContent:'center', padding:0, cursor:'pointer', flexShrink:0 }}>
            {sortOrder==='asc'?<SortAsc className="w-4 h-4" style={{color:'var(--text-secondary)'}} />:<SortDesc className="w-4 h-4" style={{color:'var(--text-secondary)'}} />}
          </button>

          <button
            onClick={()=>setShowFilters(!showFilters)}
            className="field"
            style={{ width:42, display:'flex', alignItems:'center', justifyContent:'center', padding:0, cursor:'pointer', flexShrink:0, borderColor: showFilters?'rgba(56,189,248,0.4)':'', color: showFilters?'#38bdf8':'' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={()=>setViewMode(v=>v==='cards'?'table':'cards')}
            className="field"
            style={{ width:42, display:'flex', alignItems:'center', justifyContent:'center', padding:0, cursor:'pointer', flexShrink:0 }}
          >
            {viewMode==='cards'?<LayoutList className="w-4 h-4" style={{color:'var(--text-secondary)'}}/>:<LayoutGrid className="w-4 h-4" style={{color:'var(--text-secondary)'}}/>}
          </button>
        </div>

        {showFilters && (
          <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 2fr', gap:20 }}>
              <div>
                <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8, fontWeight:500 }}>Offer Type</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {offerTypes.map(t=>(
                    <button key={t} onClick={()=>toggleOT(t)} style={{ padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', background:filters.offerType.includes(t)?'rgba(56,189,248,0.15)':'rgba(255,255,255,0.04)', border:filters.offerType.includes(t)?'1px solid rgba(56,189,248,0.3)':'1px solid rgba(255,255,255,0.06)', color:filters.offerType.includes(t)?'#38bdf8':'var(--text-secondary)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8, fontWeight:500 }}>Package Range (LPA)</p>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="number" placeholder="Min" value={filters.minPackage||''} onChange={e=>setFilters(f=>({...f,minPackage:e.target.value?Number(e.target.value):null}))} className="field" style={{ flex:1 }} />
                  <input type="number" placeholder="Max" value={filters.maxPackage||''} onChange={e=>setFilters(f=>({...f,maxPackage:e.target.value?Number(e.target.value):null}))} className="field" style={{ flex:1 }} />
                </div>
              </div>

              <div>
                <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8, fontWeight:500 }}>Branches</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, maxHeight:64, overflowY:'auto' }}>
                  {allBranches.map(b=>(
                    <button key={b} onClick={()=>toggleBr(b)} style={{ padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:500, cursor:'pointer', background:filters.branches.includes(b)?'rgba(56,189,248,0.15)':'rgba(255,255,255,0.04)', border:filters.branches.includes(b)?'1px solid rgba(56,189,248,0.3)':'1px solid rgba(255,255,255,0.06)', color:filters.branches.includes(b)?'#38bdf8':'var(--text-secondary)' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} style={{ marginTop:12, display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)', cursor:'pointer' }}>
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Count */}
      <p style={{ fontSize:13, color:'var(--text-secondary)' }}>
        Showing <span style={{ color:'white', fontWeight:600 }}>{filteredCompanies.length}</span> of{' '}
        <span style={{ color:'white', fontWeight:600 }}>{companies.length}</span> companies
      </p>

      {/* Cards / Table */}
      {viewMode==='cards' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {filteredCompanies.map(c=><CompanyCard key={c.id} company={c} />)}
        </div>
      ) : (
        <div className="chart-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th><th>Package</th><th>Stipend</th><th>Type</th><th>Offers</th><th>Branches</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.slice(0,40).map(c=>(
                  <tr key={c.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight:600, color:'white' }}>{c.name}</p>
                        <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{c.role}</p>
                      </div>
                    </td>
                    <td><span style={{ color:'#38bdf8', fontWeight:600 }}>{c.package||'-'} LPA</span></td>
                    <td><span style={{ color:'#34d399', fontWeight:600 }}>{c.stipend?`₹${(c.stipend/1000).toFixed(0)}K`:'–'}</span></td>
                    <td><span className={`pill ${c.offer_type==='FTE'?'pill-fte':c.offer_type==='Intern'?'pill-intern':'pill-ppo'}`}>{c.offer_type}</span></td>
                    <td><span style={{ color:'white', fontWeight:600 }}>{c.num_offers||0}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {c.branches?.slice(0,3).map(b=><span key={b} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.06)', borderRadius:5, fontSize:11, color:'var(--text-secondary)' }}>{b}</span>)}
                        {(c.branches?.length||0)>3&&<span style={{ fontSize:11, color:'var(--text-muted)' }}>+{c.branches!.length-3}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredCompanies.length===0&&(
        <div className="chart-card" style={{ textAlign:'center', padding:'48px 24px' }}>
          <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
          <p style={{ color:'var(--text-secondary)' }}>No companies found</p>
        </div>
      )}
    </div>
  );
}

function CompanyCard({ company: c }: { company: Company }) {
  const pillClass = c.offer_type==='FTE'?'pill-fte':c.offer_type==='Intern'?'pill-intern':'pill-ppo';
  return (
    <div className="company-card">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</h3>
          <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.role}</p>
        </div>
        {c.offer_type&&<span className={`pill ${pillClass}`} style={{ flexShrink:0, alignSelf:'flex-start' }}>{c.offer_type}</span>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        <div className="mini-stat">
          <p style={{ fontSize:10, color:'var(--text-muted)', marginBottom:4 }}>PACKAGE</p>
          <p style={{ fontSize:17, fontWeight:700, color:'#38bdf8' }}>{c.package?`${c.package} LPA`:'–'}</p>
        </div>
        <div className="mini-stat">
          <p style={{ fontSize:10, color:'var(--text-muted)', marginBottom:4 }}>STIPEND</p>
          <p style={{ fontSize:17, fontWeight:700, color:'#34d399' }}>{c.stipend?`₹${(c.stipend/1000).toFixed(0)}K`:'–'}</p>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {c.branches?.slice(0,3).map(b=><span key={b} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.05)', borderRadius:5, fontSize:10, color:'var(--text-secondary)' }}>{b}</span>)}
          {(c.branches?.length||0)>3&&<span style={{ fontSize:10, color:'var(--text-muted)' }}>+{c.branches!.length-3}</span>}
        </div>
        {c.num_offers>0&&(
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-secondary)' }}>
            <Users className="w-3.5 h-3.5" />{c.num_offers}
          </div>
        )}
      </div>
    </div>
  );
}
