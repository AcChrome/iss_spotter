const request = require('request')


const fetchMyIP = function(callback) {
  request('http://api.ipify.org?format=json', (error, response, body) => {
    if (error)
      return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP : ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    return callback(null, ip);

  });
};


const fetchCoordsByIP = function(ip, callback) {
  request(`http://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP : ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    return callback(null, { latitude, longitude });


  });
};




const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}&alt=1650`;

  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);

    }

    if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    }

    const passes = JSON.parse(body).response;
    return callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      
      fetchISSFlyOverTimes (loc, (error, nextPasses) => {
        if(error) {
          return callback(error, null);
        }
        return callback(null, nextPasses);
      })    
    });
  });
};


module.exports = { nextISSTimesForMyLocation };

// module.exports = { fetchMyIP };
// module.exports = { fetchCoordsByIP };
// module.exports = { fetchISSFlyOverTimes };

