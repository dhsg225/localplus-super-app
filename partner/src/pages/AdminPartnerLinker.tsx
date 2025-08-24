import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/services/supabase';
import { Button } from '../../shared/components';

const AdminPartnerLinker: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: usersData } = await supabase.from('users').select('id, email');
        const { data: businessesData } = await supabase.from('businesses').select('id, name');
        setUsers(usersData || []);
        setBusinesses(businessesData || []);
      } catch (err) {
        setMessage('Failed to load users or businesses');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLink = async () => {
    if (!selectedUser || !selectedBusiness) {
      setMessage('Please select both a user and a business');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await supabase.from('partners').insert({
        user_id: selectedUser,
        business_id: selectedBusiness,
        role: 'owner',
        is_active: true,
        accepted_at: new Date().toISOString()
      });
      setMessage('✅ User linked to business!');
    } catch (err: any) {
      setMessage('Error linking user: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Link User to Business</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select User</label>
        <select
          className="w-full border rounded p-2"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email} ({user.id})</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Business</label>
        <select
          className="w-full border rounded p-2"
          value={selectedBusiness}
          onChange={e => setSelectedBusiness(e.target.value)}
        >
          <option value="">-- Select Business --</option>
          {businesses.map(biz => (
            <option key={biz.id} value={biz.id}>{biz.name} ({biz.id})</option>
          ))}
        </select>
      </div>
      <Button onClick={handleLink} isLoading={loading} theme="blue">
        Link User to Business
      </Button>
      {message && <div className="mt-4 text-sm text-blue-700">{message}</div>}
    </div>
  );
};

export default AdminPartnerLinker; 