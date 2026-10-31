'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  Mic,
  Image as ImageIcon,
  CheckCheck,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { processInboundWhatsAppMessage, WhatsAppResponsePayload } from '@/lib/whatsapp/handler';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  type: 'text' | 'interactive' | 'audio' | 'image';
  text?: string;
  interactive?: {
    header?: string;
    body: string;
    footer?: string;
    buttons: Array<{ id: string; title: string }>;
  };
  timestamp: string;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      type: 'text',
      text: `👋 Hello! I am your *Learnify WhatsApp Study Companion*.\n\nTry sending:\n• */cram Carnot* — Night-before high-density revision card\n• *quiz* — Daily PYQ interactive drill\n• Or tap any quick action below!`,
      timestamp: '11:15 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: textToSend,
      timestamp: timeStr
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Process via Learnify WhatsApp Handler
    setTimeout(async () => {
      const response = await processInboundWhatsAppMessage({
        from: '+1 (555) 019-2834',
        id: `msg-${Date.now()}`,
        timestamp: String(Date.now()),
        type: 'text',
        text: { body: textToSend }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: response.type,
        text: response.text,
        interactive: response.interactive,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleButtonClick = async (btnId: string, title: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: title,
      timestamp: timeStr
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const response = await processInboundWhatsAppMessage({
        from: '+1 (555) 019-2834',
        id: `msg-${Date.now()}`,
        timestamp: String(Date.now()),
        type: 'interactive',
        interactive: {
          type: 'button_reply',
          button_reply: { id: btnId, title }
        }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: response.type,
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleSendVoiceNote = async () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: '🎙️ [Voice Note: 28 seconds - Explanation of Carnot Cycle]',
      timestamp: timeStr
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const response = await processInboundWhatsAppMessage({
        from: '+1 (555) 019-2834',
        id: `msg-${Date.now()}`,
        timestamp: String(Date.now()),
        type: 'audio',
        audio: { id: 'aud-123', mime_type: 'audio/ogg' }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'text',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleSendScratchpadImage = async () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: '📷 [Photo of handwritten scratchpad calculation]',
      timestamp: timeStr
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const response = await processInboundWhatsAppMessage({
        from: '+1 (555) 019-2834',
        id: `msg-${Date.now()}`,
        timestamp: String(Date.now()),
        type: 'image',
        image: { id: 'img-123', mime_type: 'image/jpeg' }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'text',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleCopyWebhookUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/api/whatsapp/webhook`);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="w-full max-w-sm sm:max-w-md h-[90vh] max-h-[680px] bg-[#e5ddd5] dark:bg-[#0b141a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#128c7e]/30">
        {/* WhatsApp Mobile Chrome Top Bar */}
        <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              L
            </div>
            <div>
              <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>Learnify AI Companion</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-white/80">
                Official Meta Cloud API • online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWebhookUrl}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
              title="Copy Meta Webhook URL"
            >
              {copiedWebhook ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Shortcuts Banner */}
        <div className="bg-[#128c7e] px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] text-white">
          <button
            onClick={() => handleSendMessage('/cram Carnot Engine')}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0 cursor-pointer"
          >
            📚 /cram Carnot
          </button>
          <button
            onClick={() => handleSendMessage('quiz')}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0 cursor-pointer"
          >
            ⚡ Daily Quiz
          </button>
          <button
            onClick={handleSendVoiceNote}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Mic className="w-3 h-3" /> Viva Voice
          </button>
          <button
            onClick={handleSendScratchpadImage}
            className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" /> Vision Math
          </button>
        </div>

        {/* Chat Message Scroll Window */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-repeat" style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-2.5 text-xs shadow-xs leading-relaxed select-text ${
                  msg.sender === 'user'
                    ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111] dark:text-[#e9edef] rounded-tr-none'
                    : 'bg-white dark:bg-[#202c33] text-[#111] dark:text-[#e9edef] rounded-tl-none'
                }`}
              >
                {/* Text Body with basic WhatsApp markdown parsing (*bold*, ~strikethrough~) */}
                {msg.text && (
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text.split('\n').map((line, lIdx) => {
                      // Check for strikethrough ~...~
                      if (line.includes('~')) {
                        const parts = line.split('~');
                        return (
                          <div key={lIdx} className="my-0.5">
                            {parts.map((p, pIdx) =>
                              pIdx % 2 === 1 ? (
                                <span key={pIdx} className="line-through text-red-500 font-medium">
                                  {p}
                                </span>
                              ) : (
                                <span key={pIdx}>{p}</span>
                              )
                            )}
                          </div>
                        );
                      }
                      return <div key={lIdx}>{line}</div>;
                    })}
                  </div>
                )}

                {/* Interactive Question Card */}
                {msg.interactive && (
                  <div className="space-y-2 mt-1">
                    {msg.interactive.header && (
                      <div className="font-bold text-[11px] text-[#075e54] dark:text-[#25d366]">
                        {msg.interactive.header}
                      </div>
                    )}
                    <div className="text-xs">{msg.interactive.body}</div>
                    {msg.interactive.footer && (
                      <div className="text-[10px] text-gray-500">{msg.interactive.footer}</div>
                    )}

                    {/* Interactive Quick-Reply Buttons */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-1.5">
                      {msg.interactive.buttons.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleButtonClick(btn.id, btn.title)}
                          className="w-full py-1.5 px-3 rounded-md bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e4e6eb] dark:hover:bg-[#222e35] text-[#00a884] dark:text-[#00a884] font-semibold text-center text-xs transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                        >
                          {btn.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-gray-400 mt-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message or /cram..."
            className="flex-1 px-3 py-2 text-xs rounded-full bg-white dark:bg-[#2a3942] text-[#111] dark:text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            className="h-8 w-8 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
