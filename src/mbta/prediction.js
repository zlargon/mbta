const fetch = require('node-fetch');
const api_key = require('./api_key');

module.exports = function (stop_id, direction_id) {

  const url = `https://api-v3.mbta.com/predictions?`
            + `filter[stop]=${stop_id}&`
            + `filter[direction_id]=${direction_id}&`
            + `filter[route]=Orange&`
            + `sort=departure_time&`
            + `page[limit]=5&`
            + `api_key=${api_key}`;

  return fetch(url)
          .then(res => res.json())
          .then(json => json.data.map(o => new Date(o.attributes.departure_time)))
}

