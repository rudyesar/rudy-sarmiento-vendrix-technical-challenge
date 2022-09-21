import axios from 'axios';
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

export default axios.create({
  timeout: 10000,
  baseURL: 'http://localhost:8080',
  headers: { "Access-Control-Allow-Origin": "*" }
});
