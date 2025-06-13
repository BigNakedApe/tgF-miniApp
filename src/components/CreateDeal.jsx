import React, { useState } from 'react';
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
  const [showToast, setShowToast] = useState(false);

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
        receiving_nickname: parseInt(form.receiving_nickname) // Отправляем числовой Telegram ID
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Deal</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Receiving Telegram ID</label>
          <input
            type="number"
            value={form.receiving_nickname}
            onChange={(e) => setForm({ ...form, receiving_nickname: e.target.value })}
            required
            placeholder="Enter Telegram ID"
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description for Creator</label>
          <textarea
            value={form.description_for_creator}
            onChange={(e) => setForm({ ...form, description_for_creator: e.target.value })}
            required
            placeholder="What creator needs to do"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Description for Receiver</label>
          <textarea
            value={form.description_for_recever}
            onChange={(e) => setForm({ ...form, description_for_recever: e.target.value })}
            required
            placeholder="What receiver needs to do"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Creator Payment Conditions</label>
          <div className="grid grid-cols-2 gap-4">
            {currencies.map(c => (
              <div key={c.value}>
                <label className="block mb-1 text-sm">{c.label}</label>
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
        </div>
        <div>
          <label className="block mb-1 font-medium">Receiver Payment Conditions</label>
          <div className="grid grid-cols-2 gap-4">
            {currencies.map(c => (
              <div key={c.value}>
                <label className="block mb-1 text-sm">{c.label}</label>
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
        </div>
        <button type="submit" className="btn-primary w-full">Create Deal</button>
      </form>
      {showToast && (
        <div className="toast">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Deal created successfully!
        </div>
      )}
    </div>
  );
}

export default CreateDeal;
