import React, { useState, useEffect } from 'react';
import { getUserDeals, cancelDeal, acceptDeal, payDeal, completeDeal } from '../utils/api';

function DealHistory() {
  const [deals, setDeals] = useState([]);
  const [filters, setFilters] = useState({ status: '', date: '', user: '' });
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
        const data = await getUserDeals(tgId);
        setDeals(data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDeals();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAction = async (dealId, action, isCreator = false) => {
    try {
      const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
      if (action === 'cancel') {
        await cancelDeal(dealId, tgId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, status: 'canceled' } : d));
      } else if (action === 'accept') {
        await acceptDeal(dealId, tgId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, status: 'pending' } : d));
      } else if (action === 'pay') {
        const payment = await payDeal(dealId, tgId, isCreator);
        window.location.href = payment.url;
      } else if (action === 'complete') {
        await completeDeal(dealId, tgId, isCreator);
        setDeals(deals.map(d => d.id === dealId ? { ...d, status: 'success' } : d));
      }
      setSelectedDeal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredDeals = deals.filter(d =>
    (!filters.status || d.status === filters.status) &&
    (!filters.date || d.create_time.includes(filters.date)) &&
    (!filters.user || String(d.receiving_id).includes(filters.user))
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'waiting': return 'status-pending';
      case 'pending': return 'status-pending';
      case 'success': return 'status-completed';
      case 'canceled': return 'status-cancelled';
      case 'denied': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6 text-center">Deal History</h1>
      {error && <p className="error">{error}</p>}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Filter by Status</label>
          <select name="status" onChange={handleFilterChange} className="w-full">
            <option value="">All</option>
            <option value="waiting">Waiting</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="canceled">Canceled</option>
            <option value="denied">Denied</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Filter by Date</label>
          <input type="date" name="date" onChange={handleFilterChange} className="w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Filter by Receiver Telegram ID</label>
          <input type="text" name="user" onChange={handleFilterChange} className="w-full" placeholder="Enter Telegram ID" />
        </div>
      </div>
      {selectedDeal ? (
        <div className="mb-6 p-6 bg-gray-900 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-center">Deal Details</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Deal ID:</strong> {selectedDeal.id}</p>
            <p><strong>Creator ID:</strong> {selectedDeal.creator_id}</p>
            <p><strong>Receiver ID:</strong> {selectedDeal.receiving_id}</p>
            <p><strong>Description for Creator:</strong> {selectedDeal.description_for_creator}</p>
            <p><strong>Description for Receiver:</strong> {selectedDeal.description_for_recever}</p>
            <p><strong>Creator Payment:</strong> {selectedDeal.creator_amount} {selectedDeal.creator_currency.toUpperCase()}</p>
            <p><strong>Receiver Payment:</strong> {selectedDeal.receiver_amount} {selectedDeal.receiver_currency.toUpperCase()}</p>
            <p><strong>Creator Paid:</strong> {selectedDeal.creator_paid ? 'Yes' : 'No'}</p>
            <p><strong>Receiver Paid:</strong> {selectedDeal.receiver_paid ? 'Yes' : 'No'}</p>
            <p><strong>Creator Completed:</strong> {selectedDeal.creator_completed ? 'Yes' : 'No'}</p>
            <p><strong>Receiver Completed:</strong> {selectedDeal.receiver_completed ? 'Yes' : 'No'}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${getStatusClass(selectedDeal.status)}`}>{selectedDeal.status}</span></p>
            <p><strong>Created At:</strong> {new Date(selectedDeal.create_time).toLocaleString()}</p>
            {selectedDeal.start_time && <p><strong>Started At:</strong> {new Date(selectedDeal.start_time).toLocaleString()}</p>}
            {selectedDeal.end_time && <p><strong>Ended At:</strong> {new Date(selectedDeal.end_time).toLocaleString()}</p>}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <button className="btn-secondary" onClick={() => setSelectedDeal(null)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {selectedDeal.status === 'waiting' && selectedDeal.receiving_id === window.Telegram.WebApp.initDataUnsafe.user?.id && (
              <button
                className="btn-primary"
                onClick={() => handleAction(selectedDeal.id, 'accept')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept
              </button>
            )}
            {selectedDeal.status === 'pending' && (
              <>
                <button
                  className="btn-primary"
                  onClick={() => handleAction(selectedDeal.id, 'pay', selectedDeal.creator_id === window.Telegram.WebApp.initDataUnsafe.user?.id)}
                  disabled={(selectedDeal.creator_id === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.creator_paid) || 
                            (selectedDeal.receiving_id === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.receiver_paid)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a4 4 0 00-8 0v2m-4 4h16v6H5v-6z" />
                  </svg>
                  Pay
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleAction(selectedDeal.id, 'complete', selectedDeal.creator_id === window.Telegram.WebApp.initDataUnsafe.user?.id)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleAction(selectedDeal.id, 'cancel')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Receiver ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => (
              <tr key={deal.id}>
                <td>{deal.receiving_id}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td>{new Date(deal.create_time).toLocaleDateString()}</td>
                <td>
                  <button className="btn-primary" onClick={() => setSelectedDeal(deal)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DealHistory;
