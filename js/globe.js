// ============================================================================
// globe.js -- Venezuelan Diaspora Globe (globe.gl Edition)
// IIFE -- Globe loaded via CDN script tag as global
// High-density scatter visualization: ~800-1000 points
// ============================================================================

(function () {
  'use strict';

  var container = document.getElementById('globe-container');
  if (!container || typeof Globe === 'undefined') return;

  // -------------------------------------------------------------------------
  // Constants
  // -------------------------------------------------------------------------
  var CARACAS = { lat: 10.4806, lng: -66.9036 };

  // -------------------------------------------------------------------------
  // Haversine distance (km)
  // -------------------------------------------------------------------------
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.pow(Math.sin(dLon / 2), 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // -------------------------------------------------------------------------
  // City data -- Venezuelan homeland (tier 1) + diaspora (tiers 2-4)
  // -------------------------------------------------------------------------

  // Venezuela internal cities -- RED (tier 1)
  var venezuelaCities = [
    { city: 'Caracas', lat: 10.4806, lng: -66.9036, pop: 3000000, tier: 1 },
    { city: 'Maracaibo', lat: 10.6427, lng: -71.6125, pop: 1800000, tier: 1 },
    { city: 'Valencia', lat: 10.1620, lng: -67.9994, pop: 1600000, tier: 1 },
    { city: 'Barquisimeto', lat: 10.0678, lng: -69.3474, pop: 1200000, tier: 1 },
    { city: 'Ciudad Guayana', lat: 8.3514, lng: -62.6361, pop: 900000, tier: 1 },
    { city: 'Maturin', lat: 9.7457, lng: -63.1833, pop: 600000, tier: 1 },
    { city: 'Barcelona', lat: 10.1302, lng: -64.6892, pop: 500000, tier: 1 },
    { city: 'Cumana', lat: 10.4564, lng: -64.1675, pop: 400000, tier: 1 },
    { city: 'Merida', lat: 8.5897, lng: -71.1561, pop: 350000, tier: 1 },
    { city: 'San Cristobal', lat: 7.7669, lng: -72.2250, pop: 350000, tier: 1 },
    { city: 'Barinas', lat: 8.6226, lng: -70.2074, pop: 300000, tier: 1 },
    { city: 'Puerto La Cruz', lat: 10.2176, lng: -64.6235, pop: 280000, tier: 1 },
    { city: 'Ciudad Bolivar', lat: 8.1167, lng: -63.5500, pop: 250000, tier: 1 },
    { city: 'Cabimas', lat: 10.3910, lng: -71.4424, pop: 250000, tier: 1 },
    { city: 'Los Teques', lat: 10.3445, lng: -67.0437, pop: 200000, tier: 1 },
    { city: 'Punto Fijo', lat: 11.6953, lng: -70.2096, pop: 180000, tier: 1 },
    { city: 'Guarenas', lat: 10.4736, lng: -66.6131, pop: 180000, tier: 1 },
    { city: 'Acarigua', lat: 9.5533, lng: -69.1951, pop: 170000, tier: 1 },
    { city: 'Puerto Cabello', lat: 10.4731, lng: -68.0136, pop: 160000, tier: 1 },
    { city: 'Coro', lat: 11.4045, lng: -69.6675, pop: 150000, tier: 1 },
    { city: 'San Fernando', lat: 7.8886, lng: -67.4738, pop: 130000, tier: 1 },
    { city: 'El Tigre', lat: 8.8857, lng: -64.2527, pop: 120000, tier: 1 },
    { city: 'Guanare', lat: 9.0419, lng: -69.7485, pop: 110000, tier: 1 },
    { city: 'Porlamar', lat: 11.0000, lng: -63.8500, pop: 100000, tier: 1 }
  ];

  // Diaspora cities -- GOLD (tiers 2-4 based on population)
  var diasporaCities = [
    { city: 'Bogota', lat: 4.711, lng: -74.072, pop: 1800000, label: '1.8M' },
    { city: 'Lima', lat: -12.046, lng: -77.043, pop: 1500000, label: '1.5M' },
    { city: 'Santiago', lat: -33.449, lng: -70.669, pop: 500000, label: '500K' },
    { city: 'Quito', lat: -0.181, lng: -78.468, pop: 475000, label: '475K' },
    { city: 'Madrid', lat: 40.417, lng: -3.704, pop: 350000, label: '350K' },
    { city: 'Miami', lat: 25.762, lng: -80.192, pop: 340000, label: '340K' },
    { city: 'Houston', lat: 29.760, lng: -95.370, pop: 200000, label: '200K' },
    { city: 'Buenos Aires', lat: -34.604, lng: -58.382, pop: 180000, label: '180K' },
    { city: 'Guayaquil', lat: -2.189, lng: -79.889, pop: 150000, label: '150K' },
    { city: 'Panama City', lat: 8.982, lng: -79.520, pop: 150000, label: '150K' },
    { city: 'Medellin', lat: 6.248, lng: -75.566, pop: 140000, label: '140K' },
    { city: 'Cucuta', lat: 7.894, lng: -72.508, pop: 120000, label: '120K' },
    { city: 'Lisboa', lat: 38.722, lng: -9.139, pop: 120000, label: '120K' },
    { city: 'Doral', lat: 25.820, lng: -80.355, pop: 120000, label: '120K' },
    { city: 'Santo Domingo', lat: 18.486, lng: -69.931, pop: 120000, label: '120K' },
    { city: 'New York', lat: 40.713, lng: -74.006, pop: 110000, label: '110K' },
    { city: 'Cali', lat: 3.452, lng: -76.532, pop: 90000, label: '90K' },
    { city: 'Weston', lat: 26.100, lng: -80.400, pop: 85000, label: '85K' },
    { city: 'Barcelona (ESP)', lat: 41.387, lng: 2.169, pop: 80000, label: '80K' },
    { city: 'Barranquilla', lat: 10.969, lng: -74.781, pop: 80000, label: '80K' },
    { city: 'Dallas', lat: 32.777, lng: -96.797, pop: 75000, label: '75K' },
    { city: 'Orlando', lat: 28.538, lng: -81.379, pop: 65000, label: '65K' },
    { city: 'Mexico City', lat: 19.433, lng: -99.133, pop: 60000, label: '60K' },
    { city: 'Fort Lauderdale', lat: 26.122, lng: -80.137, pop: 55000, label: '55K' },
    { city: 'Toronto', lat: 43.653, lng: -79.383, pop: 55000, label: '55K' },
    { city: 'Rome', lat: 41.903, lng: 12.496, pop: 55000, label: '55K' },
    { city: 'Sao Paulo', lat: -23.551, lng: -46.633, pop: 50000, label: '50K' },
    { city: 'Trinidad', lat: 10.692, lng: -61.223, pop: 45000, label: '45K' },
    { city: 'Los Angeles', lat: 34.052, lng: -118.244, pop: 45000, label: '45K' },
    { city: 'London', lat: 51.507, lng: -0.128, pop: 45000, label: '45K' },
    { city: 'Valencia (ESP)', lat: 39.470, lng: -0.376, pop: 40000, label: '40K' },
    { city: 'Atlanta', lat: 33.749, lng: -84.388, pop: 35000, label: '35K' },
    { city: 'Oporto', lat: 41.158, lng: -8.629, pop: 35000, label: '35K' },
    { city: 'San Jose', lat: 9.928, lng: -84.091, pop: 35000, label: '35K' },
    { city: 'Milan', lat: 45.464, lng: 9.190, pop: 30000, label: '30K' },
    { city: 'Chicago', lat: 41.878, lng: -87.630, pop: 30000, label: '30K' },
    { city: 'Aruba', lat: 12.521, lng: -69.968, pop: 28000, label: '28K' },
    { city: 'Tampa', lat: 27.951, lng: -82.457, pop: 28000, label: '28K' },
    { city: 'Rio de Janeiro', lat: -22.907, lng: -43.173, pop: 25000, label: '25K' },
    { city: 'Curazao', lat: 12.170, lng: -68.990, pop: 25000, label: '25K' },
    { city: 'Paris', lat: 48.857, lng: 2.352, pop: 25000, label: '25K' },
    { city: 'Tenerife', lat: 28.292, lng: -16.629, pop: 22000, label: '22K' },
    { city: 'Washington DC', lat: 38.907, lng: -77.037, pop: 22000, label: '22K' },
    { city: 'Dublin', lat: 53.350, lng: -6.260, pop: 20000, label: '20K' },
    { city: 'Montreal', lat: 45.502, lng: -73.567, pop: 20000, label: '20K' },
    { city: 'San Antonio', lat: 29.424, lng: -98.494, pop: 20000, label: '20K' },
    { city: 'Vigo', lat: 42.241, lng: -8.721, pop: 18000, label: '18K' },
    { city: 'Charlotte', lat: 35.227, lng: -80.843, pop: 18000, label: '18K' },
    { city: 'Monterrey', lat: 25.687, lng: -100.316, pop: 18000, label: '18K' },
    { city: 'Boston', lat: 42.360, lng: -71.059, pop: 15000, label: '15K' },
    { city: 'Montevideo', lat: -34.901, lng: -56.165, pop: 15000, label: '15K' },
    { city: 'Amsterdam', lat: 52.368, lng: 4.904, pop: 15000, label: '15K' },
    { city: 'Phoenix', lat: 33.448, lng: -112.074, pop: 12000, label: '12K' },
    { city: 'Berlin', lat: 52.520, lng: 13.405, pop: 12000, label: '12K' },
    { city: 'Cancun', lat: 21.162, lng: -86.852, pop: 12000, label: '12K' },
    { city: 'Asuncion', lat: -25.264, lng: -57.576, pop: 12000, label: '12K' },
    { city: 'Vancouver', lat: 49.283, lng: -123.121, pop: 10000, label: '10K' },
    { city: 'La Paz', lat: -16.490, lng: -68.119, pop: 10000, label: '10K' },
    { city: 'Manchester', lat: 53.481, lng: -2.243, pop: 8000, label: '8K' },
    { city: 'Dubai', lat: 25.205, lng: 55.271, pop: 8000, label: '8K' },
    { city: 'Georgetown', lat: 6.801, lng: -58.155, pop: 8000, label: '8K' },
    { city: 'Guatemala City', lat: 14.635, lng: -90.507, pop: 8000, label: '8K' },
    { city: 'Brussels', lat: 50.850, lng: 4.352, pop: 8000, label: '8K' },
    { city: 'Calgary', lat: 51.045, lng: -114.072, pop: 6000, label: '6K' },
    { city: 'Zurich', lat: 47.377, lng: 8.542, pop: 6000, label: '6K' },
    { city: 'Vienna', lat: 48.208, lng: 16.374, pop: 5000, label: '5K' },
    { city: 'Sydney', lat: -33.869, lng: 151.209, pop: 5000, label: '5K' },
    { city: 'Stockholm', lat: 59.329, lng: 18.069, pop: 4000, label: '4K' },
    { city: 'Tel Aviv', lat: 32.085, lng: 34.782, pop: 4000, label: '4K' },
    { city: 'Melbourne', lat: -37.814, lng: 144.963, pop: 3000, label: '3K' },
    { city: 'Warsaw', lat: 52.230, lng: 21.012, pop: 3000, label: '3K' },
    { city: 'Tokyo', lat: 35.676, lng: 139.650, pop: 2000, label: '2K' },
    { city: 'Auckland', lat: -36.849, lng: 174.763, pop: 2000, label: '2K' },
    { city: 'Shanghai', lat: 31.230, lng: 121.474, pop: 1500, label: '1.5K' },
    // Lonely lights -- Africa
    { city: 'Lagos', lat: 6.524, lng: 3.379, pop: 800, label: '800' },
    { city: 'Nairobi', lat: -1.286, lng: 36.817, pop: 500, label: '500' },
    { city: 'Cape Town', lat: -33.925, lng: 18.424, pop: 600, label: '600' },
    { city: 'Johannesburg', lat: -26.205, lng: 28.050, pop: 700, label: '700' },
    { city: 'Cairo', lat: 30.044, lng: 31.236, pop: 400, label: '400' },
    { city: 'Accra', lat: 5.603, lng: -0.187, pop: 300, label: '300' },
    { city: 'Dakar', lat: 14.716, lng: -17.467, pop: 250, label: '250' },
    { city: 'Casablanca', lat: 33.573, lng: -7.589, pop: 500, label: '500' },
    { city: 'Addis Ababa', lat: 9.025, lng: 38.747, pop: 200, label: '200' },
    { city: 'Dar es Salaam', lat: -6.792, lng: 39.208, pop: 150, label: '150' },
    // Lonely lights -- Asia
    { city: 'Mumbai', lat: 19.076, lng: 72.878, pop: 600, label: '600' },
    { city: 'Bangkok', lat: 13.756, lng: 100.502, pop: 500, label: '500' },
    { city: 'Singapore', lat: 1.352, lng: 103.820, pop: 400, label: '400' },
    { city: 'Jakarta', lat: -6.175, lng: 106.845, pop: 300, label: '300' },
    { city: 'Manila', lat: 14.600, lng: 120.984, pop: 350, label: '350' },
    { city: 'Ho Chi Minh City', lat: 10.823, lng: 106.630, pop: 200, label: '200' },
    { city: 'Hanoi', lat: 21.028, lng: 105.854, pop: 150, label: '150' },
    { city: 'Kuala Lumpur', lat: 3.139, lng: 101.687, pop: 300, label: '300' },
    { city: 'Seoul', lat: 37.566, lng: 126.978, pop: 500, label: '500' },
    { city: 'Beijing', lat: 39.904, lng: 116.407, pop: 400, label: '400' },
    { city: 'Hong Kong', lat: 22.320, lng: 114.169, pop: 600, label: '600' },
    { city: 'Taipei', lat: 25.033, lng: 121.565, pop: 300, label: '300' },
    // Lonely lights -- Middle East
    { city: 'Doha', lat: 25.286, lng: 51.535, pop: 500, label: '500' },
    { city: 'Riyadh', lat: 24.713, lng: 46.675, pop: 400, label: '400' },
    { city: 'Beirut', lat: 33.894, lng: 35.502, pop: 300, label: '300' },
    { city: 'Amman', lat: 31.950, lng: 35.933, pop: 200, label: '200' },
    // Lonely lights -- Other remote
    { city: 'Moscow', lat: 55.756, lng: 37.617, pop: 1500, label: '1.5K' },
    { city: 'St. Petersburg', lat: 59.934, lng: 30.335, pop: 800, label: '800' },
    { city: 'Tbilisi', lat: 41.716, lng: 44.783, pop: 300, label: '300' },
    { city: 'Almaty', lat: 43.238, lng: 76.946, pop: 200, label: '200' },
    { city: 'Reykjavik', lat: 64.147, lng: -21.943, pop: 100, label: '100' },
    { city: 'Honolulu', lat: 21.307, lng: -157.858, pop: 800, label: '800' },
    { city: 'Anchorage', lat: 61.218, lng: -149.900, pop: 300, label: '300' },
    { city: 'Perth', lat: -31.950, lng: 115.861, pop: 400, label: '400' },
    { city: 'Brisbane', lat: -27.470, lng: 153.021, pop: 300, label: '300' }
  ];

  // Assign tiers to diaspora cities based on population
  diasporaCities.forEach(function (c) {
    if (c.tier) return; // already assigned (lonely lights)
    if (c.pop >= 100000) { c.tier = 2; }
    else if (c.pop >= 10000) { c.tier = 3; }
    else { c.tier = 4; }
  });

  // Combine all source cities
  var allCities = venezuelaCities.concat(diasporaCities);

  // Add km from Caracas and label to every city
  allCities.forEach(function (c) {
    c.km = Math.round(haversineKm(CARACAS.lat, CARACAS.lng, c.lat, c.lng));
    if (!c.label) {
      if (c.pop >= 1000000) { c.label = (c.pop / 1000000).toFixed(1) + 'M'; }
      else if (c.pop >= 1000) { c.label = Math.round(c.pop / 1000) + 'K'; }
      else { c.label = c.pop.toString(); }
    }
  });

  // -------------------------------------------------------------------------
  // Scatter point generator -- gaussian cloud around each city
  // -------------------------------------------------------------------------
  function generateScatterPoints(cities) {
    var points = [];

    cities.forEach(function (city) {
      var count;
      if (city.tier === 1) {
        count = Math.ceil(city.pop / 50000) + 5;
      } else if (city.tier === 2) {
        count = Math.ceil(city.pop / 20000) + 3;
      } else if (city.tier === 3) {
        count = Math.ceil(city.pop / 10000) + 2;
      } else {
        count = Math.max(1, Math.ceil(city.pop / 5000));
      }

      for (var i = 0; i < count; i++) {
        var spread;
        if (city.tier === 1) { spread = 0.8; }
        else if (city.tier === 2) { spread = 0.5; }
        else if (city.tier === 3) { spread = 0.3; }
        else { spread = 0.15; }

        var lat = city.lat + (Math.random() - 0.5) * spread * 2;
        var lng = city.lng + (Math.random() - 0.5) * spread * 2;
        var km = Math.round(haversineKm(CARACAS.lat, CARACAS.lng, lat, lng));

        var size;
        if (city.tier <= 2) {
          size = 0.15 + Math.random() * 0.3;
        } else {
          size = 0.2 + Math.random() * 0.4;
        }

        points.push({
          lat: lat,
          lng: lng,
          size: size,
          color: city.tier === 1 ? '#CF142B' : '#F4C430',
          city: city.city,
          pop: city.pop,
          km: km,
          label: city.label,
          tier: city.tier,
          isVenezuela: city.tier === 1
        });
      }
    });

    return points;
  }

  // -------------------------------------------------------------------------
  // Trail dust -- faint points along migration corridors (tier 5)
  // No city property so tooltips are not triggered on hover
  // -------------------------------------------------------------------------
  function generateTrailDust() {
    var trails = [];
    var corridors = [
      // Caracas to Miami
      { startLat: 10.48, startLng: -66.90, endLat: 25.76, endLng: -80.19 },
      // Caracas to Bogota
      { startLat: 10.48, startLng: -66.90, endLat: 4.71, endLng: -74.07 },
      // Caracas to Madrid
      { startLat: 10.48, startLng: -66.90, endLat: 40.42, endLng: -3.70 },
      // Caracas to Lima
      { startLat: 10.48, startLng: -66.90, endLat: -12.05, endLng: -77.04 },
      // Caracas to Santiago
      { startLat: 10.48, startLng: -66.90, endLat: -33.45, endLng: -70.67 },
      // Caracas to Buenos Aires
      { startLat: 10.48, startLng: -66.90, endLat: -34.60, endLng: -58.38 },
      // Miami to NYC
      { startLat: 25.76, startLng: -80.19, endLat: 40.71, endLng: -74.01 },
      // Madrid to London
      { startLat: 40.42, startLng: -3.70, endLat: 51.51, endLng: -0.13 }
    ];

    corridors.forEach(function (c) {
      var numDust = 8 + Math.floor(Math.random() * 8);
      for (var i = 0; i < numDust; i++) {
        var t = Math.random();
        var lat = c.startLat + (c.endLat - c.startLat) * t + (Math.random() - 0.5) * 3;
        var lng = c.startLng + (c.endLng - c.startLng) * t + (Math.random() - 0.5) * 3;
        trails.push({
          lat: lat,
          lng: lng,
          size: 0.08 + Math.random() * 0.08,
          color: 'rgba(244, 196, 48, 0.25)',
          pop: 0,
          km: 0,
          tier: 5
        });
      }
    });
    return trails;
  }

  // -------------------------------------------------------------------------
  // Generate all point data
  // -------------------------------------------------------------------------
  var scatterPoints = generateScatterPoints(allCities);
  var trailDust = generateTrailDust();
  var allPoints = scatterPoints.concat(trailDust);

  // Max population for normalization (from source cities, not scatter)
  var maxPop = Math.max.apply(null, allCities.map(function (c) { return c.pop; }));

  // -------------------------------------------------------------------------
  // Arc data -- arcs FROM diaspora cities TO Caracas (energy flows home)
  // startLat/startLng = diaspora city, endLat/endLng = Caracas
  // arcColor goes gold (start) -> red (end) matching the visual direction
  // -------------------------------------------------------------------------
  // EVERY diaspora city sends energy home -- no population filter
  var arcData = diasporaCities.map(function (c) {
    return {
      startLat: c.lat,
      startLng: c.lng,
      endLat: CARACAS.lat,
      endLng: CARACAS.lng,
      pop: c.pop
    };
  });

  // -------------------------------------------------------------------------
  // Label data
  // -- Tier 1 (Venezuela) with pop >= 500000
  // -- All tier 2 (diaspora 100K+)
  // -------------------------------------------------------------------------
  var labelData = allCities.filter(function (c) {
    if (c.tier === 1) return c.pop >= 500000;
    if (c.tier === 2) return true;
    return false;
  });

  // Venezuela GeoJSON
  var venezuelaGeoUrl = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/VEN.geo.json';

  // -------------------------------------------------------------------------
  // Create tooltip element for point hover
  // -------------------------------------------------------------------------
  var tooltip = document.getElementById('globe-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'globe-tooltip';
    tooltip.style.cssText =
      'position: fixed;' +
      'padding: 8px 14px;' +
      'background: rgba(7, 7, 15, 0.92);' +
      'border: 1px solid rgba(244, 196, 48, 0.3);' +
      'border-radius: 6px;' +
      'color: #F5F0E8;' +
      'font-family: "Plus Jakarta Sans", sans-serif;' +
      'font-size: 12px;' +
      'pointer-events: none;' +
      'z-index: 1000;' +
      'opacity: 0;' +
      'transition: opacity 0.2s ease;' +
      'backdrop-filter: blur(8px);' +
      'max-width: 250px;';
    document.body.appendChild(tooltip);
  }

  // -------------------------------------------------------------------------
  // Build globe
  // -------------------------------------------------------------------------
  var globe = Globe()
    (container)
    .backgroundColor('rgba(7, 7, 15, 0)')
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
    .atmosphereColor('rgba(207, 20, 43, 0.4)')
    .atmosphereAltitude(0.25)
    .showGraticules(false)

    // -- Points layer (scatter cloud -- red homeland, gold diaspora, faint trail dust) --
    .pointsData(allPoints)
    .pointLat('lat')
    .pointLng('lng')
    .pointAltitude(function (d) {
      if (d.tier === 5) return 0.002;
      if (d.tier === 1 && d.pop >= 800000) return 0.08;
      if (d.tier === 1 && d.pop >= 300000) return 0.05;
      if (d.tier === 1) return 0.03;
      return 0.01 + (d.pop / maxPop) * 0.06;
    })
    .pointRadius(function (d) {
      return d.size;
    })
    .pointColor(function (d) {
      return d.color;
    })
    .pointsMerge(false)

    // -- Arcs layer (gold -> red dashed arcs FROM diaspora TO Caracas) --
    .arcsData(arcData)
    .arcColor(function (d) {
      // Brighter arcs for bigger cities, dimmer for small ones
      var alpha = Math.max(0.15, Math.min(0.7, d.pop / maxPop * 2));
      var hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, '0');
      return ['#F4C430' + hexAlpha, '#CF142B' + hexAlpha];
    })
    .arcAltitude(function (d) {
      // Higher arcs for farther cities
      return 0.05 + Math.min(0.4, d.pop / maxPop * 0.5) + Math.random() * 0.1;
    })
    .arcStroke(function (d) {
      // Thicker for major hubs, thin whiskers for lonely lights
      return 0.15 + (d.pop / maxPop) * 1.0;
    })
    .arcDashLength(0.4)
    .arcDashGap(0.15)
    .arcDashAnimateTime(function () { return 1200 + Math.random() * 2000; })

    // -- Rings at Caracas (pulsing home marker) --
    .ringsData([{ lat: CARACAS.lat, lng: CARACAS.lng }])
    .ringColor(function () { return function (t) { return 'rgba(207, 20, 43, ' + (1 - t) + ')'; }; })
    .ringMaxRadius(5)
    .ringPropagationSpeed(3)
    .ringRepeatPeriod(1500)

    // -- Venezuela polygon (data loaded async) --
    .polygonsData([])
    .polygonCapColor(function () { return 'rgba(207, 20, 43, 0.5)'; })
    .polygonSideColor(function () { return 'rgba(207, 20, 43, 0.8)'; })
    .polygonStrokeColor(function () { return '#CF142B'; })
    .polygonAltitude(0.035)
    .polygonLabel(function () {
      return '<div style="font-family: Bebas Neue, sans-serif; font-size: 1.5rem; color: #F4C430; text-shadow: 0 0 10px rgba(244,196,48,0.5); padding: 8px;">' +
        '\uD83C\uDDFB\uD83C\uDDEA VENEZUELA<br>' +
        '<span style="font-family: Libre Baskerville, serif; font-size: 0.8rem; font-style: italic; color: #F5F0E8;">La casa. Home. Campeones.</span></div>';
    })

    // -- Labels (Venezuelan 500K+ in red, diaspora 100K+ in gold) --
    .labelsData(labelData)
    .labelLat('lat')
    .labelLng('lng')
    .labelText(function (d) { return d.city; })
    .labelSize(function (d) { return 0.3 + (d.pop / maxPop) * 0.5; })
    .labelColor(function (d) { return d.tier === 1 ? 'rgba(207, 20, 43, 0.85)' : 'rgba(244, 196, 48, 0.7)'; })
    .labelDotRadius(0.15)
    .labelAltitude(0.01)
    .labelResolution(3)

    // -- Tooltip on point hover --
    .onPointHover(function (point) {
      if (point && point.city) {
        tooltip.innerHTML = point.isVenezuela
          ? '<strong style="color: #CF142B">' + point.city + '</strong><br><span style="color: #5a5870">Venezuela \uD83C\uDDFB\uD83C\uDDEA</span>'
          : '<strong style="color: #F4C430">' + point.city + '</strong><br><span style="color: #5a5870">~' + point.label + ' venezolanos \u00B7 ' + (point.km ? point.km.toLocaleString() : '?') + ' km from home</span>';
        tooltip.style.opacity = '1';
      } else {
        tooltip.style.opacity = '0';
      }
    });

  // -------------------------------------------------------------------------
  // Fetch Venezuela GeoJSON and light it up on the globe
  // -------------------------------------------------------------------------
  fetch(venezuelaGeoUrl)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var features = data.features || [data];
      globe.polygonsData(features);
    })
    .catch(function (err) {
      console.warn('Could not load Venezuela GeoJSON:', err);
    });

  // -------------------------------------------------------------------------
  // Tooltip follows pointer
  // -------------------------------------------------------------------------
  container.addEventListener('pointermove', function (e) {
    if (tooltip.style.opacity === '1') {
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY - 16) + 'px';
    }
  });

  // -------------------------------------------------------------------------
  // Initial camera -- zoomed tight on Venezuela (user sees this first)
  // -------------------------------------------------------------------------
  var MIAMI = { lat: 25.762, lng: -80.192 };
  globe.pointOfView({ lat: CARACAS.lat, lng: CARACAS.lng, altitude: 0.4 }, 0);

  // -------------------------------------------------------------------------
  // OrbitControls configuration
  // -------------------------------------------------------------------------
  var controls = globe.controls();
  controls.autoRotate = false; // disabled until cinematic sequence finishes
  controls.autoRotateSpeed = 0.3;
  controls.enableZoom = true;
  controls.minDistance = 150;
  controls.maxDistance = 500;
  controls.enablePan = false;

  var isMobile = window.innerWidth <= 768;
  if (isMobile) {
    controls.enableRotate = false;
    controls.enableZoom = false;
  }

  // -------------------------------------------------------------------------
  // Responsive resize
  // -------------------------------------------------------------------------
  function handleResize() {
    globe.width(container.clientWidth).height(container.clientHeight);
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  // -------------------------------------------------------------------------
  // CINEMATIC CAMERA SEQUENCE (triggered when globe scrolls into view)
  // Desktop: setTimeout chain
  // Mobile: GSAP timeline auto-play (no scroll pinning)
  // -------------------------------------------------------------------------
  var cinematicDone = false;

  function startDesktopCinematic() {
    if (cinematicDone) return;
    cinematicDone = true;

    setTimeout(function () {
      globe.pointOfView({ lat: MIAMI.lat, lng: MIAMI.lng, altitude: 0.8 }, 2000);
    }, 1500);

    setTimeout(function () {
      globe.pointOfView({ lat: 20, lng: -75, altitude: 1.8 }, 2500);
    }, 4000);

    setTimeout(function () {
      globe.pointOfView({ lat: 30, lng: -10, altitude: 2.2 }, 3000);
    }, 7000);

    setTimeout(function () {
      globe.pointOfView({ lat: 20, lng: -40, altitude: 2.5 }, 2500);
    }, 10500);

    setTimeout(function () {
      controls.autoRotate = true;
    }, 13500);
  }

  function startMobileCinematic() {
    if (cinematicDone) return;
    cinematicDone = true;

    // Use GSAP timeline for smooth mobile cinematic
    if (typeof gsap !== 'undefined') {
      var cam = { lat: CARACAS.lat, lng: CARACAS.lng, altitude: 0.5 };
      var tl = gsap.timeline();

      // Hold on Venezuela (2s)
      tl.to(cam, {
        duration: 2, ease: 'none',
        onUpdate: function() { globe.pointOfView(cam, 0); }
      });

      // Pan to Miami (1.5s)
      tl.to(cam, {
        lat: 25.76, lng: -80.19, altitude: 1.2,
        duration: 1.5, ease: 'power2.inOut',
        onUpdate: function() { globe.pointOfView(cam, 0); }
      });

      // Hold Miami (1s)
      tl.to(cam, { duration: 1, ease: 'none' });

      // Pull back to Americas (2s)
      tl.to(cam, {
        lat: 15, lng: -60, altitude: 2.0,
        duration: 2, ease: 'power2.inOut',
        onUpdate: function() { globe.pointOfView(cam, 0); }
      });

      // Rotate to Europe (2s)
      tl.to(cam, {
        lat: 42, lng: 5, altitude: 2.3,
        duration: 2, ease: 'power2.inOut',
        onUpdate: function() { globe.pointOfView(cam, 0); }
      });

      // Full globe view (2s)
      tl.to(cam, {
        lat: 20, lng: -40, altitude: 2.8,
        duration: 2, ease: 'power2.inOut',
        onUpdate: function() { globe.pointOfView(cam, 0); }
      });

      // Enable interaction after cinematic completes
      tl.call(function() {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        // Re-enable touch controls so user can explore
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.minDistance = 120;
        controls.maxDistance = 400;
      });
    } else {
      // Fallback if no GSAP on mobile
      startDesktopCinematic();
    }
  }

  // Trigger cinematic sequence when globe section scrolls into view
  var globeSection = document.getElementById('diaspora') || container.closest('section');
  if (globeSection && typeof IntersectionObserver !== 'undefined') {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (isMobile) {
            startMobileCinematic();
          } else {
            startDesktopCinematic();
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(globeSection);
  } else {
    setTimeout(isMobile ? startMobileCinematic : startDesktopCinematic, 2000);
  }

  // -------------------------------------------------------------------------
  // Counter animation (scroll into view -> 0 to 7,700,000)
  // -------------------------------------------------------------------------
  var counterEl = document.getElementById('globe-count');
  var subtitleEl = document.getElementById('globe-subtitle');
  var counterDone = false;

  function animateCounter() {
    if (counterDone || !counterEl) return;
    var rect = container.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      counterDone = true;
      var target = 7700000;
      var dur = 2500;
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        var val = Math.floor(target * eased);
        counterEl.textContent = val.toLocaleString('es-VE');
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          counterEl.textContent = '7,700,000+';
          if (subtitleEl) {
            subtitleEl.style.transition = 'opacity 1.2s ease';
            subtitleEl.style.opacity = '1';
          }
        }
      }
      requestAnimationFrame(tick);
    }
  }

  // Check on scroll and on initial load
  window.addEventListener('scroll', animateCounter, { passive: true });
  animateCounter();

})();
