import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { fetchUsage } from '../lib/api';
import clsx from 'clsx';

function StatusBadge({ code }) {
  if (code >= 200 && code < 300) return <span className="badge badge-green flex items-center gap-1"><CheckCircle size={10} />{code}</span>;
  if (code >= 400) return <span className="badge badge-red flex items-center gap-1"><XCircle size={10} />{code}</span>;
  return <span className="badge badge-yellow">{code}</span>;
}

export default function RequestHistory() {
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [days, setDays] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ['usage', days],
    queryFn: () => fetchUsage(days, 200),
  });

  const logs = data?.recentLogs || [];
  const providers = [...new Set(logs.map((l) => l.provider))];

  const filtered = logs.filter((l) => {
    if (search && !l.model?.toLowerCase().includes(search.toLowerCase()) && !l.provider?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProvider && l.provider !== filterProvider) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Request History</h1>
        <p className="text-text-secondary text-sm mt-1">Recent API requests routed through your gateway</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input pl-9"
            placeholder="Search model or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
          <option value="">All providers</option>
          {providers.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input w-auto" value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
          <option value={1}>Last 24h</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Clock size={36} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No requests found</p>
            <p className="text-text-muted text-sm mt-1">Make your first request to see it here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left text-text-muted font-medium px-4 py-3">Time</th>
                  <th className="text-left text-text-muted font-medium px-4 py-3">Model</th>
                  <th className="text-left text-text-muted font-medium px-4 py-3">Provider</th>
                  <th className="text-right text-text-muted font-medium px-4 py-3">Tokens</th>
                  <th className="text-right text-text-muted font-medium px-4 py-3">Cost</th>
                  <th className="text-right text-text-muted font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((log) => (
                  <tr key={log.$id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-primary max-w-[160px] truncate">{log.model}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-blue capitalize">{log.provider}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      {((log.tokensInput || 0) + (log.tokensOutput || 0)).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-success">
                      {log.estimatedCost > 0 ? `$${log.estimatedCost.toFixed(5)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge code={log.statusCode || 200} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/10 text-xs text-text-muted">
            Showing {filtered.length} of {logs.length} requests
          </div>
        )}
      </div>
    </div>
  );
}
