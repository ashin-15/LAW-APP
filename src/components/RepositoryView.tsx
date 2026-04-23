import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Library,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { LEGAL_DOMAINS } from '../constants';

export const RepositoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDomains = searchQuery.trim()
    ? LEGAL_DOMAINS.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.items.some(
            (item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.value.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : LEGAL_DOMAINS;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-6 md:px-10 py-8 md:py-10 border-b border-outline-variant bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Indian Legal Repository
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-base md:text-lg">
              A structured library of Indian statutes, codes, and acts. Select a domain to explore relevant laws.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all domains..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-surface rounded-xl border border-outline outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>
      </header>

      {/* Domain Grid */}
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredDomains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col shadow-sm hover:shadow-md transition-all group ${
                domain.id === 'constitutional' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full ${domain.themeColor} flex items-center justify-center`}
                >
                  <Library className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold">
                  {domain.title}
                </h2>
              </div>

              <p className="text-on-surface-variant mb-6 flex-grow text-sm md:text-base">
                {domain.description}
              </p>

              <div className="space-y-2 mb-6 md:mb-8">
                {domain.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-surface hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-outline-variant"
                  >
                    <FileText className="w-5 h-5 text-outline mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                        {item.label}
                      </span>
                      <span className="font-bold text-on-surface text-sm">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 md:pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">
                  {domain.statutesCount} Statutes Indexed
                </span>
                <button className="bg-black text-white px-4 md:px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  Explore Domain <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <div className="bg-black text-white rounded-2xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <Library className="w-14 h-14 mb-6 text-slate-400" />
            <h3 className="text-xl md:text-2xl font-display font-bold mb-3">
              Need a Specific Statute?
            </h3>
            <p className="text-slate-400 mb-6 max-w-xs text-sm">
              Use the AI chat to ask about any Indian law, or upload a new legal document to your library.
            </p>
            <button className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> India Code Portal
            </button>
          </div>
        </div>

        {/* No results */}
        {filteredDomains.length === 0 && searchQuery && (
          <div className="text-center py-16 text-on-surface-variant">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg">No domains match "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term or browse all domains.</p>
          </div>
        )}
      </div>
    </div>
  );
};
