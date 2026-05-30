"use client";
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 p-6">
          <div className="max-w-md w-full bg-dark-800 border border-dark-600 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 mb-8">
              We encountered an unexpected error. Don't worry, your progress is likely safe.
            </p>

            <div className="w-full bg-dark-900 rounded-lg p-4 border border-dark-700 mb-8 overflow-hidden text-left">
              <p className="text-red-400 font-mono text-sm truncate">
                {this.state.error?.toString() || 'Unknown Error'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.href = '/dashboard'
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
