const axios = require('axios');
const config = require('config');
const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 60, checkperiod: 600} );

http://localhost:3000/pointvalues/101?start=2021-01-01T00:00:00&end=2021-01-02T00:00:00

exports.getOaskGtpCurrPointValue = (point_id, str_time, end_time) => {
  const url = config.get('web_api.oask-gtp-uri')
  let uri = `${url}/pointvalues/${point_id}?start=${str_time}&end=${end_time}`;

    let cached_resp = cache.get( uri );

  if (cached_resp) {
    console.log("cache response")
    
    return new Promise( (resolve, reject) => {resolve(cached_resp)});  
  }

  console.log(uri)

  return axios.get( uri ) .then(res=> {
      cache.set( uri, res.data );
      return res.data    
  });

}
  
