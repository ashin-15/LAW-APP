/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gavel, 
  MessageSquare, 
  Upload, 
  BookOpen, 
  HelpCircle, 
  Shield, 
  Search, 
  Bell, 
  Settings, 
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Library,
  FileText,
  X,
  Send,
  Mic,
  Database,
  Paperclip,
  User,
  LayoutDashboard,
  BrainCircuit,
  RefreshCw,
  MoreVertical,
  Maximize2,
  Copy,
  Bookmark
} from 'lucide-react';
import { View, Message, LegalDomain } from './types';
import { LEGAL_DOMAINS } from './constants';

const Sidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'upload', label: 'Upload Law', icon: Upload },
    { id: 'repository', label: 'Study Law', icon: BookOpen },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bg-slate-950 text-white flex flex-col p-4 z-50 border-r border-slate-800">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Gavel className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black leading-tight">LegalAssist AI</span>
          <span className="text-xs text-slate-400">Precision AI Assistant</span>
        </div>
      </div>

      <div className="px-2 mb-8">
        <button className="w-full bg-white text-slate-900 font-semibold text-sm py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Case
        </button>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-slate-800 text-white shadow-inner scale-[0.98]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg text-sm transition-all">
          <HelpCircle className="w-5 h-5" />
          Support
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg text-sm transition-all">
          <User className="w-5 h-5" />
          Account
        </button>
      </div>
    </nav>
  );
};

