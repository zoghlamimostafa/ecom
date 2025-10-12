module.exports = {
  apps: [
    {
      name: "sanny-backend",
      cwd: "./backend",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      error_file: "../logs/backend-error.log",
      out_file: "../logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    },
    {
      name: "sanny-client",
      cwd: "./Client",
      script: "node_modules/react-scripts/scripts/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        BROWSER: "none"
      },
      error_file: "../logs/client-error.log",
      out_file: "../logs/client-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    },
    {
      name: "sanny-admin",
      cwd: "./admin-app",
      script: "node_modules/react-scripts/scripts/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        BROWSER: "none"
      },
      error_file: "../logs/admin-error.log",
      out_file: "../logs/admin-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};