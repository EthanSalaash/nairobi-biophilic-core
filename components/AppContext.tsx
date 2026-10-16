'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ECO_MATERIALS } from './MarketData';

export type UserRole = 'Guest' | 'Client' | 'Supervisor';
export type KenyaRegion = 'Nairobi Metro' | 'Mount Kenya Highlands' | 'Coast Region (Mombasa)' | 'Rift Valley' | 'Arid/Semi-Arid (North)';

export interface UserAccount {
  username: string;
  companyName: string;
  passwordHash: string;
  role: UserRole;
  region: KenyaRegion;
}

export interface InventoryItem {
  id: string;
  name: string;
  stockAvailable: number;
  unit: string;
}

export interface ClientProject {
  id: string;
  clientName: string;
  companyName: string;
  materialId: string;
  materialName: string;
  category: string;
  area: number;
  region: KenyaRegion;
  pipelineStage: number; 
  supervisorFeedback: string;
  timestamp: string;
  co2Impact: number;
  totalCost: number;
}

export interface SupportTicket {
  id: string;
  clientName: string;
  siteName: string;
  materialName: string;
  issueDescription: string;
  timestamp: string;
  status: 'Pending Dispatch' | 'Resolved';
}

interface AppContextType {
  currentUser: UserAccount | null;
  usersRegistry: UserAccount[];
  activeProjects: ClientProject[];
  tickets: SupportTicket[];
  inventory: InventoryItem[];
  cart: string[];
  signUp: (username: string, companyName: string, pass: string, role: UserRole, region: KenyaRegion) => { success: boolean; msg: string };
  login: (username: string, pass: string) => { success: boolean; msg: string };
  logout: () => void;
  updateCart: React.Dispatch<React.SetStateAction<string[]>>;
  purchaseMaterials: (materials: any[], area: number) => { success: boolean; msg: string };
  advanceProjectPipeline: (projectId: string, stageIndex: number) => void;
  updateProjectFeedback: (projectId: string, feedback: string) => void;
  restockInventory: (itemId: string, amount: number) => void;
  raiseTicket: (site: string, material: string, desc: string) => void;
  resolveTicket: (ticketId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const REGIONAL_CO2_MULTIPLIERS: Record<KenyaRegion, number> = {
  'Nairobi Metro': 1.0,
  'Mount Kenya Highlands': 1.3,
  'Coast Region (Mombasa)': 1.1,
  'Rift Valley': 1.2,
  'Arid/Semi-Arid (North)': 0.7,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  
  // Database Tables
  const [usersRegistry, setUsersRegistry] = useState<UserAccount[]>([]);
  const [activeProjects, setActiveProjects] = useState<ClientProject[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Load Database from LocalStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('enkai_users');
    const savedProjects = localStorage.getItem('enkai_projects');
    const savedTickets = localStorage.getItem('enkai_tickets');
    const savedInventory = localStorage.getItem('enkai_inventory');
    const savedSession = sessionStorage.getItem('enkai_current_user');

    setUsersRegistry(savedUsers ? JSON.parse(savedUsers) : [
      { username: 'ethan', companyName: 'County Bureau Admin', passwordHash: 'ethan123', role: 'Supervisor', region: 'Nairobi Metro' },
      { username: 'jommo', companyName: 'Omondi Builders Ltd', passwordHash: 'jommo123', role: 'Client', region: 'Nairobi Metro' }
    ]);
    setActiveProjects(savedProjects ? JSON.parse(savedProjects) : []);
    setTickets(savedTickets ? JSON.parse(savedTickets) : []);
    setInventory(savedInventory ? JSON.parse(savedInventory) : ECO_MATERIALS.map(m => ({ id: m.id, name: m.name, stockAvailable: 5000, unit: 'm²' })));
    if (savedSession) setCurrentUser(JSON.parse(savedSession));
    
    setIsLoaded(true);
  }, []);

  // Save Database to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('enkai_users', JSON.stringify(usersRegistry));
      localStorage.setItem('enkai_projects', JSON.stringify(activeProjects));
      localStorage.setItem('enkai_tickets', JSON.stringify(tickets));
      localStorage.setItem('enkai_inventory', JSON.stringify(inventory));
    }
  }, [usersRegistry, activeProjects, tickets, inventory, isLoaded]);

  const signUp = (username: string, companyName: string, pass: string, role: UserRole, region: KenyaRegion) => {
    const cleanName = username.trim().toLowerCase();
    if (usersRegistry.some(u => u.username === cleanName)) return { success: false, msg: 'Username ID is already allocated.' };
    const newUser: UserAccount = { username: cleanName, companyName: companyName.trim(), passwordHash: pass, role, region };
    setUsersRegistry(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    sessionStorage.setItem('enkai_current_user', JSON.stringify(newUser));
    return { success: true, msg: 'Account authorized successfully.' };
  };

  const login = (username: string, pass: string) => {
    const cleanName = username.trim().toLowerCase();
    const user = usersRegistry.find(u => u.username === cleanName);
    if (!user) return { success: false, msg: 'Account username profile ID not found.' };
    if (user.passwordHash !== pass) return { success: false, msg: 'Security key match validation failed.' };
    setCurrentUser(user);
    sessionStorage.setItem('enkai_current_user', JSON.stringify(user));
    return { success: true, msg: 'Identity unlocked.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    sessionStorage.removeItem('enkai_current_user');
  };

  const purchaseMaterials = (materials: any[], area: number) => {
    if (!currentUser) return { success: false, msg: 'Unauthorized' };
    
    // Check inventory
    for (let m of materials) {
      const stockItem = inventory.find(i => i.id === m.id);
      if (!stockItem || stockItem.stockAvailable < area) {
        return { success: false, msg: `Insufficient stock for ${m.name}. Only ${stockItem?.stockAvailable || 0} m² available.` };
      }
    }

    const multiplier = REGIONAL_CO2_MULTIPLIERS[currentUser.region];
    
    const newOrders: ClientProject[] = materials.map(m => ({
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: currentUser.username,
      companyName: currentUser.companyName,
      materialId: m.id,
      materialName: m.name,
      category: m.category,
      area: area,
      region: currentUser.region,
      pipelineStage: 0,
      supervisorFeedback: 'Pending structural engineer review...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      co2Impact: (m.impactValuePerM2 * area) * multiplier,
      totalCost: m.costPerM2 * area
    }));

    // Deduct stock
    setInventory(prev => prev.map(inv => {
      const purchased = materials.find(m => m.id === inv.id);
      return purchased ? { ...inv, stockAvailable: inv.stockAvailable - area } : inv;
    }));

    setActiveProjects(prev => [...prev, ...newOrders]);
    setCart([]);
    return { success: true, msg: 'Procurement logged successfully.' };
  };

  const advanceProjectPipeline = (projectId: string, stageIndex: number) => {
    setActiveProjects(prev => prev.map(p => p.id === projectId ? { ...p, pipelineStage: stageIndex } : p));
  };

  const updateProjectFeedback = (projectId: string, feedback: string) => {
    setActiveProjects(prev => prev.map(p => p.id === projectId ? { ...p, supervisorFeedback: feedback } : p));
  };

  const restockInventory = (itemId: string, amount: number) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, stockAvailable: i.stockAvailable + amount } : i));
  };

  const raiseTicket = (site: string, material: string, desc: string) => {
    if (!currentUser) return;
    const ticket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: currentUser.username,
      siteName: site,
      materialName: material,
      issueDescription: desc,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Dispatch'
    };
    setTickets(prev => [...prev, ticket]);
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
  };

  if (!isLoaded) return <div className="min-h-screen bg-black" />; // Prevent hydration mismatch

  return (
    <AppContext.Provider value={{
      currentUser, usersRegistry, activeProjects, tickets, inventory, cart,
      signUp, login, logout, updateCart: setCart, purchaseMaterials,
      advanceProjectPipeline, updateProjectFeedback, restockInventory, raiseTicket, resolveTicket
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
}