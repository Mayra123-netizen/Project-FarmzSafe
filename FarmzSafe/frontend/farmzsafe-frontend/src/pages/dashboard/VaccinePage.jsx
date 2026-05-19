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

  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const data = await vaccinesAPI.getAll();
      setVaccines(data);
    } catch (err) {
      // Mock data fallback
      setVaccines([
        { id: 1, animal: 'Cow #102', name: 'Anthrax Vaccine', disease: 'Anthrax', date: '2026-05-10', nextDue: '2026-11-10', status: 'Completed' },
        { id: 2, animal: 'Goat #B2', name: 'Rabies Shot', disease: 'Rabies', date: 'Pending', nextDue: '2026-05-15', status: 'Pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleVaccineSubmit = async (vaccineData) => {
    setActionLoading(true);
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
      // Fallback local modification
      if (editingVaccine) {
        setVaccines(prev => prev.map(v => v.id === editingVaccine.id ? { ...vaccineData, id: v.id } : v));
      } else {
        setVaccines(prev => [...prev, { ...vaccineData, id: Date.now() }]);
      }
      setShowVaccineModal(false);
      setEditingVaccine(null);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVaccine = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await vaccinesAPI.delete(id);
        await fetchVaccines();
      } catch (err) {
        setVaccines(prev => prev.filter(v => v.id !== id));
      }
    }
  };

  const startEditVaccine = (v) => {
    setEditingVaccine(v);
    setShowVaccineModal(true);
  };

  if (loading) return <div className="dashboard-view"><p>Loading records...</p></div>;

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
