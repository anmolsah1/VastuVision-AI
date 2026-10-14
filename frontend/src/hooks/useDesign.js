/**
 * useDesign.js - Custom hook for design operations
 * Wraps the DesignContext and API calls with loading/error state management.
 */
import { useCallback } from 'react';
import { useDesignContext } from '../context/DesignContext';
import { generateDesign, refineDesign, getDesignHistory, getDesignById, deleteDesign } from '../services/designApi';
import { useNavigate } from 'react-router-dom';

export const useDesign = () => {
  const context = useDesignContext();
  const { dispatch, updateProgress } = context;
  const navigate = useNavigate();

  /**
   * Generate a complete new design from user inputs.
   */
  const handleGenerateDesign = useCallback(async (formData, photos) => {
    dispatch({ type: 'START_GENERATION' });

    // Simulate progress stages
    const stages = [
      { stage: 'analyzing', message: 'Analyzing your space and requirements...', percent: 15, delay: 500 },
      { stage: 'vastu', message: 'Applying Vastu Shastra considerations...', percent: 35, delay: 2000 },
      { stage: 'planning', message: 'Planning furniture and spatial layout...', percent: 55, delay: 3500 },
      { stage: 'image', message: 'Creating 6-view visual concept...', percent: 75, delay: 5000 },
    ];

    // Start progress animation
    const progressTimers = stages.map(({ stage, message, percent, delay }) =>
      setTimeout(() => {
        dispatch({ type: 'UPDATE_PROGRESS', payload: { stage, message, percent } });
      }, delay)
    );

    try {
      const result = await generateDesign(formData, photos);

      // Clear timers
      progressTimers.forEach(clearTimeout);

      if (result.success) {
        dispatch({
          type: 'GENERATION_SUCCESS',
          payload: {
            designSpec: result.data.designSpec,
            designId: result.data.designId,
            imageUrl: result.data.imageUrl,
            isMockData: result.data.isMockData,
            mockModeEnabled: result.data.mockModeEnabled,
          },
        });

        // Navigate to result page
        if (result.data.designId) {
          navigate(`/design/${result.data.designId}`);
        } else {
          navigate('/design/result');
        }
      }
    } catch (error) {
      progressTimers.forEach(clearTimeout);
      dispatch({ type: 'GENERATION_ERROR', payload: error.message });
    }
  }, [dispatch, navigate]);

  /**
   * Refine an existing design.
   */
  const handleRefineDesign = useCallback(async (designId, message) => {
    dispatch({ type: 'START_REFINEMENT' });
    dispatch({ type: 'ADD_USER_MESSAGE', payload: message });

    try {
      const result = await refineDesign(designId, message);

      if (result.success) {
        dispatch({
          type: 'REFINEMENT_SUCCESS',
          payload: {
            designSpec: result.data.designSpec,
            imageUrl: result.data.imageUrl,
            isMockData: result.data.isMockData,
            userMessage: message,
            assistantMessage: result.data.designSpec?.projectSummary || 'Design updated successfully.',
          },
        });
      }
    } catch (error) {
      dispatch({ type: 'REFINEMENT_ERROR', payload: error.message });
    }
  }, [dispatch]);

  /**
   * Load design history from API.
   */
  const loadHistory = useCallback(async (page = 1) => {
    dispatch({ type: 'SET_HISTORY_LOADING', payload: true });
    try {
      const result = await getDesignHistory({ page });
      if (result.success) {
        dispatch({ type: 'SET_HISTORY', payload: result.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_HISTORY_LOADING', payload: false });
    }
  }, [dispatch]);

  /**
   * Load a specific design.
   */
  const loadDesign = useCallback(async (id) => {
    try {
      const result = await getDesignById(id);
      if (result.success) {
        dispatch({ type: 'LOAD_DESIGN', payload: { design: result.data } });
        return result.data;
      }
    } catch (error) {
      dispatch({ type: 'GENERATION_ERROR', payload: error.message });
    }
  }, [dispatch]);

  /**
   * Delete a design.
   */
  const handleDeleteDesign = useCallback(async (id) => {
    try {
      await deleteDesign(id);
      // Reload history after deletion
      await loadHistory();
      return true;
    } catch (error) {
      return false;
    }
  }, [loadHistory]);

  return {
    ...context,
    handleGenerateDesign,
    handleRefineDesign,
    loadHistory,
    loadDesign,
    handleDeleteDesign,
  };
};
