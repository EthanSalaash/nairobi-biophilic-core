'use client';

import React, { useState } from 'react';
import { useApp, KenyaRegion, UserRole } from './AppContext';
import { KeyRound, User, LayoutDashboard, UserPlus, LogIn, MapPin } from 'lucide-react';

const KENYA_REGIONS: KenyaRegion[] = [
  'Nairobi Metro',
  'Mount Kenya Highlands',
  'Coast Region (Mombasa)',
  'Rift Valley',
  'Arid/Semi-Arid (North)'
];

export default function AuthPortal() {
  const { login, signUp } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [region, setRegion] = useState<KenyaRegion>('Nairobi Metro');
  const [role, setRole] = useState<UserRole>('Client');
  const [statusMessage, setStatusMessage] = useState({ isError: false, text: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ isError: false, text: '' });

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || !password) return;

    if (isSignUp) {
      if (role === 'Client' && !companyName.trim()) {
        setStatusMessage({ isError: true, text: 'Company construction name is required for Clients.' });
        return;
      }
      const response = signUp(cleanUser, role === 'Supervisor' ? 'County Bureau Admin' : companyName.trim(), password, role, region);
      if (!response.success) {
        setStatusMessage({ isError: true, text: response.msg });
      }
    } else {
      const response = login(cleanUser, password);
      if (!response.success) {
        setStatusMessage({ isError: true, text: response.msg });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-nature-darkest border border-nature-primary/30 rounded-2xl shadow-2xl mt-12 relative text-white">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-maasai-ochre via-maasai-beadblue to-maasai-gold rounded-t-2xl" />
      
      <div className="text-center space-y-2 mb-6">
        <div className="bg-black/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto border border-white/10">
          <KeyRound className="w-5 h-5 text-maasai-gold" />
        </div>
        <h3 className="text-xl font-bold tracking-wide">Enkai Urban Portal</h3>
        <p className="text-xs text-nature-mint/70">
          {isSignUp ? 'Register profile credentials' : 'Authenticated secure dashboard access'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {statusMessage.text && (
          <div className={`p-3 rounded-xl text-xs font-mono text-center border ${statusMessage.isError ? 'bg-maasai-ochre/20 border-maasai-ochre/40 text-maasai-gold' : 'bg-nature-primary/20 border-nature-primary/40 text-nature-light'}`}>
            {statusMessage.text}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-nature-light uppercase tracking-wider block">Username ID</label>
          <input 
            type="text" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="e.g., jommo" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-nature-light"
          />
          {!isSignUp && <span className="text-[10px] text-neutral-400 block font-mono">Defaults: 'admin' (pass: admin1223) or 'jommo' (pass: jommo123)</span>}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-nature-light uppercase tracking-wider block">Password Key</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-nature-light"
          />
        </div>

        {isSignUp && (
          <>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-nature-light uppercase tracking-wider block">System Access Clearance</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Client')}
                  className={`p-2.5 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${role === 'Client' ? 'bg-nature-primary border-nature-light' : 'bg-black/20 border-white/5 text-neutral-400'}`}
                >
                  <User className="w-4 h-4" /> Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Supervisor')}
                  className={`p-2.5 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${role === 'Supervisor' ? 'bg-maasai-ochre border-maasai-ochre' : 'bg-black/20 border-white/5 text-neutral-400'}`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Supervisor
                </button>
              </div>
            </div>

            {role === 'Client' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-nature-light uppercase tracking-wider block">Corporate Construction Name</label>
                <input 
                  type="text" 
                  required 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder="e.g., Omondi Builders Ltd" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-nature-light"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-nature-light uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-maasai-gold" /> Targeted Kenya Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as KenyaRegion)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nature-light"
              >
                {KENYA_REGIONS.map(reg => (
                  <option key={reg} value={reg} className="bg-neutral-900 text-white">{reg}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <button type="submit" className="w-full bg-maasai-ochre hover:bg-maasai-ochre/90 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-2">
          {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          {isSignUp ? 'Register Profile Account' : 'Authenticate Identity'}
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setStatusMessage({ isError: false, text: '' }); }}
            className="text-xs text-nature-mint hover:underline font-medium cursor-pointer"
          >
            {isSignUp ? 'Have an active profile? Log in here' : "Need an account? Create profile sheet here"}
          </button>
        </div>
      </form>
    </div>
  );
}
