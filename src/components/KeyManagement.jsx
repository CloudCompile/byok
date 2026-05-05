import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Eye, EyeOff, Check, X, Edit2, AlertCircle } from 'lucide-react';
import { fetchKeys, createKey, updateKey, deleteKey, fetchProviders } from '../lib/api';
import clsx from 'clsx';

const PROVIDER_TIERS = {
  'Frontier': ['anthropic', 'openai', 'google', 'deepseek', 'xai'],
  'Aggregators': ['openrouter', 'together', 'perplexity', 'wavespeedai'],
  'Cost / Speed': ['siliconflow', 'groq', 'fireworks', 'mistral', 'cohere', 'inference', 'qwen', 'cerebras'],
  'Managed Cloud': ['vertexai', 'ibm', 'modal', 'deepinfra', 'anyscale'],
  'Infrastructure': ['ollama', 'cloudflare'],
  'Embeddings': ['voyage', 'jina', 'nomic'],
  'Multimodal / Audio': ['stability', 'pollinations', 'elevenlabs'],
  'Custom': ['custom'],
};

function AddKeyModal({ onClose, onAdd, providers }) {
  const [form, setForm] = useState({ provider: '', displayName: '', apiKey: '', monthlyBudget: '' });
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.provider || !form.displayName || !form.apiKey) return;
    onAdd({
      provider: form.provider,
      displayName: form.displayName,
      apiKey: form.apiKey,
      monthlyBudget: form.monthlyBudget ? parseFloat(form.monthlyBudget) : null,
    });
  };

  const selectedProvider = providers?.find((p) => p.id === form.provider);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass w-full max-w-md animate-slide-up border border-white/10">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="section-title">Add API Key</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Provider</label>
            <select
              className="input"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              required
            >
              <option value="">Select provider...</option>
              {Object.entries(PROVIDER_TIERS).map(([tier, ids]) => (
                <optgroup key={tier} label={tier}>
                  {ids.map((id) => {
                    const p = providers?.find((p) => p.id === id);
                    return <option key={id} value={id}>{p?.displayName || id}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Display Name</label>
            <input
              className="input"
              placeholder="e.g. My Anthropic Key"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">API Key</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showKey ? 'text' : 'password'}
                placeholder={form.provider === 'ollama' ? 'http://localhost:11434' : 'sk-...'}
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {selectedProvider && ['vertexai', 'ibm', 'cloudflare', 'ollama', 'custom'].includes(form.provider) && (
              <p className="text-xs text-text-muted mt-1">
                {form.provider === 'vertexai' && 'JSON: {"projectId":"...","location":"...","accessToken":"..."}'}
                {form.provider === 'ibm' && 'Format: apiKey:projectId'}
                {form.provider === 'cloudflare' && 'Format: accountId:apiToken'}
                {form.provider === 'ollama' && 'Base URL, e.g. http://localhost:11434'}
                {form.provider === 'custom' && 'Format: baseUrl|apiToken (or just the token)'}
              </p>
            )}
          </div>

          <div>
            <label className="label">Monthly Budget (USD, optional)</label>
            <input
              className="input"
              type="number"
              placeholder="e.g. 50"
              min="0"
              step="0.01"
              value={form.monthlyBudget}
              onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Key</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function KeyRow({ k, providers, onToggle, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const provider = providers?.find((p) => p.id === k.provider);

  return (
    <div className={clsx('glass-hover p-4 flex items-center gap-4 transition-all', !k.isActive && 'opacity-50')}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-text-primary text-sm">{k.displayName}</span>
          <span className="badge badge-blue">{provider?.displayName || k.provider}</span>
          {!k.isActive && <span className="badge badge-red">Disabled</span>}
          {k.monthlyBudget && (
            <span className="badge badge-yellow">Budget: ${k.monthlyBudget}/mo</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
          {k.lastUsed && <span>Last used: {new Date(k.lastUsed).toLocaleDateString()}</span>}
          {k.monthlyCost > 0 && <span>This month: ${k.monthlyCost.toFixed(4)}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(k.$id, k.isActive)}
          className={clsx('w-8 h-8 rounded-lg flex items-center justify-center transition-all',
            k.isActive ? 'text-success hover:bg-success/10' : 'text-text-muted hover:bg-white/5')}
          title={k.isActive ? 'Disable' : 'Enable'}
        >
          {k.isActive ? <Check size={14} /> : <X size={14} />}
        </button>

        {showDelete ? (
          <div className="flex items-center gap-1">
            <button onClick={() => onDelete(k.$id)} className="btn-danger text-xs py-1 px-2">Confirm</button>
            <button onClick={() => setShowDelete(false)} className="btn-secondary text-xs py-1 px-2">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setShowDelete(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function KeyManagement() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data: keysData, isLoading } = useQuery({ queryKey: ['keys'], queryFn: fetchKeys });
  const { data: providersData } = useQuery({ queryKey: ['providers'], queryFn: fetchProviders });

  const addMutation = useMutation({
    mutationFn: createKey,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keys'] }); setShowAdd(false); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => updateKey({ id, isActive: !isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keys'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keys'] }),
  });

  const keys = keysData?.keys || [];
  const providers = providersData?.providers || [];

  // Group by provider
  const grouped = {};
  for (const k of keys) {
    if (!grouped[k.provider]) grouped[k.provider] = [];
    grouped[k.provider].push(k);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">API Keys</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your provider API keys — all stored encrypted</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Key
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="glass h-16" />)}
        </div>
      ) : keys.length === 0 ? (
        <div className="glass p-12 text-center">
          <AlertCircle size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No API keys yet</p>
          <p className="text-text-muted text-sm mt-1">Add your first provider key to start routing requests</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-4 mx-auto flex items-center gap-2">
            <Plus size={16} />
            Add your first key
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([provider, pKeys]) => {
            const pInfo = providers?.find((p) => p.id === provider);
            return (
              <div key={provider}>
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  {pInfo?.displayName || provider} ({pKeys.length})
                </h3>
                <div className="space-y-2">
                  {pKeys.map((k) => (
                    <KeyRow
                      key={k.$id}
                      k={k}
                      providers={providers}
                      onToggle={(id, isActive) => toggleMutation.mutate({ id, isActive })}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <AddKeyModal
          onClose={() => setShowAdd(false)}
          onAdd={(data) => addMutation.mutate(data)}
          providers={providers}
        />
      )}
    </div>
  );
}
