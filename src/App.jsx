import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Shield, Map, Activity, FileText, Menu, X, Home, 
  AlertTriangle, Search, Database, ChevronRight, BrainCircuit,
  Clock, Filter, Download, Bell, Layers, Cpu, Radio, Calendar, Users
} from 'lucide-react';

// --- DATA FROM REPORT (APPROXIMATED & STRUCTURED) ---

// 1. Temporal Data (Updated with Arrests for Efficiency Chart)
const fullTemporalData = [
  { year: '2000', count: 7500, arrests: 2100 }, { year: '2001', count: 7400, arrests: 2050 }, 
  { year: '2002', count: 7300, arrests: 2000 }, { year: '2003', count: 7280, arrests: 1980 },
  { year: '2004', count: 7250, arrests: 1950 }, { year: '2005', count: 7220, arrests: 1920 },
  { year: '2006', count: 7200, arrests: 1900 }, { year: '2007', count: 7100, arrests: 1850 },
  { year: '2008', count: 7000, arrests: 1800 }, { year: '2009', count: 6950, arrests: 1780 },
  { year: '2010', count: 6900, arrests: 1750 }, { year: '2011', count: 6850, arrests: 1700 },
  { year: '2012', count: 6800, arrests: 1600 }, { year: '2013', count: 6700, arrests: 1550 },
  { year: '2014', count: 6600, arrests: 1500 }, { year: '2015', count: 6400, arrests: 1400 },
  { year: '2016', count: 6200, arrests: 1200 }, { year: '2017', count: 6180, arrests: 1150 },
  { year: '2018', count: 6150, arrests: 1100 }, { year: '2019', count: 6100, arrests: 1050 }, 
  { year: '2020', count: 5200, arrests: 800 }, { year: '2021', count: 4800, arrests: 750 }, 
  { year: '2022', count: 2100, arrests: 400 }, 
];

// 2. Pareto Data
const crimeTypesData = [
  { name: 'Battery', count: 7900 },
  { name: 'Narcotics', count: 7850 },
  { name: 'Assault', count: 7800 },
  { name: 'Weapons', count: 7750 },
  { name: 'Theft', count: 7700 },
  { name: 'Trespass', count: 7600 },
  { name: 'Damage', count: 7500 },
  { name: 'Robbery', count: 7200 },
];

// 3. Severity Data
const severityData = [
  { name: 'Severe', value: 68588, color: '#ef4444' }, // Red
  { name: 'Moderate', value: 44244, color: '#f59e0b' }, // Amber
  { name: 'Minor', value: 25561, color: '#10b981' }, // Emerald
];

// 4. Radar Data
const radarData = [
  { subject: 'Kidnapping', A: 50, fullMark: 350 },
  { subject: 'Liquor Law', A: 350, fullMark: 350 }, 
  { subject: 'Assault', A: 300, fullMark: 350 },
  { subject: 'Arson', A: 80, fullMark: 350 },
  { subject: 'Homicide', A: 40, fullMark: 350 },
];

// 5. Hourly Trends (Simulated)
const hourlyData = [
  { time: '00:00', incidents: 120 }, { time: '04:00', incidents: 40 },
  { time: '08:00', incidents: 85 }, { time: '12:00', incidents: 150 },
  { time: '16:00', incidents: 190 }, { time: '20:00', incidents: 240 },
];

// 6. Monthly Seasonality (Simulated from Histogram Analysis pg 9)
const monthlyData = [
  { name: 'Jan', count: 580 }, { name: 'Feb', count: 540 },
  { name: 'Mar', count: 600 }, { name: 'Apr', count: 620 },
  { name: 'May', count: 650 }, { name: 'Jun', count: 680 },
  { name: 'Jul', count: 700 }, { name: 'Aug', count: 710 }, // Peak mentioned in report
  { name: 'Sep', count: 660 }, { name: 'Oct', count: 690 }, // Peak mentioned in report
  { name: 'Nov', count: 600 }, { name: 'Dec', count: 590 },
];

