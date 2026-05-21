import { useState, useEffect } from 'react';

const ANIMAL_TYPES = ['Mixed (multiple types)', 'Cattle', 'Poultry', 'Goats', 'Sheep'];

const EMPTY = {
  name: '', location: '',
  animalType: 'Mixed (multiple types)',
  totalAnimals: '', numVaccinated: '', numSick: '0',
  animals: [],
  manager: '', notes: ''
};

const getAnimalIcon = (name) => {
  const norm = (name || '').toLowerCase();
  if (norm.includes('cow') || norm.includes('cattle') || norm.includes('bull') || norm.includes('calf') || norm.includes('ox')) {
    return 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('goat') || norm.includes('kid') || norm.includes('caprine')) {
    return 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('sheep') || norm.includes('lamb') || norm.includes('ram') || norm.includes('ewe')) {
    return 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('chicken') || norm.includes('poultry') || norm.includes('hen') || norm.includes('rooster') || norm.includes('turkey') || norm.includes('bird') || norm.includes('duck') || norm.includes('avian')) {
    return 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('pig') || norm.includes('swine') || norm.includes('boar') || norm.includes('sow') || norm.includes('pork')) {
    return 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('horse') || norm.includes('equine') || norm.includes('foal') || norm.includes('pony') || norm.includes('donkey') || norm.includes('mule')) {
    return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('rabbit') || norm.includes('hare') || norm.includes('bunny')) {
    return 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=120&q=80';
  }
  if (norm.includes('fish') || norm.includes('shrimp') || norm.includes('aquaculture') || norm.includes('crab') || norm.includes('lobster')) {
    return 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=120&q=80';
  }
  return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80';
};

