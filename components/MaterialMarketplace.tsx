'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ECO_MATERIALS } from './MarketData';
import { Building2, ArrowRight, Coins, Heart, Award, Sparkles, Package, PlusCircle } from 'lucide-react';

export default function MaterialMarketplace() {
  const { currentUser, purchaseMaterials, activeProjects, cart, updateCart, inventory, restockInventory } = useApp();
  const [selectedBuilding, setSelectedBuilding] = useState<'Commercial' | 'Public School' | 'Hospital' | 'Infrastructure Bypass'>('Commercial');
  const [coverageArea, setCoverageArea] = useState<number>(500);

  const isSupervisor = currentUser?.role === 'Supervisor';
  const filteredMaterials = ECO_MATERIALS.filter(mat => mat.recommendedFor.includes(selectedBuilding));
  const myProjects = activeProjects.filter(p => p.clientName === currentUser?.username);

  const toggleCartItem = (id: string) => {
    updateCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleCheckout = () => {
    const selectedObjects = ECO_MATERIALS.filter(m => cart.includes(m.id));
    const response = purchaseMaterials(selectedObjects, coverageArea);
    if (response.success) {
      alert("Supa! Your Procurement Contract Has Been Registered to Nairobi's Green Pipeline.");
    } else {
      alert(`Procurement Failed: ${response.msg}`);
    }
  };

  const totalBiddingEstimate = cart.reduce((sum, itemId) => {
    const item = ECO_MATERIALS.find(m => m.id === itemId);
    return sum + (item ? item.costPerM2 * coverageArea : 0);
  }, 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-black text-white">
      {isSupervisor && (
        <div className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-6 border border-nature-primary/20 space-y-5 shadow-xl mb-8">
          <h3 className="text-sm font-semibold text-white border-l-4 border-maasai-gold pl-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-maasai-gold" /> Central Stock Warehouse Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventory.map((item: any) => {
              const isLow = item.stockAvailable < 1500;
              return (
                <div key={item.id} className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2 relative overflow-hidden">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-medium text-white truncate max-w-[120px]">{item.name}</span>
                    <span className={`font-mono font-bold ${isLow ? 'text-maasai-ochre animate-pulse' : 'text-nature-light'}`}>{item.stockAvailable} {item.unit}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${isLow ? 'bg-maasai-ochre' : 'bg-nature-primary'}`} style={{ width: `${Math.min(100, (item.stockAvailable / 10000) * 100)}%` }} />
                  </div>
                  <button onClick={() => restockInventory(item.id, 500)} className="w-full mt-2 text-[9px] bg-neutral-800 hover:bg-neutral-700 text-maasai-gold font-bold px-2 py-1.5 rounded border border-white/10 cursor-pointer flex items-center justify-center gap-1">
                    <PlusCircle className="w-2.5 h-2.5" /> Allocate +500m²
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 h-fit">
          {!isSupervisor && (
            <div className="bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-5 border border-nature-primary/20 space-y-3 shadow-lg">
              <span className="text-maasai-gold text-xs font-bold uppercase tracking-wider block flex items-center gap-2"><Award className="w-4 h-4 text-nature-light" /> My Procured Footprint Tally</span>
              {myProjects.length === 0 ? <p className="text-xs text-neutral-500 font-mono italic">No features procured yet.</p> : (
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                    {myProjects.map((mat) => (
                      <div key={mat.id} className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col gap-1 text-[11px]">
                        <div className="flex justify-between items-center text-white font-medium"><span>{mat.materialName}</span><span className="text-nature-light font-mono text-[10px] bg-nature-primary/10 px-1.5 py-0.5 rounded">{mat.area} m²</span></div>
                        <div className="flex justify-between items-center text-[10px] font-mono"><span className="text-neutral-400">Cost: KES {mat.totalCost.toLocaleString()}</span><span className="text-maasai-gold">CO2 Offset: {mat.co2Impact.toLocaleString()} units</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-neutral-900/40 rounded-2xl p-6 border border-white/5 space-y-6">
            <h3 className="text-sm font-semibold text-white border-l-4 border-maasai-ochre pl-2">Project Classification</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {(['Commercial', 'Public School', 'Hospital', 'Infrastructure Bypass'] as const).map((type) => (
                <button key={type} type="button" onClick={() => { setSelectedBuilding(type); updateCart([]); }} className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${selectedBuilding === type ? 'bg-nature-primary/20 border-nature-primary text-white font-medium shadow-md' : 'bg-transparent border-white/5 text-neutral-400 hover:border-white/20'}`}><span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-maasai-gold" /> {type}</span></button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono"><span className="text-nature-light">Footprint Area:</span><span className="text-white">{coverageArea} m²</span></div>
              <input type="range" min="100" max="5000" step="100" value={coverageArea} onChange={(e) => setCoverageArea(Number(e.target.value))} className="w-full accent-nature-primary cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none" />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((material) => {
              const Icon = material.icon; const isSelected = cart.includes(material.id);
              const stockItem = inventory.find(i => i.id === material.id);
              const isOutOfStock = stockItem && stockItem.stockAvailable < coverageArea;
              
              return (
                <div key={material.id} className={`bg-neutral-900/30 rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${isSelected ? 'border-nature-primary bg-nature-darkest/10 ring-1 ring-nature-primary/20' : 'border-white/5'}`}>
                  <div className="w-full h-40 bg-neutral-900 relative"><img src={material.imgSrc} alt={material.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://unsplash.com'; }} /><div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-maasai-gold font-mono">{material.category}</div></div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                       <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Icon className="w-4 h-4 text-nature-light" /> {material.name}</h4>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isOutOfStock ? 'bg-maasai-ochre/20 text-maasai-ochre' : 'bg-nature-primary/20 text-nature-light'}`}>{stockItem?.stockAvailable} m² left</span>
                       </div>
                       <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">{material.description}</p>
                       <p className="text-[10px] text-maasai-gold font-mono pt-1">Est: KES {material.costPerM2.toLocaleString()} / m²</p>
                    </div>
                    {!isSupervisor && (
                      <button disabled={isOutOfStock} onClick={() => toggleCartItem(material.id)} className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${isOutOfStock ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : isSelected ? 'bg-maasai-ochre text-white shadow-md' : 'bg-nature-primary text-white hover:bg-nature-primary/95'}`}>
                        {isOutOfStock ? 'Insufficient Warehouse Stock' : isSelected ? 'Remove Block' : 'Add to Deployment Block'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!isSupervisor && cart.length > 0 && (
            <div className="bg-gradient-to-br from-nature-darkest to-neutral-900 rounded-2xl p-5 border border-nature-primary/30 shadow-xl space-y-4">
              <span className="text-maasai-gold text-xs font-bold uppercase tracking-widest block">Ecological Offset Summary</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">              
                {cart.map((itemId: string) => {
                const item = ECO_MATERIALS.find(m => m.id === itemId)!;
                return <div key={item.id} className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs"><span>{item.name}</span><span className="font-mono font-bold text-white">{(item.impactValuePerM2 * coverageArea).toLocaleString()} {item.impactType === 'CO2 Reduction' || item.impactType === 'Carbon Embodied' ? 'kg' : 'Liters'}</span></div>;
              })}</div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 uppercase flex items-center gap-1.5"><Coins className="w-4 h-4 text-maasai-gold" /> Total Budget Estimate:</span>
                <span className="font-mono font-bold text-white text-sm">KES {totalBiddingEstimate.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-maasai-ochre py-2.5 rounded-xl text-xs font-bold uppercase text-white cursor-pointer flex items-center justify-center gap-2 shadow-md hover:bg-maasai-ochre/90 transition-all">Authorize Procurement <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}