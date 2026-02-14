import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, RefreshCw, Search,
  LayoutDashboard, List, Code2, LogOut, ShieldCheck, Mail, Ticket,
  Plus, Edit, Trash2, X
} from 'lucide-react';

interface SalesReport {
  id: number;
  productName: string;
  category: string;
  amount: number;
  saleDate: string;
  region: string;
}

interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  performedBy: string;
  ipAddress: string;
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 1, timestamp: '2026-02-13 13:45:01', action: 'LOGIN', performedBy: 'Administrator', ipAddress: '192.168.1.105', details: 'Successful administrative portal access' },
  { id: 2, timestamp: '2026-02-13 13:46:22', action: 'DATA_EXPORT', performedBy: 'Administrator', ipAddress: '192.168.1.105', details: 'Exported transaction ledger to CSV' },
  { id: 3, timestamp: '2026-02-13 13:47:15', action: 'CONFIG_CHANGE', performedBy: 'System', ipAddress: '127.0.0.1', details: 'Updated UI theme to White' },
  { id: 4, timestamp: '2026-02-13 13:48:30', action: 'REPORT_SYNC', performedBy: 'Administrator', ipAddress: '192.168.1.105', details: 'Synchronized BI reports with central database' },
  { id: 5, timestamp: '2026-02-13 13:49:05', action: 'API_ACCESS', performedBy: 'External Tool', ipAddress: '45.76.12.33', details: 'GET /api/report request' },
];

const COLORS = ['#003366', '#475569', '#64748b', '#94a3b8', '#1e293b'];

