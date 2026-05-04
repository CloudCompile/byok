import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, GitBranch, ArrowRight, Info, X } from 'lucide-react';
import { fetchRules, createRule, updateRule, deleteRule, fetchProviders } from '../lib/api';
import clsx from 'clsx';

const CONDITIONS = [
  { value: 'always', label: 'Always (catch-all)' },
  { value: 'model_prefix', label: 'Model starts with' },
  { value: 'model_exact', label: 'Model equals' },
  { value: 'model_contains', label: 'Model contains' },
];

function RuleRow({ rule, providers, onToggle, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const cond = CONDITIONS.find((c) => c.value === rule.condition);
  const target = providers?.find((p) => p.id === rule.targetProvider);
  const fallback = providers?.find((p) => p.id === rule.fallbackProvider);

  return (
    <div className={clsx('glass p-4 flex items-center gap-4', !rule.isActive && 'opacity-50')}>
      <div className="w-6 h-6 rounded bg-blurple/20 text-blurple text-xs flex items-center justify-center font-mono shrink-0">
        {rule.priority || 0}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-text-primary text-sm">{rule.name}</span>
          {!rule.isActive && <span className="badge badge-red">Disabled</span>}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted flex-wrap">
          <span>{cond?.label || rule.condition}</span>
          {rule.conditionValue && <><span className="font-mono text-blurple">"{rule.conditionValue}"</span></>}
          <ArrowRight size={10} />
          <span className="text-success">{target?.displayName || rule.targetProvider}</span>
          {fallback && <><span>→ fallback:</span><span className="text-warning">{fallback?.displayName || rule.fallbackProvider}</span></>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(rule.$id, rule.isActive)}
          className={clsx('px-2 py-1 rounded text-xs font-medium transition-all',
            rule.isActive ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-white/5 text-text-muted hover:bg-white/10')}
        >
          {rule.isActive ? 'Active' : 'Disabled'}
        </button>
        {showDelete ? (
          <div className="flex gap-1">
            <button onClick={() => onDelete(rule.$id)} className="btn-danger text-xs py-1 px-2">Confirm</button>
            <button onClick={() => setShowDelete(false)} className="btn-secondary text-xs py-1 px-2">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowDelete(true)} className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function AddRuleModal({ onClose, onAdd, providers }) {
  const [form, setForm] = useState({ name: '', condition: 'model_prefix', conditionValue: '', targetProvider: '', fallbackProvider: '', priority: 0 });

  const needsValue = form.condition !== 'always';

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass w-full max-w-lg animate-slide-up border border-white/10">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="section-title">Add Routing Rule</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="glass border border-blurple/20 p-3 text-xs text-text-secondary flex gap-2">
            <Info size={14} className="text-blurple shrink-0 mt-0.5" />
            Rules are evaluated by priority (highest first). The first matching rule wins.
          </div>

          <div>
            <label className="label">Rule Name</label>
            <input className="input" placeholder="e.g. Route Claude to Anthropic" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Condition</label>
              <select className="input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            {needsValue && (
              <div>
                <label className="label">Value</label>
                <input className="input" placeholder="e.g. claude, gpt-4" value={form.conditionValue} onChange={(e) => setForm({ ...form, conditionValue: e.target.value })} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Target Provider</label>
              <select className="input" value={form.targetProvider} onChange={(e) => setForm({ ...form, targetProvider: e.target.value })} required>
                <option value="">Select...</option>
                {providers?.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fallback Provider (optional)</label>
              <select className="input" value={form.fallbackProvider} onChange={(e) => setForm({ ...form, fallbackProvider: e.target.value })}>
                <option value="">None</option>
                {providers?.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Priority (higher = evaluated first)</label>
            <input className="input" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Rule</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RoutingRules() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data: rulesData, isLoading } = useQuery({ queryKey: ['rules'], queryFn: fetchRules });
  const { data: providersData } = useQuery({ queryKey: ['providers'], queryFn: fetchProviders });

  const addMutation = useMutation({ mutationFn: createRule, onSuccess: () => { qc.invalidateQueries({ queryKey: ['rules'] }); setShowAdd(false); } });
  const toggleMutation = useMutation({ mutationFn: ({ id, isActive }) => updateRule({ id, isActive: !isActive }), onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }) });
  const deleteMutation = useMutation({ mutationFn: deleteRule, onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }) });

  const rules = rulesData?.rules || [];
  const providers = providersData?.providers || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Routing Rules</h1>
          <p className="text-text-secondary text-sm mt-1">Define how requests are routed to providers</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      <div className="glass p-4 border border-blurple/20">
        <div className="flex items-start gap-3">
          <GitBranch size={16} className="text-blurple mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-text-primary font-medium">Auto-routing is always on</p>
            <p className="text-text-secondary mt-0.5">Without rules, models are auto-routed by name (e.g., "claude-*" → Anthropic, "gpt-*" → OpenAI). Rules let you override this behavior.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="glass h-16" />)}</div>
      ) : rules.length === 0 ? (
        <div className="glass p-10 text-center">
          <GitBranch size={36} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No custom rules</p>
          <p className="text-text-muted text-sm mt-1">Auto-routing is handling everything. Add rules to customize.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <RuleRow key={rule.$id} rule={rule} providers={providers}
              onToggle={(id, isActive) => toggleMutation.mutate({ id, isActive })}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {showAdd && <AddRuleModal onClose={() => setShowAdd(false)} onAdd={(d) => addMutation.mutate(d)} providers={providers} />}
    </div>
  );
}
