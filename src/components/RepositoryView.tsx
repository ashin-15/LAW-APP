import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Library,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Loader2,
  X,
  Scale,
} from 'lucide-react';
import { LEGAL_DOMAINS } from '../constants';
import { getApprovedLaws } from '../firebase';
import type { VerifiedLaw } from '../types';

export const RepositoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [approvedLaws, setApprovedLaws] = React.useState<VerifiedLaw[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedLawId, setExpandedLawId] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [previewLaw, setPreviewLaw] = React.useState<VerifiedLaw | null>(null);

  React.useEffect(() => {
    loadApprovedLaws();
  }, []);

  const loadApprovedLaws = async () => {
    setLoading(true);
    try {
      const laws = await getApprovedLaws();
      setApprovedLaws(laws);
    } catch (err) {
      console.error('Error loading approved laws:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group laws by category
  const lawsByCategory = React.useMemo(() => {
    const grouped: Record<string, VerifiedLaw[]> = {};
    for (const domain of LEGAL_DOMAINS) {
      grouped[domain.id] = [];
    }
    for (const law of approvedLaws) {
      if (grouped[law.category]) {
        grouped[law.category].push(law);
      } else {
        // Fallback to constitutional if category doesn't match
        grouped['constitutional']?.push(law);
      }
    }
    return grouped;
  }, [approvedLaws]);

  // Filter by search query
  const filteredDomains = React.useMemo(() => {
    if (!searchQuery.trim() && !selectedCategory) return LEGAL_DOMAINS;
    
    let domains = LEGAL_DOMAINS;
    if (selectedCategory) {
      domains = domains.filter((d) => d.id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      domains = domains.filter((d) => {
        const domainMatch =
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q);
        const lawsMatch = (lawsByCategory[d.id] || []).some(
          (law) =>
            law.title.toLowerCase().includes(q) ||
            law.summary.toLowerCase().includes(q) ||
            law.sections.some((s) => s.toLowerCase().includes(q))
        );
        return domainMatch || lawsMatch;
      });
    }
    return domains;
  }, [searchQuery, selectedCategory, lawsByCategory]);

  // Filter laws within a domain by search
  const getFilteredLawsForDomain = (domainId: string) => {
    const laws = lawsByCategory[domainId] || [];
    if (!searchQuery.trim()) return laws;
    const q = searchQuery.toLowerCase();
    return laws.filter(
      (law) =>
        law.title.toLowerCase().includes(q) ||
        law.summary.toLowerCase().includes(q) ||
        law.sections.some((s) => s.toLowerCase().includes(q))
    );
  };

  const getCategoryColor = (catId: string) => {
    const colors: Record<string, string> = {
      constitutional: 'from-indigo-500 to-purple-600',
      civil: 'from-blue-500 to-cyan-600',
      criminal: 'from-red-500 to-rose-600',
      corporate: 'from-slate-500 to-gray-700',
      labour: 'from-amber-500 to-orange-600',
    };
    return colors[catId] || 'from-gray-500 to-gray-700';
  };

  const getCategoryBg = (catId: string) => {
    const colors: Record<string, string> = {
      constitutional: 'bg-indigo-50 border-indigo-200',
      civil: 'bg-blue-50 border-blue-200',
      criminal: 'bg-red-50 border-red-200',
      corporate: 'bg-slate-50 border-slate-200',
      labour: 'bg-amber-50 border-amber-200',
    };
    return colors[catId] || 'bg-gray-50 border-gray-200';
  };

  const totalApproved = approvedLaws.length;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-6 md:px-10 py-8 md:py-10 border-b border-outline-variant bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold">
                    Study Law
                  </h1>
                  <p className="text-on-surface-variant text-sm">
                    {totalApproved} verified laws available • Browse by domain
                  </p>
                </div>
              </div>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laws, sections, statutes..."
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-surface rounded-xl border border-outline outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                !selectedCategory
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-slate-50'
              }`}
            >
              All Domains
            </button>
            {LEGAL_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedCategory(selectedCategory === domain.id ? null : domain.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === domain.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                {domain.title}
                {(lawsByCategory[domain.id]?.length || 0) > 0 && (
                  <span className="ml-1 opacity-60">({lawsByCategory[domain.id]?.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-on-surface-variant" />
              <p className="text-on-surface-variant font-medium">Loading study materials...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredDomains.map((domain, index) => {
              const domainLaws = getFilteredLawsForDomain(domain.id);
              
              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Domain Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(domain.id)} flex items-center justify-center shadow-lg`}>
                      <Library className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-display font-bold">{domain.title}</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">{domain.description}</p>
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-2 rounded-full hidden md:inline-flex">
                      {domainLaws.length} {domainLaws.length === 1 ? 'Law' : 'Laws'}
                    </span>
                  </div>

                  {/* Domain Laws */}
                  {domainLaws.length === 0 ? (
                    <div className={`rounded-2xl p-8 text-center border ${getCategoryBg(domain.id)}`}>
                      <Scale className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-on-surface-variant">No approved laws in this category yet</p>
                      <p className="text-sm text-outline mt-1">Upload a law and it will appear here once approved by admin</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domainLaws.map((law) => (
                        <motion.div
                          key={law.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white border border-outline-variant rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="p-5 md:p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2.5">
                                <FileText className="w-5 h-5 text-on-surface-variant shrink-0" />
                                <h3 className="font-display font-bold text-base">{law.title}</h3>
                              </div>
                              <button
                                onClick={() => setPreviewLaw(law)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Read Full Law"
                              >
                                <BookOpen className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                              {law.summary}
                            </p>

                            {/* Sections */}
                            {law.sections.length > 0 && (
                              <div>
                                <button
                                  onClick={() => setExpandedLawId(expandedLawId === law.id ? null : law.id)}
                                  className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors mb-2"
                                >
                                  {expandedLawId === law.id ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                  {law.sections.length} Sections
                                </button>
                                <AnimatePresence>
                                  {expandedLawId === law.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="flex flex-wrap gap-1.5">
                                        {law.sections.map((s, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant"
                                          >
                                            {s.length > 40 ? s.slice(0, 40) + '...' : s}
                                          </span>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                                {law.type === 'file' ? 'Uploaded File' : 'Text Entry'}
                              </span>
                              <button
                                onClick={() => setPreviewLaw(law)}
                                className="text-xs font-bold text-black hover:underline"
                              >
                                Read Full Law →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Domain Divider */}
                  <div className="border-b border-outline-variant mt-10" />
                </motion.div>
              );
            })}

            {/* No results */}
            {filteredDomains.length === 0 && searchQuery && (
              <div className="text-center py-16 text-on-surface-variant">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium text-lg">No results for "{searchQuery}"</p>
                <p className="text-sm mt-1">Try a different search term or browse all domains.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Law Preview Modal */}
      <AnimatePresence>
        {previewLaw && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setPreviewLaw(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-12 bg-white rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(previewLaw.category)} flex items-center justify-center`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-display font-bold truncate">{previewLaw.title}</h2>
                    <p className="text-xs text-on-surface-variant">
                      {LEGAL_DOMAINS.find((d) => d.id === previewLaw.category)?.title || previewLaw.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewLaw(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {previewLaw.summary && (
                <div className="px-6 py-3 border-b border-slate-100 bg-surface-container-low">
                  <p className="text-sm text-on-surface-variant font-medium">{previewLaw.summary}</p>
                </div>
              )}
              {previewLaw.sections.length > 0 && (
                <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2">
                  {previewLaw.sections.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6">
                <pre className="whitespace-pre-wrap text-sm text-on-surface font-sans leading-relaxed">
                  {previewLaw.content}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
