'use client';

import React from 'react';
import { Leaf, Building2, ShieldCheck, MapPin } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardHeader({ activeTab, setActiveTab }: DashboardHeaderProps) {
  return (
    <header className="w-full bg-nature-darkest text-white border-b-4 border-maasai-ochre shadow-xl">
      {/* Top Tribal Bead Ribbon Pattern Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-maasai-ochre via-maasai-beadblue to-maasai-gold opacity-90 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding & Location */}
        <div className="flex items-center gap-3">
          <div className="bg-nature-primary p-2.5 rounded-xl border border-nature-light/30">
            <Leaf className="w-7 h-7 text-nature-mint" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              ENKAI BIOPHILIC <span className="text-xs bg-maasai-ochre px-2 py-0.5 rounded text-white font-mono tracking-normal">B2B/B2G</span>
            </h1>
            <p className="text-xs text-nature-light flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-maasai-gold" /> Nairobi Urban Development Portal
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Tiers for Contractors */}
        <nav className="flex bg-black/30 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
          {[
            { id: 'marketplace', name: '1. Materials Catalog', icon: Leaf },
            { id: 'pipeline', name: '2. Deploy Pipeline', icon: Building2 },
            { id: 'maintenance', name: '3. Upkeep Sensors', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-nature-primary text-white shadow-lg border border-nature-light/20 scale-105'
                    : 'text-nature-mint/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-maasai-gold' : ''}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
