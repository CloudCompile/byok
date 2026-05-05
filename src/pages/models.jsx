import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Image, Volume2, Zap, Tag, Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { getCatalog, TIER_LABELS } from '../lib/models-catalog';

const catalog = getCatalog();

function formatPrice(val) {
  if (val === 0) return 'Free';
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return `$${val.toFixed(3)}`;
}

function PricingCell({ pricing }) {
  if (!pricing) return <span className="text-text-muted text-xs">—</span>;

  if (pricing.type === 'image') {
    return (
      <span className="text-xs font-mono text-purple-400">
        {formatPrice(pricing.cost_per_image || 0)}/img
      </span>
    );
  }

  if (pricing.type === 'audio') {
    return (
      <span className="text-xs font-mono text-orange-400">
        {formatPrice(pricing.cost_per_minute || 0)}/min
      </span>
    );
  }

  return (
    <span className="text-xs font-mono">
      <span className="text-success">{formatPrice(pricing.input)}</span>
      <span className="text-text-muted"> / </span>
      <span className="text-warning">{formatPrice(pricing.output)}</span>
      {pricing.cached_input != null && (
        <span className="text-text-muted ml-1">({formatPrice(pricing.cached_input)} cached)</span>
      )}
    </span>
  );
}

function TypeBadge({ type }) {
  if (!type || type === 'text') return null;
  if (type === 'image') return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
      <Image size={10} /> image
    </span>
  );
  if (type === 'audio') return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
      <Volume2 size={10} /> audio
    </span>
  );
  return null;
}

function PrefixCopy({ prefix }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(prefix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title="Copy provider prefix"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs bg-blurple/10 text-blurple border border-blurple/20 hover:bg-blurple/20 transition-all"
    >
      {prefix}
      {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
    </button>
  );
}

function ProviderCard({ provider, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const hasModels = provider.models.length > 0;

  return (
    <div className="glass overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-all text-left"
      >
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: provider.color === '#ffffff' ? '#6b7280' : provider.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-text-primary text-sm">{provider.displayName}</span>
            <span className="badge badge-blue text-xs">{TIER_LABELS[provider.tier] || provider.tier}</span>
            <PrefixCopy prefix={provider.prefix} />
          </div>
          {provider.defaultPricing && (
            <div className="mt-0.5 text-xs text-text-muted">
              Default: <PricingCell pricing={provider.defaultPricing} />
              {!hasModels && ' (all models)'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasModels && (
            <span className="text-xs text-text-muted">{provider.models.length} models</span>
          )}
          {open ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
        </div>
      </button>

      {open && hasModels && (
        <div className="border-t border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-text-muted border-b border-white/5">
                <th className="text-left px-5 py-2 font-medium">Model ID</th>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Input / Output (per 1M tokens)</th>
                {provider.models.some((m) => m.cached_input != null) && (
                  <th className="text-left px-3 py-2 font-medium">Cached Input</th>
                )}
              </tr>
            </thead>
            <tbody>
              {provider.models.map((model) => (
                <tr key={model.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-2.5 font-mono text-xs text-text-primary">{model.id}</td>
                  <td className="px-3 py-2.5"><TypeBadge type={model.type} /></td>
                  <td className="px-3 py-2.5"><PricingCell pricing={model} /></td>
                  {provider.models.some((m) => m.cached_input != null) && (
                    <td className="px-3 py-2.5 font-mono text-xs text-blurple">
                      {model.cached_input != null ? formatPrice(model.cached_input) : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const TIERS = Object.keys(TIER_LABELS);

export default function Models() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return catalog.filter((p) => {
      const matchTier = tierFilter === 'all' || p.tier === tierFilter;
      if (!matchTier) return false;
      if (!q) return true;
      if (p.displayName.toLowerCase().includes(q) || p.id.includes(q)) return true;
      return p.models.some((m) => m.id.toLowerCase().includes(q));
    });
  }, [search, tierFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Models & Pricing</h1>
        <p className="text-text-secondary text-sm mt-1">
          All supported providers with per-token pricing. Use{' '}
          <code className="font-mono text-blurple bg-blurple/10 px-1 rounded">@provider/model</code>{' '}
          in your requests to target a specific provider explicitly.
        </p>
      </div>

      {/* Legend */}
      <div className="glass p-4 border border-blurple/20 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5"><span className="text-success font-mono font-medium">$X.XXX</span> Input price per 1M tokens</span>
        <span className="flex items-center gap-1.5"><span className="text-warning font-mono font-medium">$X.XXX</span> Output price per 1M tokens</span>
        <span className="flex items-center gap-1.5"><span className="text-blurple font-mono font-medium">$X.XXX</span> Cached input price per 1M tokens</span>
        <span className="flex items-center gap-1.5"><span className="text-purple-400 font-mono font-medium">$X.XX/img</span> Per image (image models)</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input pl-9"
            placeholder="Search providers or model IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
        >
          <option value="all">All tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>{TIER_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted">
        {filtered.length} provider{filtered.length !== 1 ? 's' : ''} shown
        {search && ` matching "${search}"`}
      </p>

      {/* Provider cards */}
      <div className="space-y-2">
        {filtered.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            defaultOpen={!!search}
          />
        ))}
        {filtered.length === 0 && (
          <div className="glass p-10 text-center">
            <Tag size={36} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No providers match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
