import { useState } from 'react';

const ANIMAL_TYPES = ['Mixed (multiple types)', 'Cattle', 'Poultry', 'Goats', 'Sheep'];

const EMPTY = {
  name: '', location: '', yearEstablished: '',
  animalType: 'Mixed (multiple types)',
  totalAnimals: '', numVaccinated: '', numSick: '0',
  manager: '', notes: ''
};

export default function FarmForm({ onSubmit, onCancel, initial = EMPTY, loading }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initial
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <h3>{initial.name ? 'Edit Farm' : 'Add New Farm'}</h3>
      </div>
      <div className="modal-body">
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
          <label>Animal Type</label>
          <select value={form.animalType} onChange={set('animalType')}>
            {ANIMAL_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Total Animals</label>
            <input type="number" placeholder="e.g. 100" value={form.totalAnimals} onChange={set('totalAnimals')} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Vaccinated</label>
            <input type="number" placeholder="e.g. 85" value={form.numVaccinated} onChange={set('numVaccinated')} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Sick / Ill</label>
            <input type="number" placeholder="e.g. 0" value={form.numSick} onChange={set('numSick')} required />
          </div>
        </div>

        <div className="form-group">
          <label>Farm Manager / Contact</label>
          <input type="text" placeholder="Full name" value={form.manager} onChange={set('manager')} required />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea placeholder="Any extra details about this farm.." value={form.notes} onChange={set('notes')} />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save Farm'}
        </button>
      </div>
    </form>
  );
}
