module.exports = {
  apps: [{
    name: 'backend-fixed',
    script: './index.js',
    cwd: '/home/blackrdp/sanny/san/ecomerce_sanny/backend',
    env: {
      NODE_ENV: 'development',
      PORT: 4000,
      BASE_URL: 'http://74.235.205.26:4000'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000,
      BASE_URL: 'http://74.235.205.26:4000'
    }
  }]
};
