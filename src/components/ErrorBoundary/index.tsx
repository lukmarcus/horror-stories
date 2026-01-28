import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Coś poszło nie tak 😞</h1>
          <p>Przepraszamy, aplikacja napotkała błąd.</p>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>Szczegóły błędu</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.875rem' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            Odśwież aplikację
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
