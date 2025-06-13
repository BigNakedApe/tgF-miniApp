import { useState, useEffect } from 'react';
import { getUser } from '../utils/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tgId = window.Telegram.WebApp.initDataUnsafe.user?.id;
        const data = await getUser(tgId);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Profile</h1>
      {error && <p className="error">{error}</p>}
      <p><strong>Username:</strong> {user.username || 'N/A'}</p>
      <p><strong>Telegram ID:</strong> {user.telegram_id}</p>
      <p><strong>Total Deals:</strong> {user.num_deals}</p>
      <p><strong>Successful Deals:</strong> {user.successful_num_deals}</p>
    </div>
  );
}

export default Profile;