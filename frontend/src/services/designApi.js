/**
 * designApi.js - Design-specific API methods
 * All AI-related API calls are made FROM the backend.
 * This file only makes requests to OUR backend — never directly to OpenAI/Gemini.
 */
import api from './api';

/**
 * Generate a complete design (full AI pipeline).
 * Sends form data including optional photo uploads.
 * @param {Object} designData - Form data
 * @param {File[]} photos - Optional uploaded photos
 * @returns {Promise<Object>}
 */
export const generateDesign = async (designData, photos = []) => {
  const formData = new FormData();

  // Append text fields
  Object.entries(designData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Append array as JSON string for requirements
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  // Append photo files
  photos.forEach((photo) => {
    formData.append('photos', photo);
  });

  const response = await api.post('/ai/design', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Refine an existing design via chat message.
 * @param {string} designId
 * @param {string} message
 * @returns {Promise<Object>}
 */
export const refineDesign = async (designId, message) => {
  const response = await api.post(`/designs/${designId}/refine`, { message });
  return response.data;
};

/**
 * Get design history for the current session.
 * @param {Object} params - { page, limit }
 * @returns {Promise<Object>}
 */
export const getDesignHistory = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get('/designs', { params: { page, limit } });
  return response.data;
};

/**
 * Get a single design by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getDesignById = async (id) => {
  const response = await api.get(`/designs/${id}`);
  return response.data;
};

/**
 * Delete a design.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteDesign = async (id) => {
  const response = await api.delete(`/designs/${id}`);
  return response.data;
};

/**
 * Check API health.
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
