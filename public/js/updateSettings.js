/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// update Data 
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8080/api/v1/users/updateMyPassword'
        : 'http://localhost:8080/api/v1/users/updateMe';


    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if ( res.data.status || res.status === 'success' ) {
      showAlert('success', `${type.toUpperCase()} Was Successfully Updated!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

