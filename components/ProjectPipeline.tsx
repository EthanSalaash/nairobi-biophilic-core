'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { UserCheck, MessageSquare, ClipboardCheck, Wrench, Sprout } from 'lucide-react';

const STAGES = [
  { name: 'Procurement Ordered', desc: 'Awaiting structural assessment', icon: ClipboardCheck },
  { name: 'Engineering & Feedback', desc: 'Supervisor site review notes', icon: MessageSquare },
  { name: 'Assembly Works', desc: 'On-site installation and fitting', icon: Wrench },
  { name: 'Active Handover', desc: 'Cellular IoT tracking online', icon: Sprout },
];

export default function ProjectPipeline() {
  const { currentUser, activeProjects, advanceProjectPipeline, updateProjectFeedback } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const isSupervisor = currentUser?.role === 'Supervisor';
  const targetProject = activeProjects.find((p) => p.id === selectedProjectId);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetProject && feedbackInput) {
      updateProjectFeedback(targetProject.id, feedbackInput);
      setFeedbackInput('');
      alert("Feedback transmitted to client portal.");
    }
  };

  if (!isSupervisor) {
    const userProjects = activeProjects.filter((p) => p.clientName === currentUser?.username);

    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-black text-white space-y-6">
        <h3 className="text-md font-semibold border-l-4 border-nature-primary pl-2">Your Active Construction Trackers</h3>
        
        {userProjects.length === 0 ? (
          <div className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5">
             <p className="text-xs text-neutral-500 font-mono italic">No active structural procurement orders logged for your contractor name yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userProjects.map(project => (
              <div key={project.id} className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="font-bold text-sm text-white">{project.materialName}</span>
                   <span className="text-xs font-mono text-maasai-gold">{project.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {STAGES.map((stage, idx) => {
                    const isCurrent = idx === project.pipelineStage;
                    const isCompleted = idx < project.pipelineStage;
                    const Icon = stage.icon;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border ${isCurrent ? 'bg-nature-darkest/40 border-nature-primary shadow-lg ring-1 ring-nature-primary/30' : isCompleted ? 'bg-nature-primary/10 border-nature-primary/30 text-neutral-300' : 'bg-transparent border-white/5 text-neutral-600'}`}>
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] font-mono block opacity-60">Phase 0{idx + 1}</span>
                           <Icon className={`w-4 h-4 ${isCurrent ? 'text-nature-light animate-pulse' : 'opacity-40'}`} />
                        </div>
                        <h4 className="text-xs font-bold mt-2">{stage.name}</h4>
                        <p className="text-[10px] text-neutral-400 mt-1">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-maasai-ochre/20 flex gap-3">
                   <MessageSquare className="w-5 h-5 text-maasai-ochre shrink-0" />
                   <div>
                     <span className="text-[10px] uppercase font-bold text-maasai-gold tracking-wider">Supervisor Engineering Feedback</span>
                     <p className="text-sm font-mono mt-1 text-neutral-200">{project.supervisorFeedback}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-black text-white space-y-6">
      <div className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 flex-wrap gap-2">
          <h3 className="text-md font-semibold text-white">Nairobi Contract Deployment Pipeline</h3>
          <select 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-black border border-white/10 rounded-xl px-3 py-1.5 text-xs text-maasai-gold focus:outline-none cursor-pointer"
          >
            <option value="">-- Choose Deployed Contract --</option>
            {activeProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.id} - {p.clientName}</option>
            ))}
          </select>
        </div>

        {targetProject ? (
          <div className="space-y-6">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-400 block uppercase tracking-wider text-[10px]">Client Builder Name</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{targetProject.clientName} ({targetProject.companyName})</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 block uppercase tracking-wider text-[10px]">Material Asset Specifications</span>
                <span className="text-nature-light font-mono block mt-0.5">{targetProject.materialName} [{targetProject.area} m²]</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {STAGES.map((stage, idx) => {
                const isCurrent = targetProject.pipelineStage === idx;
                return (
                  <button
                    key={idx} type="button" onClick={() => advanceProjectPipeline(targetProject.id, idx)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${isCurrent ? 'bg-maasai-ochre border-maasai-ochre text-white font-bold shadow-md' : 'bg-black/20 border-white/5 text-neutral-400 hover:border-white/10'}`}
                  >
                    <span className="text-[9px] font-mono block opacity-60">Phase 0{idx + 1}</span>
                    <span className="text-[11px] block mt-1 truncate">{stage.name}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleFeedbackSubmit} className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3">
               <span className="text-xs font-bold text-maasai-gold">Update Structural Engineer Feedback</span>
               <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={feedbackInput} 
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="e.g., Load-bearing capacity confirmed. Proceeding to assembly..." 
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                 />
                 <button type="submit" className="bg-nature-primary text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">Send to Client</button>
               </div>
               <p className="text-[10px] text-neutral-500 font-mono">Current Note: {targetProject.supervisorFeedback}</p>
            </form>
          </div>
        ) : (
          <p className="text-xs text-neutral-500 font-mono italic text-center py-4">Select an active contractor ticket to manage delivery and engineering feedback.</p>
        )}
      </div>

      <div className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><UserCheck className="w-4 h-4 text-maasai-beadblue" /> Master Client Procurement Log Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="pb-2">ID</th>
                <th className="pb-2">Contractor</th>
                <th className="pb-2">Material Integration</th>
                <th className="pb-2">Size</th>
                <th className="pb-2">Status Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {activeProjects.map((p) => (
                <tr key={p.id} className="text-neutral-300 hover:text-white transition-colors">
                  <td className="py-2.5 text-maasai-gold">{p.id}</td>
                  <td className="py-2.5">{p.clientName}</td>
                  <td className="py-2.5 max-w-[150px] truncate">{p.materialName}</td>
                  <td className="py-2.5 text-nature-light">{p.area} m²</td>
                  <td className="py-2.5"><span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] border border-white/5">P{p.pipelineStage + 1} Complete</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}