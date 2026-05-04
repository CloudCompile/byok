import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, DollarSign, Zap, BarChart2 } from 'lucide-react';
import { fetchUsage } from '../lib/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-xs border border-white/10">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.value < 0.01 ? `$${p.value.toFixed(5)}` : p.value?.toLocaleString?.() ?? p.value}
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#5865F2', '#23d18b', '#e3b341', '#f14c4c', '#7c8ef7', '#52c4e8'];

export default function Analytics() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({ queryKey: ['usage', days], queryFn: () => fetchUsage(days) });

  const daily = data?.dailyData || [];
  const byProvider = data?.byProvider || [];
  const byModel = data?.byModel?.slice(0, 10) || [];
  const summary = data?.summary || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-text-secondary text-sm mt-1">Detailed usage breakdown</p>
        </div>
        <select className="input w-auto" value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Requests', value: summary.totalRequests?.toLocaleString() || '0', icon: BarChart2, color: '#5865F2' },
          { label: 'Tokens', value: summary.totalTokens >= 1e6 ? `${(summary.totalTokens / 1e6).toFixed(2)}M` : summary.totalTokens?.toLocaleString() || '0', icon: Zap, color: '#e3b341' },
          { label: 'Cost', value: `$${(summary.totalCost || 0).toFixed(4)}`, icon: DollarSign, color: '#23d18b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-text-muted">{label}</p>
              <p className="text-lg font-semibold text-text-primary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily requests + cost */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-5">
          <h2 className="section-title mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-blurple" />Daily Requests</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={daily} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5865F2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="requests" name="Requests" stroke="#5865F2" fill="url(#g1)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-5">
          <h2 className="section-title mb-4 flex items-center gap-2"><DollarSign size={15} className="text-success" />Daily Cost</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={daily} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#23d18b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#23d18b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cost" name="Cost ($)" stroke="#23d18b" fill="url(#g2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By provider bar chart */}
      {byProvider.length > 0 && (
        <div className="glass p-5">
          <h2 className="section-title mb-4">Requests by Provider</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byProvider} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="provider" tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#606060', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" name="Requests" fill="#5865F2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top models */}
      {byModel.length > 0 && (
        <div className="glass p-5">
          <h2 className="section-title mb-4">Top Models</h2>
          <div className="space-y-2">
            {byModel.map((m, i) => {
              const max = byModel[0].requests;
              return (
                <div key={m.model} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-5 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-mono text-text-primary truncate max-w-[200px]">{m.model}</span>
                      <span className="text-xs text-text-secondary">{m.requests} reqs</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blurple rounded-full" style={{ width: `${(m.requests / max) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-success w-20 text-right">${m.cost.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
