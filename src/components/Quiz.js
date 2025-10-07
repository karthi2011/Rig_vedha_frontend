import React, {useState, useEffect} from 'react'

export default function Quiz(){
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  // Use the correct Gemini model - gemini-1.0-pro is widely available
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent';
  useEffect(() => {
    generateQuizQuestions()
  }, [])

  async function generateQuizQuestions() {
    if (!GEMINI_API_KEY) {
      setQuestions(getFallbackQuestions());
      setLoading(false);
      return;
    }

    setLoading(true)
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate exactly 5 multiple choice questions about Rig Vedha. 
              Return ONLY valid JSON array format without any other text.
              Example format:
              [
                {
                  "q": "What is Rig Vedha?",
                  "options": ["Ancient Hindu scripture", "Modern book", "Movie", "Song"],
                  "answer_index": 0,
                  "explanation": "Rig Vedha is the oldest of the four Vedas"
                }
              ]
              Requirements:
              - Each question must have: q, options (array of 4 strings), answer_index (0-3), and explanation
              - Make questions about Rig Vedha content, structure, and significance
              - Ensure answer_index is correct for each question
              - Return exactly 5 questions`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        })
      })
      
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        const responseText = data.candidates[0].content.parts[0].text;
      
        
        let quizData = [];
        
        try {
          const cleanText = responseText.replace(/```json|```/g, '').trim();
          quizData = JSON.parse(cleanText);
        } catch (parseError) {
          quizData = getFallbackQuestions();
        }
        
        setQuestions(Array.isArray(quizData) ? quizData.slice(0, 5) : getFallbackQuestions());
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }
    } catch (error) {

      setQuestions(getFallbackQuestions());
    } finally {
      setLoading(false);
    }
  }

  function getFallbackQuestions() {
    return [
      {
        q: "What is Rig Vedha?",
        options: [
          "Ancient Hindu scripture", 
          "Modern philosophy book", 
          "Scientific text", 
          "Historical novel"
        ],
        answer_index: 0,
        explanation: "Rig Vedha is the oldest of the four Vedas, composed in Vedic Sanskrit around 1500-1200 BCE."
      },
      {
        q: "How many mandalas (books) are in Rig Vedha?",
        options: ["10", "7", "5", "12"],
        answer_index: 0,
        explanation: "Rig Vedha is organized into 10 mandalas containing 1,028 hymns (suktas)."
      },
      {
        q: "Which language is Rig Vedha originally written in?",
        options: ["Vedic Sanskrit", "Hindi", "Tamil", "Pali"],
        answer_index: 0,
        explanation: "Rig Vedha was composed in Vedic Sanskrit, an early form of the Sanskrit language."
      },
      {
        q: "Rig Vedha is part of which collection?",
        options: ["The Four Vedas", "Upanishads", "Puranas", "Sutras"],
        answer_index: 0,
        explanation: "Rig Vedha is the first and oldest of the four Vedas (Rig, Yajur, Sama, Atharva)."
      },
      {
        q: "What is the main content of Rig Vedha?",
        options: [
          "Hymns to deities", 
          "Historical events", 
          "Scientific theories", 
          "Moral stories"
        ],
        answer_index: 0,
        explanation: "Rig Vedha primarily contains hymns dedicated to various deities like Agni, Indra, Varuna, and Surya."
      }
    ]
  }

  function choose(index, optionIndex) {
    const copy = [...answers]
    copy[index] = optionIndex
    setAnswers(copy)
  }

  function submit() {
    if (!name) return alert('Please enter your name for the result')
    
    setSubmitting(true)
    
    // Calculate score locally
    let score = 0
    const results = questions.map((question, index) => {
      const isCorrect = answers[index] === question.answer_index
      if (isCorrect) score++
      
      return {
        question: question.q,
        userAnswer: question.options[answers[index]] || 'Not answered',
        correctAnswer: question.options[question.answer_index],
        isCorrect: isCorrect,
        explanation: question.explanation
      }
    })
    
    const resultData = {
      name: name,
      score: score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      detailedResults: results
    }
    
    setResult(resultData)
    setSubmitting(false)
  }

  function restartQuiz() {
    setQuestions([])
    setAnswers([])
    setResult(null)
    setName('')
    setLoading(true)
    generateQuizQuestions()
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Rig Vedha Quiz</h2>
      
      <div style={styles.nameInput}>
        <label style={styles.label}>
          Your Name: 
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={styles.input}
            placeholder="Enter your name"
            disabled={loading || result}
          />
        </label>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Generating quiz questions with AI...</p>
          <p style={styles.loadingSubtext}>Creating your personalized Rig Vedha knowledge test</p>
        </div>
      )}

      {/* Questions Container */}
      {!loading && !result && questions.length > 0 && (
        <div style={styles.questionsContainer}>
          {questions.map((q, i) => (
            <div key={i} style={styles.questionCard}>
              <div style={styles.questionText}>
                {i+1}. {q.q}
              </div>
              <div style={styles.optionsContainer}>
                {q.options && q.options.map((opt, j) => (
                  <div key={j} style={styles.option}>
                    <label style={{
                      ...styles.optionLabel,
                      ...(answers[i] === j ? styles.selectedOption : {})
                    }}>
                      <input 
                        type="radio" 
                        name={`q${i}`} 
                        checked={answers[i] === j} 
                        onChange={() => choose(i, j)} 
                        style={styles.radio}
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
      {!loading && !result && questions.length > 0 && (
        <button 
          onClick={submit} 
          style={{
            ...styles.submitButton,
            ...(answers.length !== questions.length ? styles.submitButtonDisabled : {})
          }}
          disabled={answers.length !== questions.length || submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      )}

      {/* Error State */}
      {!loading && questions.length === 0 && !result && (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Failed to Generate Questions</h3>
          <p style={styles.errorText}>Please try refreshing the page</p>
          <button 
            onClick={restartQuiz} 
            style={styles.retryButton}
          >
            Try Again
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
                width: `${result.percentage}%`
              }}
            ></div>
          </div>
          
          <p style={styles.resultPercentage}>{result.percentage}%</p>

          {/* Detailed Results */}
          <div style={styles.detailedResults}>
            <h4 style={styles.detailedTitle}>Detailed Results:</h4>
            {result.detailedResults.map((detail, index) => (
              <div key={index} style={styles.resultItem}>
                <div style={styles.questionResult}>
                  <strong>Q{index + 1}:</strong> {detail.question}
                </div>
                <div style={styles.answerResult}>
                  Your answer: <span style={detail.isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
                    {detail.userAnswer}
                  </span>
                </div>
                {!detail.isCorrect && (
                  <div style={styles.correctAnswerResult}>
                    Correct answer: <span style={styles.correctText}>{detail.correctAnswer}</span>
                  </div>
                )}
                <div style={styles.explanation}>
                  💡 {detail.explanation}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={restartQuiz} 
            style={styles.restartButton}
          >
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '10px',
    padding: '0',
    minHeight: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  title: {
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: 'linear-gradient(45deg, #fef2f2, #fff)',
    borderBottom: '2px solid #b91c1c',
    borderRadius: '10px 10px 0 0',
    fontSize: '1.5rem'
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
    padding: '0.75rem',
    border: '2px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '1rem',
    marginTop: '0.25rem',
    transition: 'all 0.3s ease'
  },
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
  questionsContainer: {
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '0 1.5rem'
  },
  questionCard: {
    background: '#fef2f2',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #fecaca'
  },
  questionText: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.75rem',
    fontSize: '1rem'
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
    padding: '0.75rem',
    borderRadius: '5px',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  selectedOption: {
    background: '#fecaca',
    borderColor: '#b91c1c'
  },
  radio: {
    marginRight: '0.75rem',
    accentColor: '#b91c1c',
    transform: 'scale(1.2)'
  },
  optionText: {
    color: '#4b5563',
    fontSize: '0.95rem'
  },
  submitButton: {
    width: 'calc(100% - 3rem)',
    margin: '1rem 1.5rem',
    background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '15px 24px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  submitButtonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed'
  },
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
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  resultCard: {
    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    padding: '1.5rem',
    margin: '0 1.5rem 1.5rem',
    borderRadius: '12px',
    border: '2px solid #16a34a'
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
    fontSize: '1.1rem',
    textAlign: 'center'
  },
  score: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    margin: '1rem 0'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(45deg, #16a34a, #22c55e)',
    borderRadius: '6px',
    transition: 'width 1s ease-in-out'
  },
  resultPercentage: {
    color: '#166534',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    margin: '0 0 1rem 0',
    textAlign: 'center'
  },
  detailedResults: {
    marginTop: '1.5rem'
  },
  detailedTitle: {
    color: '#166534',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '1.1rem'
  },
  resultItem: {
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #bbf7d0'
  },
  questionResult: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    fontSize: '0.95rem'
  },
  answerResult: {
    marginBottom: '0.25rem',
    fontSize: '0.9rem'
  },
  correctAnswer: {
    color: '#16a34a',
    fontWeight: 'bold'
  },
  wrongAnswer: {
    color: '#dc2626',
    fontWeight: 'bold'
  },
  correctAnswerResult: {
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  },
  correctText: {
    color: '#16a34a',
    fontWeight: 'bold'
  },
  explanation: {
    color: '#6b7280',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    marginTop: '0.5rem'
  },
  restartButton: {
    width: '100%',
    background: '#b91c1c',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.3s ease'
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  
  label:hover input:not(:disabled) + span {
    color: #b91c1c;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;
document.head.appendChild(style);