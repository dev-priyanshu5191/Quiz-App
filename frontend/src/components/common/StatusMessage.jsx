function StatusMessage({ loading, error, empty, children }) {
  if (loading) return <div className="panel status-message">Loading...</div>;
  if (error) return <div className="panel status-message error-text">{error}</div>;
  if (empty) return <div className="panel status-message muted">{children || "Nothing here yet."}</div>;
  return null;
}

export default StatusMessage;
