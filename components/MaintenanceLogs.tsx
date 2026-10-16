'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { PhoneCall, AlertTriangle, CheckCircle, Leaf, Wind } from 'lucide-react';

export default function MaintenanceLogs() {
  const { currentUser, tickets, activeProjects, raiseTicket, resolveTicket } = useApp();
  const [site, setSite] = useState('');
  const [material, setMaterial] = useState('');
  const [desc, setDesc] = useState('');

  const isSupervisor = currentUser?.role === 'Supervisor';
  const clientProjects = isSupervisor ? activeProjects : activeProjects.filter(p => p.clientName === currentUser?.username);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    raiseTicket(site, material, desc);
    setSite(''); setMaterial(''); setDesc('');
    alert("Emergency ticket logged! Alert sent to Supervisor dashboard.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-black text-white">
      {!isSupervisor && (
        <div className="bg-neutral-900/40 rounded-2xl p-6 border border-maasai-ochre/30 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <div className="flex items-center gap-2 text-maasai-ochre font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Biophilic Care Speedline</span>
            </div>
            <h4 className="text-md font-semibold text-white">Log Site System Irregularity</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">Instantly deploy certified maintenance field crews to correct structural moisture or nutrient imbalances.</p>
          </div>
          <form onSubmit={handleTicketSubmit} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <input type="text" value={site} onChange={(e)=>setSite(e.target.value)} required placeholder="Facility Project Name" className="bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
            <select value={material} onChange={(e)=>setMaterial(e.target.value)} required className="bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
              <option value="">Select Material</option>
              {clientProjects.map(p => <option key={p.id} value={p.materialName}>{p.materialName}</option>)}
            </select>
            <input type="text" value={desc} onChange={(e)=>setDesc(e.target.value)} required placeholder="Observable Variance Description" className="bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white sm:col-span-2" />
            <button type="submit" className="sm:col-span-2 bg-maasai-ochre hover:bg-maasai-ochre/90 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors">Broadcast Dispatch Alert</button>
          </form>
        </div>
      )}

      {isSupervisor && (
        <div className="bg-maasai-ochre/10 rounded-2xl p-6 border border-maasai-ochre/30 space-y-4">
           <h3 className="text-md font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-maasai-ochre" /> Supervisor Client Ticket Inbox</h3>
           {tickets.length === 0 ? <p className="text-xs text-neutral-400 font-mono">No active complaints from clients.</p> : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {tickets.map(t => (
                 <div key={t.id} className="bg-black/50 p-4 rounded-xl border border-white/10">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-mono text-neutral-400">Client: {t.clientName} | {t.timestamp}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded border ${t.status === 'Resolved' ? 'bg-nature-primary/20 border-nature-primary text-nature-light' : 'bg-maasai-ochre/20 border-maasai-ochre text-maasai-gold'}`}>{t.status}</span>
                   </div>
                   <h4 className="text-sm font-bold">{t.siteName}</h4>
                   <p className="text-xs text-maasai-gold font-mono">{t.materialName}</p>
                   <p className="text-xs mt-2 bg-white/5 p-2 rounded">{t.issueDescription}</p>
                   {t.status !== 'Resolved' && <button onClick={() => resolveTicket(t.id)} className="mt-3 w-full bg-nature-primary py-1.5 rounded-lg text-xs font-bold uppercase flex justify-center items-center gap-1"><CheckCircle className="w-3 h-3"/> Mark Resolved</button>}
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      <div className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5 space-y-4">
        <div>
          <h3 className="text-md font-semibold text-white">{isSupervisor ? 'Global Client Environmental Yield Tracker' : 'My Regional CO2 Impact Tracker'}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Cellular monitoring arrays capturing biophilic structural offsets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clientProjects.length === 0 ? <p className="text-xs text-neutral-500 font-mono col-span-3">No tracking data available for active procurements.</p> : clientProjects.map((log) => (
            <div key={log.id} className="bg-neutral-900/60 rounded-xl p-5 border border-white/5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-maasai-gold block">{log.companyName} {isSupervisor ? `(${log.clientName})` : ''} - {log.region}</span>
                <h4 className="text-xs font-bold text-white mt-1">{log.materialName}</h4>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex justify-between items-center text-xs">
                <div><span className="text-[10px] text-neutral-400 block flex items-center gap-1"><Wind className="w-3 h-3 text-nature-light"/> Regional Offset</span><span className="font-mono font-bold text-white block mt-0.5">{log.co2Impact.toLocaleString()} Units</span></div>
                <span className="text-[10px] bg-nature-primary/10 border border-nature-primary text-nature-light px-2 py-0.5 rounded">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}