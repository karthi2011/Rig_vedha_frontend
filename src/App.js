
// In your main router file (e.g., main.jsx, App.jsx, or routes configuration)
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './Main'
import PdfPage from './routes/Pdfpage'
import QuizPage from './routes/QuizPage'
import ChatPage from './routes/ChatPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/pdf" element={<PdfPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;