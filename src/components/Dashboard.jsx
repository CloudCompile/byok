import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Activity, DollarSign, Zap, Key, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { fetchUsage, fetchKeys } from '../lib/api';

const COLORS = ['#5865F2', '#10a37f', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function StatCard({ title, value, sub, icon: Icon, color = 'blurple' }) {
  const colorMap = {
    blurple: { bg: 'bg-blurple/10', icon: 'text-blurple', border: 'border-blurple/20' },
    green: { bg: 'bg-success/10', icon: 'text-success', border: 'border-success/20' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/20' },
    orange: { bg: 'bg-warning/10', icon: 'text-warning', border: 'border-warning/20' },
    red: { bg: 'bg-error/10', icon: 'text-error', border: 'border-error/20' },
  };
  const colors = colorMap[color];

  return (
    <div className={`bg-white/[0.02] border ${colors.border} rounded-xl p-6 hover:border-white/30 transition-colors`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-3">{value}</p>
          <p className="text-xs text-text-muted mt-2">{sub}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/80 backdrop-blur border border-white/20 rounded-lg p-3 text-sm">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
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
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white/5 rounded-xl" />
          <div className="h-72 bg-white/5 rounded-xl" />
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">Monitor your AI API gateway usage and costs in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={summary.totalRequests?.toLocaleString() || '0'}
          sub="Last 30 days"
          icon={Activity}
          color="blurple"
        />
        <StatCard
          title="Total Cost"
          value={`$${(summary.totalCost || 0).toFixed(2)}`}
          sub={summary.avgRequestCost ? `${summary.avgRequestCost.toFixed(4)}/req avg` : 'Estimated'}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Input Tokens"
          value={`${(summary.totalInputTokens / 1e6 || 0).toFixed(2)}M`}
          sub={summary.avgInputPerRequest ? `${summary.avgInputPerRequest.toLocaleString()}/req` : 'Total'}
          icon={Zap}
          color="blue"
        />
        <StatCard
          title="Output Tokens"
          value={`${(summary.totalOutputTokens / 1e6 || 0).toFixed(2)}M`}
          sub={summary.avgOutputPerRequest ? `${summary.avgOutputPerRequest.toLocaleString()}/req` : 'Total'}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Alert */}
      {activeKeys === 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-text-primary font-semibold">Get started with your first API key</p>
            <p className="text-text-secondary text-sm mt-1">Add provider API keys to start routing requests through the gateway.</p>
            <a href="/keys" className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 font-medium text-sm">
              Add API Keys <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily requests */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Request Volume</h2>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5865F2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#5865F2" fill="url(#reqGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted">No data yet</div>
          )}
        </div>

        {/* Provider pie */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">By Provider</h2>
          {providerPieData.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={providerPieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75}
                    dataKey="value" paddingAngle={2}>
                    {providerPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {providerPieData.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-text-secondary capitalize">{p.name}</span>
                    </div>
                    <span className="text-text-primary font-medium">{((p.value / providerPieData.reduce((sum, x) => sum + x.value, 0)) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-text-muted">No providers used yet</div>
          )}
        </div>
      </div>

      {/* Top providers table */}
      {byProvider.length > 0 && (
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Provider Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-text-secondary font-medium py-3">Provider</th>
                  <th className="text-right text-text-secondary font-medium py-3">Requests</th>
                  <th className="text-right text-text-secondary font-medium py-3">Tokens</th>
                  <th className="text-right text-text-secondary font-medium py-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {byProvider.map((row) => (
                  <tr key={row.provider} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-text-primary font-medium capitalize">{row.provider}</td>
                    <td className="py-3 text-right text-text-secondary">{row.requests.toLocaleString()}</td>
                    <td className="py-3 text-right text-text-secondary">{(row.tokens / 1e6).toFixed(2)}M</td>
                    <td className="py-3 text-right font-mono text-success font-medium">${row.cost.toFixed(2)}</td>
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
