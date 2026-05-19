import { useState, useEffect } from 'react';

const ANIMAL_TYPES = ['Mixed (multiple types)', 'Cattle', 'Poultry', 'Goats', 'Sheep'];

const EMPTY = {
  name: '', location: '', yearEstablished: '',
  animalType: 'Mixed (multiple types)',
  totalAnimals: '', numVaccinated: '', numSick: '0',
  cowsCount: '0', cowsVaccinated: '0', cowsSick: '0',
  goatsCount: '0', goatsVaccinated: '0', goatsSick: '0',
  sheepCount: '0', sheepVaccinated: '0', sheepSick: '0',
  manager: '', notes: ''
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
              <div className="livestock-breakdown-section" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px dashed var(--border)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>Enter counts for each livestock type:</h4>
                
                {/* Cows Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🐄 Cattle</span>
                  <input type="number" placeholder="Total" value={form.cowsCount} onChange={set('cowsCount')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Vac." value={form.cowsVaccinated} onChange={set('cowsVaccinated')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Sick" value={form.cowsSick} onChange={set('cowsSick')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                </div>

                {/* Goats Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🐐 Goats</span>
                  <input type="number" placeholder="Total" value={form.goatsCount} onChange={set('goatsCount')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Vac." value={form.goatsVaccinated} onChange={set('goatsVaccinated')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Sick" value={form.goatsSick} onChange={set('goatsSick')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                </div>

                {/* Sheep Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🐑 Sheep</span>
                  <input type="number" placeholder="Total" value={form.sheepCount} onChange={set('sheepCount')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Vac." value={form.sheepVaccinated} onChange={set('sheepVaccinated')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
                  <input type="number" placeholder="Sick" value={form.sheepSick} onChange={set('sheepSick')} style={{ padding: '6px 12px', borderRadius: '30px' }} />
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
