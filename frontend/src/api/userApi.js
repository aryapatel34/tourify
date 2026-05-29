import { fetchClient } from './client';

export const fetchUserProfile = async () => {
  return await fetchClient('/api/users/profile');
};

export const updateUserProfile = async (userData) => {
  return await fetchClient('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
