import { useState, useEffect } from 'react';
import { reportsAPI } from '../../api';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportsAPI.getSummary();
        setReports(data);
      } catch (err) {
        // Mock fallback
        setReports({
          successfulChecks: 24,
          casualties: 2,
          monthlySummary: [
            { id: 1, farmName: "Fatima's Farm", animalType: "Cattle", casualties: 0, successfulChecks: 2, notes: "All healthy this month" },
            { id: 2, farmName: "Obi's Farm", animalType: "Sheep", casualties: 1, successfulChecks: 1, notes: "One casualty due to heat" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="dashboard-view"><p>Loading reports...</p></div>;

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
