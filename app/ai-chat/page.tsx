"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDropzone } from "react-dropzone";
import {
  Send,
  Paperclip,
  Mic,
  Loader2,
  Sparkles,
  Bot,
  Menu,
  Plus,
  Trash2,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
  Leaf,
  Droplets,
  Sun,
  Cloud,
  Wheat,
  Apple,
  Sprout,
  Image,
  FileText,
  Camera,
  X,
  Upload,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Copy,
  Share2,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
} from "lucide-react";
import { useSession } from "@/lib/useSession";

// Types
interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mode?: string;
  model?: string;
  files?: FileAttachment[];
  isTyping?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  pinned?: boolean;
}

const suggestedQuestions = [
  { icon: Leaf, text: "What's the best time to plant maize in Cameroon?" },
  { icon: Droplets, text: "How do I manage soil erosion on my farm?" },
  { icon: Sun, text: "What crops grow best in the dry season?" },
  { icon: Cloud, text: "How does climate change affect farming?" },
  { icon: Wheat, text: "What are the best fertilizers for cassava?" },
  { icon: Apple, text: "How do I control pests on my tomato farm?" },
];

function formatTime(timestamp: Date | string | undefined): string {
  if (!timestamp) return "";
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AIChatPage() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");
  
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load sessions
  useEffect(() => {
    const saved = localStorage.getItem("agrinova_chat_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setSessions(sessionsWithDates);
        if (sessionsWithDates.length > 0) {
          setCurrentSessionId(sessionsWithDates[0].id);
          setMessages(sessionsWithDates[0].messages);
        }
      } catch (e) {
        console.error("Failed to load chat sessions:", e);
      }
    }
  }, []);

  // Save sessions
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("agrinova_chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Update messages
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) setMessages(session.messages);
    }
  }, [currentSessionId, sessions]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dropzone for file uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // File handling functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: FileAttachment = {
        id: `camera_${Date.now()}`,
        name: `photo_${new Date().toISOString()}.jpg`,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        file: file,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false,
      };
      setFiles(prev => [...prev, newFile]);
    }
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioFile: FileAttachment = {
          id: `audio_${Date.now()}`,
          name: `voice_${new Date().toISOString()}.wav`,
          type: "audio/wav",
          size: audioBlob.size,
          url: URL.createObjectURL(audioBlob),
          file: new File([audioBlob], `voice_${new Date().toISOString()}.wav`, { type: "audio/wav" }),
          preview: undefined,
          uploading: false,
          uploaded: false,
        };
        setFiles(prev => [...prev, audioFile]);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Create new session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `chat_${Date.now()}`,
      title: "New conversation",
      messages: [],
      updatedAt: new Date(),
      pinned: false,
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setFiles([]);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Delete session
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remaining[0]?.id || null);
      setMessages(remaining[0]?.messages || []);
    }
  };

  // Copy message
  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || loadingAI) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim() || "I have uploaded files for you to analyze.",
      timestamp: new Date(),
      files: [...files],
    };

    setMessages(prev => [...prev, userMessage]);
    const filesToSend = [...files];
    setFiles([]);
    setInput("");
    setLoadingAI(true);

    if (!currentSessionId) createNewSession();

    if (currentSessionId) {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId && s.title === "New conversation") {
          const title = input.trim().length > 30 ? input.trim().substring(0, 30) + "..." : input.trim();
          return { ...s, title };
        }
        return s;
      }));
    }

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const formData = new FormData();
      formData.append("message", userMessage.content);
      formData.append("conversationHistory", JSON.stringify(history));
      
      for (const file of filesToSend) {
        if (file.file) {
          formData.append("files", file.file);
        }
      }

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {
          response: "🌾 I'm AGRINOVA AI, your agricultural assistant!\n\nI can help with crops, livestock, soil, pests, and farm management in Cameroon.",
          mode: "Knowledge Base",
          model: "AGRINOVA KB"
        };
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: data.response || "I couldn't process that. Please try again.",
        timestamp: new Date(),
        mode: data.mode,
        model: data.model,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (currentSessionId) {
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: [...s.messages, userMessage, assistantMessage],
              updatedAt: new Date(),
            };
          }
          return s;
        }));
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      sendMessage(fakeEvent);
    }, 100);
  };

  if (loading || !user) {
    return (
      <div className="ai-loading">
        <div className="ai-loading-spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="ai-chat-page">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="ai-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`ai-sidebar ${sidebarOpen ? 'ai-sidebar-open' : ''}`}>
        <div className="ai-sidebar-header">
          <button className="ai-new-chat-btn" onClick={createNewSession}>
            <Plus className="ai-icon" />
            New conversation
          </button>
        </div>

        <div className="ai-sidebar-sessions">
          <div className="ai-sidebar-label">Recent chats</div>
          {sessions.length === 0 ? (
            <div className="ai-no-sessions">No conversations yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`ai-session-item ${currentSessionId === session.id ? 'ai-session-active' : ''}`}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="ai-session-info">
                  <MessageSquare className="ai-session-icon" />
                  <span className="ai-session-title">{session.title}</span>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="ai-session-delete"
                >
                  <Trash2 className="ai-icon-sm" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="ai-sidebar-footer">
          <button onClick={() => router.push("/farmer")} className="ai-sidebar-btn">
            <LayoutDashboard className="ai-icon" />
            Dashboard
          </button>
          <button onClick={() => router.push("/settings")} className="ai-sidebar-btn">
            <ChevronDown className="ai-icon" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="ai-main">
        {/* Header */}
        <header className="ai-header">
          <div className="ai-header-left">
            <button onClick={() => setSidebarOpen(true)} className="ai-menu-btn">
              <Menu className="ai-icon" />
            </button>
            <div className="ai-brand">
              <div className="ai-brand-icon">
                <Sprout className="ai-brand-icon-svg" />
              </div>
              <div>
                <span className="ai-brand-name">AGRINOVA AI</span>
                <div className="ai-brand-status">
                  <span className="ai-status-dot"></span>
                  <span className="ai-status-text">Agricultural Expert</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ai-header-actions">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (currentSessionId) {
                    setSessions(prev => prev.map(s => {
                      if (s.id === currentSessionId) return { ...s, messages: [] };
                      return s;
                    }));
                    setMessages([]);
                  }
                }}
                className="ai-clear-btn"
              >
                Clear chat
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="ai-messages">
          <div className="ai-messages-container">
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <div className="ai-welcome-icon">
                  <Sprout className="ai-welcome-icon-svg" />
                </div>
                <h1 className="ai-welcome-title">How can I help you today?</h1>
                <p className="ai-welcome-sub">
                  I'm your agricultural assistant. Ask me about crops, livestock, soil, pests, or farm management in Cameroon.
                </p>
                <div className="ai-features-grid">
                  <div className="ai-feature-item">
                    <Image className="ai-feature-icon" />
                    <span>Upload Images</span>
                  </div>
                  <div className="ai-feature-item">
                    <Camera className="ai-feature-icon" />
                    <span>Take Photos</span>
                  </div>
                  <div className="ai-feature-item">
                    <FileText className="ai-feature-icon" />
                    <span>Documents</span>
                  </div>
                  <div className="ai-feature-item">
                    <Mic className="ai-feature-icon" />
                    <span>Voice Messages</span>
                  </div>
                </div>
                <div className="ai-suggestions">
                  {suggestedQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(q.text)}
                      className="ai-suggestion-btn"
                    >
                      <q.icon className="ai-suggestion-icon" />
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ai-messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`ai-message ${msg.role === "user" ? 'ai-message-user' : 'ai-message-assistant'}`}
                  >
                    <div className={`ai-message-bubble ${msg.role === "user" ? 'ai-bubble-user' : 'ai-bubble-assistant'}`}>
                      {msg.role === "assistant" && msg.mode && (
                        <div className="ai-message-badge">
                          <span className={`ai-badge ${msg.mode === "AI" ? 'ai-badge-ai' : 'ai-badge-kb'}`}>
                            {msg.mode === "AI" ? "AI" : "Knowledge Base"}
                          </span>
                          {msg.model && <span className="ai-message-model">{msg.model}</span>}
                        </div>
                      )}
                      
                      {/* Display files in message */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="ai-message-files">
                          {msg.files.map((file) => (
                            <div key={file.id} className="ai-message-file">
                              {file.type.startsWith("image/") ? (
                                <div className="ai-message-file-preview">
                                  <img src={file.url} alt={file.name} />
                                </div>
                              ) : file.type.startsWith("audio/") ? (
                                <div className="ai-message-file-audio">
                                  <Mic className="ai-message-file-icon" />
                                  <span>Voice Message</span>
                                </div>
                              ) : (
                                <div className="ai-message-file-doc">
                                  <FileText className="ai-message-file-icon" />
                                  <span>{file.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="ai-message-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      <div className="ai-message-footer">
                        <div className={`ai-message-time ${msg.role === "user" ? 'ai-time-user' : 'ai-time-assistant'}`}>
                          {formatTime(msg.timestamp)}
                        </div>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => copyMessage(msg.content, msg.id)}
                            className="ai-message-copy"
                          >
                            {copiedMessageId === msg.id ? (
                              <CheckCircle className="ai-message-copy-icon text-green-500" />
                            ) : (
                              <Copy className="ai-message-copy-icon" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loadingAI && (
                  <div className="ai-message ai-message-assistant">
                    <div className="ai-message-bubble ai-bubble-assistant">
                      <div className="ai-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className="ai-typing-text">AGRINOVA is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="ai-file-previews">
            {files.map((file) => (
              <div key={file.id} className="ai-file-preview">
                {file.type.startsWith("image/") ? (
                  <div className="ai-file-preview-img">
                    <img src={file.url} alt={file.name} />
                  </div>
                ) : file.type.startsWith("audio/") ? (
                  <div className="ai-file-preview-audio">
                    <Mic className="ai-file-preview-icon" />
                  </div>
                ) : (
                  <div className="ai-file-preview-doc">
                    <FileText className="ai-file-preview-icon" />
                  </div>
                )}
                <div className="ai-file-preview-info">
                  <span className="ai-file-preview-name">{file.name}</span>
                  <span className="ai-file-preview-size">{formatFileSize(file.size)}</span>
                </div>
                <button onClick={() => removeFile(file.id)} className="ai-file-preview-remove">
                  <X className="ai-file-preview-remove-icon" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-input-area">
          <div className="ai-input-container">
            {/* Drag and drop zone */}
            <div {...getRootProps()} className="ai-dropzone">
              <input {...getInputProps()} />
              {isDragActive && (
                <div className="ai-dropzone-active">
                  <Upload className="ai-dropzone-icon" />
                  <span>Drop your files here</span>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="ai-input-form">
              <div className="ai-input-wrapper">
                <div className="ai-input-buttons">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="ai-input-btn"
                    title="Upload files"
                  >
                    <Paperclip className="ai-icon" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    multiple
                    onChange={handleFileUpload}
                    className="ai-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="ai-input-btn"
                    title="Take photo"
                  >
                    <Camera className="ai-icon" />
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="ai-file-input"
                  />
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`ai-input-btn ${isRecording ? 'ai-input-btn-recording' : ''}`}
                    title={isRecording ? "Stop recording" : "Voice input"}
                  >
                    <Mic className="ai-icon" />
                  </button>
                </div>
                
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about farming, crops, pests... or upload files"
                  rows={1}
                  className="ai-input-textarea"
                  disabled={loadingAI}
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 200) + "px";
                  }}
                />
                
                <button
                  type="submit"
                  disabled={(!input.trim() && files.length === 0) || loadingAI}
                  className="ai-send-btn"
                >
                  {loadingAI ? (
                    <Loader2 className="ai-icon animate-spin" />
                  ) : (
                    <Send className="ai-icon" />
                  )}
                </button>
              </div>
              <div className="ai-input-footer">
                <Sparkles className="ai-footer-icon" />
                <span>AGRINOVA AI • Upload images, documents, or voice messages</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Page Container */
        .ai-chat-page {
          display: flex;
          height: 100vh;
          background: #f7f7f8;
          overflow: hidden;
        }

        /* Loading */
        .ai-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f7f7f8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .ai-loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid #e5e7eb;
          border-top-color: #10a37f;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Overlay */
        .ai-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 40;
          display: none;
        }

        @media (max-width: 768px) {
          .ai-overlay {
            display: block;
          }
        }

        /* Sidebar */
        .ai-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          width: 18rem;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          transform: translateX(-100%);
        }

        .ai-sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .ai-sidebar {
            position: static;
            transform: translateX(0);
          }
        }

        .ai-sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .ai-new-chat-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #10a37f;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .ai-new-chat-btn:hover {
          background: #0d8b6e;
        }

        .ai-sidebar-sessions {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
        }

        .ai-sidebar-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0 0.5rem;
          margin-bottom: 0.75rem;
        }

        .ai-no-sessions {
          text-align: center;
          padding: 2rem 0;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .ai-session-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.25rem;
        }

        .ai-session-item:hover {
          background: #f9fafb;
        }

        .ai-session-active {
          background: #f0f9f6;
          border: 1px solid rgba(16, 163, 127, 0.2);
        }

        .ai-session-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          flex: 1;
        }

        .ai-session-icon {
          width: 1rem;
          height: 1rem;
          color: #9ca3af;
          flex-shrink: 0;
        }

        .ai-session-active .ai-session-icon {
          color: #10a37f;
        }

        .ai-session-title {
          font-size: 0.875rem;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ai-session-delete {
          padding: 0.25rem;
          background: none;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-session-item:hover .ai-session-delete {
          opacity: 1;
        }

        .ai-session-delete:hover {
          background: #f3f4f6;
        }

        .ai-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
          background: white;
        }

        .ai-sidebar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          background: none;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
          transition: background 0.2s;
        }

        .ai-sidebar-btn:hover {
          background: #f9fafb;
        }

        .ai-sidebar-btn + .ai-sidebar-btn {
          margin-top: 0.25rem;
        }

        .ai-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .ai-icon-sm {
          width: 0.875rem;
          height: 0.875rem;
          color: #9ca3af;
        }

        /* Main Chat */
        .ai-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #f7f7f8;
        }

        /* Header */
        .ai-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          display: none;
        }

        .ai-menu-btn:hover {
          background: #f3f4f6;
        }

        @media (max-width: 768px) {
          .ai-menu-btn {
            display: block;
          }
        }

        .ai-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-brand-icon {
          width: 2rem;
          height: 2rem;
          background: rgba(16, 163, 127, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-brand-icon-svg {
          width: 1.25rem;
          height: 1.25rem;
          color: #10a37f;
        }

        .ai-brand-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .ai-brand-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .ai-status-dot {
          width: 0.375rem;
          height: 0.375rem;
          background: #10a37f;
          border-radius: 50%;
        }

        .ai-status-text {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .ai-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-clear-btn {
          font-size: 0.75rem;
          color: #9ca3af;
          background: none;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-clear-btn:hover {
          color: #374151;
          background: #f3f4f6;
        }

        /* Messages */
        .ai-messages {
          flex: 1;
          overflow-y: auto;
        }

        .ai-messages-container {
          max-width: 48rem;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        /* Welcome */
        .ai-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 28rem;
          text-align: center;
        }

        .ai-welcome-icon {
          width: 5rem;
          height: 5rem;
          background: rgba(16, 163, 127, 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .ai-welcome-icon-svg {
          width: 2.5rem;
          height: 2.5rem;
          color: #10a37f;
        }

        .ai-welcome-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .ai-welcome-sub {
          color: #6b7280;
          font-size: 0.875rem;
          max-width: 28rem;
          margin-bottom: 1.5rem;
        }

        .ai-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          width: 100%;
          max-width: 32rem;
          margin-bottom: 1.5rem;
        }

        .ai-feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .ai-feature-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #10a37f;
        }

        @media (max-width: 480px) {
          .ai-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .ai-suggestions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          width: 100%;
          max-width: 42rem;
        }

        @media (max-width: 480px) {
          .ai-suggestions {
            grid-template-columns: 1fr;
          }
        }

        .ai-suggestion-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .ai-suggestion-btn:hover {
          border-color: #10a37f;
          background: #f0f9f6;
        }

        .ai-suggestion-icon {
          width: 1rem;
          height: 1rem;
          color: #10a37f;
          flex-shrink: 0;
        }

        /* Messages List */
        .ai-messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-message {
          display: flex;
        }

        .ai-message-user {
          justify-content: flex-end;
        }

        .ai-message-assistant {
          justify-content: flex-start;
        }

        .ai-message-bubble {
          max-width: 85%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          position: relative;
        }

        .ai-bubble-user {
          background: #10a37f;
          color: white;
          border-top-right-radius: 0.25rem;
        }

        .ai-bubble-assistant {
          background: white;
          border: 1px solid #e5e7eb;
          border-top-left-radius: 0.25rem;
        }

        .ai-message-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.375rem;
          font-size: 0.75rem;
        }

        .ai-badge {
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 500;
        }

        .ai-badge-ai {
          background: rgba(16, 163, 127, 0.1);
          color: #10a37f;
        }

        .ai-badge-kb {
          background: #f3f4f6;
          color: #6b7280;
        }

        .ai-message-model {
          color: #9ca3af;
          font-size: 0.625rem;
        }

        .ai-message-content {
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .ai-message-content p {
          margin: 0.25rem 0;
        }

        .ai-message-content ul,
        .ai-message-content ol {
          margin: 0.25rem 0;
          padding-left: 1.25rem;
        }

        .ai-message-content code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        .ai-message-content pre {
          background: #f3f4f6;
          padding: 0.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-size: 0.75rem;
        }

        .ai-message-files {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ai-message-file {
          padding: 0.25rem 0.5rem;
          background: rgba(0,0,0,0.05);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .ai-message-file-preview {
          width: 2rem;
          height: 2rem;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .ai-message-file-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ai-message-file-audio,
        .ai-message-file-doc {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .ai-message-file-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .ai-message-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.375rem;
        }

        .ai-message-time {
          font-size: 0.625rem;
        }

        .ai-time-user {
          color: rgba(255,255,255,0.6);
        }

        .ai-time-assistant {
          color: #9ca3af;
        }

        .ai-message-copy {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-message-copy:hover {
          background: #f3f4f6;
        }

        .ai-message-copy-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #9ca3af;
        }

        /* Typing */
        .ai-typing {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .ai-typing span {
          width: 0.5rem;
          height: 0.5rem;
          background: #10a37f;
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite;
        }

        .ai-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .ai-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .ai-typing-text {
          font-size: 0.875rem;
          color: #6b7280;
          margin-left: 0.25rem;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        /* File Previews */
        .ai-file-previews {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .ai-file-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .ai-file-preview-img {
          width: 2rem;
          height: 2rem;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .ai-file-preview-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ai-file-preview-audio,
        .ai-file-preview-doc {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          background: #f3f4f6;
          border-radius: 0.25rem;
        }

        .ai-file-preview-icon {
          width: 1rem;
          height: 1rem;
          color: #6b7280;
        }

        .ai-file-preview-info {
          display: flex;
          flex-direction: column;
        }

        .ai-file-preview-name {
          font-size: 0.75rem;
          color: #374151;
          max-width: 6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ai-file-preview-size {
          font-size: 0.625rem;
          color: #9ca3af;
        }

        .ai-file-preview-remove {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .ai-file-preview-remove:hover {
          background: #f3f4f6;
        }

        .ai-file-preview-remove-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #9ca3af;
        }

        /* Input */
        .ai-input-area {
          border-top: 1px solid #e5e7eb;
          background: white;
          padding: 0.75rem 1rem;
          flex-shrink: 0;
        }

        .ai-input-container {
          max-width: 48rem;
          margin: 0 auto;
          position: relative;
        }

        .ai-dropzone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        .ai-dropzone-active {
          position: absolute;
          inset: -0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(16, 163, 127, 0.05);
          border: 2px dashed #10a37f;
          border-radius: 1rem;
          pointer-events: none;
          gap: 0.5rem;
          color: #10a37f;
        }

        .ai-dropzone-icon {
          width: 2rem;
          height: 2rem;
        }

        .ai-file-input {
          display: none;
        }

        .ai-input-form {
          position: relative;
        }

        .ai-input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          background: #f7f7f8;
          border-radius: 1rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .ai-input-wrapper:focus-within {
          border-color: #10a37f;
          background: white;
          box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
        }

        .ai-input-buttons {
          display: flex;
          align-items: center;
          gap: 0.125rem;
        }

        .ai-input-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-input-btn:hover {
          background: #f3f4f6;
          color: #4b5563;
        }

        .ai-input-btn-recording {
          color: #ef4444;
          animation: pulse-recording 1s ease-in-out infinite;
        }

        @keyframes pulse-recording {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .ai-input-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: #1f2937;
          font-size: 0.875rem;
          padding: 0.5rem 0;
          min-height: 2.5rem;
          max-height: 12.5rem;
          font-family: inherit;
        }

        .ai-input-textarea::placeholder {
          color: #9ca3af;
        }

        .ai-input-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-send-btn {
          padding: 0.5rem;
          background: #10a37f;
          border: none;
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-send-btn:hover:not(:disabled) {
          background: #0d8b6e;
        }

        .ai-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-input-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .ai-footer-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}