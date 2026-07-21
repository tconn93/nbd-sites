import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import './App.css'

const navItems = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/setup', label: 'Setup', icon: '⚙' },
  { path: '/master', label: 'Master Mode', icon: '◉' },
  { path: '/node', label: 'Node Mode', icon: '○' },
  { path: '/api', label: 'API Reference', icon: '⇄' },
  { path: '/architecture', label: 'Architecture', icon: '⊞' },
]

function Sidebar() {
  const location = useLocation()
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">nbd docs</Link>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}>
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a href="https://github.com/tconn93/nbd" target="_blank" rel="noopener">GitHub</a>
        <a href="https://nbd.sh" target="_blank" rel="noopener">nbd.sh</a>
      </div>
    </aside>
  )
}

function HomePage() {
  return (
    <div className="page">
      <h1>nbd &mdash; Hermes Fleet Orchestration</h1>
      <p className="lead">
        nbd is a Hermes dashboard plugin that turns one Hermes agent into a fleet master,
        with any number of other Hermes agents connecting as worker nodes.
      </p>
      <h2>Quick Overview</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Master Agent</h3>
          <p>Runs the Hermes dashboard with the nbd plugin. Exposes a Fleet tab showing all connected nodes, their sessions, and conversation history.</p>
          <code className="card-code">./nbd setup master</code>
        </div>
        <div className="card">
          <h3>Node Agent</h3>
          <p>Runs <code>hermes proxy</code> to expose an OpenAI-compatible API, then registers with the master.</p>
          <code className="card-code">./nbd setup node --master http://&lt;ip&gt;:9119</code>
        </div>
        <div className="card">
          <h3>Dashboard Tab</h3>
          <p>A Fleet tab appears in the Hermes dashboard showing connected nodes, status indicators, expandable session lists, and full conversation history.</p>
        </div>
      </div>
    </div>
  )
}

function SetupPage() {
  return (
    <div className="page">
      <h1>Setup</h1>
      <p className="lead">Get nbd running in under a minute.</p>
      <h2>Prerequisites</h2>
      <ul>
        <li>Hermes Agent installed on all machines</li>
        <li>Python 3.10+</li>
        <li>Network connectivity between machines</li>
      </ul>
      <h2>Installation</h2>
      <div className="code-block">
        <div className="code-header">Clone the repo</div>
        <pre><code>git clone git@github.com:tconn93/nbd.git ~/nbd{'\n'}cd ~/nbd</code></pre>
      </div>
      <h2>Master Setup</h2>
      <p>On the machine that will be the fleet orchestrator:</p>
      <div className="code-block">
        <div className="code-header">One command</div>
        <pre><code>./nbd setup master</code></pre>
      </div>
      <p>This installs the dashboard plugin, configures auth, and starts the dashboard on port 9119.</p>
      <h2>Node Setup</h2>
      <p>On each worker machine:</p>
      <div className="code-block">
        <div className="code-header">One command</div>
        <pre><code>./nbd setup node --master http://&lt;master-ip&gt;:9119</code></pre>
      </div>
      <p>This starts <code>hermes proxy</code> and registers the node with the master.</p>
    </div>
  )
}

function MasterPage() {
  return (
    <div className="page">
      <h1>Master Mode</h1>
      <p className="lead">The master is a Hermes agent running the dashboard with the nbd plugin.</p>
      <h2>What the Master Does</h2>
      <ul>
        <li>Hosts the Fleet dashboard tab at <code>/fleet</code></li>
        <li>Exposes the Fleet API at <code>/api/plugins/nbd/</code></li>
        <li>Accepts node registrations and heartbeats</li>
        <li>Stores all conversations in SQLite</li>
        <li>Auto-detects its own IP and displays the connect command for nodes</li>
      </ul>
      <h2>Dashboard Auth</h2>
      <p>When bound to the network, the dashboard requires authentication. Default credentials are <strong>admin / hermes</strong>.</p>
      <h2>Viewing Nodes</h2>
      <p>Open the Fleet tab to see all connected nodes with status indicators.</p>
    </div>
  )
}

