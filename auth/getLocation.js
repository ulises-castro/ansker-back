require('dotenv').config();
import axios from 'axios';

const ipProviderUrl = 'http://api.ipstack.com';
const access_token = process.env.IPTOKEN;

// Gettings user location information ##############
const getUserLocation = async function (ipUser) {
  return axios.get(`${ipProviderUrl}/${ipUser}?access_key=${access_token}`);
  //
  // console.log("Entro aquí IP====,", ipUser, response);
  //
  // return response;
}

export default getUserLocation;
