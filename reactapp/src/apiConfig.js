const apiConfig = {
    baseUrl: process.env.REACT_APP_DB_API_URL || 'http://localhost:8080/api/db',
    fsBaseUrl: process.env.REACT_APP_FS_API_URL || 'http://localhost:8080/api/fs'
};

export default apiConfig;
