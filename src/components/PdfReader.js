import React from 'react'
import { API_BASE } from '../config'

export default function PdfReader(){
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📖 Read Rig Vedha</h2>
      <div style={styles.iframeContainer}>
        <iframe
          src={`${API_BASE}/api/pdf`}
          title="Rig Vedha PDF"
          style={styles.iframe}
        />
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '10px',
    padding: '0'
  },
  title: {
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    background: 'linear-gradient(45deg, #fef2f2, #fff)',
    borderBottom: '2px solid #b91c1c',
    borderRadius: '10px 10px 0 0'
  },
  iframeContainer: {
    border: '2px solid #b91c1c',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden'
  },
  iframe: {
    width: '100%',
    height: '500px',
    border: 'none'
  }
}