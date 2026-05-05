import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Terminal, Plus, Copy, Check, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { fetchGatewayKeys, createGatewayKey, revokeGatewayKey } from '../lib/api';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-primary transition-all">
      {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
    </button>
  );
}

export default function APIKeyGenerator() {
  const qc = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['gateway-keys'], queryFn: fetchGatewayKeys });

  const createMutation = useMutation({
    mutationFn: createGatewayKey,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['gateway-keys'] });
      setGeneratedKey(data.fullKey);
      setNewKeyName('');
      setShowCreate(false);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeGatewayKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateway-keys'] }),
  });

  const keys = data?.keys || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Gateway Keys</h1>
          <p className="text-text-secondary text-sm mt-1">Keys for accessing your BYOK gateway endpoint</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Generate Key
        </button>
      </div>

      {/* Usage example */}
      <div className="glass p-5 border border-blurple/20">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} className="text-blurple" />
          <span className="section-title text-sm">Usage</span>
        </div>
        <pre className="text-xs font-mono text-text-secondary overflow-x-auto">
{`curl https://byok-eta.vercel.app/api/v1/chat/completions \\
  -H "Authorization: Bearer byok_<keyId>_<secret>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
        </pre>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="glass p-5 border border-blurple/20 animate-slide-up">
          <h2 className="section-title mb-4">New Gateway Key</h2>
          <div className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="Key name, e.g. Production App"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newKeyName && createMutation.mutate({ displayName: newKeyName })}
            />
            <button
              onClick={() => newKeyName && createMutation.mutate({ displayName: newKeyName })}
              disabled={!newKeyName || createMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Generated key - show once */}
      {generatedKey && (
        <div className="glass p-5 border border-success/30 animate-slide-up">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
            <p className="text-sm text-text-primary font-medium">Save this key — it won't be shown again</p>
          </div>
          <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 font-mono text-xs">
            <span className="flex-1 break-all text-success">{generatedKey}</span>
            <CopyButton text={generatedKey} />
          </div>
          <button onClick={() => setGeneratedKey(null)} className="btn-secondary mt-3 text-xs w-full">
            I've saved it
          </button>
        </div>
      )}

      {/* Keys list */}
      {isLoading ? (
        <div className="animate-pulse space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="glass h-16" />)}</div>
      ) : keys.length === 0 ? (
        <div className="glass p-10 text-center">
          <Terminal size={36} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No gateway keys yet</p>
          <p className="text-text-muted text-sm mt-1">Generate a key to start using the gateway API</p>
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.$id} className="glass p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary text-sm">{k.displayName}</span>
                  {k.isActive ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Revoked</span>}
                </div>
                <div className="text-xs text-text-muted mt-0.5 font-mono">byok_{k.$id}_***</div>
                {k.lastUsed && <div className="text-xs text-text-muted mt-0.5">Last used: {new Date(k.lastUsed).toLocaleDateString()}</div>}
              </div>
              {k.isActive && (
                <button
                  onClick={() => revokeMutation.mutate(k.$id)}
                  className="btn-danger text-xs flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
