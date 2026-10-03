import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled frontend error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <div className="error-screen-card">
            <p className="eyebrow">Quiz App</p>
            <h1>Something went wrong.</h1>
            <p className="muted">Reload the page to try again.</p>
            <button className="button button-primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
