import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { farmsAPI } from '../../api';
import FarmForm from '../../components/FarmForm';
import { useAuth } from '../../context/AuthContext';

export default function FarmsPage() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmsAPI.getAll();
      setFarms(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch farms from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleAddFarm = async (farmData) => {
    setActionLoading(true);
    setError(null);
    try {
      await farmsAPI.create(farmData);
      await fetchFarms();
      setShowAddFarmModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create new farm.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="dashboard-view"><p>Loading farms...</p></div>;
  if (error) return (
    <div className="dashboard-view">
      <div className="error-alert">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button className="btn-primary-small" onClick={fetchFarms}>Retry Connection</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <div className="h-text">
          <h2>My Farms</h2>
          <p className="sub">{farms.length} registered farms - click a farm to view its report</p>
        </div>
        {(user?.role === 'Owner' || user?.role === 'Employee') && (
          <button className="btn-primary-small" onClick={() => setShowAddFarmModal(true)}>
            <Plus size={16} /> Add new farm
          </button>
        )}
      </div>

      {selectedFarm ? (
        <div className="farm-detail-view">
          <button className="btn-text" onClick={() => setSelectedFarm(null)}>← Back to Farms</button>
          
          <div className="farm-report-header">
            <div className="report-cards-grid">
              <div className="report-mini-card">
                <span className="val">{selectedFarm.totalAnimals ?? 0}</span>
                <span>Total animals</span>
                <span className="sub-val">Livestock</span>
              </div>
              <div className="report-mini-card">
                <span className="val">{selectedFarm.numVaccinated ?? 0}</span>
                <span>Vaccinated</span>
                <span className="sub-val good">
                  {selectedFarm.totalAnimals > 0 ? Math.round(((selectedFarm.numVaccinated ?? 0) / selectedFarm.totalAnimals) * 100) : 0}%
                </span>
              </div>
              <div className="report-mini-card">
                <span className="val">{selectedFarm.numSick ?? 0}</span>
                <span>Sick / Ill</span>
                <span className={`sub-val ${(selectedFarm.numSick ?? 0) > 0 ? 'pending' : 'good'}`}>
                  {(selectedFarm.numSick ?? 0) > 0 ? 'Outbreak Alert' : 'No Disease'}
                </span>
              </div>
              <div className="report-mini-card">
                <span className="val">
                  {selectedFarm.totalAnimals > 0 ? Math.round(((selectedFarm.totalAnimals - (selectedFarm.numSick ?? 0)) / selectedFarm.totalAnimals) * 100) : 100}%
                </span>
                <span>Safety Status</span>
                <span className={`sub-val ${((selectedFarm.numSick ?? 0) / (selectedFarm.totalAnimals || 1)) > 0.05 ? 'pending' : 'good'}`}>
                  {((selectedFarm.numSick ?? 0) / (selectedFarm.totalAnimals || 1)) > 0.05 ? 'High Risk' : 'Secure'}
                </span>
              </div>
            </div>
          </div>

          <div className="table-container" style={{ marginTop: '2rem' }}>
            <h3>Detailed Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>ANIMAL TYPE</th>
                  <th>TOTAL</th>
                  <th>HEALTHY</th>
                  <th>SICK</th>
                  <th>VACCINATION COVERAGE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {selectedFarm.breakdown && selectedFarm.breakdown.map((anim) => {
                  const total = anim.count || 0;
                  const vac = anim.vaccinatedAnimalCount || 0;
                  const sick = anim.sickAnimalCount || 0;
                  const healthy = Math.max(0, total - sick);
                  const pct = total > 0 ? Math.round((vac / total) * 100) : 0;
                  const status = sick > 0 ? 'Outbreak' : 'Healthy';
                  
                  return (
                    <tr key={anim._id || anim.type}>
                      <td><strong style={{ textTransform: 'capitalize' }}>{anim.type}</strong></td>
                      <td>{total}</td>
                      <td>{healthy}</td>
                      <td>{sick}</td>
                      <td className="coverage-cell">
                        <div className="progress-container">
                          <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#2d5a27' : '#ff9800' }}></div>
                        </div>
                        <span>{pct}%</span>
                      </td>
                      <td><span className={`status-badge ${status.toLowerCase()}`}>{status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="farms-list">
          {farms.map(farm => (
            <div key={farm.id} className="farm-card-detailed clickable" onClick={() => setSelectedFarm(farm)}>
              <div className="farm-info">
                <h3>{farm.name}</h3>
                <p>{farm.location} </p>
                <div className="farm-tags">
                  {farm.breakdown && farm.breakdown.length > 0 ? (
                    farm.breakdown.map((anim, idx) => (
                      <span key={idx} className="tag" style={{ textTransform: 'capitalize' }}>
                        {anim.type}
                      </span>
                    ))
                  ) : (
                    <span className="tag" style={{ textTransform: 'capitalize' }}>{farm.animalType}</span>
                  )}
                </div>
              </div>
              <div className="farm-stats-summary">
                <div className="f-main-stat">
                  <span className="s-val">{farm.totalAnimals || 105}</span>
                  <span className="s-lbl">animals</span>
                </div>
                <div className="f-main-stat">
                  <span className="s-val green">
                    {Math.round(((farm.numVaccinated || 88) / (farm.totalAnimals || 105)) * 100)}%
                  </span>
                  <span className="s-lbl">vaccinated</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddFarmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FarmForm
              onSubmit={handleAddFarm}
              onCancel={() => setShowAddFarmModal(false)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
