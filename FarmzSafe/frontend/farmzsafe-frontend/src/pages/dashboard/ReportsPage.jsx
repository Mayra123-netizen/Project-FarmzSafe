import { useState, useEffect } from 'react';
import { reportsAPI } from '../../api';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <h2>Reports & Summaries</h2>
      </div>

      <div className="reports-summary-cards">
        <div className="report-mini-card">
          <h4>Successful Check-ups</h4>
          <p className="val">{reports?.successfulChecks}</p>
          <span>This month</span>
        </div>
        <div className="report-mini-card">
          <h4>Casualties</h4>
          <p className="val danger">{reports?.casualties}</p>
          <span>This month</span>
        </div>
      </div>

      <div className="table-container">
        <h3>Monthly Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Farm Name</th>
              <th>Animal Type</th>
              <th>Casualties</th>
              <th>Successful Checks</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {reports?.monthlySummary.map(row => (
              <tr key={row.id}>
                <td>{row.farmName}</td>
                <td>{row.animalType}</td>
                <td>{row.casualties}</td>
                <td>{row.successfulChecks}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
