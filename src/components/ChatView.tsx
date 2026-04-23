import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  Gavel,
  BrainCircuit,
  Send,
  Mic,
  Copy,
  Bookmark,
  Library,
} from 'lucide-react';
import { sendChatMessage } from '../gemini';
import type { Message, UserProfile } from '../types';

interface ChatViewProps {
  user: UserProfile | null;
}

export const ChatView: React.FC<ChatViewProps> = ({ user }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const allMessages = [...messages, userMsg];
      const response = await sendChatMessage(allMessages, text);

      // Extract source citations from response
      const sources: string[] = [];
      const lawPatterns = [
        /(?:Section|Article|Rule)\s+\d+[\w-]*/gi,
        /Indian Contract Act/gi,
        /Constitution of India/gi,
        /BNS|BNSS|BSA/g,
        /IPC|CrPC|CPC/g,
        /Companies Act/gi,
        /Consumer Protection Act/gi,
        /IT Act/gi,
        /Transfer of Property Act/gi,
      ];
      for (const pattern of lawPatterns) {
        const matches = response.match(pattern);
        if (matches) {
          for (const m of matches.slice(0, 3)) {
            if (!sources.includes(m)) sources.push(m);
          }
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        sources: sources.slice(0, 6),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Error:** ${error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 pb-48 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Header */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center mb-6 shadow-xl">
                <Gavel className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">
                LegalAssist AI
              </h2>
              <p className="max-w-md text-on-surface-variant text-lg mb-8">
                Your AI-powered Indian legal advocate. Ask me anything about Indian law — from Constitutional rights to the latest BNS provisions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  'What are my rights if arrested under BNSS?',
                  'Explain Section 420 of IPC vs BNS',
                  'How to file a consumer complaint?',
                  'What is Article 21 of the Constitution?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      textareaRef.current?.focus();
                    }}
                    className="text-left p-4 bg-white border border-outline-variant rounded-xl text-sm text-on-surface-variant hover:bg-surface-container hover:border-black/20 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
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

                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-5 md:p-6 shadow-sm border border-outline-variant relative group ${
                    msg.role === 'user'
                      ? 'bg-surface-container-highest rounded-tr-none'
                      : 'bg-white rounded-tl-none'
                  }`}
                >
                  {/* Action buttons */}
                  {msg.role === 'assistant' && (
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-outline hover:text-black"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="text-outline hover:text-black" title="Bookmark">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {copiedId === msg.id && (
                    <span className="absolute right-4 top-4 text-xs text-green-600 font-bold">
                      Copied!
                    </span>
                  )}

                  {/* Message Content */}
                  <div className="prose-legal leading-relaxed">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.sources.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 bg-surface-container rounded-full text-[11px] font-bold text-on-surface-variant border border-outline-variant flex items-center gap-1"
                        >
                          <Library className="w-3 h-3" /> {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 border border-slate-200">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Me"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {user?.displayName?.[0] || '?'}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0 mt-1">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none p-6 shadow-sm border border-outline-variant">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot" />
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot" />
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-surface via-surface to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-outline-variant p-2 focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none resize-none px-4 py-4 min-h-[56px] max-h-[200px] text-on-surface placeholder-slate-400 focus:ring-0 focus:outline-none"
              placeholder="Ask a legal question... e.g., 'What are bail provisions under BNSS?'"
              rows={1}
              disabled={loading}
            />
            <div className="flex justify-between items-center px-2 pb-2">
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-lg transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-black text-white p-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-outline mt-3">
            LegalAssist AI provides informational guidance only. Consult a licensed advocate for formal advice.
          </p>
        </div>
      </div>
    </div>
  );
};
