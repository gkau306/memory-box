import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(err) {
    return { error: err }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#f5efe6', minHeight: '100vh', color: '#2c1810' }}>
          <h1>Something went wrong</h1>
          <pre style={{ overflow: 'auto', background: '#fff', padding: '1rem', borderRadius: 8 }}>{this.state.error?.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
