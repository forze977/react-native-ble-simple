const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

export const base64toHEX = (base64) => {
  var raw = Base64.atob(base64);

  var HEX = '';

  for (i = 0; i < raw.length; i++) {
    var _hex = raw.charCodeAt(i).toString(16);

    HEX += _hex.length == 2 ? _hex : '0' + _hex;
  }
  return HEX.toUpperCase();
}

/**
 * 
 * @param {string} base64 base64 input
 * @returns {s1, s2, s3, s4, s5, batt} return s1(sensor1) to s5 and batt(battery)
 */
const extractDataFrombase64 = (base64) => {
  let raw = base64toHEX(base64);
  return extractDataFromHex(raw);
}
const bytesToHexString = (byteArray) => {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}
/**
 * 
 * @param {string} hex hexstring input
 * @returns {s1, s2, s3, s4, s5, batt} return s1(sensor1) to s5 and batt(battery)
 */
export const extractDataFromHex = (hex) => {
  let sensor = [];
  for(let i = 1; i <= 5; i++){
    let index = i * 4;
    let r = hex.substring(index - 3, index);
    //if(r[0] === '0' && r[1] === '0') r = r[2];
    //else if (r[0] === '0') r = r.substring(1);
    let dec = parseInt('0x' + r);
    isNaN(dec) ? dec = 0 : dec = dec;
    sensor.push(dec);
  }
  sensor.push(parseInt('0x' + hex.substring(20)));
  return {s1: sensor[0], s2: sensor[1], s3: sensor[2], s4: sensor[3], s5: sensor[4], batt: sensor[5]};
}

export default extractDataFrombase64;