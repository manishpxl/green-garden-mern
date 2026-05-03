const apiConfig = {
  baseUrl: process.env.REACT_APP_DB_API_URL || 'https://green-garden-mern.onrender.com/api/db',
  fsBaseUrl: process.env.REACT_APP_FS_API_URL || 'https://green-garden-mern.onrender.com/api/fs'
};

export default apiConfig;