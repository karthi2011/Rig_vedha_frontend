import React, {useState, useRef, useEffect} from 'react';
import ReactMarkdown from "react-markdown";

export default function Chatbot(){
  const [msg, setMsg] = useState('')
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [logs, loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function send(){
    if(!msg.trim()) return
    
    const userMessage = msg
    setMsg('')
    setLogs(prev => [...prev, {from:'user', text: userMessage}])
    setLoading(true)

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert on Rig Vedha. Answer the following question clearly and elaborately. 
              Focus only on Rig Vedha related topics. If the question is not about Rig Vedha, politely decline to answer or deviate that to rig vedha.
              
              Question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        const botResponse = data.candidates[0].content.parts[0].text
        setLogs(prev => [...prev, {from:'bot', text: botResponse}])
      } else {
        throw new Error('Invalid response from Gemini API')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setLogs(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please check if the Gemini API key is properly configured.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setLogs([])
  }

  const handleSuggestionClick = (suggestion) => {
    setMsg(suggestion)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🤖 Rig Vedha Chatbot</h2>
        {logs.length > 0 && (
          <button onClick={clearChat} style={styles.clearButton}>
            Clear Chat
          </button>
        )}
      </div>
      
      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {logs.length === 0 ? (
            <div style={styles.welcomeMessage}>
              <div style={styles.welcomeIcon}>📚</div>
              <h3 style={styles.welcomeTitle}>Welcome to Rig Vedha Chatbot</h3>
              <p style={styles.welcomeText}>
                Ask me anything about Rig Vedha, its hymns, philosophy, or historical significance.
                I'm here to help you explore this ancient wisdom!
              </p>
              <div style={styles.suggestions}>
                <div 
                  style={styles.suggestion}
                  onClick={() => handleSuggestionClick('Tell me about Rig Vedha')}
                >
                  Tell me about Rig Vedha
                </div>
                <div 
                  style={styles.suggestion}
                  onClick={() => handleSuggestionClick('What are the main themes in Rig Vedha?')}
                >
                  What are the main themes?
                </div>
                <div 
                  style={styles.suggestion}
                  onClick={() => handleSuggestionClick('Explain the creation hymn in Rig Vedha')}
                >
                  Explain the creation hymn
                </div>
              </div>
            </div>
          ) : (
            <>
              {logs.map((l,i) => (
                <div key={i} style={l.from === 'user' ? styles.userMessage : styles.botMessage}>
                  <div style={styles.messageHeader}>
                    <strong>{l.from === 'user' ? 'You' : 'Gemini'}:</strong>
                    <span style={styles.messageTime}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={styles.messageContent}>
                    <ReactMarkdown>{l.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {/* Loading Message */}
              {loading && (
                <div style={styles.botMessage}>
                  <div style={styles.messageHeader}>
                    <strong>Gemini:</strong>
                  </div>
                  <div style={styles.loadingMessage}>
                    <div style={styles.typingIndicator}>
                      <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
                      <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
                      <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
                    </div>
                    <span style={styles.typingText}>Thinking about Rig Vedha...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input 
            value={msg} 
            onChange={e=>setMsg(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            placeholder="Ask about Rig Vedha..."
            disabled={loading}
          />
          <button 
            onClick={send} 
            style={loading ? styles.sendButtonDisabled : styles.sendButton}
            disabled={loading || !msg.trim()}
          >
            {loading ? (
              <div style={styles.sendButtonContent}>
                <div style={styles.smallSpinner}></div>
                Sending...
              </div>
            ) : (
              <div style={styles.sendButtonContent}>
                <span>Send</span>
                <span style={styles.sendIcon}>↑</span>
              </div>
            )}
          </button>
        </div>
        <div style={styles.inputHint}>
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '10px',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'linear-gradient(45deg, #fef2f2, #fff)',
    borderBottom: '2px solid #b91c1c',
    borderRadius: '10px 10px 0 0'
  },
  title: {
    color: '#b91c1c',
    margin: 0,
    fontSize: '1.25rem'
  },
  clearButton: {
    background: 'transparent',
    color: '#b91c1c',
    border: '1px solid #b91c1c',
    padding: '0.25rem 0.75rem',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  chatContainer: {
    flex: 1,
    border: '2px solid #b91c1c',
    margin: '0 1rem',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#fafafa'
  },
  messages: {
    height: '100%',
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  welcomeMessage: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  welcomeIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  welcomeTitle: {
    color: '#b91c1c',
    marginBottom: '1rem',
    fontSize: '1.5rem'
  },
  welcomeText: {
    marginBottom: '2rem',
    lineHeight: '1.6',
    maxWidth: '400px'
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '300px'
  },
  suggestion: {
    background: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '15px 15px 0 15px',
    maxWidth: '80%',
    animation: 'messageSlideIn 0.3s ease'
  },
  botMessage: {
    alignSelf: 'flex-start',
    background: 'white',
    color: '#374151',
    padding: '0.75rem 1rem',
    borderRadius: '15px 15px 15px 0',
    border: '1px solid #e5e7eb',
    maxWidth: '80%',
    animation: 'messageSlideIn 0.3s ease'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    opacity: 0.8,
    marginBottom: '0.25rem'
  },
  messageTime: {
    fontSize: '0.7rem'
  },
  messageContent: {
    lineHeight: '1.4'
  },
  // Loading Styles
  loadingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0'
  },
  typingIndicator: {
    display: 'flex',
    gap: '3px'
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#b91c1c',
    animation: 'typingAnimation 1.4s infinite ease-in-out'
  },
  typingText: {
    color: '#6b7280',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  smallSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  // Input Styles
  inputContainer: {
    padding: '1rem',
    background: 'white',
    borderTop: '1px solid #e5e7eb'
  },
  inputWrapper: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.25rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  sendButton: {
    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '100px'
  },
  sendButtonDisabled: {
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    minWidth: '100px'
  },
  sendButtonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  sendIcon: {
    fontSize: '0.8rem'
  },
  inputHint: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    textAlign: 'center'
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes typingAnimation {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
  
  @keyframes messageSlideIn {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .suggestion:hover {
    background: #fef2f2;
    border-color: #b91c1c;
    transform: translateY(-1px);
  }
  
  input:focus {
    outline: none;
    border-color: #b91c1c;
    box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
  }
`;
document.head.appendChild(style);