const axios = require('axios');
const config = require('config');

http://localhost:3000/pointvalues/101?start=2021-01-01T00:00:00&end=2021-01-02T00:00:00

exports.getOaskGtpCurrPointValue = (point_id, str_time, end_time) => {
  const url = config.get('web_api.oask-gtp-uri')
  let uri = `${url}/pointvalues/${point_id}?start=${str_time}&end=${end_time}`;
  console.log(uri)
  return axios.get( uri );
}
  
