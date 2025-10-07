import React from 'react'
import PdfReader from '../components/PdfReader'

export default function PdfPage() {
  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.header}>
        <h1 style={pageStyles.title}>📖 Rig Vedha PDF Reader</h1>
        <button 
          style={pageStyles.closeButton}
          onClick={() => window.close()}
        >
          Close Window
        </button>
      </div>
      <PdfReader />
    </div>
  )
}

const pageStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    background: 'white',
    padding: '1rem 2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '2px solid #b91c1c'
  },
  title: {
    color: '#b91c1c',
    margin: 0,
    fontSize: '1.8rem'
  },
  closeButton: {
    background: '#b91c1c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
}