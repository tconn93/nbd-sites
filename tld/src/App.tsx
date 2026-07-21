import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <span className="logo">nbd</span>
          <div className="nav-links">
            <a href="https://github.com/tconn93/nbd" target="_blank" rel="noopener">GitHub</a>
            <a href="https://docs.nbd.sh" target="_blank" rel="noopener">Docs</a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-accent">nbd</span>
              <br />
              Hermes Fleet Orchestration
            </h1>
            <p className="hero-subtitle">
              Connect, manage, and communicate across your fleet of Hermes agents.
              One master orchestrator, many worker nodes.
            </p>
            <div className="hero-actions">
              <a href="https://docs.nbd.sh" className="btn btn-primary">
                Get Started
              </a>
              <a href="https://github.com/tconn93/nbd" target="_blank" rel="noopener" className="btn btn-secondary">
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">How It Works</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>One Master</h3>
              <p>A single Hermes instance runs the Fleet dashboard and API. Every node registers here.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <path d="M6 6h.01" />
                  <path d="M6 18h.01" />
                </svg>
              </div>
              <h3>Many Nodes</h3>
              <p>Each node runs <code>hermes proxy</code> and registers with the master via a single command.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Chat & Sessions</h3>
              <p>Send prompts to any node from the dashboard. Every conversation is stored and searchable.</p>
            </div>
          </div>
        </section>

        <section className="install-section">
          <h2 className="section-title">One Command to Start</h2>
          <div className="code-blocks">
            <div className="code-block">
              <div className="code-header">Master</div>
              <pre><code>git clone git@github.com:tconn93/nbd.git
cd nbd && ./nbd setup master</code></pre>
            </div>
            <div className="code-block">
              <div className="code-header">Node</div>
              <pre><code>./nbd setup node --master http://&lt;master-ip&gt;:9119</code></pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with Hermes Agent &middot; MIT License</p>
      </footer>
    </div>
  )
}

export default App
