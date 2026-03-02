import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App';

// Debug logging
console.log('🚀 App starting...');
console.log('📍 Current URL:', window.location.href);
console.log('📱 Capacitor platform:', Capacitor.getPlatform());
console.log('🌐 Is native platform:', Capacitor.isNativePlatform());

// Error boundary for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#000' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
console.log('🎯 Root element:', rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Could not find root element to mount to");
}

// Add error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error, event.filename, event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

console.log('🎨 Rendering React app...');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);