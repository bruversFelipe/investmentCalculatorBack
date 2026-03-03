export default {
  PORT: process.env.PORT || 4000,
  API_PREFIX: '/v1',
  MORGAN_LOG_FORMAT: 'dev',
  CORS: {
    ORIGIN: {
      
    },
    METHOD: 'GET, POST',
    ALLOWED_HEADERS: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
};