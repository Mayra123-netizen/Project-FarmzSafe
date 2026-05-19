import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { vaccinesAPI } from '../../api';
import VaccineForm from '../../components/VaccineForm';

export default function VaccinePage() {
  const [vaccines, setVaccines] = useState([]);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVaccines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vaccinesAPI.getAll();
      setVaccines(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch vaccine records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleVaccineSubmit = async (vaccineData) => {
    setActionLoading(true);
    setError(null);
    try {
      if (editingVaccine) {
        await vaccinesAPI.update(editingVaccine.id, vaccineData);
      } else {
        await vaccinesAPI.create(vaccineData);
      }
      await fetchVaccines();
      setShowVaccineModal(false);
      setEditingVaccine(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save vaccine record.');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVaccine = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setError(null);
      try {
        await vaccinesAPI.delete(id);
        await fetchVaccines();
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to delete vaccine record.');
      }
    }
  };

  const startEditVaccine = (v) => {
    setEditingVaccine(v);
    setShowVaccineModal(true);
  };

  if (loading) return <div className="dashboard-view"><p>Loading records...</p></div>;
  if (error) return (
    <div className="dashboard-view">
      <div className="error-alert">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button className="btn-primary-small" onClick={fetchVaccines}>Retry Connection</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <h2>Vaccination Records</h2>
        <button className="btn-primary-small" onClick={() => { setEditingVaccine(null); setShowVaccineModal(true); }}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Animal</th>
              <th>Vaccine</th>
              <th>Disease</th>
              <th>Date</th>
              <th>Next Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map(v => (
              <tr key={v.id}>
                <td>{v.animal}</td>
                <td>{v.name}</td>
                <td>{v.disease}</td>
                <td>{v.date}</td>
                <td>{v.nextDue}</td>
                <td><span className={v.status === 'Completed' ? 'badge-success' : 'badge-pending'}>{v.status}</span></td>
                <td className="actions-cell">
                  <button className="text-btn edit" onClick={() => startEditVaccine(v)}>Edit</button>
                  <button className="text-btn delete" onClick={() => deleteVaccine(v.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showVaccineModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-morphism">
            <VaccineForm
              onSubmit={handleVaccineSubmit}
              onCancel={() => { setShowVaccineModal(false); setEditingVaccine(null); }}
              initial={editingVaccine || undefined}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
