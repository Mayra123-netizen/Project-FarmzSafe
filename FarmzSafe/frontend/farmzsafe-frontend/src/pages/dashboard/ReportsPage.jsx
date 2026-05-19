import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../api';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsAPI.getSummary();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenAdd = () => {
    setForm({ title: '', description: '', fileUrl: '' });
    setModalMode('add');
    setShowModal(true);
  };

  const handleOpenEdit = (report) => {
    setForm({ title: report.title, description: report.description, fileUrl: report.fileUrl });
    setSelectedReportId(report.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        await reportsAPI.create(form);
      } else {
        await reportsAPI.update(selectedReportId, form);
      }
      setShowModal(false);
      await fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await reportsAPI.delete(id);
      await fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed.');
    }
  };

  if (loading) return <div className="dashboard-view"><p>Loading reports...</p></div>;
  if (error) return (
    <div className="dashboard-view">
      <div className="error-alert">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button className="btn-primary-small" onClick={fetchReports}>Retry Connection</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <div className="h-text">
          <h2>Reports & Health Logs</h2>
          <p className="sub">Manage livestock health records and safety reports</p>
        </div>
        {user?.role === 'Owner' && (
          <button className="btn-primary-small" onClick={handleOpenAdd}>
            Create Report
          </button>
        )}
      </div>

      <div className="reports-summary-cards">
        <div className="report-mini-card">
          <h4>Successful Check-ups</h4>
          <p className="val">{reports?.successfulChecks || 0}</p>
          <span>Total logs recorded</span>
        </div>
        <div className="report-mini-card">
          <h4>Casualties / Reports</h4>
          <p className="val danger">{reports?.casualties || 0}</p>
          <span>Critical status logs</span>
        </div>
      </div>

      <div className="table-container">
        <h3>Safety Records & Logs</h3>
        <table>
          <thead>
            <tr>
              <th>Title / Farm</th>
              <th>Description</th>
              <th>Document / Reference</th>
              {user?.role === 'Owner' && <th style={{ width: '120px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reports?.monthlySummary.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'Owner' ? 4 : 3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No reports logged yet.
                </td>
              </tr>
            ) : (
              reports?.monthlySummary.map(row => (
                <tr key={row.id}>
                  <td><strong>{row.title}</strong></td>
                  <td>{row.description}</td>
                  <td>{row.fileUrl ? <a href={row.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>{row.fileUrl}</a> : 'N/A'}</td>
                  {user?.role === 'Owner' && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-text" style={{ padding: 0, color: 'var(--primary-color)' }} onClick={() => handleOpenEdit(row)}>Edit</button>
                        <button className="btn-text" style={{ padding: 0, color: 'var(--danger-color)' }} onClick={() => handleDelete(row.id)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>{modalMode === 'add' ? 'Create New Report' : 'Edit Report'}</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Report Title / Farm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Q2 Safety Review or Sunrise Valley Ranch"
                    value={form.title}
                    onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description / Health Log Details</label>
                  <textarea
                    placeholder="Describe livestock health status, checkup results, or safety logs..."
                    value={form.description}
                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Document URL / File Reference (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. https://drive.google.com/..."
                    value={form.fileUrl}
                    onChange={(e) => setForm(p => ({ ...p, fileUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</button>
                <button type="submit" className="btn-save" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
