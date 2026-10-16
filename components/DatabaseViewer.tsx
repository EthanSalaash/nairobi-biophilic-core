'use client';

import React from 'react';
import { useApp } from './AppContext';
import { Database } from 'lucide-react';

export default function DatabaseViewer() {
  const { currentUser, usersRegistry, activeProjects, tickets, inventory } = useApp();
  
  // Only allow the Supervisor to see the raw database dump
  if (currentUser?.role !== 'Supervisor') return null;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12 mt-8">
      <div className="bg-neutral-950 rounded-2xl p-6 border border-maasai-ochre/30 shadow-2xl">
        <h3 className="text-maasai-gold font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
          <Database className="w-4 h-4" /> 
          Live Database Registry Output
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-4 rounded-xl border border-white/10 overflow-auto max-h-64 shadow-inner">
            <h4 className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-2">Table: Users_Registry</h4>
            <pre className="text-[10px] text-nature-light font-mono leading-relaxed">{JSON.stringify(usersRegistry, null, 2)}</pre>
          </div>
          <div className="bg-black p-4 rounded-xl border border-white/10 overflow-auto max-h-64 shadow-inner">
            <h4 className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-2">Table: Active_Projects</h4>
            <pre className="text-[10px] text-nature-light font-mono leading-relaxed">{JSON.stringify(activeProjects, null, 2)}</pre>
          </div>
          <div className="bg-black p-4 rounded-xl border border-white/10 overflow-auto max-h-64 shadow-inner">
            <h4 className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-2">Table: Maintenance_Tickets</h4>
            <pre className="text-[10px] text-nature-light font-mono leading-relaxed">{JSON.stringify(tickets, null, 2)}</pre>
          </div>
          <div className="bg-black p-4 rounded-xl border border-white/10 overflow-auto max-h-64 shadow-inner">
            <h4 className="text-white text-xs font-bold mb-2 border-b border-white/10 pb-2">Table: Warehouse_Inventory</h4>
            <pre className="text-[10px] text-nature-light font-mono leading-relaxed">{JSON.stringify(inventory, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}