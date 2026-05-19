// =======================================================
// FARMZSAFE — API Helper
// All backend calls go through here.
// Matches backend routes at: /api/Users, /api/farms, /api/Vaccine, /api/Report
// =======================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('farmzsafe_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Auth (routes: /api/Users) ──────────────────────────
export const authAPI = {
  login: (data) => request('/Users/Login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => request('/Users/Signup', { method: 'POST', body: JSON.stringify(data) }),
  // Fallback if password reset isn't in Express app yet
  forgotPassword: (data) => Promise.resolve({ success: true }),
};

// ── Farms (routes: /api/farms) ──────────────────────────
export const farmsAPI = {
  getAll: () => request('/farms/getFarms'),
  getById: (id) => request(`/farms/getfarmbyID/${id}`),
  create: (data) => {
    // Backend AddFarm expects: { farmName, owner, location, contact, animals }
    // Translate frontend payload to backend naming schema
    const backendData = {
      farmName: data.name,
      owner: data.manager,
      location: data.location,
      contact: data.manager,
      animals: [
        { type: 'Mixed', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }
      ]
    };
    return request('/farms/AddFarm', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: (id, data) => {
    const backendData = {
      farmName: data.name,
      owner: data.manager,
      location: data.location,
      contact: data.manager,
      animals: [
        { type: 'Mixed', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }
      ]
    };
    return request(`/farms/editFarm/${id}`, { method: 'PUT', body: JSON.stringify(backendData) });
  },
  delete: (id) => request(`/farms/deleteFarm/${id}`, { method: 'DELETE' }),
};

// ── Vaccines (routes: /api/Vaccine) ─────────────────────
export const vaccinesAPI = {
  getAll: () => request('/Vaccine/getVaccines'),
  create: (data) => {
    // Backend expects: { vaccineName, DiseaseName, Isavailable }
    const backendData = {
      vaccineName: data.name,
      DiseaseName: data.disease,
      Isavailable: data.status === 'Completed'
    };
    return request('/Vaccine/addVaccine', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: (id, data) => {
    const backendData = {
      vaccineName: data.name,
      DiseaseName: data.disease,
      Isavailable: data.status === 'Completed'
    };
    return request(`/Vaccine/editVaccine/${id}`, { method: 'PUT', body: JSON.stringify(backendData) });
  },
  delete: (id) => request(`/Vaccine/deleteVaccine/${id}`, { method: 'DELETE' }),
};

// ── Reports (routes: /api/Report) ───────────────────────
export const reportsAPI = {
  getSummary: async () => {
    try {
      const data = await request('/Report/getReports');
      // Format backend response to support expected frontend format if necessary
      return {
        successfulChecks: data.length,
        casualties: 0, // Mock value
        monthlySummary: data.map(r => ({
          id: r._id,
          farmName: r.title || 'General Report',
          animalType: 'All',
          casualties: 0,
          successfulChecks: 1,
          notes: r.description || 'No extra remarks'
        }))
      };
    } catch {
      return { successfulChecks: 0, casualties: 0, monthlySummary: [] };
    }
  }
};
