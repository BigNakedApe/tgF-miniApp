import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeal } from '../utils/api';
import { currencies } from '../constants';

function CreateDeal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receiving_nickname: '',
    description_for_creator: '',
    description_for_recever: '',
    conditions_for_creator_payment: { usdt: 0, stars: 0 },
    conditions_for_recever_payment: { usdt: 0, stars: 0 }
  });
  const [error, setError] = useState('');

  const handlePaymentChange = (type, currency, value) => {
    setForm({
      ...form,
      [type]: {
        ...form[type],
        [currency.apiValue]: parseFloat(value) || 0
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDeal({
        ...form,
        creator_id: window.Telegram.WebApp.initDataUnsafe.user?.id,
        receiving_nickname: parseInt(form.receiving_nickname)
      });
      alert('Deal created successfully!');
      navigate('/history');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Create Deal</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Receiving Telegram ID</label>
          <input
            type="number"
            value={form.receiving_nickname}
            onChange={(e) => setForm({ ...form, receiving_nickname: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description for Creator</label>
          <textarea
            value={form.description_for_creator}
            onChange={(e) => setForm({ ...form, description_for_creator: e.target.value })}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description for Receiver</label>
          <textarea
            value={form.description_for_recever}
            onChange={(e) => setForm({ ...form, description_for_recever: e.target.value })}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Creator Payment Conditions</label>
          {currencies.map(c => (
            <div key={c.value} className="mb-2">
              <label className="block mb-1">{c.label}</label>
              <input
                type="number"
                step="0.01"
                value={form.conditions_for_creator_payment[c.apiValue] || ''}
                onChange={(e) => handlePaymentChange('conditions_for_creator_payment', c, e.target.value)}
                placeholder={`Amount in ${c.label}`}
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Receiver Payment Conditions</label>
          {currencies.map(c => (
            <div key={c.value} className="mb-2">
              <label className="block mb-1">{c.label}</label>
              <input
                type="number"
                step="0.01"
                value={form.conditions_for_recever_payment[c.apiValue] || ''}
                onChange={(e) => handlePaymentChange('conditions_for_recever_payment', c, e.target.value)}
                placeholder={`Amount in ${c.label}`}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn-primary">Create Deal</button>
      </form>
    </div>
  );
}

export default CreateDeal;