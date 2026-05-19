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
        
        let animalType = 'Mixed (multiple types)';
        if (f.animals && f.animals.length === 1) {
          const t = f.animals[0].type.toLowerCase();
          if (t === 'cows' || t === 'cattle' || t === 'cow') animalType = 'Cattle';
          else if (t === 'goats' || t === 'goat') animalType = 'Goats';
          else if (t === 'sheep') animalType = 'Sheep';
        }

        const animalsObj = f.animals ? f.animals.reduce((acc, a) => {
          const key = a.type.toLowerCase();
          if (key === 'cows' || key === 'cattle' || key === 'cow') {
            acc.cows = (acc.cows || 0) + (a.count || 0);
          } else if (key === 'goats' || key === 'goat') {
            acc.goats = (acc.goats || 0) + (a.count || 0);
          } else if (key === 'sheep') {
            acc.sheep = (acc.sheep || 0) + (a.count || 0);
          } else {
            acc.cows = (acc.cows || 0) + (a.count || 0);
          }
          return acc;
        }, { cows: 0, goats: 0, sheep: 0 }) : { cows: 0, goats: 0, sheep: 0 };

        return {
          id: f._id,
          name: f.farmName,
          location: f.location,
          manager: f.contact || '',
          totalAnimals: total || 0,
          numVaccinated: vac || 0,
          animalType,
          animals: animalsObj,
          notes: ''
        };
      });
    } catch (err) {
      console.error("Farms API error", err);
      throw err;
    }
  },
  getById: async (id) => {
    const f = await request(`/farms/getfarmbyID/${id}`);
    const total = f.animals ? f.animals.reduce((sum, a) => sum + (a.count || 0), 0) : 0;
    const vac = f.animals ? f.animals.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0) : 0;
    
    let animalType = 'Mixed (multiple types)';
    if (f.animals && f.animals.length === 1) {
      const t = f.animals[0].type.toLowerCase();
      if (t === 'cows' || t === 'cattle' || t === 'cow') animalType = 'Cattle';
      else if (t === 'goats' || t === 'goat') animalType = 'Goats';
      else if (t === 'sheep') animalType = 'Sheep';
    }

    const animalsObj = f.animals ? f.animals.reduce((acc, a) => {
      const key = a.type.toLowerCase();
      if (key === 'cows' || key === 'cattle' || key === 'cow') {
        acc.cows = (acc.cows || 0) + (a.count || 0);
      } else if (key === 'goats' || key === 'goat') {
        acc.goats = (acc.goats || 0) + (a.count || 0);
      } else if (key === 'sheep') {
        acc.sheep = (acc.sheep || 0) + (a.count || 0);
      } else {
        acc.cows = (acc.cows || 0) + (a.count || 0);
      }
      return acc;
    }, { cows: 0, goats: 0, sheep: 0 }) : { cows: 0, goats: 0, sheep: 0 };

    return {
      id: f._id,
      name: f.farmName,
      location: f.location,
      manager: f.contact || '',
      totalAnimals: total,
      numVaccinated: vac,
      animalType,
      animals: animalsObj,
      notes: ''
    };
  },
  create: async (data) => {
    const type = data.animalType || 'Mixed (multiple types)';
    let animalsList = [];
    if (type === 'Goats') {
      animalsList = [{ type: 'Goats', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else if (type === 'Sheep') {
      animalsList = [{ type: 'Sheep', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else if (type === 'Cattle') {
      animalsList = [{ type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else {
      const count = Math.floor(Number(data.totalAnimals) / 3);
      const vac = Math.floor(Number(data.numVaccinated) / 3);
      animalsList = [
        { type: 'Cows', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: 0 },
        { type: 'Goats', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: 0 },
        { type: 'Sheep', count: Number(data.totalAnimals) - 2 * count, vaccinatedAnimalCount: Number(data.numVaccinated) - 2 * vac, sickAnimalCount: 0 }
      ];
    }

    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      animals: animalsList
    };
    return request('/farms/AddFarm', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: async (id, data) => {
    const type = data.animalType || 'Mixed (multiple types)';
    let animalsList = [];
    if (type === 'Goats') {
      animalsList = [{ type: 'Goats', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else if (type === 'Sheep') {
      animalsList = [{ type: 'Sheep', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else if (type === 'Cattle') {
      animalsList = [{ type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: 0 }];
    } else {
      const count = Math.floor(Number(data.totalAnimals) / 3);
      const vac = Math.floor(Number(data.numVaccinated) / 3);
      animalsList = [
        { type: 'Cows', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: 0 },
        { type: 'Goats', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: 0 },
        { type: 'Sheep', count: Number(data.totalAnimals) - 2 * count, vaccinatedAnimalCount: Number(data.numVaccinated) - 2 * vac, sickAnimalCount: 0 }
      ];
    }

    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      animals: animalsList
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
