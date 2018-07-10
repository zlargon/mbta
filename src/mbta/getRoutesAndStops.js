/*
 * The script to generate the route.json
 */
const fs = require('fs');
const co = require('co');
const fetch = require('node-fetch');
const host = 'https://api-v3.mbta.com';

co(function * () {
  // https://api-v3.mbta.com/routes
  let res = yield fetch(host + '/routes').then(res => res.json());
  const routes = res.data.slice(0, 7);

  for (let route of routes) {

    route.name = route.attributes.long_name;
    route.short_name = route.attributes.short_name;
    route.color = '#' + route.attributes.color;
    route.text_color = '#' + route.attributes.text_color;
    route.direction = route.attributes.direction_names;

    delete route.links;
    delete route.type;
    delete route.attributes;

    // https://api-v3.mbta.com/stops?filter[route]=Orange
    let stops = yield fetch(host + '/stops?filter[route]=' + route.id)
                      .then(res => res.json())
                      .then(res => res.data.reverse());

    for (let stop of stops) {

      stop.name = stop.attributes.name;

      // stop.location = {
      //   address: stop.attributes.address,
      //   latitude: stop.attributes.latitude,
      //   longitude: stop.attributes.longitude
      // };

      delete stop.links;
      delete stop.relationships;
      delete stop.type;
      delete stop.attributes;
    }

    route.stops = stops;
  }

  // write file
  fs.writeFileSync('route.json', JSON.stringify(routes, null, 2));
});
