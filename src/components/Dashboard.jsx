import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Activity, DollarSign, Zap, Key, TrendingUp, AlertTriangle } from 'lucide-react';
import { fetchUsage, fetchKeys } from '../lib/api';
import { format } from 'date-fns';

const COLORS = ['#5865F2', '#23d18b', '#e3b341', '#f14c4c', '#7c8ef7', '#52c4e8', '#f0a8d0'];

function StatCard({ title, value, sub, icon: Icon, color = 'blurple' }) {
  const colorMap = {
    blurple: 'text-blurple bg-blurple/10',
    green: 'text-success bg-success/10',
    yellow: 'text-warning bg-warning/10',
    red: 'text-error bg-error/10',
  };
  return (
    <div className="glass p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      {sub && <p className="text-xs text-text-secondary">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-sm border border-white/10">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.value < 1 ? `$${p.value.toFixed(4)}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: usage, isLoading: usageLoading } = useQuery({ queryKey: ['usage', 30], queryFn: () => fetchUsage(30) });
  const { data: keysData, isLoading: keysLoading } = useQuery({ queryKey: ['keys'], queryFn: fetchKeys });

  if (usageLoading || keysLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass h-24" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass h-64" />
          <div className="glass h-64" />
        </div>
      </div>
    );
  }

  const summary = usage?.summary || {};
  const dailyData = usage?.dailyData || [];
  const byProvider = usage?.byProvider || [];
  const activeKeys = keysData?.keys?.filter((k) => k.isActive)?.length || 0;
  const totalKeys = keysData?.keys?.length || 0;

  const providerPieData = byProvider.slice(0, 7).map((p, i) => ({
    name: p.provider,
    value: p.requests,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Your AI gateway overview — last 30 days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={summary.totalRequests?.toLocaleString() || '0'}
          sub="Last 30 days"
          icon={Activity}
          color="blurple"
        />
        <StatCard
          title="Total Cost"
          value={`$${(summary.totalCost || 0).toFixed(4)}`}
          sub="Estimated spend"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Tokens"
          value={summary.totalTokens >= 1e6 ? `${(summary.totalTokens / 1e6).toFixed(2)}M` : (summary.totalTokens?.toLocaleString() || '0')}
          sub="Input + Output"
          icon={Zap}
          color="yellow"
        />
        <StatCard
          title="Active Keys"
          value={`${activeKeys}/${totalKeys}`}
          sub="Provider API keys"
          icon={Key}
          color={activeKeys === 0 ? 'red' : 'blurple'}
        />
      </div>

      {activeKeys === 0 && (
        <div className="glass border border-warning/30 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-warning mt-0.5 shrink-0" />
          <div>
            <p className="text-text-primary font-medium text-sm">No API keys configured</p>
            <p className="text-text-secondary text-sm mt-0.5">
              Add provider API keys in the <a href="/keys" className="text-blurple hover:underline">Keys</a> section to start routing requests.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily requests */}
        <div className="lg:col-span-2 glass p-5">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blurple" />
            Daily Requests
          </h2>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5865F2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#606060', fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#606060', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#5865F2" fill="url(#reqGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-text-muted text-sm">No data yet — make your first request!</div>
          )}
        </div>

        {/* Provider pie */}
        <div className="glass p-5">
          <h2 className="section-title mb-4">By Provider</h2>
          {providerPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={providerPieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {providerPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => <span style={{ color: '#a0a0a0', fontSize: 11 }}>{v}</span>}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-text-muted text-sm">No providers used yet</div>
          )}
        </div>
      </div>

      {/* Top providers table */}
      {byProvider.length > 0 && (
        <div className="glass p-5">
          <h2 className="section-title mb-4">Provider Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-text-muted font-medium pb-2">Provider</th>
                  <th className="text-right text-text-muted font-medium pb-2">Requests</th>
                  <th className="text-right text-text-muted font-medium pb-2">Tokens</th>
                  <th className="text-right text-text-muted font-medium pb-2">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {byProvider.map((row) => (
                  <tr key={row.provider} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-medium text-text-primary capitalize">{row.provider}</td>
                    <td className="py-2.5 text-right text-text-secondary">{row.requests.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-text-secondary">{row.tokens.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-success">${row.cost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
