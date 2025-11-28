const isDevelopment = true; // Set this to false for production

const config = {
    API_URL: isDevelopment ? 'http://localhost:5000/api' : '/api',
    SOCKET_URL: isDevelopment ? 'http://localhost:5000' : '',
    isDevelopment
};

export default config; 