import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HomeFeast ErrorBoundary caught error:', error, errorInfo);
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#home';
    window.location.reload();
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#FAF8F5',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #EAE3D9',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍲</div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', marginBottom: '8px' }}>
              HomeFeast Food Discovery
            </h2>
            <p style={{ fontSize: '13.5px', color: '#78716C', marginBottom: '20px', lineHeight: 1.5 }}>
              Click below to return smoothly to the HomeFeast discovery page.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleGoHome}
                style={{
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🏠 Return to Home
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  background: '#F5F5F4',
                  color: '#1C1917',
                  border: '1px solid #EAE3D9',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
