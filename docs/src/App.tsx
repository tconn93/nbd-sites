import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import './App.css'

const navItems = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/setup', label: 'Setup', icon: '⚙' },
  { path: '/master', label: 'Master', icon: '◉' },
  { path: '/node', label: 'Node', icon: '○' },
  { path: '/tokens', label: 'Tokens', icon: '🔑' },
  { path: '/mcp', label: 'MCP Tools', icon: '🔌' },
  { path: '/api', label: 'API', icon: '⇄' },
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
        nbd is a Hermes plugin that turns one Hermes agent into a fleet master,
        with any number of other Hermes agents connecting as worker nodes.
      </p>
      <h2>Quick Overview</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Master Agent</h3>
          <p>Runs the Fleet API server (port 9005) with MCP tools & HTTP endpoints. The dashboard tab shows all nodes, sessions, and conversations.</p>
          <code className="card-code">nbd setup master</code>
        </div>
        <div className="card">
          <h3>Node Agent</h3>
          <p>Runs <code>hermes proxy</code> to expose an OpenAI-compatible API, then registers with a time-limited token.</p>
          <code className="card-code">nbd setup node --master http://IP:9005 --token TOKEN</code>
        </div>
        <div className="card">
          <h3>MCP Server</h3>
          <p>The Fleet API doubles as an MCP server. Add to Hermes mcp_servers and get fleet tools (nbd_list_nodes, nbd_chat_with_node, etc.) in any session.</p>
          <code className="card-code">hermes config set mcp_servers.nbd.url http://127.0.0.1:9005/mcp</code>
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
        <li>Python 3.10+, pip</li>
        <li>Network connectivity between machines</li>
      </ul>
      <h2>Installation</h2>
      <CodeBlock header="Clone" code={`git clone git@github.com:tconn93/nbd.git ~/nbd
cd ~/nbd`} />
      <h2>Master Setup</h2>
      <p>One command &mdash; interactive walkthrough: plugin install, database, auth, service:</p>
      <CodeBlock header="Interactive setup" code="nbd setup master" />
      <p>This deploys the dashboard plugin + Fleet API server (port 9005) + MCP config.</p>
      <h2>Node Setup</h2>
      <p>On each worker machine, use the token from the master:</p>
      <CodeBlock header="Node registration" code="nbd setup node --master http://MASTER_IP:9005 --token YOUR_TOKEN" />
    </div>
  )
}

function MasterPage() {
  return (
    <div className="page">
      <h1>Master Mode</h1>
      <p className="lead">The master runs the Fleet API server + Hermes dashboard with the nbd plugin.</p>
      <h2>What Runs on the Master</h2>
      <ul>
        <li><strong>Fleet API server</strong> &mdash; port 9005, serves HTTP (dashboard UI) + MCP (agent tools)</li>
        <li><strong>Hermes Dashboard</strong> &mdash; port 9119, shows the "Node Big Deal" tab</li>
        <li><strong>SQLite database</strong> &mdash; nodes, sessions, messages, registration tokens</li>
      </ul>
      <h2>Starting the Fleet API</h2>
      <CodeBlock code="nbd serve" />
      <p>Or with an explicit port: <code>nbd serve --port 9005</code></p>
      <h2>MCP Configuration</h2>
      <p>Add the Fleet API as an MCP server:</p>
      <CodeBlock code="hermes config set mcp_servers.nbd.url http://127.0.0.1:9005/mcp" />
      <p>After a <code>/reload</code>, MCP tools (nbd_list_nodes, nbd_chat_with_node, nbd_generate_token) appear in your session.</p>
      <h2>Dashboard Auth</h2>
      <p>The dashboard at port 9119 has basic auth. Default: <strong>admin / hermes</strong>.</p>
    </div>
  )
}

function NodePage() {
  return (
    <div className="page">
      <h1>Node Mode</h1>
      <p className="lead">A node is any Hermes agent that connects to the master fleet.</p>
      <h2>What a Node Does</h2>
      <ul>
        <li>Runs <code>hermes proxy</code> &mdash; exposes an OpenAI-compatible HTTP API</li>
        <li>Registers with the master via token-authenticated POST</li>
        <li>Sends heartbeats every 45 seconds</li>
        <li>Accepts chat prompts from the master/agent</li>
      </ul>
      <h2>Connect a Node</h2>
      <CodeBlock code="nbd setup node --master http://MASTER:9005 --token TOKEN" />
      <p>The CLI handles proxy startup, registration, and heartbeats.</p>
    </div>
  )
}

function TokensPage() {
  return (
    <div className="page">
      <h1>Registration Tokens</h1>
      <p className="lead">Time-limited tokens keep your fleet secure. Default: 24-hour expiry, one-time use.</p>
      <h2>Generate a Token</h2>
      <CodeBlock code="nbd generate-token --hours 24 --desc worker-vm-1" />
      <p>Output includes the full <code>nbd setup node</code> command for the node agent.</p>
      <h2>Via HTTP API</h2>
      <CodeBlock code={`curl -X POST http://MASTER:9005/api/plugins/nbd/tokens/generate \\
  -H "Content-Type: application/json" \\
  -d '{"hours": 24, "description": "jenkins-agent"}'`} />
      <h2>List Tokens</h2>
      <CodeBlock code="curl http://MASTER:9005/api/plugins/nbd/tokens" />
      <h2>Token Lifecycle</h2>
      <ul>
        <li><strong>Created</strong> &mdash; stored in the database with expiry timestamp</li>
        <li><strong>Redeemed</strong> &mdash; when a node registers with the token, it is marked as used</li>
        <li><strong>Expired</strong> &mdash; tokens past their expiry date are rejected</li>
        <li><strong>One-time use</strong> &mdash; each token can only be used once</li>
      </ul>
    </div>
  )
}

