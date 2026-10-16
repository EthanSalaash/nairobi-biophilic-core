'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '../components/AppContext';
import DashboardHeader from '../components/DashboardHeader';
import AuthPortal from '../components/AuthPortal';
import MaterialMarketplace from '../components/MaterialMarketplace';
import ProjectPipeline from '../components/ProjectPipeline';
import MaintenanceLogs from '../components/MaintenanceLogs';
import DatabaseViewer from '../components/DatabaseViewer';
import { LogOut, UserCheck } from 'lucide-react';

function MasterDashboard() {
  const { currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState<string>('marketplace');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
        <AuthPortal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative selection:bg-nature-primary">
      {/* 1. Global Bead-pattern row Navigation Bar Header */}
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Quick Profile Metadata Status & LogOut Control Panel */}
      <div className="max-w-7xl mx-auto px-6 pt-4 flex justify-between items-center border-b border-white/5 pb-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <UserCheck className="w-4 h-4 text-nature-light" />
          <span>Active User: <strong className="text-white font-sans">{currentUser.username}</strong> ({currentUser.companyName})</span>
          <span className="text-[10px] bg-nature-primary/20 text-nature-light px-2 py-0.5 rounded-full border border-nature-primary/30 uppercase font-sans font-bold tracking-wider ml-1">{currentUser.role}</span>
        </div>
        
        <button 
          onClick={logout} 
          className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-maasai-ochre transition-colors cursor-pointer border border-white/5 bg-neutral-900/40 px-2.5 py-1 rounded-lg"
        >
          <LogOut className="w-3 h-3" /> Sign Out Profile
        </button>
      </div>
      
      {/* 2. Interactive Workspace Module Router Filters */}
      <div className="py-2">
        {activeTab === 'marketplace' && <MaterialMarketplace />}
        {activeTab === 'pipeline' && <ProjectPipeline />}
        {activeTab === 'maintenance' && <MaintenanceLogs />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MasterDashboard />
    </AppProvider>
  );
}


