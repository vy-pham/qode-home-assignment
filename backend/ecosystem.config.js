module.exports = {
  apps: [
    {
      name: 'idle-khanwars-be',
      script: 'dist/main.js',
      args: 'one two',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3011,
        JWT_SECRET: '123456789',
        MONGODB_URI: 'mongodb://127.0.0.1:27017',
        MONGODB_NAME: 'idle-khanwars',
        APP_CONTEXT: 'api',
      },
    },
  ],
}
