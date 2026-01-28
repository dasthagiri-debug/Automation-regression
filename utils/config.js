const YAML = require('yamljs');
const path = require('path');

const configPath = path.join(__dirname, '../config/configuration.yaml');
const config = YAML.load(configPath);

/**
 * Get property from YAML config using dot notation
 * @param {string} path - Dot-separated path, e.g., "credentials.username"
 */
function getProperty(path) {
  return path.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), config);
}

module.exports = { getProperty };