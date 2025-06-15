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
    creator_currency: 'usdt',
    creator_amount: '',
    receiver_currency: 'usdt',
    receiver_amount: ''
  });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiving_nickname.trim()) {
      setError('Receiving nickname is required');
      return;
    }
    if (!form.creator_amount || !form.receiver_amount) {
      setError('Amounts are required');
      return;
    }
    try {
      await createDeal({
        ...form,
        creator_id: window.Telegram.WebApp.initDataUnsafe.user?.id,
        creator_amount: parseFloat(form.creator_amount),
        receiver_amount: parseFloat(form.receiver_amount)
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
          <label className="block mb-1 font-medium">Receiving Telegram Nickname</label>
          <input
            type="text"
            name="receiving_nickname"
            value={form.receiving_nickname}
            onChange={handleChange}
            required
            placeholder="@username"
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description for Creator</label>
          <textarea
            name="description_for_creator"
            value={form.description_for_creator}
            onChange={handleChange}
            required
            placeholder="What creator needs to do"
            rows="4"
            className="w-full"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Description for Receiver</label>
          <textarea
            name="description_for_recever"
            value={form.description_for_recever}
            onChange={handleChange}
            required
            placeholder="What receiver needs to do"
            rows="4"
            className="w-full"
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Creator Payment</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Currency</label>
              <select
                name="creator_currency"
                value={form.creator_currency}
                onChange={handleChange}
                className="w-full"
              >
                {currencies.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Amount</label>
              <input
                type="number"
                step="0.01"
                name="creator_amount"
                value={form.creator_amount}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Receiver Payment</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Currency</label>
              <select
                name="receiver_currency"
                value={form.receiver_currency}
                onChange={handleChange}
                className="w-full"
              >
                {currencies.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Amount</label>
              <input
                type="number"
                step="0.01"
                name="receiver_amount"
                value={form.receiver_amount}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full"
              />
            </div>
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