function App() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'transactions' | 'api' | 'audit' | 'contact' | 'ticket'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://report-portal-api.onrender.com/api/report');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    setShowChatbot(!isLoggedIn);
  }, [isLoggedIn]);

  const filteredData = useMemo(() => {
    let data = filter === 'All' ? reports : reports.filter(r => r.category === filter);
    if (searchTerm) {
      data = data.filter(r =>
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  }, [reports, filter, searchTerm]);

  // BI Data Processing
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + r.amount;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.region] = (counts[r.region] || 0) + r.amount;
    });
    return Object.entries(counts).map(([name, amount]) => ({ name, amount }));
  }, [reports]);

  const totalSales = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  const avgTicket = filteredData.length > 0 ? totalSales / filteredData.length : 0;
  const categories = ['All', ...new Set(reports.map(r => r.category))];

  const [showChatbot, setShowChatbot] = useState(true);
  const [showTfaModal, setShowTfaModal] = useState(false);
  const [tfaStep, setTfaStep] = useState(1);

  // Ticket System State
  const [tickets, setTickets] = useState([
    { id: 'TKT-7721-A', subject: 'Payroll access denied...', status: 'RESOLVED', color: 'var(--success)' },
    { id: 'TKT-8812-B', subject: 'Regional report mismatch', status: 'IN PROGRESS', color: '#b45309' }
  ]);
  const [ticketsSubmitted, setTicketsSubmitted] = useState(0);
  const [chatbotMessageOverride, setChatbotMessageOverride] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [currentUser, setCurrentUser] = useState('Administrator');
  const [loginUsername, setLoginUsername] = useState('guest');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingReport, setEditingReport] = useState<SalesReport | null>(null);
  const [addFormData, setAddFormData] = useState({
    productName: '',
    category: 'Electronics',
    region: 'District 1',
    amount: '',
    saleDate: new Date().toISOString().split('T')[0]
  });

  const loginView = (
    <div className="login-container" style={{ flexDirection: 'column' }}>
      <div className="demo-banner" style={{ width: '100%', position: 'absolute', top: 0 }}>
        Web application and Web Service Demo Created by Rattanaphan Chavez
      </div>
      <div className="login-card-replica">
        <div className="logo-area-replica">
          <h1>Report Portal</h1>
        </div>

        <form className="login-form-replica" onSubmit={(e) => {
          e.preventDefault();
          const validUsers = ['aomchavez', 'guest'];
          if (validUsers.includes(loginUsername.toLowerCase()) && loginPassword === 'admin') {
            setLoginError('');
            setTfaStep(1);
            setShowTfaModal(true);
          } else {
            setLoginError('Invalid username or password. Access denied.');
          }
        }}>
          <div className="form-group-replica">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
              maxLength={10}
            />
          </div>
          <div className="form-group-replica">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              maxLength={10}
            />
          </div>
          {loginError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '15px', textAlign: 'left' }}>{loginError}</div>}
          <button type="submit" className="btn-login-replica">LOGIN TO PORTAL</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="#" style={{ color: '#64748b', textDecoration: 'underline', fontSize: '0.85em', cursor: 'not-allowed', opacity: 0.6 }}>Forgot password?</a>
          <a href="#" style={{ color: '#64748b', textDecoration: 'underline', fontSize: '0.85em', cursor: 'not-allowed', opacity: 0.6 }}>Create new account</a>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8em' }}>
          <p>This Report Portal application created by Rattanaphan Aom Chavez</p>
        </div>
      </div>

      {/* 2FA Modal */}
      {showTfaModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '40px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            {tfaStep === 1 ? (
              <>
                <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '10px' }}>Verify Identity</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>We'll send a verification code to your registered email or phone number for verification.</p>
                <div className="form-group-replica">
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Verification Email or Phone</label>
                  <input
                    type="text"
                    placeholder="Enter email or phone"
                    defaultValue="test@test.com"
                    disabled
                    style={{ width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid var(--border-light)', marginBottom: '15px', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>
                <button
                  onClick={() => setTfaStep(2)}
                  style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Send code to device
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '10px' }}>Security Check</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>Please enter the 6-digit code sent to your device.</p>
                <input
                  type="text"
                  placeholder="••••••"
                  defaultValue="123456"
                  disabled
                  style={{ width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid var(--border-light)', marginBottom: '15px', letterSpacing: '0.5em', textAlign: 'center', fontWeight: 800, fontSize: '1.2em', color: '#64748b', cursor: 'not-allowed' }}
                />
                <button
                  onClick={() => {
                    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
                    const newLog: AuditLog = {
                      id: Date.now(),
                      timestamp,
                      action: 'LOGIN',
                      performedBy: loginUsername || 'Administrator',
                      ipAddress: '127.0.0.1',
                      details: `Successful session initialization for ${loginUsername}`
                    };
                    setAuditLogs([newLog, ...auditLogs]);
                    setIsLoggedIn(true);
                    setCurrentUser(loginUsername || 'Administrator');
                    setActiveMenu('dashboard');
                  }}
                  style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Submit & Login
                </button>
                <button
                  onClick={() => setShowTfaModal(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', marginTop: '15px', cursor: 'pointer', fontSize: '0.8em' }}
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isLoggingOut ? (
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: 'var(--primary)',
          flexDirection: 'column',
          zIndex: 9999
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>You are loging out. Thank you</h1>
          <RefreshCw className="spin" size={40} color="var(--primary)" />
        </div>
      ) : !isLoggedIn ? loginView : (
        <div className="app-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              Report Portal
            </div>
            <div className="user-profile">
              <div className="user-welcome">Welcome Session</div>
              <div className="user-name">{currentUser}</div>
            </div>
            <div className="sidebar-menu">
              <div
                className={`sidebar-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveMenu('dashboard')}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </div>
              <div
                className={`sidebar-item ${activeMenu === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveMenu('transactions')}
              >
                <List size={20} />
                Transactions
              </div>
              <div
                className={`sidebar-item ${activeMenu === 'api' ? 'active' : ''}`}
                onClick={() => setActiveMenu('api')}
              >
                <Code2 size={20} />
                Web Service API
              </div>
              <div
                className={`sidebar-item ${activeMenu === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveMenu('audit')}
              >
                <ShieldCheck size={20} />
                Audit Log
              </div>
              <div
                className={`sidebar-item ${activeMenu === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveMenu('contact')}
              >
                <Mail size={20} />
                Contact Support
              </div>
              <div
                className={`sidebar-item ${activeMenu === 'ticket' ? 'active' : ''}`}
                onClick={() => setActiveMenu('ticket')}
              >
                <Ticket size={20} />
                Create Ticket
              </div>
              <div
                className="sidebar-item"
                style={{ marginTop: 'auto', borderLeftColor: 'transparent', color: '#fca5a5' }}
                onClick={() => {
                  setIsLoggingOut(true);
                  setTimeout(() => {
                    setIsLoggedIn(false);
                    setIsLoggingOut(false);
                    setShowTfaModal(false);
                    setTfaStep(1);
                    setTicketsSubmitted(0);
                    setChatbotMessageOverride(null);
                    setLoginUsername('guest');
                    setLoginPassword('admin');
                    setLoginError('');
                  }, 2000);
                }}
              >
                <LogOut size={20} />
                Log Out
              </div>
            </div>
            <div style={{ padding: '1rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              VER v2.1.0-GOV
            </div>
          </aside>

          <main className="main-content">
            <div className="demo-banner">
              Web application and Web Service Demo Created by Rattanaphan Chavez
            </div>
            <div className="container">
              <header className="header">
                <div>
                  <h1>
                    {activeMenu === 'dashboard' && 'Analytical Dashboard'}
                    {activeMenu === 'transactions' && 'Transaction Registry'}
                    {activeMenu === 'api' && 'REST API Documentation'}
                    {activeMenu === 'audit' && 'Security Audit Trail'}
                    {activeMenu === 'contact' && 'Support & Contact'}
                    {activeMenu === 'ticket' && 'Service Desk Ticket'}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {activeMenu === 'dashboard' && 'Strategic Business Intelligence Overview'}
                    {activeMenu === 'transactions' && 'Statutory Financial Records Maintenance'}
                    {activeMenu === 'api' && 'Web Service Interoperability & Endpoints'}
                    {activeMenu === 'audit' && 'Security Events & Administrative Actions Monitoring'}
                    {activeMenu === 'contact' && 'Direct Communication & Technical Assistance Channels'}
                    {activeMenu === 'ticket' && 'Submit Formal Requests, Feedback, or Technical Bug Reports'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {(activeMenu === 'dashboard' || activeMenu === 'transactions') && (
                    <select
                      className="refresh-btn"
                      style={{ background: 'white', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '0', padding: '0.5rem 1rem' }}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      {categories.map(c => <option key={c} value={c}>{c} Filter</option>)}
                    </select>
                  )}
                  {activeMenu !== 'api' && activeMenu !== 'audit' && (
                    <button className="refresh-btn" onClick={fetchReports}>
                      <RefreshCw size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Sync
                    </button>
                  )}
                </div>
              </header>

              {activeMenu === 'dashboard' && (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-label">Consolidated Revenue</div>
                      <div className="stat-value">${totalSales.toLocaleString()}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '4px', fontWeight: 'bold' }}>
                        <TrendingUp size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        +12.4% PERFORMANCE
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Average Transaction Value</div>
                      <div className="stat-value">${avgTicket.toFixed(2)}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Reporting Regions</div>
                      <div className="stat-value">{[...new Set(reports.map(r => r.region))].length}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="stat-card" style={{ height: '350px' }}>
                      <div className="stat-label" style={{ marginBottom: '1rem' }}>Regional Performance Matrix</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={regionData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid var(--border-color)' }} />
                          <Bar dataKey="amount" fill="#003366" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="stat-card" style={{ height: '350px' }}>
                      <div className="stat-label" style={{ marginBottom: '1rem' }}>Volume by Category Distribution</div>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {categoryData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {activeMenu === 'transactions' && (
                <div className="report-table-container">
                  <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Statutory Transaction Ledger: {filter} Category View</div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        className="refresh-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}
                        onClick={() => {
                          setEditingReport(null);
                          setAddFormData({
                            productName: '',
                            category: 'Electronics',
                            region: 'District 1',
                            amount: '',
                            saleDate: new Date().toISOString().split('T')[0]
                          });
                          setShowAddModal(true);
                        }}
                      >
                        <Plus size={14} /> New Registry Entry
                      </button>
                      <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search Records..."
                          style={{
                            padding: '0.4rem 1rem 0.4rem 2rem',
                            fontSize: '0.75rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0',
                            width: '240px'
                          }}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button
                        className="refresh-btn"
                        style={{ background: '#166534', fontSize: '0.7rem' }}
                        onClick={() => {
                          const headers = ['ID', 'Product', 'Category', 'Amount', 'Date', 'Region'];
                          const rows = filteredData.map(r => [r.id, r.productName, r.category, r.amount, r.saleDate, r.region]);
                          const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
                          const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
                          const newLog: AuditLog = {
                            id: Date.now(),
                            timestamp,
                            action: 'DATA_EXPORT',
                            performedBy: currentUser,
                            ipAddress: '127.0.0.1',
                            details: `Exported ${filteredData.length} statutory records as CSV`
                          };
                          setAuditLogs([newLog, ...auditLogs]);

                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.setAttribute("download", `Report_Export_${new Date().toISOString().split('T')[0]}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  {loading ? (
                    <div className="loading">Accessing Central Database...</div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Registry Item</th>
                          <th>Category</th>
                          <th>Region ID</th>
                          <th>Posting Date</th>
                          <th>Total Amount</th>
                          <th>Administrative</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((report) => (
                          <tr key={report.id}>
                            <td style={{ fontWeight: 600 }}>{report.productName}</td>
                            <td>
                              <span className={`badge badge-${report.category.toLowerCase()}`}>
                                {report.category}
                              </span>
                            </td>
                            <td>{report.region}</td>
                            <td>{new Date(report.saleDate).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 800 }}>${report.amount.toFixed(2)}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => {
                                    setEditingReport(report);
                                    setAddFormData({
                                      productName: report.productName,
                                      category: report.category,
                                      region: report.region,
                                      amount: report.amount.toString(),
                                      saleDate: report.saleDate.split('T')[0]
                                    });
                                    setShowAddModal(true);
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '4px' }}
                                  title="Edit Entry"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setChatbotMessageOverride("Thanks for trying this demo web application. We disable some button for the demo purpose only.");
                                    setShowChatbot(true);
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'not-allowed', padding: '4px', opacity: 0.6 }}
                                  title="Delete Entry (Disabled for Demo)"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                  <div style={{ background: 'white', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.75rem' }}>
                      <h2 style={{ color: 'var(--primary)', margin: 0, textTransform: 'uppercase', fontSize: '1.2rem' }}>
                        {editingReport ? 'Edit Registry Entry' : 'New Statutory Record'}
                      </h2>
                      <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={24} />
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const amountNum = parseFloat(addFormData.amount);
                      if (isNaN(amountNum)) return;

                      if (editingReport) {
                        const updatedReports = reports.map(r =>
                          r.id === editingReport.id ? { ...r, ...addFormData, amount: amountNum } : r
                        );
                        setReports(updatedReports);

                        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
                        const newLog: AuditLog = {
                          id: Date.now(),
                          timestamp,
                          action: 'DATA_UPDATE',
                          performedBy: currentUser,
                          ipAddress: '127.0.0.1',
                          details: `Updated registry record ID:${editingReport.id} (${addFormData.productName})`
                        };
                        setAuditLogs([newLog, ...auditLogs]);
                      } else {
                        const newId = Math.max(...reports.map(r => r.id), 0) + 1;
                        const newReport: SalesReport = {
                          id: newId,
                          productName: addFormData.productName,
                          category: addFormData.category,
                          amount: amountNum,
                          saleDate: addFormData.saleDate,
                          region: addFormData.region
                        };
                        setReports([newReport, ...reports]);

                        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
                        const newLog: AuditLog = {
                          id: Date.now(),
                          timestamp,
                          action: 'DATA_CREATE',
                          performedBy: currentUser,
                          ipAddress: '127.0.0.1',
                          details: `New statutory registry entry created ID:${newId} (${addFormData.productName})`
                        };
                        setAuditLogs([newLog, ...auditLogs]);
                      }
                      setShowAddModal(false);
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Registry Item Name</label>
                          <input
                            type="text"
                            required
                            value={addFormData.productName}
                            onChange={(e) => setAddFormData({ ...addFormData, productName: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', outline: 'none' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</label>
                            <select
                              value={addFormData.category}
                              onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
                              style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                            >
                              <option value="Electronics">Electronics</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Compliance">Compliance</option>
                              <option value="Advisory">Advisory</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reporting Region</label>
                            <select
                              value={addFormData.region}
                              onChange={(e) => setAddFormData({ ...addFormData, region: e.target.value })}
                              style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                            >
                              <option value="District 1">District 1</option>
                              <option value="District 2">District 2</option>
                              <option value="District 3">District 3</option>
                              <option value="Headquarters">Headquarters</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Amount ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={addFormData.amount}
                              onChange={(e) => setAddFormData({ ...addFormData, amount: e.target.value })}
                              style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Posting Date</label>
                            <input
                              type="date"
                              required
                              value={addFormData.saleDate}
                              onChange={(e) => setAddFormData({ ...addFormData, saleDate: e.target.value })}
                              style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', outline: 'none' }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            className="refresh-btn"
                            style={{ flex: 1, padding: '1rem', opacity: 0.6, cursor: 'not-allowed' }}
                            onClick={() => {
                              setChatbotMessageOverride("Thanks for trying this demo web application. We disable some button for the demo purpose only.");
                              setShowChatbot(true);
                            }}
                          >
                            {editingReport ? 'Update Record' : 'Commit to Registry'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            style={{ flex: 1, padding: '1rem', background: 'none', border: '1px solid var(--border-color)', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeMenu === 'api' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="stat-card">
                    <div className="stat-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                      Web Service Interface Definition (REST)
                    </div>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ background: '#166534', color: 'white', padding: '0.2rem 0.6rem', fontWeight: 'bold', fontSize: '0.75rem' }}>GET</span>
                        <code style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1rem' }}>/api/report</code>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Returns a list of statutory reporting records. Supports asynchronous task execution in the .NET runtime.
                      </p>

                      <div style={{ background: '#ffffff', color: 'var(--text-main)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Resource Access URL (Production)</div>
                        <code style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>https://report-portal-api.onrender.com/api/report</code>
                      </div>

                      <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Interface Schema (SalesReport)</div>
                        <table style={{ background: 'white', fontSize: '0.8rem' }}>
                          <thead>
                            <tr>
                              <th style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '0.5rem' }}>Data Field</th>
                              <th style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '0.5rem' }}>Protocol Type</th>
                              <th style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '0.5rem' }}>System Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>id</td><td>Integer</td><td>Unique primary record identifier</td></tr>
                            <tr><td>productName</td><td>String</td><td>Official registry name of item</td></tr>
                            <tr><td>category</td><td>String</td><td>Statutory classification (Electronics, etc)</td></tr>
                            <tr><td>amount</td><td>Decimal</td><td>Total currency value of transaction</td></tr>
                            <tr><td>saleDate</td><td>DateTime</td><td>ISO 8601 standardized timestamp</td></tr>
                            <tr><td>region</td><td>String</td><td>Administrative reporting district</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <div className="stat-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                          HTTP Status Standards
                        </div>
                        <ul style={{ fontSize: '0.85rem', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '0.5rem' }}><code style={{ color: '#166534', fontWeight: 'bold' }}>200 OK</code> - Successful retrieval</li>
                          <li style={{ marginBottom: '0.5rem' }}><code style={{ color: '#991b1b', fontWeight: 'bold' }}>500 ERR</code> - Server-side fault detected</li>
                        </ul>
                      </div>
                      <div>
                        <div className="stat-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                          C# Mapping Definition
                        </div>
                        <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', background: '#f1f5f9', padding: '0.5rem' }}>
                          public class SalesReport<br />
                          &#123;<br />
                          &nbsp;&nbsp;public int Id &#123; get; set; &#125;<br />
                          &nbsp;&nbsp;public decimal Amount &#123; get; set; &#125;<br />
                          &#125;
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label" style={{ marginBottom: '1rem' }}>Payload Example (MIME: application/json)</div>
                    <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '1.5rem', overflowX: 'auto', fontSize: '0.8rem', lineHeight: '1.6' }}>
                      {`[
  {
    "id": 1004,
    "productName": "Statutory Desktop Unit",
    "category": "Electronics",
    "amount": 1499.50,
    "saleDate": "2026-02-13T13:30:00",
    "region": "District 1"
  }
]`}
                    </pre>
                  </div>
                </div>
              )}

              {activeMenu === 'audit' && (
                <div className="report-table-container">
                  <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Official System Security Audit Trail</div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>IP Address</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                          <td>
                            <span className={`badge ${log.action === 'LOGIN' ? 'badge-login' :
                              log.action.includes('EXPORT') ? 'badge-export' :
                                'badge-system'
                              }`} style={{ fontSize: '0.65rem' }}>
                              {log.action.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{log.performedBy}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent)' }}>{log.ipAddress}</td>
                          <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeMenu === 'contact' && (
                <div style={{ background: 'white', border: '1px solid var(--border-color)', borderTop: '4px solid var(--accent)', padding: '2.5rem' }}>
                  <div style={{ maxWidth: '600px' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '1.2rem' }}>Technical Assistance Center</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ background: '#eff6ff', padding: '12px', color: 'var(--primary)' }}>
                          <Mail size={24} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-main)' }}>Email Inquiry</h4>
                          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <span
                              style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                              onClick={() => setShowEmailModal(true)}
                            >
                              Click here to contact us
                            </span>
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ background: '#eff6ff', padding: '12px', color: 'var(--primary)' }}>
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-main)' }}>System Availability</h4>
                          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monday - Friday | 08:00 - 17:00 EST</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderLeft: '4px solid #94a3b8' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                          "For immediate assistance regarding administrative access or payroll report discrepancies, please utilize the internal messaging system or contact your direct supervisor."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === 'ticket' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
                  <div style={{ background: 'white', border: '1px solid var(--border-color)', borderTop: '4px solid var(--accent)', padding: '2.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '1.2rem' }}>Ticket Submission Form</h2>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (ticketsSubmitted >= 3) {
                        setChatbotMessageOverride("For this demo, we allow 3 tickets to be submitted. Thanks for trying");
                        setShowChatbot(true);
                        return;
                      }
                      const newId = `TKT-${Math.floor(Math.random() * 9000) + 1000}-X`;
                      const newTicket = { id: newId, subject: ticketSubject, status: 'SUBMITTED', color: 'var(--accent)' };

                      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
                      const newLog: AuditLog = {
                        id: Date.now(),
                        timestamp,
                        action: 'TICKET_SUBMIT',
                        performedBy: currentUser,
                        ipAddress: '127.0.0.1',
                        details: `Submitted service desk ticket ${newId}: ${ticketSubject.substring(0, 30)}...`
                      };
                      setAuditLogs([newLog, ...auditLogs]);

                      setTickets([newTicket, ...tickets]);
                      setHighlightedTicketId(newId);
                      setTicketSubject('');
                      setTicketDesc('');
                      setTicketsSubmitted(prev => prev + 1);
                      // Auto-remove highlight after 5 seconds
                      setTimeout(() => setHighlightedTicketId(null), 5000);
                    }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>Subject</label>
                        <input
                          type="text"
                          placeholder="Brief summary of the issue or request"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          maxLength={100}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Max 100 characters
                        </div>
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>Category</label>
                        <select style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}>
                          <option value="request">General Request</option>
                          <option value="feedback">User Feedback</option>
                          <option value="bug">Technical Bug / error</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>Description</label>
                        <textarea
                          placeholder="Please provide detailed information regarding your submission..."
                          rows={6}
                          required
                          value={ticketDesc}
                          onChange={(e) => setTicketDesc(e.target.value)}
                          maxLength={500}
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        ></textarea>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Max 500 characters
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="refresh-btn" style={{ padding: '1rem 2rem' }}>Submit Ticket</button>
                        <button type="button" onClick={() => setActiveMenu('dashboard')} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '1rem 2rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                  <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Submissions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {tickets.slice(0, 4).map((ticket) => (
                        <div
                          key={ticket.id}
                          style={{
                            padding: '10px',
                            background: highlightedTicketId === ticket.id ? '#e0f2fe' : '#f8fafc',
                            borderLeft: `3px solid ${ticket.color}`,
                            border: highlightedTicketId === ticket.id ? '1px solid var(--accent)' : '1px solid transparent',
                            borderLeftWidth: '3px',
                            transition: 'all 0.3s ease',
                            transform: highlightedTicketId === ticket.id ? 'scale(1.02)' : 'scale(1)'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{ticket.id}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.subject || 'No subject provided'}</div>
                          <div style={{ fontSize: '0.6rem', color: ticket.color, marginTop: '4px', fontWeight: 700 }}>{ticket.status}</div>
                        </div>
                      ))}
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>Showing latest {Math.min(tickets.length, 4)} records</p>
                    </div>
                  </div>
                </div>
              )}

              <footer style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', paddingBottom: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 'bold' }}>Institutional Report Service</div>
                NOT FOR REDISTRIBUTION | PROPRIETARY ADVISORY
              </footer>
            </div>
          </main>

        </div>
      )}

      {/* Chatbot Widget (Global) */}
      <div className="chatbot-container-replica">
        {showChatbot && (
          <div className="chatbot-window-replica">
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '18px' }}>S</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Support</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Digital Agent</p>
              </div>
            </div>
            <div style={{ flex: 1, padding: '20px', background: '#f8fafc', overflowY: 'auto' }}>
              {!isLoggedIn ? (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>S</div>
                    <div style={{ background: 'white', padding: '12px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Hello! I can assist you with the Report Portal login.
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexDirection: 'row-reverse' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>U</div>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', fontSize: '14px' }}>
                      I need help with my login credentials.
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>S</div>
                    <div style={{ background: 'white', padding: '12px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Of course. You can use 'guest' as your username and 'admin' as the password. These are pre-populated in the form for your convenience.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>S</div>
                    <div style={{ background: 'white', padding: '12px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Hello! How can I help you today?
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexDirection: 'row-reverse' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>U</div>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', fontSize: '14px' }}>
                      I need assistance with the reports.
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '14px', flexShrink: 0 }}>S</div>
                    <div style={{ background: 'white', padding: '12px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {chatbotMessageOverride || "I'm here to support you with the N-Tier Reporting System. You can navigate through the dashboard or transactions via the sidebar."}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Type your message..." style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-light)', fontSize: '14px', background: '#f8fafc' }} disabled />
                <button style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, opacity: 0.5 }} disabled>Send</button>
              </div>
            </div>
          </div>
        )}
        <button
          className="chatbot-toggle-replica"
          onClick={() => setShowChatbot(!showChatbot)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.31-3.86-.86l-.28-.15-2.9.49.49-2.9-.15-.28C4.31 14.68 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4-9h-3V8c0-.55-.45-1-1-1s-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1z" />
          </svg>
        </button>
      </div>

      {showEmailModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: 'white', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.75rem' }}>
              <h2 style={{ color: 'var(--primary)', margin: 0, textTransform: 'uppercase', fontSize: '1.2rem' }}>Contact Support</h2>
              <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>Your Message</label>
              <textarea
                placeholder="Write your message to the support team here..."
                rows={5}
                maxLength={700}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Max 700 characters
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                disabled
                className="refresh-btn"
                style={{ flex: 1, padding: '10px', opacity: 0.6, cursor: 'not-allowed' }}
              >
                Submit Inquiry
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid var(--border-color)', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App