function McpPage() {
  return (
    <div className="page">
      <h1>MCP Tools</h1>
      <p className="lead">The Fleet API exposes an MCP endpoint. Add it to Hermes for fleet tools in every session.</p>
      <h2>Configuration</h2>
      <CodeBlock header="config.yaml" code={`mcp_servers:
  nbd:
    url: http://127.0.0.1:9005/mcp`} />
      <p>Or via CLI: <code>hermes config set mcp_servers.nbd.url http://127.0.0.1:9005/mcp</code></p>
      <h2>Available Tools</h2>
      <table className="api-table">
        <thead><tr><th>Tool</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>nbd_list_nodes</code></td><td>List all registered nodes with status</td></tr>
          <tr><td><code>nbd_node_status</code></td><td>Get detailed status for a specific node</td></tr>
          <tr><td><code>nbd_chat_with_node</code></td><td>Send a prompt to a node, get a reply</td></tr>
          <tr><td><code>nbd_get_sessions</code></td><td>List conversation sessions</td></tr>
          <tr><td><code>nbd_get_session</code></td><td>View full conversation history</td></tr>
          <tr><td><code>nbd_generate_token</code></td><td>Create a time-limited registration token</td></tr>
        </tbody>
      </table>
    </div>
  )
}

function ApiPage() {
  return (
    <div className="page">
      <h1>API Reference</h1>
      <p className="lead">All endpoints on the Fleet API server at port 9005.</p>
      <h2>Setup</h2>
      <ApiTable rows={[
        ['GET', '/api/plugins/nbd/setup-command', 'Returns master URL and setup command'],
      ]} />
      <h2>Nodes</h2>
      <ApiTable rows={[
        ['GET', '/api/plugins/nbd/nodes', 'List all registered nodes'],
        ['GET', '/api/plugins/nbd/nodes/{id}', 'Get a specific node'],
        ['POST', '/api/plugins/nbd/nodes/register', 'Register or update a node (with token)'],
        ['POST', '/api/plugins/nbd/nodes/heartbeat', 'Send a heartbeat'],
      ]} />
      <h2>Sessions</h2>
      <ApiTable rows={[
        ['GET', '/api/plugins/nbd/sessions', 'List sessions (filter by node_id)'],
        ['GET', '/api/plugins/nbd/sessions/{id}', 'Get full session with messages'],
      ]} />
      <h2>Tokens</h2>
      <ApiTable rows={[
        ['POST', '/api/plugins/nbd/tokens/generate', 'Create a time-limited registration token'],
        ['GET', '/api/plugins/nbd/tokens', 'List all tokens and their status'],
      ]} />
      <h2>Chat</h2>
      <ApiTable rows={[
        ['POST', '/api/plugins/nbd/chat', 'Send prompt to a node. Auto-stores conversation.'],
      ]} />
      <h2>System</h2>
      <ApiTable rows={[
        ['GET', '/health', 'Server health check'],
        ['GET', '/mcp', 'MCP SSE endpoint (Streamable HTTP)'],
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

function CodeBlock({ code, header }: { code: string; header?: string }) {
  return (
    <div className="code-block">
      {header && <div className="code-header">{header}</div>}
      <pre><code>{code}</code></pre>
    </div>
  )
}

function ArchitecturePage() {
  return (
    <div className="page">
      <h1>Architecture</h1>
      <p className="lead">How nbd connects your fleet of Hermes agents.</p>
      <div className="arch-diagram">
        <pre>{archArt}</pre>
      </div>
      <h2>Data Flow</h2>
      <ol>
        <li><strong>Registration</strong> &mdash; Node starts hermes proxy, POSTs to /nodes/register with a token</li>
        <li><strong>Heartbeat</strong> &mdash; Node sends periodic heartbeats every 45s</li>
        <li><strong>Chat</strong> &mdash; Master/agent proxies prompts through the Fleet API to node OpenAI APIs</li>
        <li><strong>MCP</strong> &mdash; Agents connect to the Fleet API via MCP for direct fleet tool access</li>
        <li><strong>Storage</strong> &mdash; Every message is stored in SQLite and viewable in the Fleet tab</li>
      </ol>
      <h2>Tech Stack</h2>
      <ul>
        <li><strong>Fleet API:</strong> FastAPI + FastMCP (port 9005)</li>
        <li><strong>Storage:</strong> SQLite (WAL mode)</li>
        <li><strong>Node API:</strong> OpenAI-compatible HTTP via hermes proxy</li>
        <li><strong>Dashboard:</strong> React via Hermes Dashboard Plugin SDK (port 9119)</li>
        <li><strong>Agent tools:</strong> MCP (Streamable HTTP SSE over /mcp)</li>
      </ul>
    </div>
  )
}

const archArt = `
+----------------------------+
|  Hermes Agent (me)         |
|  o MCP Client              |
|  o nbd_list_nodes          |
|  o nbd_chat_with_node      |
+-------+--------------------+
        | MCP (SSE /mcp)
+-------v--------------------+
|  Master: Fleet API (9005)  |
|  o MCP tools               |
|  o HTTP API                |
|  o SQLite (nodes, sessions,|
|    messages, tokens)       |
+-------+--------------------+
        | OpenAI-compat API
        | (hermes proxy)
  +-----+------+------+
  |     |      |      |
+--v--+ +--v--+ +--v--+
|Node1| |Node2| |Node3|
|:8080| |:8080| |:8080|
+-----+ +-----+ +-----+

+--- Dashboard (9119) ---+
| "Node Big Deal" tab    |
| > calls Fleet API      |
+-------------------------+
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
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/mcp" element={<McpPage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
