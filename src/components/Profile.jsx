import React, { useState, useEffect } from 'react';
import { getUserByTelegramId, getAppeals, createAppeal } from '../utils/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [appealForm, setAppealForm] = useState({ description: '' });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
        const userData = await getUserByTelegramId(tgId);
        const appealsData = await getAppeals(tgId);
        setUser(userData);
        setAppeals(appealsData || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealForm.description.trim()) {
      setError('Description is required');
      return;
    }
    try {
      const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
      const newAppeal = await createAppeal({
        tg_id: tgId,
        description: appealForm.description
      });
      setAppeals([...appeals, newAppeal]);
      setAppealForm({ description: '' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'waiting': return 'status-pending';
      case 'progressing': return 'status-pending';
      case 'complete': return 'status-completed';
      case 'denied': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <div className="space-y-4 mb-8">
          <p><strong>Telegram ID:</strong> {user.telegram_id}</p>
          <p><strong>Nickname:</strong> {user.nickname || 'Not set'}</p>
          <p><strong>Total Deals:</strong> {user.num_deals}</p>
          <p><strong>Successful Deals:</strong> {user.successful_num_deals}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Create Appeal</h2>
          <form onSubmit={handleAppealSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={appealForm.description}
                onChange={(e) => setAppealForm({ ...appealForm, description: e.target.value })}
                required
                placeholder="Describe your issue"
                rows="4"
                className="w-full"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">Submit Appeal</button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Appeal History</h2>
          {appeals.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Admin Reply</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map(appeal => (
                  <tr key={appeal.id}>
                    <td>{appeal.id}</td>
                    <td>{appeal.description}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appeal.status)}`}>
                        {appeal.status}
                      </span>
                    </td>
                    <td>{new Date(appeal.create_time).toLocaleDateString()}</td>
                    <td>{appeal.admin_reply || 'No reply'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400">No appeals found</p>
          )}
        </div>
      </div>
      {showToast && (
        <div className="toast">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Appeal submitted successfully!
        </div>
      )}
    </div>
  );
}

export default Profile;
