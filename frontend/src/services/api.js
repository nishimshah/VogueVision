import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getProducts = async (category = 'all') => {
  const response = await api.get('/products', {
    params: { category: category !== 'all' ? category : undefined }
  });
  return response.data;
};

export const analyzeImageFile = async (file, category = 'tops') => {
  const formData = new FormData();
  formData.append('image', file);
  if (category) {
    formData.append('category', category);
  }
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeImageDataUrl = async (dataUrl, category = 'tops') => {
  const response = await api.post('/analyze', {
    image_data: dataUrl,
    category: category
  });
  return response.data;
};

export const analyzeSampleImage = async (sampleName, category = 'tops') => {
  const response = await api.post('/analyze', {
    sample_name: sampleName,
    category: category
  });
  return response.data;
};

export const getOutfitRecommendations = async (itemId, category, primaryColor) => {
  const response = await api.post('/recommend-outfit', {
    item_id: itemId,
    category,
    primary_color: primaryColor
  });
  return response.data;
};

export const getProductStyling = async (productId) => {
  const response = await api.get(`/products/${productId}/styling`);
  return response.data;
};

export default api;