function NodePage() {
  const curlCmd = [
    'curl -X POST http://<master>:9119/api/plugins/nbd/nodes/register \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{"api_url": "http://<node-ip>:8080", "name": "my-node"}\'',
  ].join('\n')

  return (
    <div className="page">
      <h1>Node Mode</h1>
      <p className="lead">A node is any Hermes agent that connects to the master.</p>
      <h2>What a Node Does</h2>
      <ul>
        <li>Runs <code>hermes proxy</code> &mdash; exposes an OpenAI-compatible HTTP API</li>
        <li>Registers with the master Fleet API</li>
        <li>Sends heartbeats every 45 seconds</li>
        <li>Accepts chat prompts from the master via its OpenAI API</li>
      </ul>
      <h2>Manual Registration</h2>
      <p>If you prefer not to use the CLI, register directly via curl:</p>
      <div className="code-block">
        <pre><code>{curlCmd}</code></pre>
      </div>
    </div>
  )
}

function ApiPage() {
  return (
    <div className="page">
      <h1>API Reference</h1>
      <p className="lead">All endpoints are mounted at <code>/api/plugins/nbd/</code> on the master dashboard.</p>
      <h2>Setup</h2>
      <ApiTable rows={[
        ['GET', '/setup-command', 'Returns master URL and nbd setup node command'],
      ]} />
      <h2>Nodes</h2>
      <ApiTable rows={[
        ['GET', '/nodes', 'List all registered nodes'],
        ['GET', '/nodes/{id}', 'Get a specific node'],
        ['POST', '/nodes/register', 'Register or update a node'],
        ['POST', '/nodes/heartbeat', 'Send a heartbeat'],
      ]} />
      <h2>Sessions</h2>
      <ApiTable rows={[
        ['GET', '/sessions', 'List sessions (filter by node_id)'],
        ['GET', '/sessions/{id}', 'Get session with all messages'],
        ['POST', '/sessions', 'Create a session'],
        ['POST', '/sessions/{id}/messages', 'Add a message'],
      ]} />
      <h2>Chat</h2>
      <ApiTable rows={[
        ['POST', '/chat', 'Send a prompt to a node. Auto-creates session, stores conversation.'],
      ]} />
    </div>
  )
}

function ApiTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <table className="api-table">
      <thead><tr><th>Method</th><th>Path</th><th>Description</th></tr></thead>
      <tbody>
        {rows.map(([method, path, desc], i) => (
          <tr key={i}>
            <td><span className={`method ${method.toLowerCase()}`}>{method}</span></td>
            <td><code>{path}</code></td>
            <td>{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ArchitecturePage() {
  return (
    <div className="page">
      <h1>Architecture</h1>
      <p className="lead">How nbd connects your fleet of Hermes agents.</p>
      <div className="arch-diagram">
        <pre>{asciiArt}</pre>
      </div>
      <h2>Data Flow</h2>
      <ol>
        <li><strong>Registration</strong> &mdash; Node starts hermes proxy, POSTs to /nodes/register</li>
        <li><strong>Heartbeat</strong> &mdash; Node sends periodic heartbeats every 45s</li>
        <li><strong>Chat</strong> &mdash; Master proxies prompts to the node OpenAI API</li>
        <li><strong>Storage</strong> &mdash; Every message is stored in SQLite and viewable in the Fleet tab</li>
      </ol>
      <h2>Tech Stack</h2>
      <ul>
        <li><strong>Plugin:</strong> FastAPI router mounted in the Hermes dashboard</li>
        <li><strong>Storage:</strong> SQLite (WAL mode)</li>
        <li><strong>Node API:</strong> OpenAI-compatible HTTP via hermes proxy</li>
        <li><strong>Frontend:</strong> React via Hermes Dashboard Plugin SDK</li>
      </ul>
    </div>
  )
}

const asciiArt = `
+---------------------------+
|   Master (Orch)           |
|  +---------------------+  |
|  | Hermes Dash         |  |  Port 9119
|  | + nbd plugin        |  |
|  | Fleet tab + REST    |  |
|  +---------+-----------+  |
+-----------+---------------+
            | OpenAI-compat API
            | (hermes proxy)
      +-----+-----+------+
      |     |     |      |
   +--v--+ +--v--+ +--v--+
   |Node1| |Node2| |Node3|
   |:8080| |:8080| |:8080|
   +-----+ +-----+ +-----+
`

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/master" element={<MasterPage />} />
          <Route path="/node" element={<NodePage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
