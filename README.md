# MBTA V3 API

* https://api-v3.mbta.com/docs/swagger
* https://www.mbta.com/schedules/Orange/schedule?direction_id=0&origin=place-welln

1. https://api-v3.mbta.com/routes

``` js
data[1] = {
  id: "Orange",
  attributes: {
    direction_names: [
      "Southbound",
      "Northbound"
    ]
  }
}
```

2. https://api-v3.mbta.com/stops?filter[route]=Orange

``` js
  data[17] = {
    id: "place-welln",
    attributes: {
      name: "Wellington"
    }
  }
```

``` js
  data[18] = {
    id: "place-mlmnl",
    attributes: {
      name: "Malden Center"
    }
  }
```

3. https://api-v3.mbta.com/predictions?filter[stop]=place-welln&filter[direction_id]=0

``` js
  data[index].attributes = {
    departure_time: "2017-12-27T16:00:15-05:00",
    direction_id: 0
  }
```
