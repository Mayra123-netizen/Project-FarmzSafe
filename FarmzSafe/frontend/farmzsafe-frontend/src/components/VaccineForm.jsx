import { useState } from 'react';

const VACCINES = ['Anthrax Vaccine', 'Foot and Mouth Disease', 'Rabies Shot', 'Brucellosis', 'Newcastle Disease'];
const EMPTY = { animal: '', name: '', disease: '', date: '', nextDue: '', status: 'Available' };

export default function VaccineForm({ onSubmit, onCancel, initial = EMPTY, loading }) {
  const [form, setForm] = useState(initial);
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="modal-header">
        <h3>{initial.animal ? 'Edit Vaccine Record' : 'Add Vaccine Record'}</h3>
      </div>
      <div className="modal-body">
        <div className="form-group">
          <label>Animal Name / ID</label>
          <input type="text" placeholder="e.g. Cow #102" value={form.animal} onChange={set('animal')} required />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Vaccine Name</label>
            <select value={form.name} onChange={set('name')} required>
              <option value="">Select Vaccine</option>
              {VACCINES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Disease Targeted</label>
            <input type="text" placeholder="e.g. Anthrax" value={form.disease} onChange={set('disease')} required />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Date Administered</label>
            <input type="text" placeholder="YYYY-MM-DD or Pending" value={form.date} onChange={set('date')} />
          </div>
          <div className="form-group">
            <label>Next Due Date</label>
            <input type="date" value={form.nextDue} onChange={set('nextDue')} required />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={set('status')}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Saving...' : initial.animal ? 'Save Changes' : 'Add Record'}
        </button>
      </div>
    </form>
  );
}
