// =======================================================
// FARMZSAFE — API Helper
// Handles all communication with the Express backend.
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
  login: async (data) => {
    const res = await request('/Users/Login', { method: 'POST', body: JSON.stringify(data) });
    return res;
  },
  signup: async (data) => {
    const res = await request('/Users/Signup', { method: 'POST', body: JSON.stringify(data) });
    return res;
  },
  forgotPassword: (data) => Promise.resolve({ success: true }),
};

// ── Farms (routes: /api/farms) ──────────────────────────
export const farmsAPI = {
  getAll: async () => {
    try {
      const data = await request('/farms/getFarms');
      return data.map(f => {
        const total = f.animals ? f.animals.reduce((sum, a) => sum + (a.count || 0), 0) : 0;
        const vac = f.animals ? f.animals.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0) : 0;
        return {
          id: f._id,
          name: f.farmName,
          location: f.location,
          manager: f.contact || '',
          totalAnimals: total || 0,
          numVaccinated: vac || 0,
          animals: f.animals ? f.animals.reduce((acc, a) => {
            acc[a.type.toLowerCase()] = a.count;
            return acc;
          }, { cows: 0, goats: 0, sheep: 0 }) : { cows: 0, goats: 0, sheep: 0 },
          notes: ''
        };
      });
    } catch (err) {
      console.error("Farms API error, fetching fallback", err);
      throw err;
    }
  },
  getById: async (id) => {
    const f = await request(`/farms/getfarmbyID/${id}`);
    const total = f.animals ? f.animals.reduce((sum, a) => sum + (a.count || 0), 0) : 0;
    const vac = f.animals ? f.animals.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0) : 0;
    return {
      id: f._id,
      name: f.farmName,
      location: f.location,
      manager: f.contact || '',
      totalAnimals: total,
      numVaccinated: vac,
      animals: f.animals ? f.animals.reduce((acc, a) => {
        acc[a.type.toLowerCase()] = a.count;
        return acc;
      }, { cows: 0, goats: 0, sheep: 0 }) : { cows: 0, goats: 0, sheep: 0 },
      notes: ''
    };
  },
  create: async (data) => {
    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      animals: [
        { type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }
      ]
    };
    return request('/farms/AddFarm', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: async (id, data) => {
    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      animals: [
        { type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }
      ]
    };
    return request(`/farms/editFarm/${id}`, { method: 'PUT', body: JSON.stringify(backendData) });
  },
  delete: async (id) => {
    return request(`/farms/deleteFarm/${id}`, { method: 'DELETE' });
  },
};

// ── Vaccines (routes: /api/Vaccine) ─────────────────────
export const vaccinesAPI = {
  getAll: async () => {
    try {
      const data = await request('/Vaccine/getVaccines');
      return data.map(v => {
        const namePart = v.vaccineName.includes('|') ? v.vaccineName.split('|')[0].trim() : v.vaccineName;
        const animalPart = v.vaccineName.includes('|') ? v.vaccineName.split('|')[1].trim() : 'General';
        return {
          id: v._id,
          name: namePart,
          animal: animalPart,
          disease: v.diseaseName || '',
          date: v.createdAt ? new Date(v.createdAt).toISOString().split('T')[0] : 'Completed',
          nextDue: v.expiryDate ? new Date(v.expiryDate).toISOString().split('T')[0] : '',
          status: v.IsAvailable ? 'Completed' : 'Pending',
        };
      });
    } catch (err) {
      console.error("Vaccines API error", err);
      throw err;
    }
  },
  create: async (data) => {
    const backendData = {
      vaccineName: `${data.name} | ${data.animal}`,
      diseaseName: data.disease,
      IsAvailable: data.status === 'Completed',
      stock: 100,
      expiryDate: data.nextDue ? new Date(data.nextDue) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    };
    return request('/Vaccine/addVaccine', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: async (id, data) => {
    const backendData = {
      vaccineName: `${data.name} | ${data.animal}`,
      diseaseName: data.disease,
      IsAvailable: data.status === 'Completed',
      stock: 100,
      expiryDate: data.nextDue ? new Date(data.nextDue) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    };
    return request(`/Vaccine/editVaccine/${id}`, { method: 'PUT', body: JSON.stringify(backendData) });
  },
  delete: async (id) => {
    return request(`/Vaccine/deleteVaccine/${id}`, { method: 'DELETE' });
  },
};

// ── Reports (routes: /api/Report) ───────────────────────
export const reportsAPI = {
  getSummary: async () => {
    try {
      const data = await request('/Report/getReports');
      return {
        successfulChecks: data.length,
        casualties: 0,
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
