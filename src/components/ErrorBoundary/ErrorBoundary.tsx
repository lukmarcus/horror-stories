import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import "./ErrorBoundary.css";

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
    console.error("App error:", error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1>Coś poszło nie tak 😞</h1>
          <p>Przepraszamy, aplikacja napotkała błąd.</p>
          <details className="error-boundary__details">
            <summary>Szczegóły błędu</summary>
            <pre className="error-boundary__pre">
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="error-boundary__button"
          >
            Odśwież aplikację
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
