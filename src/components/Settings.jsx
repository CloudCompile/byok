import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Globe, Code, Check } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Configure your BYOK gateway</p>
      </div>

      {/* Gateway Info */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-blurple" />
          <h2 className="section-title">Gateway Endpoint</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <label className="label">Base URL</label>
            <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 font-mono text-xs">
              <span className="text-blurple flex-1">{appUrl}/api/v1</span>
            </div>
          </div>
          <div>
            <label className="label">Chat Completions</label>
            <div className="bg-black/40 rounded-lg px-3 py-2 font-mono text-xs text-text-secondary">
              POST {appUrl}/api/v1/chat/completions
            </div>
          </div>
        </div>
      </div>

      {/* Integration */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Code size={16} className="text-blurple" />
          <h2 className="section-title">Integration Examples</h2>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="label">Python (openai SDK)</p>
            <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-text-secondary overflow-x-auto">
{`import openai

client = openai.OpenAI(
    api_key="byok_<keyId>_<secret>",
    base_url="${appUrl}/api/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello!"}]
)`}
            </pre>
          </div>
          <div>
            <p className="label">JavaScript / Node.js</p>
            <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-text-secondary overflow-x-auto">
{`import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'byok_<keyId>_<secret>',
  baseURL: '${appUrl}/api/v1',
});

const res = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});`}
            </pre>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-blurple" />
          <h2 className="section-title">Security</h2>
        </div>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start gap-2">
            <Check size={14} className="text-success mt-0.5 shrink-0" />
            <span>All provider API keys encrypted at rest using AES-256-GCM</span>
          </div>
          <div className="flex items-start gap-2">
            <Check size={14} className="text-success mt-0.5 shrink-0" />
            <span>Gateway keys hashed with bcrypt (12 rounds)</span>
          </div>
          <div className="flex items-start gap-2">
            <Check size={14} className="text-success mt-0.5 shrink-0" />
            <span>Keys never returned in API responses</span>
          </div>
          <div className="flex items-start gap-2">
            <Check size={14} className="text-success mt-0.5 shrink-0" />
            <span>All requests authenticated via Bearer token</span>
          </div>
        </div>
      </div>

      {/* Environment vars */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon size={16} className="text-blurple" />
          <h2 className="section-title">Environment Variables</h2>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {[
            ['APPWRITE_ENDPOINT', 'Appwrite API endpoint'],
            ['APPWRITE_PROJECT_ID', 'Appwrite project ID'],
            ['APPWRITE_API_KEY', 'Appwrite server API key'],
            ['APPWRITE_DATABASE_ID', 'Database ID (byok_db)'],
            ['JWT_SECRET', 'Secret for dashboard JWT tokens'],
            ['ENCRYPTION_KEY', '64-char hex key for AES-256-GCM'],
            ['ADMIN_EMAIL', 'Dashboard login email'],
            ['ADMIN_PASSWORD', 'Dashboard login password (plain, dev only)'],
            ['ADMIN_PASSWORD_HASH', 'bcrypt hash (production)'],
          ].map(([key, desc]) => (
            <div key={key} className="flex gap-3 py-1.5 border-b border-white/5">
              <span className="text-blurple w-52 shrink-0">{key}</span>
              <span className="text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
