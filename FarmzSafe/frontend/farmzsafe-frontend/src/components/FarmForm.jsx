import { useState, useEffect } from 'react';

const ANIMAL_TYPES = ['Mixed (multiple types)', 'Cattle', 'Poultry', 'Goats', 'Sheep'];

const EMPTY = {
  name: '', location: '', yearEstablished: '',
  animalType: 'Mixed (multiple types)',
  totalAnimals: '', numVaccinated: '', numSick: '0',
  cowsLabel: 'Cattle', cowsCount: '0', cowsVaccinated: '0', cowsSick: '0',
  goatsLabel: 'Goats', goatsCount: '0', goatsVaccinated: '0', goatsSick: '0',
  sheepLabel: 'Sheep', sheepCount: '0', sheepVaccinated: '0', sheepSick: '0',
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

  useEffect(() => {
    if (form.animalType === 'Mixed (multiple types)') {
      const total = Number(form.cowsCount || 0) + Number(form.goatsCount || 0) + Number(form.sheepCount || 0);
      const vac = Number(form.cowsVaccinated || 0) + Number(form.goatsVaccinated || 0) + Number(form.sheepVaccinated || 0);
      const sick = Number(form.cowsSick || 0) + Number(form.goatsSick || 0) + Number(form.sheepSick || 0);

      if (
        Number(form.totalAnimals) !== total ||
        Number(form.numVaccinated) !== vac ||
        Number(form.numSick) !== sick
      ) {
        setForm(prev => ({
          ...prev,
          totalAnimals: String(total),
          numVaccinated: String(vac),
          numSick: String(sick)
        }));
      }
    }
  }, [
    form.animalType,
    form.cowsCount, form.cowsVaccinated, form.cowsSick,
    form.goatsCount, form.goatsVaccinated, form.goatsSick,
    form.sheepCount, form.sheepVaccinated, form.sheepSick,
    form.totalAnimals, form.numVaccinated, form.numSick
  ]);

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

            <div className="form-group-row">
              <div className="form-group">
                <label>State / Location</label>
                <input type="text" placeholder="e.g. Benue State" value={form.location} onChange={set('location')} required />
              </div>
              <div className="form-group">
                <label>Year Established</label>
                <input type="text" placeholder="e.g. 2021" value={form.yearEstablished} onChange={set('yearEstablished')} />
              </div>
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

            {form.animalType === 'Mixed (multiple types)' && (
              <div className="livestock-breakdown-section" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px dashed var(--border)' }}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Animal Category</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Total</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Vaccinated</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>Sick / Ill</span>
                </div>
                
                {/* Cattle/Animal 1 Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={getAnimalIcon(form.cowsLabel)} 
                      alt={form.cowsLabel} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} 
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. Cattle" 
                      value={form.cowsLabel} 
                      onChange={set('cowsLabel')} 
                      className="compact-input" 
                      style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', height: '36px', width: '100%' }}
                    />
                  </div>
                  <input type="number" placeholder="Total" value={form.cowsCount} onChange={set('cowsCount')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Vac." value={form.cowsVaccinated} onChange={set('cowsVaccinated')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Sick" value={form.cowsSick} onChange={set('cowsSick')} className="compact-input" style={{ height: '36px' }} />
                </div>

                {/* Goats/Animal 2 Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={getAnimalIcon(form.goatsLabel)} 
                      alt={form.goatsLabel} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} 
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. Goats" 
                      value={form.goatsLabel} 
                      onChange={set('goatsLabel')} 
                      className="compact-input" 
                      style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', height: '36px', width: '100%' }}
                    />
                  </div>
                  <input type="number" placeholder="Total" value={form.goatsCount} onChange={set('goatsCount')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Vac." value={form.goatsVaccinated} onChange={set('goatsVaccinated')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Sick" value={form.goatsSick} onChange={set('goatsSick')} className="compact-input" style={{ height: '36px' }} />
                </div>

                {/* Sheep/Animal 3 Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={getAnimalIcon(form.sheepLabel)} 
                      alt={form.sheepLabel} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} 
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. Sheep" 
                      value={form.sheepLabel} 
                      onChange={set('sheepLabel')} 
                      className="compact-input" 
                      style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', height: '36px', width: '100%' }}
                    />
                  </div>
                  <input type="number" placeholder="Total" value={form.sheepCount} onChange={set('sheepCount')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Vac." value={form.sheepVaccinated} onChange={set('sheepVaccinated')} className="compact-input" style={{ height: '36px' }} />
                  <input type="number" placeholder="Sick" value={form.sheepSick} onChange={set('sheepSick')} className="compact-input" style={{ height: '36px' }} />
                </div>
              </div>
            )}

            <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Total Animals</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={form.totalAnimals}
                  onChange={set('totalAnimals')}
                  readOnly={form.animalType === 'Mixed (multiple types)'}
                  style={form.animalType === 'Mixed (multiple types)' ? { background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' } : {}}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Vaccinated</label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={form.numVaccinated}
                  onChange={set('numVaccinated')}
                  readOnly={form.animalType === 'Mixed (multiple types)'}
                  style={form.animalType === 'Mixed (multiple types)' ? { background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' } : {}}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Sick / Ill</label>
                <input
                  type="number"
                  placeholder="e.g. 0"
                  value={form.numSick}
                  onChange={set('numSick')}
                  readOnly={form.animalType === 'Mixed (multiple types)'}
                  style={form.animalType === 'Mixed (multiple types)' ? { background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' } : {}}
                  required
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
