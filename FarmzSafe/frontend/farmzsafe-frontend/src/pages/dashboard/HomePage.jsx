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

  useEffect(() => {
    const load = async () => {
      try {
        const [f, v] = await Promise.all([farmsAPI.getAll(), vaccinesAPI.getAll()]);
        setFarms(f);
        setVaccines(v);
      } catch {
        // Use local demo data while backend is offline
        setFarms([{ id: 1, name: "Fatima's Farm", location: "Kaduna State", animals: { cows: 45, goats: 32, sheep: 28 } }]);
        setVaccines([
          { id: 1, animal: 'Cow #102', name: 'Anthrax Vaccine', status: 'Completed' },
          { id: 2, animal: 'Goat #B2', name: 'Rabies Shot', status: 'Pending' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalAnimals = farms.reduce((acc, f) => acc + (f.animals?.cows || 0) + (f.animals?.goats || 0) + (f.animals?.sheep || 0), 0);
  const vaccinated = vaccines.filter(v => v.status === 'Completed').length;
  const pending = vaccines.filter(v => v.status === 'Pending').length;

  const doughnutData = {
    labels: ['Vaccinated', 'Pending'],
    datasets: [{ data: [vaccinated, pending], backgroundColor: ['#2d5a27', '#ff9800'], borderColor: ['#fff', '#fff'], borderWidth: 2 }],
  };

  if (loading) return <div className="dashboard-view"><p>Loading...</p></div>;

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user?.name || user?.role}! Monitoring {totalAnimals} animals across {farms.length} farms.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Animals', value: totalAnimals, bg: '#e8f5e9', icon: '🐄' },
          { label: 'Vaccinated',    value: vaccinated,   bg: '#e3f2fd', icon: '💉' },
          { label: 'Pending',       value: pending,      bg: '#fff3e0', icon: '⚠️' },
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
          <div className="animal-item"><span>💉</span><p>Vaccinated ({vaccinated})</p></div>
        </div>
      </div>
    </div>
  );
}
