import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { farmsAPI, vaccinesAPI } from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CHART_COLORS = [
  '#2d5a27', // Forest Green
  '#3f51b5', // Indigo
  '#ff9800', // Amber/Orange
  '#9c27b0', // Deep Purple
  '#00bcd4', // Cyan
  '#e91e63', // Pink
  '#4caf50', // Emerald Green
  '#009688', // Teal
  '#ff5722', // Deep Orange
  '#673ab7'  // Purple
];


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
          {
            label: 'Total Animals',
            value: totalAnimals,
            bg: '#e8f5e9',
            icon: (
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=120&q=80"
                alt="Total Animals"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            )
          },
          {
            label: 'Vaccinated',
            value: totalVaccinatedAnimals,
            bg: '#e3f2fd',
            icon: (
              <img
                src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=120&q=80"
                alt="Vaccinated"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            )
          },
          {
            label: 'Sick / Ill',
            value: totalSickAnimals,
            bg: '#ffebee',
            icon: (
              <img
                src="https://images.unsplash.com/photo-1584036561566-baf241f2c44e?auto=format&fit=crop&w=120&q=80"
                alt="Sick"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            )
          },
          {
            label: 'Active Farms',
            value: farms.length,
            bg: '#f1f8e9',
            icon: (
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=120&q=80"
                alt="Active Farms"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            )
          },
        ].map(({ label, value, bg, icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: bg, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Vaccination Ratio</h3>
          <div className="chart-container-small">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Vaccinations by Farm</h3>
          <div className="chart-container">
            {farms.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No farm data logged in database.
              </div>
            ) : (
              <Bar
                data={{
                  labels: farms.map(f => f.name),
                  datasets: [{
                    label: 'Vaccinated Animals',
                    data: farms.map(f => f.numVaccinated),
                    backgroundColor: farms.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
                    borderRadius: 4
                  }]
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="animal-types-preview">
        <h3>Livestock Overview</h3>
        <div className="animal-grid">
          <div className="animal-item">
            <img src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=80&q=80" alt="Cows" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <p>Cows ({farms.reduce((a, f) => a + (f.animals?.cows || 0), 0)})</p>
          </div>
          <div className="animal-item">
            <img src="https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=80&q=80" alt="Goats" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <p>Goats ({farms.reduce((a, f) => a + (f.animals?.goats || 0), 0)})</p>
          </div>
          <div className="animal-item">
            <img src="https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=80&q=80" alt="Sheep" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <p>Sheep ({farms.reduce((a, f) => a + (f.animals?.sheep || 0), 0)})</p>
          </div>
          <div className="animal-item">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=80&q=80" alt="Vaccinated" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <p>Vaccinated ({totalVaccinatedAnimals})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