// 7. Association Rules
const associationRules = [
  { id: 1, source: 'Battery', target: 'Assault', conf: '1.00', lift: '1.00' },
  { id: 2, source: 'Narcotics', target: 'Theft', conf: '0.99', lift: '1.00' },
  { id: 3, source: 'Trespass', target: 'Assault', conf: '0.99', lift: '1.00' },
  { id: 4, source: 'Weapons', target: 'Battery', conf: '0.98', lift: '1.01' },
];

// 8. Cluster Data
const clusterData = [
  { id: 1, x: 60, y: 30, label: 'North Side (Theft)', color: '#3b82f6', size: 400 },
  { id: 2, x: 45, y: 45, label: 'West Side (Narcotics)', color: '#ef4444', size: 600 },
  { id: 3, x: 55, y: 55, label: 'Central (Battery)', color: '#10b981', size: 500 },
  { id: 4, x: 70, y: 70, label: 'South Side (Assault)', color: '#f59e0b', size: 550 },
  { id: 5, x: 40, y: 20, label: 'Far North (Fraud)', color: '#8b5cf6', size: 300 },
  { id: 6, x: 30, y: 60, label: 'West Suburbs (Damage)', color: '#ec4899', size: 450 },
  { id: 7, x: 65, y: 85, label: 'Far South (Weapons)', color: '#6366f1', size: 350 },
];

// 9. Recent Alerts
const recentAlerts = [
  { id: 1, type: 'Battery', loc: 'Cluster 3', time: '10m ago' },
  { id: 2, type: 'Theft', loc: 'Cluster 1', time: '24m ago' },
  { id: 3, type: 'Narcotics', loc: 'Cluster 2', time: '1h ago' },
  { id: 4, type: 'Assault', loc: 'Cluster 4', time: '2h ago' },
];

// 10. Model Performance Data
const modelPerformance = [
  { name: 'Decision Tree', accuracy: 48.72, precision: 0.49, recall: 0.45, f1: 0.47, color: '#3b82f6' },
  { name: 'Naive Bayes', accuracy: 53.54, precision: 0.55, recall: 0.67, f1: 0.61, color: '#8b5cf6' },
  { name: 'SVC', accuracy: 52.98, precision: 0.57, recall: 0.64, f1: 0.60, color: '#ec4899' },
];


// --- UI COMPONENTS ---

const Card = ({ title, children, className = "", action }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col ${className}`}>
    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
      <h3 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
        {title}
      </h3>
      {action}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const Metric = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4 hover:border-slate-600 hover:bg-slate-750 transition-all duration-300 cursor-default group shadow-lg">
    <div className={`p-3 rounded-lg bg-opacity-20 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);

// --- SECTIONS ---

