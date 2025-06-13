import { useState, useEffect } from 'react';
import { getUserDeals, cancelDeal, markDone, payDeal, completeDeal } from '../utils/api';

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

  const handleAction = async (dealId, action) => {
    try {
      const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
      if (action === 'cancel') {
        await cancelDeal(dealId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, status: 'cancelled' } : d));
      } else if (action === 'pay') {
        await payDeal(dealId, tgId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, creator_paid: tgId === d.creator_id ? true : d.creator_paid, receiver_paid: tgId === d.receiving_nickname ? true : d.receiver_paid } : d));
      } else if (action === 'mark-done') {
        await markDone(dealId, tgId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, creator_completed: tgId === d.creator_id ? true : d.creator_completed, receiver_completed: tgId === d.receiving_nickname ? true : d.receiver_completed } : d));
      } else if (action === 'complete') {
        await completeDeal(dealId);
        setDeals(deals.map(d => d.id === dealId ? { ...d, status: 'completed' } : d));
      }
      setSelectedDeal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredDeals = deals.filter(d =>
    (!filters.status || d.status === filters.status) &&
    (!filters.date || d.created_at.includes(filters.date)) &&
    (!filters.user || String(d.receiving_nickname).includes(filters.user))
  );

  return (
    <div>
      <h1 className="text-2xl mb-4">Deal History</h1>
      {error && <p className="error">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1">Filter by Status</label>
        <select name="status" onChange={handleFilterChange} className="mb-2">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <label className="block mb-1">Filter by Date</label>
        <input type="date" name="date" onChange={handleFilterChange} className="mb-2" />
        <label className="block mb-1">Filter by Receiver Telegram ID</label>
        <input type="text" name="user" onChange={handleFilterChange} />
      </div>
      {selectedDeal ? (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">Deal Details</h2>
          <p><strong>Creator ID:</strong> {selectedDeal.creator_id}</p>
          <p><strong>Receiver Telegram ID:</strong> {selectedDeal.receiving_nickname}</p>
          <p><strong>Description for Creator:</strong> {selectedDeal.description_for_creator}</p>
          <p><strong>Description for Receiver:</strong> {selectedDeal.description_for_recever}</p>
          <p><strong>Creator Payment Conditions:</strong> USDT: {selectedDeal.conditions_for_creator_payment.usdt}, Stars: {selectedDeal.conditions_for_creator_payment.stars}</p>
          <p><strong>Receiver Payment Conditions:</strong> USDT: {selectedDeal.conditions_for_recever_payment.usdt}, Stars: {selectedDeal.conditions_for_recever_payment.stars}</p>
          <p><strong>Creator Payment:</strong> USDT: {selectedDeal.creator_payment.usdt}, Stars: {selectedDeal.creator_payment.stars}</p>
          <p><strong>Receiver Payment:</strong> USDT: {selectedDeal.recever_payment.usdt}, Stars: {selectedDeal.recever_payment.stars}</p>
          <p><strong>Creator Paid:</strong> {selectedDeal.creator_paid ? 'Yes' : 'No'}</p>
          <p><strong>Receiver Paid:</strong> {selectedDeal.receiver_paid ? 'Yes' : 'No'}</p>
          <p><strong>Creator Completed:</strong> {selectedDeal.creator_completed ? 'Yes' : 'No'}</p>
          <p><strong>Receiver Completed:</strong> {selectedDeal.receiver_completed ? 'Yes' : 'No'}</p>
          <p><strong>Status:</strong> {selectedDeal.status}</p>
          <p><strong>Created At:</strong> {new Date(selectedDeal.created_at).toLocaleString()}</p>
          <button className="btn-secondary mr-2" onClick={() => setSelectedDeal(null)}>Back</button>
          {selectedDeal.status === 'pending' && (
            <>
              <button
                className="btn-primary mr-2"
                onClick={() => handleAction(selectedDeal.id, 'pay')}
                disabled={(selectedDeal.creator_id === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.creator_paid) || 
                          (selectedDeal.receiving_nickname === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.receiver_paid)}
              >
                Pay
              </button>
              <button
                className="btn-primary mr-2"
                onClick={() => handleAction(selectedDeal.id, 'mark-done')}
                disabled={(selectedDeal.creator_id === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.creator_completed) || 
                          (selectedDeal.receiving_nickname === window.Telegram.WebApp.initDataUnsafe.user?.id && selectedDeal.receiver_completed)}
              >
                Mark Done
              </button>
              <button
                className="btn-primary mr-2"
                onClick={() => handleAction(selectedDeal.id, 'complete')}
              >
                Complete
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleAction(selectedDeal.id, 'cancel')}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Receiver Telegram ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => (
              <tr key={deal.id}>
                <td>{deal.receiving_nickname}</td>
                <td>{deal.status}</td>
                <td>{new Date(deal.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn-primary" onClick={() => setSelectedDeal(deal)}>
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