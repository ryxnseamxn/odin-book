const developmentApiUrl = process.env.REACT_APP_API_URL;
const productionApiUrl = process.env.REACT_APP_API_URL_PRODUCTION;


const apiUrl = process.env.REACT_APP_ENVIRONMENT === 'production'
  ? productionApiUrl
  : developmentApiUrl;


if (!apiUrl) {
  console.error("API URL is not configured. Check environment variables.");
}

export { apiUrl };