const DashboardView = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [displayData, setDisplayData] = useState(fullTemporalData);

  useEffect(() => {
    if (timeFilter === '5yr') {
      setDisplayData(fullTemporalData.slice(-6));
    } else if (timeFilter === '10yr') {
      setDisplayData(fullTemporalData.slice(-11));
    } else {
      setDisplayData(fullTemporalData);
    }
  }, [timeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Executive Overview</h2>
          <p className="text-slate-400 text-sm">Real-time analysis of crime trends and predictive insights.</p>
        </div>
        <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex text-sm">
          <button onClick={() => setTimeFilter('all')} className={`px-3 py-1.5 rounded-md transition-all ${timeFilter === 'all' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>All Time</button>
          <button onClick={() => setTimeFilter('10yr')} className={`px-3 py-1.5 rounded-md transition-all ${timeFilter === '10yr' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Last 10 Years</button>
          <button onClick={() => setTimeFilter('5yr')} className={`px-3 py-1.5 rounded-md transition-all ${timeFilter === '5yr' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Last 5 Years</button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Total Incidents" value="138,393" sub="Sampled Dataset" icon={Database} color="bg-blue-500 text-blue-500" />
        <Metric label="Top Crime" value="Battery" sub="~7,900 Cases" icon={AlertTriangle} color="bg-red-500 text-red-500" />
        <Metric label="Safest Year" value="2022" sub="Lowest Count" icon={Shield} color="bg-emerald-500 text-emerald-500" />
        <Metric label="Best Model" value="53.54%" sub="Naive Bayes" icon={BrainCircuit} color="bg-purple-500 text-purple-500" />
      </div>

      {/* Row 1: Main Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card title="Temporal Trends & Arrests" className="lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArrest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" name="Total Incidents" />
                <Area type="monotone" dataKey="arrests" stroke="#10b981" fillOpacity={1} fill="url(#colorArrest)" name="Arrests Made" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-400 mt-4 italic flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Visualizing the gap between reported incidents and enforcement actions over time.
          </p>
        </Card>

        {/* Live Alerts Feed */}
        <Card title="Recent Activity" action={<div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded animate-pulse flex gap-1 items-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/>LIVE</div>}>
          <div className="h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded border border-slate-700 hover:border-slate-500 transition-colors">
                <div className="bg-slate-800 p-2 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{alert.type} Reported</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <Map className="w-3 h-3" /> {alert.loc} • <Clock className="w-3 h-3" /> {alert.time}
                  </p>
                </div>
              </div>
            ))}
            <div className="p-3 bg-blue-900/20 rounded border border-blue-800 text-xs text-blue-300">
              System monitoring active clusters for anomalies.
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Heatmap & Seasonality (New Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Hourly Risk Heatmap">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="incidents" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Avg Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Peak criminal activity observed during evening hours (20:00).</p>
        </Card>

        <Card title="Monthly Seasonality">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[500, 800]} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{r:3}} name="Avg Count" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Crime rates peak in August/October as noted in descriptive analysis.</p>
        </Card>
      </div>

      {/* Row 3: Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Crime Severity">
          <div className="h-64 w-full flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4 pointer-events-none">
              <span className="text-3xl font-bold text-white block">68.5k</span>
              <span className="text-xs text-slate-400">Severe</span>
            </div>
          </div>
        </Card>

        <Card title="Pareto Analysis (Top Types)" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crimeTypesData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const GeospatialView = () => {
  const [activeCluster, setActiveCluster] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Geospatial Intelligence</h2>
        <div className="flex gap-2">
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30">K-Means Active</span>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30">DBSCAN Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Simulation */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group shadow-inner">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 200,50 L 300,50 L 350,150 L 320,400 L 250,550 L 150,500 L 150,300 L 200,200 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="absolute inset-0 p-10">
            {clusterData.map((cluster) => (
              <div 
                key={cluster.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 z-10"
                style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                onMouseEnter={() => setActiveCluster(cluster)}
                onMouseLeave={() => setActiveCluster(null)}
              >
                <div 
                  className={`rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-pulse`} 
                  style={{ backgroundColor: cluster.color, width: `${cluster.size / 15}px`, height: `${cluster.size / 15}px` }} 
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded text-xs text-slate-400 border border-slate-600">Interactive Map Simulation</div>
        </div>

        {/* Cluster Details */}
        <Card title="Cluster Analysis" className="h-full">
          <div className="h-full flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-6">Hover over map points for details.</p>
              {activeCluster ? (
                <div className="bg-slate-700/50 p-5 rounded-lg border border-slate-600 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: activeCluster.color }} />
                    <h4 className="font-bold text-white text-lg">{activeCluster.label}</h4>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between border-b border-slate-600/50 pb-2"><span>Dominant Crime:</span><span className="text-white font-medium">{activeCluster.label.split('(')[1].replace(')', '')}</span></div>
                    <div className="flex justify-between border-b border-slate-600/50 pb-2"><span>Incident Volume:</span><span className="text-white font-medium">{activeCluster.size}</span></div>
                    <div className="flex justify-between"><span>Density Score:</span><span className="text-emerald-400 font-mono">0.89</span></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-lg bg-slate-800/50"><Map className="w-10 h-10 mb-3 opacity-30" /><p className="text-sm">Select a cluster</p></div>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400"/> Algorithm Insights
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>K-Means</strong> successfully partitioned the city into 7 distinct spatial zones. 
                <strong> DBSCAN</strong> was superior in identifying arbitrary shaped clusters along major thoroughfares.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ModelsView = () => {
  const [selectedModel, setSelectedModel] = useState('nb'); 
  const [inputs, setInputs] = useState({ arrest: 'false', location: 'street', time: 'night' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulation Logic based on report accuracies
      let baseAcc = modelPerformance.find(m => m.name === (selectedModel === 'nb' ? 'Naive Bayes' : selectedModel === 'dt' ? 'Decision Tree' : 'SVC')).accuracy;
      let resultType = 'Battery';
      let confidence = baseAcc;

      if (selectedModel === 'dt') {
        if (inputs.arrest === 'true') { resultType = 'Narcotics'; confidence += 15; }
        else { confidence -= 5; }
      } else if (selectedModel === 'nb') {
        if (inputs.location === 'residence') { resultType = 'Domestic'; confidence += 8; }
        else if (inputs.location === 'retail') { resultType = 'Theft'; confidence += 12; }
      } else {
        if (inputs.arrest === 'true' && inputs.location === 'street') { resultType = 'Weapons'; confidence += 10; }
      }

      setPrediction({ type: resultType, conf: confidence.toFixed(1) });
      setLoading(false);
    }, 800);
  };

  const activeModelData = modelPerformance.find(m => m.name === (selectedModel === 'nb' ? 'Naive Bayes' : selectedModel === 'dt' ? 'Decision Tree' : 'SVC'));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Predictive Modeling & AI</h2>
        <p className="text-slate-400 text-sm">Compare algorithms and run real-time predictions.</p>
      </div>
      
      {/* Model Comparison Chart */}
      <Card title="Model Performance Comparison">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelPerformance} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 60]} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
              <RechartsTooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                {modelPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Model Selector */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-lg flex flex-wrap gap-2">
        <button onClick={() => { setSelectedModel('nb'); setPrediction(null); }} className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedModel === 'nb' ? 'bg-slate-700 text-white shadow-md border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'}`}>Naive Bayes</button>
        <button onClick={() => { setSelectedModel('dt'); setPrediction(null); }} className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedModel === 'dt' ? 'bg-slate-700 text-white shadow-md border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'}`}>Decision Tree</button>
        <button onClick={() => { setSelectedModel('svc'); setPrediction(null); }} className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedModel === 'svc' ? 'bg-slate-700 text-white shadow-md border border-slate-600' : 'text-slate-400 hover:bg-slate-700/50'}`}>SVC</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metrics Panel */}
        <Card title={`${activeModelData.name} Metrics`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg text-center border border-slate-700/50"><div className="text-xs text-slate-500 uppercase">Accuracy</div><div className="text-2xl font-bold text-white">{activeModelData.accuracy}%</div></div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center border border-slate-700/50"><div className="text-xs text-slate-500 uppercase">F1-Score</div><div className="text-2xl font-bold text-white">{activeModelData.f1}</div></div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center border border-slate-700/50"><div className="text-xs text-slate-500 uppercase">Precision</div><div className="text-2xl font-bold text-white">{activeModelData.precision}</div></div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center border border-slate-700/50"><div className="text-xs text-slate-500 uppercase">Recall</div><div className="text-2xl font-bold text-white">{activeModelData.recall}</div></div>
          </div>
        </Card>

        {/* Prediction Lab */}
        <Card title="Prediction Lab" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Arrest Made?</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white" value={inputs.arrest} onChange={(e) => setInputs({...inputs, arrest: e.target.value})}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Location</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white" value={inputs.location} onChange={(e) => setInputs({...inputs, location: e.target.value})}>
                  <option value="street">Street</option>
                  <option value="residence">Residence</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
              <button onClick={handlePredict} disabled={loading} className={`w-full py-3 ${activeModelData.color.replace('bg-', 'bg-')} hover:opacity-90 text-white rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2`}>
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <>Run {activeModelData.name}</>}
              </button>
            </div>

            {/* Output */}
            <div className={`flex flex-col justify-center items-center p-6 rounded-xl border-2 border-dashed transition-all duration-500 ${prediction ? 'bg-slate-900/50 border-emerald-500/50' : 'bg-slate-900/20 border-slate-800'}`}>
              {prediction ? (
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="text-sm text-slate-400 mb-1">Predicted Crime Type</div>
                  <div className="text-3xl font-bold text-white mb-2">{prediction.type.toUpperCase()}</div>
                  <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700">
                    Confidence: <span className="text-emerald-400 font-mono font-bold">{prediction.conf}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-600"><BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="text-sm">Configure inputs and run the model.</p></div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Rules */}
      <Card title="Association Rule Mining (Apriori)">
        <p className="text-slate-400 text-sm mb-4">Top associations found in dataset. <span className="text-emerald-400 ml-1 text-xs">Threshold: Support {'>'} 0.5</span></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {associationRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono text-blue-400">{rule.source}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="font-mono text-emerald-400">{rule.target}</span>
              </div>
              <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Conf: {rule.conf}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// --- MAIN APP SHELL ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Inject Tailwind CDN dynamically for immediate styling
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'geo', label: 'Geospatial Map', icon: Map },
    { id: 'models', label: 'Models & AI', icon: BrainCircuit },
  ];

  return (
   <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex">      
      {/* Sidebar */}
      <aside
  className={`
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    fixed lg:static
    inset-y-0 left-0
    z-50 w-64
    bg-slate-900 border-r border-slate-800
    transform transition-transform duration-300 ease-in-out
    flex flex-col
  `}
>

        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900 shrink-0">
          <Shield className="w-6 h-6 text-blue-500 mr-2" />
          <h1 className="font-bold text-lg text-white tracking-tight">Crime<span className="text-blue-500">Hub</span></h1>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-lg transition-colors cursor-default opacity-50 hover:opacity-100">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">AT</div>
            <div><p className="text-sm font-bold text-slate-300">Analytics Team</p><p className="text-[10px] text-slate-500 uppercase tracking-wide">Chicago Division</p></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col min-h-screen relative bg-slate-950 lg:ml-64">
        <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-40 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white"><Menu className="w-6 h-6" /></button>
          <h2 className="text-xl font-bold text-white hidden md:block tracking-tight">{navItems.find(n => n.id === activeTab)?.label}</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => alert("Simulating Report Download...")} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded border border-slate-700 transition-all"><Download className="w-3 h-3" /> Export Report</button>
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition-colors group">
              <Search className="w-4 h-4 text-slate-500 mr-2 group-hover:text-blue-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-white w-32 placeholder-slate-600 focus:w-48 transition-all duration-300" />
            </div>
            <button className="p-2 text-slate-400 hover:text-white relative group"><div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" /><Bell className="w-5 h-5 group-hover:text-blue-400 transition-colors" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="w-full pb-8">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'geo' && <GeospatialView />}
            {activeTab === 'models' && <ModelsView />}
          </div>
          <footer className="mt-8 text-center text-xs text-slate-600 border-t border-slate-800 pt-6">
            <p>© 2025 Chicago Crime Analysis Project • Powered by React & PySpark Analysis</p>
            <p className="mt-1 text-slate-700">Data based on internal report "ADS_REPORT (3).pdf"</p>
          </footer>
        </div>
        
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      </main>
    </div>
  );
};

export default App;