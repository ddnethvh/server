const fetch = require('node-fetch');

const PROXY_CHECK_URL = 'https://proxycheck.io/v2';

/**
 * Middleware to detect if the request is coming from a proxy/VPN
 * Uses proxycheck.io API
 */
const proxyCheck = async (req, res, next) => {
  try {
    // Get IP address from headers or socket
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    if (!ip) {
      console.error('No IP address found in request');
      return next();
    }

    // Clean IPv6 localhost to IPv4
    const cleanIP = ip.replace('::ffff:', '');

    // Make request to proxycheck.io API
    const response = await fetch(`${PROXY_CHECK_URL}/${cleanIP}`);

    if (!response.ok) {
      console.error('Proxy check API error:', await response.text());
      return next();
    }

    const data = await response.json();

    // Check if the request was successful and contains proxy information
    if (data.status === 'ok' && data[cleanIP]) {
      const proxyInfo = data[cleanIP];
      
      // Add proxy status to request object
      req.proxyData = {
        isProxy: proxyInfo.proxy === 'yes',
        type: proxyInfo.type
      };
    }

    next();
  } catch (error) {
    console.error('Error checking proxy:', error);
    next();
  }
};

module.exports = proxyCheck; 