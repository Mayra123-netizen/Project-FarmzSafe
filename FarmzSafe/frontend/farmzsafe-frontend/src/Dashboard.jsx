import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Plus,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ onBack, role = 'Owner' }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [editingVaccine, setEditingVaccine] = useState(null);
  
  const [farms, setFarms] = useState([
    { 
      id: 1, 
      name: "Fatima's Farm", 
      owner: "Fatima Ahmed", 
      location: "Kaduna State",
      animals: { cows: 45, goats: 32, sheep: 28 },
      healthLogs: [
        { date: '2026-05-12', status: 'Healthy', notes: 'All animals vaccinated and eating well.' }
      ]
    }
  ]);

  const [vaccines, setVaccines] = useState([
    { id: 1, animal: 'Cow #102', name: 'Anthrax Vaccine', disease: 'Anthrax', date: '2026-05-10', nextDue: '2026-11-10', status: 'Completed' },
    { id: 2, animal: 'Goat #B2', name: 'Rabies Shot', disease: 'Rabies', date: 'Pending', nextDue: '2026-05-15', status: 'Pending' },
  ]);

  const [newFarm, setNewFarm] = useState({ 
    name: '', 
    location: '', 
    yearEstablished: '', 
    animalType: 'Mixed (multiple types)', 
    totalAnimals: '', 
    numVaccinated: '', 
    manager: '', 
    notes: '' 
  });

  const handleAddFarm = (e) => {
    e.preventDefault();
    const farmToAdd = {
      id: Date.now(),
      name: newFarm.name,
      owner: newFarm.manager,
      location: newFarm.location,
      year: newFarm.yearEstablished,
      animals: { 
        cows: Math.round(newFarm.totalAnimals * 0.6), 
        goats: Math.round(newFarm.totalAnimals * 0.3), 
        sheep: Math.round(newFarm.totalAnimals * 0.1) 
      },
      healthLogs: []
    };
    setFarms([...farms, farmToAdd]);
    setShowAddFarmModal(false);
    setNewFarm({ name: '', location: '', yearEstablished: '', animalType: 'Mixed (multiple types)', totalAnimals: '', numVaccinated: '', manager: '', notes: '' });
  };

  const handleVaccineSubmit = (e) => {
    e.preventDefault();
    if (editingVaccine) {
      setVaccines(vaccines.map(v => v.id === editingVaccine.id ? { ...newVaccine, id: v.id } : v));
    } else {
      setVaccines([...vaccines, { ...newVaccine, id: Date.now() }]);
    }
    setShowVaccineModal(false);
    setEditingVaccine(null);
    setNewVaccine({ animal: '', name: '', disease: '', date: '', nextDue: '', status: 'Pending' });
  };

  const deleteVaccine = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setVaccines(vaccines.filter(v => v.id !== id));
    }
  };

  const startEditVaccine = (v) => {
    setEditingVaccine(v);
    setNewVaccine(v);
    setShowVaccineModal(true);
  };

  const addHealthLog = (farmId, log) => {
    setFarms(farms.map(f => f.id === farmId ? { ...f, healthLogs: [log, ...f.healthLogs] } : f));
  };

  const doughnutData = {
    labels: ['Vaccinated', 'Unvaccinated'],
    datasets: [{
      data: [vaccines.filter(v => v.status === 'Completed').length, vaccines.filter(v => v.status === 'Pending').length],
      backgroundColor: ['#5da418', '#ff9800'],
      borderColor: ['#fff', '#fff'],
      borderWidth: 2,
    }],
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="dashboard-view">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
              <p>Welcome back, {role}! Monitoring {farms.reduce((acc, f) => acc + (f.animals.cows || 0) + (f.animals.goats || 0) + (f.animals.sheep || 0), 0)} animals across {farms.length} farms.</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper">🐄</div>
                <div className="stat-info">
                  <span className="stat-label">Total Animals</span>
                  <span className="stat-value">{farms.reduce((acc, f) => acc + f.animals.cows + f.animals.goats + f.animals.sheep, 0)}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">💉</div>
                <div className="stat-info">
                  <span className="stat-label">Vaccinated</span>
                  <span className="stat-value">312</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">⚠️</div>
                <div className="stat-info">
                  <span className="stat-label">Unvaccinated</span>
                  <span className="stat-value">170</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">🏡</div>
                <div className="stat-info">
                  <span className="stat-label">Active Farms</span>
                  <span className="stat-value">{farms.length}</span>
                </div>
              </div>
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
                  <Bar data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Monthly Vaccinations',
                      data: [45, 52, 38, 65, 48, 72],
                      backgroundColor: '#5da418',
                    }]
                  }} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Farms':
        return (
          <div className="dashboard-view">
            <div className="section-header">
              <div className="h-text">
                <h2>My farms</h2>
                <p className="sub">{farms.length} registered farms - click a farm to view its report</p>
              </div>
              <button className="btn-primary-small" onClick={() => setShowAddFarmModal(true)}><Plus size={16} /> Add new farm</button>
            </div>

            {selectedFarm ? (
              <div className="farm-detail-view">
                <button className="btn-text" onClick={() => setSelectedFarm(null)}>← Back to Farms</button>
                
                <div className="farm-report-header">
                  <div className="report-cards-grid">
                    <div className="report-mini-card">
                      <span className="val">88</span>
                      <span>Total animals</span>
                      <span className="sub-val">2 types</span>
                    </div>
                    <div className="report-mini-card">
                      <span className="val">70</span>
                      <span>Vaccinated</span>
                      <span className="sub-val good">80%</span>
                    </div>
                    <div className="report-mini-card">
                      <span className="val">12</span>
                      <span>Due / overdue</span>
                      <span className="sub-val pending">Pending</span>
                    </div>
                    <div className="report-mini-card">
                      <span className="val">2</span>
                      <span>Sick animals</span>
                      <span className="sub-val monitor">Monitor</span>
                    </div>
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ANIMAL TYPE</th>
                        <th>TOTAL</th>
                        <th>HEALTHY</th>
                        <th>SICK</th>
                        <th>VACCINATION COVERAGE</th>
                        <th>LAST CHECKUP</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Cattle</strong></td>
                        <td>55</td>
                        <td>53</td>
                        <td>2</td>
                        <td className="coverage-cell">
                          <div className="progress-container"><div className="progress-bar" style={{width: '95%'}}></div></div>
                          <span>95%</span>
                        </td>
                        <td>Today</td>
                        <td><span className="status-badge healthy">Good</span></td>
                      </tr>
                      <tr>
                        <td><strong>Poultry</strong></td>
                        <td>33</td>
                        <td>31</td>
                        <td>0</td>
                        <td className="coverage-cell">
                          <div className="progress-container"><div className="progress-bar" style={{width: '45%', backgroundColor: '#f39c12'}}></div></div>
                          <span>45%</span>
                        </td>
                        <td>3 days ago</td>
                        <td><span className="status-badge at-risk">Low</span></td>
                      </tr>
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
                      <p>{farm.location} · Est. {farm.year || '2021'}</p>
                      <div className="farm-tags">
                        <span className="tag">Cattle</span>
                        <span className="tag">Goats</span>
                        <span className="tag">Sheep</span>
                      </div>
                    </div>
                    <div className="farm-stats-summary">
                      <div className="f-main-stat">
                        <span className="s-val">160</span>
                        <span className="s-lbl">animals</span>
                      </div>
                      <div className="f-main-stat">
                        <span className="s-val green">86%</span>
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
                  <div className="modal-header">
                    <h3>Add new farm</h3>
                  </div>
                  <form onSubmit={handleAddFarm} className="modal-body">
                    <div className="form-group">
                      <label>Farm name</label>
                      <input type="text" placeholder="e.g. Sunrise Valley Ranch" value={newFarm.name} onChange={(e) => setNewFarm({...newFarm, name: e.target.value})} required />
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>State / location</label>
                        <input type="text" placeholder="e.g. Benue State" value={newFarm.location} onChange={(e) => setNewFarm({...newFarm, location: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Year established</label>
                        <input type="text" placeholder="e.g. 2021" value={newFarm.yearEstablished} onChange={(e) => setNewFarm({...newFarm, yearEstablished: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Animal types (select all that apply)</label>
                      <select value={newFarm.animalType} onChange={(e) => setNewFarm({...newFarm, animalType: e.target.value})}>
                        <option>Mixed (multiple types)</option>
                        <option>Cattle</option>
                        <option>Poultry</option>
                        <option>Goats</option>
                      </select>
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Total no. of animals</label>
                        <input type="number" placeholder="e.g. 100" value={newFarm.totalAnimals} onChange={(e) => setNewFarm({...newFarm, totalAnimals: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>No. vaccinated</label>
                        <input type="number" placeholder="e.g. 85" value={newFarm.numVaccinated} onChange={(e) => setNewFarm({...newFarm, numVaccinated: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Farm manager / contact</label>
                      <input type="text" placeholder="Full name" value={newFarm.manager} onChange={(e) => setNewFarm({...newFarm, manager: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Notes (optional)</label>
                      <textarea placeholder="Any extra details about this farm.." value={newFarm.notes} onChange={(e) => setNewFarm({...newFarm, notes: e.target.value})}></textarea>
                    </div>
                  </form>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowAddFarmModal(false)}>Cancel</button>
                    <button type="submit" className="btn-save" onClick={handleAddFarm}>Save farm</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Vaccine':
        return (
          <div className="dashboard-view">
            <div className="section-header">
              <h2>Vaccination Records</h2>
              <button className="btn-primary-small" onClick={() => { setEditingVaccine(null); setNewVaccine({ animal: '', name: '', disease: '', date: '', nextDue: '', status: 'Pending' }); setShowVaccineModal(true); }}>
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
                  <h3>{editingVaccine ? 'Edit Record' : 'Add Vaccine Record'}</h3>
                  <form onSubmit={handleVaccineSubmit}>
                    <div className="form-group">
                      <label>Animal Name/ID</label>
                      <input type="text" value={newVaccine.animal} onChange={(e) => setNewVaccine({...newVaccine, animal: e.target.value})} required />
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Vaccine Name</label>
                        <select value={newVaccine.name} onChange={(e) => setNewVaccine({...newVaccine, name: e.target.value})} required>
                          <option value="">Select Vaccine</option>
                          <option value="Anthrax Vaccine">Anthrax Vaccine</option>
                          <option value="Foot and Mouth Disease">FMD Shot</option>
                          <option value="Rabies Shot">Rabies Shot</option>
                          <option value="Brucellosis">Brucellosis</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Disease</label>
                        <input type="text" value={newVaccine.disease} onChange={(e) => setNewVaccine({...newVaccine, disease: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Date Administered</label>
                        <input type="text" value={newVaccine.date} onChange={(e) => setNewVaccine({...newVaccine, date: e.target.value})} placeholder="YYYY-MM-DD or Pending" />
                      </div>
                      <div className="form-group">
                        <label>Next Due Date</label>
                        <input type="date" value={newVaccine.nextDue} onChange={(e) => setNewVaccine({...newVaccine, nextDue: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={newVaccine.status} onChange={(e) => setNewVaccine({...newVaccine, status: e.target.value})}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="btn-text" onClick={() => setShowVaccineModal(false)}>Cancel</button>
                      <button type="submit" className="btn-primary">{editingVaccine ? 'Save Changes' : 'Add Record'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      case 'Reports':
        return (
          <div className="dashboard-view">
            <div className="section-header">
              <h2>Reports & Summaries</h2>
            </div>
            <div className="reports-summary-cards">
              <div className="report-mini-card">
                <h4>Successful Check-ups</h4>
                <p className="val">24</p>
                <span>This month</span>
              </div>
              <div className="report-mini-card">
                <h4>Casualties</h4>
                <p className="val danger">2</p>
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
                  <tr>
                    <td>Fatima's Farm</td>
                    <td>Cattle</td>
                    <td>0</td>
                    <td>2</td>
                    <td>All healthy this month</td>
                  </tr>
                  <tr>
                    <td>Obi's Farm</td>
                    <td>Sheep</td>
                    <td>1</td>
                    <td>1</td>
                    <td>One casualty due to heat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="left-sidebar">
        <div className="sidebar-brand">
          <h1>FARMZ SAFE</h1>
          <p>Livestock Monitor</p>
        </div>
        <nav className="nav-menu">
          <button 
            className={activeTab === 'Home' ? 'active' : ''} 
            onClick={() => setActiveTab('Home')}
          >
            <Home size={20} /> Home
          </button>
          <button 
            className={activeTab === 'Farms' ? 'active' : ''} 
            onClick={() => setActiveTab('Farms')}
          >
            <MapPin size={20} /> Farms
          </button>
          <button 
            className={activeTab === 'Vaccine' ? 'active' : ''} 
            onClick={() => setActiveTab('Vaccine')}
          >
            <ShieldCheck size={20} /> Vaccine
          </button>
          <button 
            className={activeTab === 'Reports' ? 'active' : ''} 
            onClick={() => setActiveTab('Reports')}
          >
            <FileText size={20} /> Reports
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="u-avatar">{role[0]}</div>
            <div className="u-info">
              <span className="u-name">{role} Mode</span>
              <span className="u-role">Active</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onBack}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
