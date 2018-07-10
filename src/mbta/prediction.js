const fetch = require('node-fetch');
const api_key = require('./api_key');

module.exports = function (route_id, stop_id, direction_id) {

  const url = `https://api-v3.mbta.com/predictions?`
            + `filter[stop]=${stop_id}&`
            + `filter[direction_id]=${direction_id}&`
            + `filter[route]=${route_id}&`
            + `sort=departure_time&`
            + `api_key=${api_key}`;

  return fetch(url)
          .then(res => res.json())
          .then(json => json.data.map(o => o.attributes.departure_time))
}

