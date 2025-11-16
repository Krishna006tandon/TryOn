import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tryon-d5zv.onrender.com';

const Chatbot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your shopping assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot`, {
        message: input,
        userId,
        conversationHistory: messages,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      if (error.response && error.response.data) {
        console.error('Server error details:', error.response.data);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'background-color 0.2s',
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '384px',
    height: '500px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 20px 25px rgba(0,0,0,0.3)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    color: '#000',
  };

  const headerStyle = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const messagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const inputAreaStyle = {
    borderTop: '1px solid #e5e5e5',
    padding: '16px',
    display: 'flex',
    gap: '8px',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
        aria-label="Open Chatbot"
      >
        <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={chatWindowStyle}
          >
            <div style={headerStyle}>
              <h3 style={{ margin: 0, fontWeight: 500 }}>Shopping Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }}
                onMouseEnter={(e) => e.target.style.color = '#ccc'}
                onMouseLeave={(e) => e.target.style.color = '#fff'}
              >
                ✕
              </button>
            </div>

            <div style={messagesStyle}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: msg.role === 'user' ? '#000' : '#f3f4f6',
                      color: msg.role === 'user' ? '#fff' : '#000',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px' }}>{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={inputAreaStyle}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#000'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) e.target.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) e.target.style.backgroundColor = '#000';
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;