const TopNav = ({ title }: { title: string }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
    <h1 className="text-lg font-bold tracking-tight text-slate-900 font-display">{title}</h1>
    
    <div className="flex items-center gap-4">
      <div className="relative w-64 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search matters..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
      
      <div className="flex items-center gap-1">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 ml-2">
        <img 
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" 
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex w-full min-h-screen bg-surface">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 flex items-center gap-2">
          <Gavel className="w-8 h-8 text-black" />
          <span className="font-display font-bold text-xl">LegalAssist AI</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-black lg:text-5xl">Welcome back</h1>
            <p className="text-lg text-on-surface-variant font-sans">Sign in to continue to your legal workspace.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onStart}
              className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant hover:bg-surface-container transition-all py-3 px-4 rounded-lg shadow-sm font-medium"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="text-xs font-bold text-outline">OR</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onStart(); }}>
              <div className="space-y-1.5 text-sm font-semibold">
                <label className="text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@lawfirm.com"
                  className="w-full border border-outline rounded-lg px-4 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5 text-sm font-semibold">
                <div className="flex justify-between">
                  <label className="text-on-surface">Password</label>
                  <button className="text-black hover:underline">Forgot password?</button>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full border border-outline rounded-lg px-4 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-black/90 transition-all shadow-lg"
              >
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-on-surface-variant">
            Don't have an account? <button className="text-black font-bold hover:underline">Request Access</button>
          </p>

          <p className="text-center text-xs text-outline pt-8">
            By signing in, you agree to our <button className="hover:underline">Terms of Service</button> and <button className="hover:underline">Privacy Policy</button>.
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" 
          alt="Law Office"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40"></div>
        
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="grid grid-cols-2 gap-4 max-w-[560px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-2 glass-panel p-8 rounded-2xl space-y-4 shadow-2xl"
            >
              <BrainCircuit className="w-10 h-10 text-black mb-2" />
              <h2 className="text-3xl font-display font-bold text-black">Precision AI Assistance</h2>
              <p className="text-lg text-on-surface-variant">Accelerate your legal research and document review with enterprise-grade AI tailored for law.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 rounded-2xl space-y-3"
            >
              <ShieldCheck className="w-7 h-7 text-black" />
              <h3 className="text-lg font-bold text-black">Bank-grade Security</h3>
              <p className="text-sm text-on-surface-variant">Your case files remain encrypted and strictly confidential.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 rounded-2xl space-y-3"
            >
              <Library className="w-7 h-7 text-black" />
              <h3 className="text-lg font-bold text-black">Comprehensive Library</h3>
              <p className="text-sm text-on-surface-variant">Instant access to vast repositories of precedents and statutes.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatView = () => {
  const [messages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'I need a summary of recent precedents regarding breach of contract in the technology sector, specifically focusing on software delivery delays in India.',
      timestamp: new Date()
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Based on recent jurisprudence in India regarding software delivery delays, courts generally look at the "essence of time" clause under Section 55 of the Indian Contract Act, 1872.',
      analysis: 'ANALYSIS: TECH CONTRACT PRECEDENTS (INDIA)',
      sources: ['Indian Contract Act, 1872', 'Section 55 & 74'],
      timestamp: new Date()
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 pb-40 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <Gavel className="w-12 h-12 text-outline mb-4" />
            <h2 className="text-2xl font-display font-semibold mb-2">LegalAssistAI Session Initiated</h2>
            <p className="max-w-md text-on-surface-variant">I am your secure, AI-powered legal advocate. How may I assist you with your case research today?</p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0 mt-1">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-6 shadow-sm border border-outline-variant relative group ${
                  msg.role === 'user' 
                    ? 'bg-surface-container-highest rounded-tr-none' 
                    : 'bg-white rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                       <button className="text-outline hover:text-black"><Copy className="w-4 h-4" /></button>
                       <button className="text-outline hover:text-black"><Bookmark className="w-4 h-4" /></button>
                    </div>
                  )}

                  {msg.analysis && (
                    <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">{msg.analysis}</h3>
                  )}

                  <div className="space-y-4 leading-relaxed">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.role === 'assistant' && (
                      <>
                        <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-black font-sans">
                          <h4 className="font-bold text-sm mb-1">Key Precedent: TCS vs. State of Andhra Pradesh (2004)</h4>
                          <p className="text-sm text-on-surface-variant">Established fundamental principles regarding software as 'goods' and delivery expectations.</p>
                        </div>
                        <ul className="list-disc pl-5 space-y-2 text-on-surface-variant font-sans">
                          <li><strong className="text-on-surface">Mitigation:</strong> Aggrieved party must prove mitigation effort.</li>
                          <li><strong className="text-on-surface">Force Majeure:</strong> Scrutiny has increased post-2020.</li>
                        </ul>
                      </>
                    )}
                  </div>

                  {msg.sources && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.sources.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-surface-container rounded-full text-[11px] font-bold text-on-surface-variant border border-outline-variant flex items-center gap-1">
                          <Library className="w-3 h-3" /> {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" alt="Me" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface via-surface to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-outline-variant p-2 group focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <div className="px-4 py-2 border-b border-surface-container flex gap-2 overflow-x-auto hide-scrollbar items-center">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant border border-transparent hover:border-outline-variant transition-all">
                <Paperclip className="w-3.5 h-3.5" /> Attach Document
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <div className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-2 py-1 rounded-lg text-[11px] border border-blue-200">
                <FileText className="w-3 h-3" /> Tech_Agreement_v2.pdf <button><X className="w-3 h-3" /></button>
              </div>
            </div>
            <textarea 
              className="w-full bg-transparent border-none resize-none px-4 py-4 min-h-[60px] text-on-surface placeholder-slate-400 focus:ring-0"
              placeholder="Message LegalAssistAI... Specify sections, cases, or upload context."
              rows={1}
            />
            <div className="flex justify-between items-center px-2 pb-2">
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-lg"><Mic className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-lg"><Database className="w-5 h-5" /></button>
              </div>
              <button className="bg-black text-white p-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-outline mt-3">LegalAssistAI can make mistakes. Verify critical info.</p>
        </div>
      </div>
    </div>
  );
};