export default function FarmForm({ onSubmit, onCancel, initial = EMPTY, loading }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initial
  });
  const [step, setStep] = useState(1);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const addAnimal = () => {
    setForm(prev => ({
      ...prev,
      animals: [...(prev.animals || []), { type: '', count: 0, vaccinatedAnimalCount: 0, sickAnimalCount: 0 }]
    }));
  };

  const updateAnimal = (idx, field, value) => {
    setForm(prev => {
      const updated = [...(prev.animals || [])];
      updated[idx] = { ...updated[idx], [field]: field === 'type' ? value : Number(value) };
      
      // Auto-calculate totals
      const total = updated.reduce((sum, a) => sum + (a.count || 0), 0);
      const vac = updated.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0);
      const sick = updated.reduce((sum, a) => sum + (a.sickAnimalCount || 0), 0);
      
      return {
        ...prev,
        animals: updated,
        totalAnimals: String(total),
        numVaccinated: String(vac),
        numSick: String(sick)
      };
    });
  };

  const removeAnimal = (idx) => {
    setForm(prev => {
      const updated = prev.animals.filter((_, i) => i !== idx);
      const total = updated.reduce((sum, a) => sum + (a.count || 0), 0);
      const vac = updated.reduce((sum, a) => sum + (a.vaccinatedAnimalCount || 0), 0);
      const sick = updated.reduce((sum, a) => sum + (a.sickAnimalCount || 0), 0);
      
      return {
        ...prev,
        animals: updated,
        totalAnimals: String(total),
        numVaccinated: String(vac),
        numSick: String(sick)
      };
    });
  };

  useEffect(() => {
    if (form.animalType !== 'Mixed (multiple types)') {
      const total = Number(form.totalAnimals || 0);
      const vac = Number(form.numVaccinated || 0);
      const sick = Number(form.numSick || 0);
      
      setForm(prev => ({
        ...prev,
        animals: total > 0 ? [{
          type: form.animalType,
          count: total,
          vaccinatedAnimalCount: vac,
          sickAnimalCount: sick
        }] : []
      }));
    }
  }, [form.animalType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <div style={{ width: '100%' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>{initial.name ? 'Edit Farm' : 'Add New Farm'}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Step {step} of 2: {step === 1 ? 'General Information' : 'Livestock Inventory'}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ height: '4px', flex: 1, borderRadius: '2px', background: 'var(--primary)', transition: 'all 0.3s ease' }}></div>
            <div style={{ height: '4px', flex: 1, borderRadius: '2px', background: 'var(--primary)', opacity: step === 2 ? 1 : 0.2, transition: 'all 0.3s ease' }}></div>
          </div>
        </div>
      </div>

      <div className="modal-body" style={{ minHeight: '340px' }}>
        {step === 1 ? (
          /* STEP 1: GENERAL INFORMATION */
          <div className="step-content animate-fade-in">
            <div className="form-group">
              <label>Farm name</label>
              <input type="text" placeholder="e.g. Sunrise Valley Ranch" value={form.name} onChange={set('name')} required />
            </div>

            <div className="form-group">
              <label>State / Location</label>
              <input type="text" placeholder="e.g. Benue State" value={form.location} onChange={set('location')} required />
            </div>

            <div className="form-group">
              <label>Farm Manager / Contact</label>
              <input type="text" placeholder="Full name" value={form.manager} onChange={set('manager')} required />
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea placeholder="Any extra details about this farm.." value={form.notes} onChange={set('notes')} style={{ minHeight: '80px' }} />
            </div>
          </div>
        ) : (
          /* STEP 2: LIVESTOCK INVENTORY */
          <div className="step-content animate-fade-in">
            <div className="form-group">
              <label>Animal Type</label>
              <select value={form.animalType} onChange={set('animalType')}>
                {ANIMAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="livestock-breakdown-section" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Livestock List</h4>
                <button 
                  type="button"
                  onClick={addAnimal}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Add Animal
                </button>
              </div>

              {(!form.animals || form.animals.length === 0) ? (
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  No animals added yet. Click "Add Animal" to get started.
                </p>
              ) : (
                <>
                  {/* Header Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 50px 65px 50px 35px', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Animal Type</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Total</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Vaccinated</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Sick</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}></span>
                  </div>

                  {/* Animal Rows */}
                  {form.animals.map((animal, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '110px 50px 65px 50px 35px', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <input 
                        type="text" 
                        placeholder="Cattle" 
                        value={animal.type} 
                        onChange={(e) => updateAnimal(idx, 'type', e.target.value)}
                        className="compact-input" 
                        style={{ fontSize: '0.7rem', fontWeight: 600, padding: '5px 6px', height: '28px', width: '100%' }}
                      />
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={animal.count} 
                        onChange={(e) => updateAnimal(idx, 'count', e.target.value)}
                        className="compact-input" 
                        style={{ height: '28px', textAlign: 'center', fontSize: '0.75rem' }} 
                      />
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={animal.vaccinatedAnimalCount} 
                        onChange={(e) => updateAnimal(idx, 'vaccinatedAnimalCount', e.target.value)}
                        className="compact-input" 
                        style={{ height: '28px', textAlign: 'center', fontSize: '0.75rem' }} 
                      />
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={animal.sickAnimalCount} 
                        onChange={(e) => updateAnimal(idx, 'sickAnimalCount', e.target.value)}
                        className="compact-input" 
                        style={{ height: '28px', textAlign: 'center', fontSize: '0.75rem' }} 
                      />
                      <button 
                        type="button"
                        onClick={() => removeAnimal(idx)}
                        style={{ 
                          padding: 0, 
                          borderRadius: '4px', 
                          border: 'none', 
                          background: '#ff5252',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          height: '28px',
                          width: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Total Animals</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={form.totalAnimals}
                  readOnly
                  style={{ background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Vaccinated</label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={form.numVaccinated}
                  readOnly
                  style={{ background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Sick / Ill</label>
                <input
                  type="number"
                  placeholder="e.g. 0"
                  value={form.numSick}
                  readOnly
                  style={{ background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions">
        {step === 1 ? (
          <>
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-save">
              Next: Animals &rarr;
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-cancel" onClick={() => setStep(1)} disabled={loading}>&larr; Back</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Farm'}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
