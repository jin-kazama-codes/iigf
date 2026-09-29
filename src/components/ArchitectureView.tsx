import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  Sparkles, 
  Workflow, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ArrowDown, 
  Database, 
  Bot, 
  Globe, 
  Calendar, 
  MessageSquare,
  Repeat
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'modules' | 'ecosystem' | 'roadmap' | 'workforce'>('modules');

  const modules = [
    {
      num: '01',
      title: 'AI Buyer Experience',
      items: ['AI Website Concierge', 'WhatsApp AI Multi-Channel', 'Voice AI Intake', 'Conversational Registration', 'Buyer Intent Qualification']
    },
    {
      num: '02',
      title: 'AI Matchmaking & Discovery',
      items: ['Buyer ↔ Exhibitor Algorithm', 'Multimodal Product Matching', 'Reverse Matchmaking (Natural RFQ)', 'Capacity & Audit Scoring', 'Tailored Recommendation Feeds']
    },
    {
      num: '03',
      title: 'AI Fair Companion',
      items: ['Mobile Responsive Web App', 'Indoor Stall Waypoint Navigation', 'Real-Time Speech Translation (7 Languages)', 'Dynamic Agenda Optimizer', 'Beacon & Proximity Alerts']
    },
    {
      num: '04',
      title: 'AI Exhibitor Copilot',
      items: ['Badge Scan Lead Capture', 'Algorithmic Lead Scoring (1-100)', 'Meeting Audio Transcription & AI Summary', 'Automated Commercial Follow-Up (WhatsApp/Email)']
    },
    {
      num: '05',
      title: 'Organizer Command Center',
      items: ['Unified Buyer & Exhibitor CRM', 'Live Event Operational Telemetry', 'AI Organizer Copilot ("Ask IIGF Data")', 'Macro Trade Flow Analytics', 'Exhibitor Meeting Parity Engine']
    },
    {
      num: '06',
      title: 'AI Conversion & 365 Network',
      items: ['Automated RFQ Dispatching', 'Multi-touch Re-engagement Engine', 'Sample Dispatch Tracking', 'Year-Round Digital Sourcing Network', 'Off-Cycle Supplier Matchmaking']
    }
  ];

  const roadmapPhases = [
    {
      phase: 'PHASE 1',
      name: 'AI Support Layer',
      scope: 'Website Concierge + WhatsApp AI + Multi-language Voice assistance for preliminary visitor queries and FAQ automation.',
      status: 'Active Prototype'
    },
    {
      phase: 'PHASE 2',
      name: 'AI Buyer Intelligence',
      scope: 'Conversational registration, automatic buyer qualification, intent scoring, and forward/reverse supplier matchmaking.',
      status: 'Ready for Staging'
    },
    {
      phase: 'PHASE 3',
      name: 'AI Fair Companion',
      scope: 'On-site floor navigation, synchronized meetings agenda, speech translation, and instant lead badge capture.',
      status: 'Planned for Fair Deployment'
    },
    {
      phase: 'PHASE 4',
      name: 'AI Conversion Engine',
      scope: 'Meeting transcript extraction, structured commitments, and autonomous WhatsApp/Email follow-up pipelines.',
      status: 'Planned for Post-Fair'
    },
    {
      phase: 'PHASE 5',
      name: '365-Day Sourcing Network',
      scope: 'Transforming the 3-day physical event into a continuous, year-round global sourcing ecosystem for Indian textile exporters.',
      status: 'Long-Term Strategic Horizon'
    }
  ];

  const aiAgents = [
    { name: 'AI Receptionist', role: 'First-touch visitor triage and multilingual greeting across web and WhatsApp.' },
    { name: 'AI Registration Agent', role: 'Conversational onboarding and validation of international buyer credentials.' },
    { name: 'AI Buyer Qualification Agent', role: 'Analyzes procurement volume, target MOQ, and ethical audit criteria.' },
    { name: 'AI Matchmaking Agent', role: 'Calculates high-dimensional vector similarity across 426 manufacturer profiles.' },
    { name: 'AI Appointment Agent', role: 'Coordinates B2B calendar slots and eliminates booth scheduling conflicts.' },
    { name: 'AI Travel Concierge', role: 'Assists international buyers with visa invitation letters, shuttles, and hotels.' },
    { name: 'AI Translation Agent', role: 'Zero-latency neural translation between Hindi/regional languages and buyer languages.' },
    { name: 'AI Event Support Agent', role: 'Provides live directions, seminar timings, and VIP lounge amenities.' },
    { name: 'AI Lead Qualification Agent', role: 'Scores booth interactions and ranks hot buying intent for sales teams.' },
    { name: 'AI Follow-up Agent', role: 'Generates post-meeting summaries, quotes, and catalog dispatches.' },
    { name: 'AI CRM Agent', role: 'Provides instant natural language query answers for fair organizers.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-[#D97706] uppercase tracking-wider block mb-2">
          System Architecture & Strategic Blueprint
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          From Event Platform to AI-Powered Sourcing Ecosystem
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          How IIGF AI provides an intelligent automation layer without requiring IIGF to replace its current website, registration systems, or event infrastructure.
        </p>

        {/* Section Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveSection('modules')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'modules' ? 'bg-[#0B1B3D] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            6 Major AI Modules
          </button>
          <button
            onClick={() => setActiveSection('ecosystem')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'ecosystem' ? 'bg-[#0B1B3D] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Built Around Existing Ecosystem
          </button>
          <button
            onClick={() => setActiveSection('roadmap')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'roadmap' ? 'bg-[#0B1B3D] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5-Phase Strategic Roadmap
          </button>
          <button
            onClick={() => setActiveSection('workforce')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'workforce' ? 'bg-[#0B1B3D] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            The Core AI Workforce
          </button>
        </div>
      </div>

      {/* SECTION 29: BUILT AROUND YOUR EXISTING ECOSYSTEM (Do Not Reinvent the Wheel) */}
      {(activeSection === 'ecosystem' || activeSection === 'modules') && (
        <div className="bg-[#0B1B3D] text-white rounded-2xl p-6 sm:p-10 border border-[#1E3A68] shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block mb-2">
              Architecture Core Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Built Around Your Existing Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              IIGF does not need to replace its existing website (indiaapparelfair.com), existing registration systems, databases, or event infrastructure.
              <strong> IIGF AI acts as an intelligent automation and intelligence layer on top of existing systems.</strong>
            </p>
          </div>

          {/* Equation Representation (Section 29) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
            <div className="bg-[#07132B] p-5 rounded-xl border border-[#23467B] md:col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Legacy & Production Layer</span>
              <h3 className="text-base font-bold text-white">Existing IIGF Infrastructure</h3>
              <p className="text-xs text-slate-400 mt-1">Current website, exhibitor registries, registration forms, venue badges & ticketing</p>
            </div>

            <div className="text-2xl font-black text-[#F59E0B] flex items-center justify-center">
              +
            </div>

            <div className="bg-[#07132B] p-5 rounded-xl border border-[#D97706]/70 md:col-span-2">
              <span className="text-[10px] text-[#F59E0B] uppercase font-bold block mb-1">Intelligence Layer</span>
              <h3 className="text-base font-bold text-white">IIGF AI Intelligence Layer</h3>
              <p className="text-xs text-slate-300 mt-1">Multimodal matchmaking, RAG knowledge retrieval, real-time translation & follow-up engine</p>
            </div>
          </div>

          <div className="my-4 text-center text-2xl font-black text-[#10B981]">=</div>

          <div className="bg-gradient-to-r from-[#10B981]/20 via-[#0B1B3D] to-[#10B981]/20 p-5 rounded-xl border border-[#10B981]/40 text-center">
            <span className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider block">Unified Transformation</span>
            <h3 className="text-lg font-bold text-white mt-1">AI-Powered IIGF Global Sourcing Ecosystem</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl mx-auto">
              Empowering buyers with instant matches and giving organizers full intelligence without operational downtime or data migration friction.
            </p>
          </div>

          {/* Section 28 Diagram representation */}
          <div className="mt-8 pt-6 border-t border-[#1E3A68] text-xs space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-center">
              System Integration Flow
            </h3>

            <div className="bg-[#07132B] p-4 rounded-xl border border-[#1E3A68] font-mono text-[11px] text-slate-300 max-w-xl mx-auto space-y-2">
              <div className="p-2 bg-[#122A50] rounded text-center font-bold text-white">
                EXPERIENCE LAYER: Web Sourcing Portal / WhatsApp Bot / Voice AI
              </div>
              <div className="text-center text-[#F59E0B]">▼</div>
              <div className="p-2 bg-[#1B3666] rounded text-center font-bold text-[#FBBF24]">
                INTELLIGENCE LAYER: Vector Embeddings / RAG Catalog / Matchmaker
              </div>
              <div className="text-center text-[#F59E0B]">▼</div>
              <div className="p-2 bg-[#122A50] rounded text-center font-bold text-white">
                IIGF AI CRM: Buyer Telemetry / Exhibitor Directory / RFQs / Meetings
              </div>
              <div className="text-center text-[#F59E0B]">▼</div>
              <div className="p-2 bg-[#0B1E40] border border-[#274B7F] rounded text-center text-slate-300">
                EXISTING IIGF SYSTEMS (indiaapparelfair.com, AEPC, IGFA Registry)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 25: SIX MAJOR AI MODULES */}
      {(activeSection === 'modules') && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Six Major AI Modules</h2>
            <p className="text-xs text-slate-500 mt-1">Comprehensive modular capability breakdown</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.num}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#D97706] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#D97706]">{m.num}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Core AI Module</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {m.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 26: FIVE-PHASE ROADMAP */}
      {(activeSection === 'roadmap' || activeSection === 'modules') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-[#D97706] uppercase tracking-wider block">Evolutionary Pathway</span>
              <h2 className="text-xl font-bold text-slate-900">Five-Phase Platform Roadmap</h2>
            </div>
            <span className="text-xs text-slate-500">From Single Event to 365-Day Sourcing Network</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roadmapPhases.map((r, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#0B1B3D] block">{r.phase}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{r.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {r.scope}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] font-semibold text-[#B45309]">
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 27: THE CORE AI WORKFORCE */}
      {(activeSection === 'workforce' || activeSection === 'modules') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#D97706] uppercase tracking-wider block">Specialized Multi-Agent Mesh</span>
            <h2 className="text-xl font-bold text-slate-900">The Core AI Workforce</h2>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous agents collaborating through the central IIGF AI Intelligence Layer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAgents.map((agent, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#D97706] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0B1B3D] text-white flex items-center justify-center font-bold text-xs">
                    <Bot className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-9">
                  {agent.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
