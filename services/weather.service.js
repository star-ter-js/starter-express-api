/*
api.openweathermap.org/data/2.5/weather?&appid={your api key}&lat={lat}&lon={lon}
http://api.openweathermap.org/data/2.5/weather?appid=3428ad1ac06579bcc9f5e12a7cd86313&units=metric&q=giovinazzo,it
http://api.openweathermap.org/data/2.5/forecast?appid=3428ad1ac06579bcc9f5e12a7cd86313&units=metric&q=giovinazzo,it
*/

const fetch = require('node-fetch');

const appID = "3428ad1ac06579bcc9f5e12a7cd86313";
const baseUrl = "http://api.openweathermap.org/data/2.5/";

module.exports = {
  /**
   * get the current weather using openweathermap online service
   *
   * @param {Object} {
   *     {String} loc default 'roma,it',
   *   }={}
   * @returns {Object} openweathermap responce {cod, }
   */
  async weather(opt = {}) {

    const loc = ('string' === typeof opt) ? opt : opt.loc || 'Rome';
    const url = `${baseUrl}/weather?appid=${appID}&units=metric&q=${loc}`;

    try {
      let resp = await fetch(url).then(resp => resp.json());

      if (resp.cod !== 200) throw new Error(resp.message);

      //do stuff with "resp"

      return resp;
    } catch (err) {
      throw new Error(err);
    }
  }, // weather
  async forecast({
    hour = 3
  } = {}) {}, // forecast
  /**
   * returns string that describe current weather
   *
   * @param {Object} resp openweathermap responce
   * @returns {string}
   */
  stringFromWeather(resp) {
    if (!resp) throw new Error('city not found');

    let out = [`current weather for ${resp.name.toUpperCase()}`];
    out.push(`${resp.weather[0].description}`);
    out.push(['temp', 'feels_like', 'temp_min', 'temp_max']
      .map(item => `${item}: ${resp.main[item]}`).join(' '));
    out.push(...(['pressure', 'humidity'].map(item => `${item}: ${resp.main[item]}`)));
    out.push(`visibility: ${resp.visibility}`);
    out.push(`wind speed: ${resp.wind.speed}, deg: ${resp.wind.deg}`);

    return out.join(';\n');
  }, // stringFromWeather
}; // exports