const UploadView = () => (
  <div className="p-10 max-w-7xl mx-auto space-y-10 h-full overflow-y-auto">
    <div className="space-y-2">
      <h1 className="text-4xl font-display font-bold">Document Ingestion</h1>
      <p className="text-on-surface-variant max-w-2xl text-lg">Securely add legal texts or internal firm documents to your matter context. The system will automatically index the contents.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-outline-variant p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Upload className="w-7 h-7 text-black" />
          <h2 className="text-2xl font-display font-bold">Upload Files</h2>
        </div>
        <div className="flex-1 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-12 bg-surface-container-low hover:bg-surface-container transition-all group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
            <Plus className="w-8 h-8 text-on-secondary-container" />
          </div>
          <h3 className="text-lg font-bold mb-1">Drag and drop legal documents</h3>
          <p className="text-on-surface-variant mb-8 text-center text-sm">Or click to browse your computer</p>
          <div className="flex gap-4 text-[11px] font-bold text-on-surface-variant border-t border-outline-variant pt-6 w-full justify-center opacity-60">
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> PDF</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> DOCX</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> TXT</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-7 h-7 text-black" />
          <h2 className="text-2xl font-display font-bold">Paste Text</h2>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <textarea 
            className="flex-1 w-full border border-outline rounded-2xl p-6 font-sans text-sm outline-none focus:ring-2 focus:ring-black/5 resize-none placeholder:text-slate-400"
            placeholder="Paste excerpts, clauses, or raw text directly into this field for immediate analysis..."
          />
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5 opacity-60">
              <HelpCircle className="w-4 h-4" /> Auto-detects citations and entities
            </span>
            <button className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              <BrainCircuit className="w-5 h-5" /> Analyze Text
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant px-5 py-2 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">System Ready. Awaiting Input.</span>
      </div>
    </div>
  </div>
);

const RepositoryView = () => (
  <div className="h-full overflow-y-auto">
    <header className="px-10 py-10 border-b border-outline-variant bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Legal Repository</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">A structured library of foundational statutes, codes, and historical acts. Select a domain below to begin your research.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search across all repositories..."
            className="w-full pl-12 pr-4 py-4 bg-surface rounded-xl border border-outline outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
      </div>
    </header>

    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LEGAL_DOMAINS.map((domain) => (
          <div key={domain.id} className={`bg-white border border-outline-variant rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition-all group ${domain.id === 'constitutional' ? 'lg:col-span-2' : ''}`}>
             <div className="flex items-center gap-3 mb-4">
               <div className={`w-12 h-12 rounded-full ${domain.themeColor} flex items-center justify-center`}>
                 <Library className="w-6 h-6" />
               </div>
               <h2 className="text-2xl font-display font-bold">{domain.title}</h2>
             </div>
             <p className="text-on-surface-variant mb-6 flex-grow">{domain.description}</p>
             
             <div className="space-y-2 mb-8">
               {domain.items.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-surface hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-outline-variant">
                   <FileText className="w-5 h-5 text-outline mt-1" />
                   <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.label}</span>
                     <span className="font-bold text-on-surface">{item.value}</span>
                   </div>
                 </div>
               ))}
             </div>

             <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{domain.statutesCount} Statutes Indexed</span>
               <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                 Explore Domain <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}

        <div className="bg-black text-white rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <Library className="w-14 h-14 mb-6 text-slate-400" />
          <h3 className="text-2xl font-display font-bold mb-3">Need a Specific Statute?</h3>
          <p className="text-slate-400 mb-8 max-w-xs">Use the advanced semantic search or upload a new local mandate.</p>
          <button className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-lg">
            Advanced Search
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProcessingView = () => (
  <div className="h-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-surface to-secondary-container/20">
    <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-black border-r-black opacity-40 shadow-inner"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full border-[3px] border-transparent border-b-slate-400 border-l-slate-400 opacity-30 shadow-inner"
      />
      <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border border-slate-100 z-10">
        <Gavel className="w-10 h-10 text-black" />
      </div>
    </div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-4 max-w-sm"
    >
      <h2 className="text-2xl font-display font-bold">Analyzing Statutes...</h2>
      <p className="text-on-surface-variant font-medium leading-relaxed">Please wait while our AI meticulously reviews your document to map clauses and identify key liabilities.</p>
      
      <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-8 overflow-hidden relative">
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 bg-black rounded-full"
        />
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const [view, setView] = React.useState<View>('login');

  if (view === 'login') {
    return <LandingPage onStart={() => setView('chat')} />;
  }

  const getTitle = () => {
    switch(view) {
      case 'chat': return 'Legal Assistant Chat';
      case 'upload': return 'Document Ingestion';
      case 'repository': return 'Legal Repository';
      case 'processing': return 'AI Processing';
      default: return 'Legal Assistant';
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 ml-[280px] h-screen flex flex-col overflow-hidden relative">
        <TopNav title={getTitle()} />
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'chat' && <ChatView />}
              {view === 'upload' && <UploadView />}
              {view === 'repository' && <RepositoryView />}
              {view === 'processing' && <ProcessingView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
