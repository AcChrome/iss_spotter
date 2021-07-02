const request = require('request-promise-native');

fetchMyIP = () => {
  return request('http://api.ipify.org?format=json');

}; 

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://freegeoip.app/json/${ip}`);
};

fetchISSFlyOverTimes = (body) => {
  const { latitude, longitude } = JSON.parse(body);
  return request(`http://api.open-notify.org/iss/v1/?lat=${latitude}&lon=${longitude}&alt=1650`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { reponse } =JSON.parse(data);
    return response;
  });
};

module.exports = { nextISSTimesForMyLocation };



// module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
