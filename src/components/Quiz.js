import React, {useState, useEffect} from 'react'
import {API_BASE} from '../config'

export default function Quiz(){
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(API_BASE+'/api/quiz/generate', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({count: 5})
    })
    .then(r => r.json())
    .then(data => {
      setQuestions(data)
      setLoading(false)
    })
    .catch(error => {
      console.error('Error fetching questions:', error)
      setLoading(false)
    })
  }, [])

  function choose(index, optionIndex){
    const copy = [...answers]
    copy[index] = optionIndex
    setAnswers(copy)
  }

  async function submit(){
    if(!name) return alert('Please enter your name for the result')
    
    setSubmitting(true)
    try {
      const response = await fetch(API_BASE+'/api/quiz/submit', {
        method: 'POST', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name, answers, questions})
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Error submitting quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Rig Vedha Quiz</h2>
      
      <div style={styles.nameInput}>
        <label style={styles.label}>
          Your Name: 
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            style={styles.input}
            placeholder="Enter your name"
            disabled={loading}
          />
        </label>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading quiz questions...</p>
          <p style={styles.loadingSubtext}>Preparing your Rig Vedha knowledge test</p>
        </div>
      )}

      {/* Questions Container */}
      {!loading && (
        <div style={styles.questionsContainer}>
          {questions.map((q, i) => (
            <div key={i} style={styles.questionCard}>
              <div style={styles.questionText}>
                {i+1}. {q.q}
              </div>
              <div style={styles.optionsContainer}>
                {q.options && q.options.map((opt, j) => (
                  <div key={j} style={styles.option}>
                    <label style={styles.optionLabel}>
                      <input 
                        type="radio" 
                        name={`q${i}`} 
                        checked={answers[i]===j} 
                        onChange={()=>choose(i,j)} 
                        style={styles.radio}
                        disabled={submitting}
                      /> 
                      <span style={styles.optionText}>{opt}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {!loading && questions.length > 0 && (
        <button 
          onClick={submit} 
          style={submitting ? styles.submitButtonDisabled : styles.submitButton}
          disabled={submitting || loading}
        >
          {submitting ? (
            <div style={styles.buttonContent}>
              <div style={styles.smallSpinner}></div>
              Submitting...
            </div>
          ) : (
            'Submit Answers'
          )}
        </button>
      )}

      {/* Error State */}
      {!loading && questions.length === 0 && (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Failed to Load Questions</h3>
          <p style={styles.errorText}>Please try refreshing the page or check your connection</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <div style={styles.trophy}>🏆</div>
            <h3 style={styles.resultTitle}>Quiz Completed!</h3>
          </div>
          <p style={styles.resultText}>
            <strong>{result.name}</strong>, your score: 
            <span style={styles.score}> {result.score}/{result.total}</span>
          </p>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(result.score / result.total) * 100}%`
              }}
            ></div>
          </div>
          <p style={styles.resultPercentage}>
            {Math.round((result.score / result.total) * 100)}%
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '10px',
    padding: '0',
    minHeight: '500px'
  },
  title: {
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: 'linear-gradient(45deg, #fef2f2, #fff)',
    borderBottom: '2px solid #b91c1c',
    borderRadius: '10px 10px 0 0'
  },
  nameInput: {
    padding: '0 1.5rem',
    marginBottom: '1rem'
  },
  label: {
    color: '#374151',
    fontWeight: '600',
    display: 'block',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '2px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '1rem',
    marginTop: '0.25rem',
    transition: 'all 0.3s ease'
  },
  // Loading Styles
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f4f6',
    borderTop: '5px solid #b91c1c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#374151',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  loadingSubtext: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  // Questions Styles
  questionsContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '0 1.5rem'
  },
  questionCard: {
    background: '#fef2f2',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #fecaca',
    animation: 'fadeIn 0.5s ease-in'
  },
  questionText: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.75rem'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  option: {
    padding: '0.25rem 0'
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '5px',
    transition: 'background-color 0.2s'
  },
  radio: {
    marginRight: '0.5rem',
    accentColor: '#b91c1c'
  },
  optionText: {
    color: '#4b5563'
  },
  // Button Styles
  submitButton: {
    width: 'calc(100% - 3rem)',
    margin: '1rem 1.5rem',
    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    width: 'calc(100% - 3rem)',
    margin: '1rem 1.5rem',
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Error Styles
  errorContainer: {
    textAlign: 'center',
    padding: '2rem 1.5rem',
    background: '#fef2f2',
    margin: '1rem 1.5rem',
    borderRadius: '8px',
    border: '2px solid #fecaca'
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  errorTitle: {
    color: '#b91c1c',
    marginBottom: '0.5rem'
  },
  errorText: {
    color: '#6b7280',
    marginBottom: '1rem'
  },
  retryButton: {
    background: '#b91c1c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  // Result Styles
  resultCard: {
    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    padding: '1.5rem',
    margin: '0 1.5rem 1.5rem',
    borderRadius: '12px',
    border: '2px solid #16a34a',
    textAlign: 'center',
    animation: 'bounceIn 0.6s ease'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  trophy: {
    fontSize: '2rem'
  },
  resultTitle: {
    color: '#166534',
    margin: 0,
    fontSize: '1.3rem'
  },
  resultText: {
    color: '#374151',
    margin: '0 0 1rem 0',
    fontSize: '1.1rem'
  },
  score: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '1rem 0'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(45deg, #16a34a, #22c55e)',
    borderRadius: '4px',
    transition: 'width 1s ease-in-out'
  },
  resultPercentage: {
    color: '#166534',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    margin: 0
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  input:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  
  label:hover input:not(:disabled) + span {
    color: #b91c1c;
  }
`;
document.head.appendChild(style);