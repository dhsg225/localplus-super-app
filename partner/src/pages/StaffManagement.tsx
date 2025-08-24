import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../shared/services/bookingService';
import { authService } from '../../shared/services/authService';
import type { Restaurant, Partner } from '../../shared/types';
import { Button } from '../../shared/components';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const StaffManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [staff, setStaff] = useState<Partner[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [userId: string]: UserProfile }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<string>(''); // Current user's role (for permissions)
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'manager' | 'staff'>('staff');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await bookingService.getPartnerRestaurants();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0].id);
        }
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Error loading restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  useEffect(() => {
    const loadStaff = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const data = await bookingService.getPartners(selectedRestaurant);
        setStaff(data);
        // TODO: Replace with actual user ID from auth context
        const currentUserId = null; // <-- Replace with real user ID
        if (currentUserId) {
          const current = data.find((p) => p.user_id === currentUserId);
          setRole(current ? current.role : 'staff');
        } else {
          setRole('owner'); // Default for now
        }
      } catch (err) {
        setError('Failed to load staff');
        setStaff([]);
        console.error('Error loading staff:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [selectedRestaurant]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (staff.length === 0) return;
      setProfilesLoading(true);
      const newProfiles: { [userId: string]: UserProfile } = { ...userProfiles };
      for (const member of staff) {
        if (!newProfiles[member.user_id]) {
          try {
            const profile = await authService.getUserById(member.user_id);
            newProfiles[member.user_id] = profile;
          } catch (err) {
            newProfiles[member.user_id] = {
              id: member.user_id,
              email: '(unknown)',
              firstName: '',
              lastName: ''
            };
          }
        }
      }
      setUserProfiles(newProfiles);
      setProfilesLoading(false);
    };
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess('');
    try {
      // For demo: create a new partner with a fake user_id (in real app, lookup or invite user by email)
      // You may want to implement a real invite flow with email sending and user creation
      await bookingService.addPartner(selectedRestaurant, inviteEmail, inviteRole, []);
      setInviteSuccess('Invitation sent!');
      setInviteEmail('');
      setInviteRole('staff');
      setInviteOpen(false);
      // Reload staff list
      const data = await bookingService.getPartners(selectedRestaurant);
      setStaff(data);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to invite staff');
    } finally {
      setInviteLoading(false);
    }
  };

  // TODO: Replace with actual user ID from auth context
  const currentUserId = null; // <-- Replace with real user ID

  const handleRoleChange = async (partnerId: string, newRole: 'owner' | 'manager' | 'staff') => {
    setActionLoading(partnerId);
    setActionError('');
    setActionSuccess('');
    try {
      await bookingService.updatePartner(partnerId, { role: newRole });
      setActionSuccess('Role updated!');
      // Reload staff list
      const data = await bookingService.getPartners(selectedRestaurant);
      setStaff(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update role');
    } finally {
      setActionLoading('');
    }
  };

  const handleRemove = async (partnerId: string) => {
    setActionLoading(partnerId);
    setActionError('');
    setActionSuccess('');
    try {
      await bookingService.removePartner(partnerId);
      setActionSuccess('Staff removed!');
      // Reload staff list
      const data = await bookingService.getPartners(selectedRestaurant);
      setStaff(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to remove staff');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading staff...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
        <p className="text-gray-600">View and manage your restaurant's staff and permissions</p>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Restaurant</h2>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Staff</h2>
          {role === 'owner' && (
            <>
              <Button theme="blue" size="sm" onClick={() => setInviteOpen(true)}>
                + Invite Staff
              </Button>
              {inviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Invite Staff</h3>
                    <form onSubmit={handleInvite} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={inviteRole}
                          onChange={e => setInviteRole(e.target.value as any)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                      </div>
                      {inviteError && <div className="text-red-600 text-sm">{inviteError}</div>}
                      {inviteSuccess && <div className="text-green-600 text-sm">{inviteSuccess}</div>}
                      <div className="flex justify-end gap-2">
                        <Button type="button" theme="gray" size="sm" onClick={() => setInviteOpen(false)} disabled={inviteLoading}>Cancel</Button>
                        <Button type="submit" theme="blue" size="sm" isLoading={inviteLoading} disabled={inviteLoading}>Send Invite</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {actionError && <div className="text-red-600 text-sm px-6 pt-2">{actionError}</div>}
        {actionSuccess && <div className="text-green-600 text-sm px-6 pt-2">{actionSuccess}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {role === 'owner' && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => {
                const profile = userProfiles[member.user_id];
                const isSelf = member.user_id === currentUserId;
                return (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profilesLoading && !profile ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        profile ? `${profile.firstName} ${profile.lastName}`.trim() || '(No Name)' : member.user_id
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profilesLoading && !profile ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        profile ? profile.email : '(unknown)'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role === 'owner' && !isSelf ? (
                        <select
                          value={member.role}
                          onChange={e => handleRoleChange(member.id, e.target.value as any)}
                          disabled={actionLoading === member.id}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                      ) : (
                        member.role
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.is_active ? 'Active' : 'Inactive'}</td>
                    {role === 'owner' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {!isSelf ? (
                          <Button
                            theme="red"
                            size="sm"
                            isLoading={actionLoading === member.id}
                            disabled={actionLoading === member.id}
                            onClick={() => handleRemove(member.id)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-xs">(You)</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement; 