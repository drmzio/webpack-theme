const dotenv = require('dotenv').config();

/**
 * Gets a environment value if it's set or default otherwise.
 *
 * @param {String} variable
 * @param {*} defaults
 */
module.exports = (variable, defaults) => {
  return (process.env[variable]) ? process.env[variable] : defaults
};
