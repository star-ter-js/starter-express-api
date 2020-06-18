const fetch = require('node-fetch');

/**
 * geocode address using arcgis geocoder online service
 *
 * @param {String} address
 * @returns {Object} arcgis geocoder online service responce
 */
async function geocode(address) {
  address = encodeURIComponent(address.trim());
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/FindAddressCandidates?F=pjson&SingleLine=${address}`;
  //const url = `http://nominatim.openstreetmap.org/search?format=json&q=${address}`;

  try {
    let resp = await fetch(url).then(resp => resp.json());
    //console.log(out);

    //do stuff with "resp"

    return resp;
  } catch (err) {
    throw new Error(err);
  }
} // geocode

module.exports = geocode;
