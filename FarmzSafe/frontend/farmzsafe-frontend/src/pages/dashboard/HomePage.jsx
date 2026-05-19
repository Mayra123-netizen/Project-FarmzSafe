import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { farmsAPI, vaccinesAPI } from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function HomePage() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [f, v] = await Promise.all([farmsAPI.getAll(), vaccinesAPI.getAll()]);
      setFarms(f);
      setVaccines(v);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch dashboard summary data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalAnimals = farms.reduce((acc, f) => acc + (f.animals?.cows || 0) + (f.animals?.goats || 0) + (f.animals?.sheep || 0), 0);
  const totalVaccinatedAnimals = farms.reduce((acc, f) => acc + (f.numVaccinated || 0), 0);
  const totalSickAnimals = farms.reduce((acc, f) => acc + (f.numSick || 0), 0);
  const nonVaccinatedAnimals = Math.max(0, totalAnimals - totalVaccinatedAnimals);

  const doughnutData = {
    labels: ['Vaccinated', 'Pending / Unvaccinated'],
    datasets: [{ data: [totalVaccinatedAnimals, nonVaccinatedAnimals], backgroundColor: ['#2d5a27', '#ff9800'], borderColor: ['#fff', '#fff'], borderWidth: 2 }],
  };

  if (loading) return <div className="dashboard-view"><p>Loading...</p></div>;
  if (error) return (
    <div className="dashboard-view">
      <div className="error-alert">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button className="btn-primary-small" onClick={load}>Retry Connection</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user?.name || user?.role}! Monitoring {totalAnimals} animals across {farms.length} farms.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Animals', value: totalAnimals, bg: '#e8f5e9', icon: '🐄' },
          { label: 'Vaccinated',    value: totalVaccinatedAnimals,   bg: '#e3f2fd', icon: '💉' },
          { label: 'Sick / Ill',    value: totalSickAnimals,      bg: '#ffebee', icon: '⚠️' },
          { label: 'Active Farms',  value: farms.length, bg: '#f1f8e9', icon: '🏡' },
        ].map(({ label, value, bg, icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: bg }}>{icon}</div>
            <div className="stat-info">
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Vaccination Status</h3>
          <div className="chart-container-small">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Monthly Progress</h3>
          <div className="chart-container">
            <Bar
              data={{ labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Vaccinations', data: [45,52,38,65,48,72], backgroundColor: '#2d5a27' }] }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="animal-types-preview">
        <h3>Livestock Overview</h3>
        <div className="animal-grid">
          <div className="animal-item"><span>🐄</span><p>Cows ({farms.reduce((a, f) => a + (f.animals?.cows || 0), 0)})</p></div>
          <div className="animal-item"><span>🐐</span><p>Goats ({farms.reduce((a, f) => a + (f.animals?.goats || 0), 0)})</p></div>
          <div className="animal-item"><span>🐑</span><p>Sheep ({farms.reduce((a, f) => a + (f.animals?.sheep || 0), 0)})</p></div>
          <div className="animal-item"><span>💉</span><p>Vaccinated ({totalVaccinatedAnimals})</p></div>
        </div>
      </div>
    </div>
  );
}
