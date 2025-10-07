// src/App.jsx
import React from "react";

export default function Main() {
  const openPdfWindow = () => {
    window.open('/pdf', 'pdfWindow', 'width=1000,height=700,left=200,top=100');
  };

  const openQuizWindow = () => {
    window.open('/quiz', 'quizWindow', 'width=800,height=700,left=200,top=100');
  };

  const openChatWindow = () => {
    window.open('/chat', 'chatWindow', 'width=600,height=700,left=200,top=100');
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.content}>
        <h1 style={styles.header}>
          Rig Vedha Knowledge Portal
        </h1>
        
        <p style={styles.subtitle}>
          Explore the ancient wisdom of Rig Vedha through interactive features
        </p>

        <div style={styles.buttonGrid}>
          <div style={styles.buttonCard} className="button-card">
            <div style={styles.icon}>📖</div>
            <h3 style={styles.buttonTitle}>PDF Reader</h3>
            <p style={styles.buttonDescription}>
              Read the complete Rig Vedha text with our built-in PDF viewer
            </p>
            <button style={styles.actionButton} onClick={openPdfWindow} className="action-button">
              Open PDF Reader
            </button>
          </div>

          <div style={styles.buttonCard} className="button-card">
            <div style={styles.icon}>🎯</div>
            <h3 style={styles.buttonTitle}>Vedha Quiz</h3>
            <p style={styles.buttonDescription}>
              Test your knowledge about Rig Vedha with interactive quizzes
            </p>
            <button style={styles.actionButton} onClick={openQuizWindow} className="action-button">
              Start Quiz
            </button>
          </div>

          <div style={styles.buttonCard} className="button-card">
            <div style={styles.icon}>🤖</div>
            <h3 style={styles.buttonTitle}>AI Chatbot</h3>
            <p style={styles.buttonDescription}>
              Ask questions and learn about Rig Vedha with AI assistance
            </p>
            <button style={styles.actionButton} onClick={openChatWindow} className="action-button">
              Chat Now
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          <p>Choose any feature to begin your journey into Rig Vedha</p>
          <p>Designed by Karthikeyan Lakshmanan</p>
          <p>Email: karthikeyantcemdu@gmail.com</p>
          <p>Phn: 8300789327</p>
        </div>
      </div>

      {/* Add CSS styles directly */}
      <style>
        {`
          .button-card {
            transition: all 0.3s ease;
          }
          
          .button-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }
          
          .action-button {
            transition: all 0.3s ease;
          }
          
          .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(185, 28, 28, 0.4);
            background: linear-gradient(45deg, #dc2626, #b91c1c);
          }
          
          button:focus {
            outline: 3px solid #b91c1c;
            outline-offset: 3px;
          }
          
          @media (max-width: 768px) {
            .button-card:hover {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '2rem',
    boxSizing: 'border-box'
  },
  content: {
    textAlign: 'center',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  },
  header: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#b91c1c',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    background: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: '3px solid #b91c1c',
    margin: '0 auto 2rem',
    maxWidth: '100%',
    boxSizing: 'border-box'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: '#374151',
    marginBottom: '3rem',
    background: 'white',
    padding: '1rem 2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '2px solid #fecaca',
    margin: '0 auto 3rem',
    maxWidth: '800px',
    lineHeight: '1.6',
    boxSizing: 'border-box'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
    alignItems: 'stretch',
    justifyItems: 'center'
  },
  buttonCard: {
    background: 'white',
    padding: '2.5rem 2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '3px solid #b91c1c',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  buttonDescription: {
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6',
    flex: 1,
    textAlign: 'center'
  },
  actionButton: {
    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 6px 12px rgba(185, 28, 28, 0.3)',
    transition: 'all 0.3s ease',
    minWidth: '180px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: 'auto'
  },
  footer: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '2px solid #fecaca',
    color: '#6b7280',
    textAlign: 'center',
    margin: '0 auto',
    maxWidth: '600px',
    boxSizing: 'border-box'
  }
};

// Add responsive CSS
const responsiveStyle = document.createElement('style');
responsiveStyle.textContent = `
  @media (max-width: 1024px) {
    .app-container {
      padding: 1.5rem;
    }
    
    .button-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .button-card {
      padding: 2rem 1.5rem;
      max-width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .app-container {
      padding: 1rem;
    }
    
    .button-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .button-card {
      padding: 1.5rem 1rem;
    }
    
    .header {
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .subtitle {
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .app-container {
      padding: 0.5rem;
    }
    
    .button-grid {
      gap: 1rem;
    }
    
    .button-card {
      padding: 1.5rem 1rem;
    }
    
    .action-button {
      padding: 12px 24px;
      min-width: 160px;
      font-size: 1rem;
    }
    
    .icon {
      font-size: 3rem;
      min-height: 60px;
    }
  }
  
  /* Ensure no overlapping during animations */
  .button-card {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  
  .button-card:hover {
    z-index: 10;
  }
`;

document.head.appendChild(responsiveStyle);