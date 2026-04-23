import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Plus,
  HelpCircle,
  BrainCircuit,
  Trash2,
  Key,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Eye,
} from 'lucide-react';
import { saveDocument, getDocuments, deleteDocument, type FirestoreDoc } from '../firebase';
import { analyzeDocumentWithUserKey } from '../gemini';
import type { UserProfile } from '../types';

interface UploadViewProps {
  user: UserProfile | null;
}

export const UploadView: React.FC<UploadViewProps> = ({ user }) => {
  const [userApiKey, setUserApiKey] = React.useState('');
  const [showApiKeyInput, setShowApiKeyInput] = React.useState(false);
  const [pasteText, setPasteText] = React.useState('');
  const [documents, setDocuments] = React.useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fetchingDocs, setFetchingDocs] = React.useState(true);
  const [previewDoc, setPreviewDoc] = React.useState<FirestoreDoc | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch user's documents on mount
  React.useEffect(() => {
    if (user?.uid) {
      loadDocuments();
    }
  }, [user?.uid]);

  const loadDocuments = async () => {
    if (!user?.uid) return;
    setFetchingDocs(true);
    try {
      const docs = await getDocuments(user.uid);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setFetchingDocs(false);
    }
  };

  const processAndSave = async (rawText: string, type: 'file' | 'text') => {
    if (!user?.uid) return;
    if (!userApiKey.trim()) {
      setShowApiKeyInput(true);
      setUploadStatus({ type: 'error', message: 'Please enter your Gemini API key to analyze the document.' });
      return;
    }

    setLoading(true);
    setUploadStatus(null);

    try {
      // Analyze with user's API key (NOT stored)
      const analysis = await analyzeDocumentWithUserKey(userApiKey, rawText);

      // Save to Firestore
      await saveDocument(user.uid, {
        title: analysis.title,
        content: rawText,
        sections: analysis.sections,
        type,
      });

      setUploadStatus({ type: 'success', message: `"${analysis.title}" analyzed and saved successfully!` });
      setPasteText('');
      await loadDocuments();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setUploadStatus({ type: 'error', message: error.message || 'Failed to process document.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await processAndSave(text, 'file');
    } catch {
      setUploadStatus({ type: 'error', message: 'Could not read file. Please try a .txt file.' });
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasteAnalyze = () => {
    if (!pasteText.trim()) return;
    processAndSave(pasteText, 'text');
  };

  const handleDelete = async (docId: string) => {
    if (!user?.uid) return;
    try {
      await deleteDocument(user.uid, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold">Document Ingestion</h1>
        <p className="text-on-surface-variant max-w-2xl text-base md:text-lg">
          Upload legal texts to your personal library. Documents are analyzed using AI and stored securely in your account.
        </p>
      </div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <Key className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900">Your Gemini API Key</h3>
            <p className="text-sm text-amber-700 mt-1">
              To analyze uploaded documents, we need a Gemini API key. Your key is used <strong>only in the frontend</strong> for this analysis — it is <strong>never stored</strong> on any server.
            </p>
          </div>
        </div>
        
        {showApiKeyInput || userApiKey ? (
          <div className="flex gap-3 mt-3">
            <input
              type="password"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="Paste your Gemini API key here..."
              className="flex-1 border border-amber-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            {userApiKey && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Ready
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="mt-2 bg-amber-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-amber-700 transition-all text-sm flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> Enter API Key
          </button>
        )}
      </motion.div>

      {/* Status Message */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{uploadStatus.message}</span>
            <button onClick={() => setUploadStatus(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="bg-white rounded-2xl border border-outline-variant p-6 md:p-8 flex flex-col shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-7 h-7 text-black" />
            <h2 className="text-xl md:text-2xl font-display font-bold">Upload Files</h2>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 md:p-12 bg-surface-container-low hover:bg-surface-container transition-all group cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8 text-on-secondary-container" />
              </div>
            )}
            <h3 className="text-lg font-bold mb-1">
              {loading ? 'Analyzing document...' : 'Drop legal documents here'}
            </h3>
            <p className="text-on-surface-variant mb-6 text-center text-sm">
              Or click to browse your computer
            </p>
            <div className="flex gap-4 text-[11px] font-bold text-on-surface-variant border-t border-outline-variant pt-4 w-full justify-center opacity-60">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> TXT</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> MD</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> LOG</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.log,.text"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Paste Text */}
        <div className="bg-white rounded-2xl border border-outline-variant p-6 md:p-8 flex flex-col shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-7 h-7 text-black" />
            <h2 className="text-xl md:text-2xl font-display font-bold">Paste Text</h2>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="flex-1 w-full border border-outline rounded-2xl p-4 md:p-6 font-sans text-sm outline-none focus:ring-2 focus:ring-black/5 resize-none placeholder:text-slate-400 min-h-[200px]"
              placeholder="Paste excerpts, clauses, or raw legal text here for analysis..."
              disabled={loading}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5 opacity-60">
                <HelpCircle className="w-4 h-4" /> Auto-detects citations and sections
              </span>
              <button
                onClick={handlePasteAnalyze}
                disabled={loading || !pasteText.trim() || !userApiKey.trim()}
                className="bg-black text-white font-bold py-3 px-6 md:px-8 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BrainCircuit className="w-5 h-5" />
                )}
                Analyze Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Your Documents</h2>
        {fetchingDocs ? (
          <div className="flex items-center gap-3 text-on-surface-variant py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No documents uploaded yet.</p>
            <p className="text-sm mt-1">Upload legal texts above to build your personal library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-black" />
                    <h3 className="font-bold text-sm truncate max-w-[180px]">{doc.title}</h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {doc.sections.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {doc.sections.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant"
                      >
                        {s.length > 30 ? s.slice(0, 30) + '...' : s}
                      </span>
                    ))}
                    {doc.sections.length > 3 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-outline">
                        +{doc.sections.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[11px] text-outline mt-3 uppercase tracking-widest font-bold">
                  {doc.type === 'file' ? 'Uploaded File' : 'Pasted Text'}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setPreviewDoc(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-16 bg-white rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold truncate">{previewDoc.title}</h2>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {previewDoc.sections.length > 0 && (
                <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2">
                  {previewDoc.sections.map((s, i) => (
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
                  {previewDoc.content}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Status bar */}
      <div className="flex justify-center pb-8">
        <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant px-5 py-2 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">
            System Ready • {documents.length} Documents Indexed
          </span>
        </div>
      </div>
    </div>
  );
};
