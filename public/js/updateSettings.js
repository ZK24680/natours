/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Update User Successful!');
      window.location.reload();
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
