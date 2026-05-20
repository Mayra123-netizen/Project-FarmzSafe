// =======================================================
// FARMZSAFE — API Helper
// Handles all communication with the Express backend.
// =======================================================

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://backend-blond-nine.vercel.app/api';
    }
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

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

function getUserId() {
  try {
    const userStr = localStorage.getItem('farmzsafe_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user._id || null;
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }
  return null;
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
 
};

// ── Farms (routes: /api/farms) ──────────────────────────
export const farmsAPI = {
  getAll: async () => {
    try {
      const data = await request('/farms/getFarms');
      return data.map(f => {
        const total = f.animals ? f.animals.reduce((sum, a) => sum + (a.count || 0), 0) : 0;
        const vac = f.animals ? f.animals.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0) : 0;
        const sick = f.animals ? f.animals.reduce((sum, a) => sum + (a.sickAnimalCount || 0), 0) : 0;
        
        let animalType = 'Mixed (multiple types)';
        if (f.animals && f.animals.length === 1) {
          const t = f.animals[0].type.toLowerCase();
          if (t === 'cows' || t === 'cattle' || t === 'cow') animalType = 'Cattle';
          else if (t === 'goats' || t === 'goat') animalType = 'Goats';
          else if (t === 'sheep') animalType = 'Sheep';
        }

        let cowsCount = 0, cowsVaccinated = 0, cowsSick = 0;
        let goatsCount = 0, goatsVaccinated = 0, goatsSick = 0;
        let sheepCount = 0, sheepVaccinated = 0, sheepSick = 0;

        if (f.animals) {
          f.animals.forEach(a => {
            const key = a.type.toLowerCase();
            if (key === 'cows' || key === 'cattle' || key === 'cow') {
              cowsCount = a.count || 0;
              cowsVaccinated = a.vaccinatedAnimalCount || 0;
              cowsSick = a.sickAnimalCount || 0;
            } else if (key === 'goats' || key === 'goat') {
              goatsCount = a.count || 0;
              goatsVaccinated = a.vaccinatedAnimalCount || 0;
              goatsSick = a.sickAnimalCount || 0;
            } else if (key === 'sheep') {
              sheepCount = a.count || 0;
              sheepVaccinated = a.vaccinatedAnimalCount || 0;
              sheepSick = a.sickAnimalCount || 0;
            }
          });
        }

        return {
          id: f._id,
          name: f.farmName,
          location: f.location,
          manager: f.contact || '',
          totalAnimals: total || 0,
          numVaccinated: vac || 0,
          numSick: sick || 0,
          animalType,
          cowsCount, cowsVaccinated, cowsSick,
          goatsCount, goatsVaccinated, goatsSick,
          sheepCount, sheepVaccinated, sheepSick,
          animals: { cows: cowsCount, goats: goatsCount, sheep: sheepCount },
          breakdown: f.animals || [],
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
    const sick = f.animals ? f.animals.reduce((sum, a) => sum + (a.sickAnimalCount || 0), 0) : 0;
    
    let animalType = 'Mixed (multiple types)';
    if (f.animals && f.animals.length === 1) {
      const t = f.animals[0].type.toLowerCase();
      if (t === 'cows' || t === 'cattle' || t === 'cow') animalType = 'Cattle';
      else if (t === 'goats' || t === 'goat') animalType = 'Goats';
      else if (t === 'sheep') animalType = 'Sheep';
    }

    let cowsCount = 0, cowsVaccinated = 0, cowsSick = 0;
    let goatsCount = 0, goatsVaccinated = 0, goatsSick = 0;
    let sheepCount = 0, sheepVaccinated = 0, sheepSick = 0;

    if (f.animals) {
      f.animals.forEach(a => {
        const key = a.type.toLowerCase();
        if (key === 'cows' || key === 'cattle' || key === 'cow') {
          cowsCount = a.count || 0;
          cowsVaccinated = a.vaccinatedAnimalCount || 0;
          cowsSick = a.sickAnimalCount || 0;
        } else if (key === 'goats' || key === 'goat') {
          goatsCount = a.count || 0;
          goatsVaccinated = a.vaccinatedAnimalCount || 0;
          goatsSick = a.sickAnimalCount || 0;
        } else if (key === 'sheep') {
          sheepCount = a.count || 0;
          sheepVaccinated = a.vaccinatedAnimalCount || 0;
          sheepSick = a.sickAnimalCount || 0;
        }
      });
    }

    return {
      id: f._id,
      name: f.farmName,
      location: f.location,
      manager: f.contact || '',
      totalAnimals: total,
      numVaccinated: vac,
      numSick: sick,
      animalType,
      cowsCount, cowsVaccinated, cowsSick,
      goatsCount, goatsVaccinated, goatsSick,
      sheepCount, sheepVaccinated, sheepSick,
      animals: { cows: cowsCount, goats: goatsCount, sheep: sheepCount },
      breakdown: f.animals || [],
      notes: ''
    };
  },
  create: async (data) => {
    const type = data.animalType || 'Mixed (multiple types)';
    let animalsList = [];
    if (type === 'Goats') {
      animalsList = [{ type: 'Goats', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else if (type === 'Sheep') {
      animalsList = [{ type: 'Sheep', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else if (type === 'Cattle') {
      animalsList = [{ type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else {
      // Mixed
      animalsList = [
        { type: 'Cows', count: Number(data.cowsCount || 0), vaccinatedAnimalCount: Number(data.cowsVaccinated || 0), sickAnimalCount: Number(data.cowsSick || 0) },
        { type: 'Goats', count: Number(data.goatsCount || 0), vaccinatedAnimalCount: Number(data.goatsVaccinated || 0), sickAnimalCount: Number(data.goatsSick || 0) },
        { type: 'Sheep', count: Number(data.sheepCount || 0), vaccinatedAnimalCount: Number(data.sheepVaccinated || 0), sickAnimalCount: Number(data.sheepSick || 0) }
      ].filter(a => a.count > 0 || a.vaccinatedAnimalCount > 0 || a.sickAnimalCount > 0);

      // Fallback in case they submit zeros for all categories but entered a general total
      if (animalsList.length === 0 && Number(data.totalAnimals) > 0) {
        const count = Math.floor(Number(data.totalAnimals) / 3);
        const vac = Math.floor(Number(data.numVaccinated) / 3);
        const sickVal = Math.floor(Number(data.numSick || 0) / 3);
        animalsList = [
          { type: 'Cows', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: sickVal || 0 },
          { type: 'Goats', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: sickVal || 0 },
          { type: 'Sheep', count: Number(data.totalAnimals) - 2 * count, vaccinatedAnimalCount: Number(data.numVaccinated) - 2 * vac, sickAnimalCount: Number(data.numSick || 0) - 2 * sickVal }
        ];
      }
    }

    const ownerId = getUserId() || "664c12345678901234567890";
    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      owner: ownerId,
      animals: animalsList
    };
    return request('/farms/AddFarm', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: async (id, data) => {
    const type = data.animalType || 'Mixed (multiple types)';
    let animalsList = [];
    if (type === 'Goats') {
      animalsList = [{ type: 'Goats', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else if (type === 'Sheep') {
      animalsList = [{ type: 'Sheep', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else if (type === 'Cattle') {
      animalsList = [{ type: 'Cows', count: Number(data.totalAnimals), vaccinatedAnimalCount: Number(data.numVaccinated), sickAnimalCount: Number(data.numSick || 0) }];
    } else {
      // Mixed
      animalsList = [
        { type: 'Cows', count: Number(data.cowsCount || 0), vaccinatedAnimalCount: Number(data.cowsVaccinated || 0), sickAnimalCount: Number(data.cowsSick || 0) },
        { type: 'Goats', count: Number(data.goatsCount || 0), vaccinatedAnimalCount: Number(data.goatsVaccinated || 0), sickAnimalCount: Number(data.goatsSick || 0) },
        { type: 'Sheep', count: Number(data.sheepCount || 0), vaccinatedAnimalCount: Number(data.sheepVaccinated || 0), sickAnimalCount: Number(data.sheepSick || 0) }
      ].filter(a => a.count > 0 || a.vaccinatedAnimalCount > 0 || a.sickAnimalCount > 0);

      // Fallback
      if (animalsList.length === 0 && Number(data.totalAnimals) > 0) {
        const count = Math.floor(Number(data.totalAnimals) / 3);
        const vac = Math.floor(Number(data.numVaccinated) / 3);
        const sickVal = Math.floor(Number(data.numSick || 0) / 3);
        animalsList = [
          { type: 'Cows', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: sickVal || 0 },
          { type: 'Goats', count: count || 0, vaccinatedAnimalCount: vac || 0, sickAnimalCount: sickVal || 0 },
          { type: 'Sheep', count: Number(data.totalAnimals) - 2 * count, vaccinatedAnimalCount: Number(data.numVaccinated) - 2 * vac, sickAnimalCount: Number(data.numSick || 0) - 2 * sickVal }
        ];
      }
    }

    const ownerId = getUserId() || "664c12345678901234567890";
    const backendData = {
      farmName: data.name,
      location: data.location,
      contact: data.manager,
      owner: ownerId,
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
          status: v.IsAvailable ? 'Available' : 'Unavailable',
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
      IsAvailable: data.status === 'Available',
      stock: 100,
      expiryDate: data.nextDue ? new Date(data.nextDue) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    };
    return request('/Vaccine/addVaccine', { method: 'POST', body: JSON.stringify(backendData) });
  },
  update: async (id, data) => {
    const backendData = {
      vaccineName: `${data.name} | ${data.animal}`,
      diseaseName: data.disease,
      IsAvailable: data.status === 'Available',
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
          title: r.title,
          description: r.description || '',
          fileUrl: r.fileUrl || '',
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
  },
  create: async (data) => {
    return request('/Report/addReport', { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id, data) => {
    return request(`/Report/editReport/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id) => {
    return request(`/Report/deleteReport/${id}`, { method: 'DELETE' });
  }
};
