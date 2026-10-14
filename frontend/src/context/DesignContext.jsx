/**
 * DesignContext.jsx - Global design state management
 * Uses React Context + useReducer for predictable state updates.
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const DesignContext = createContext(null);

// ── State Shape ───────────────────────────────────────────────────────────────

const initialState = {
  // Current design being worked on
  currentDesign: null,
  currentDesignId: null,
  currentImageUrl: null,
  currentViews: [],

  // Pipeline state
  isGenerating: false,
  isRefining: false,
  progress: { stage: 'idle', message: '', percent: 0 },
  error: null,

  // Design history (loaded from API)
  history: [],
  historyLoading: false,
  historyTotal: 0,
  historyPage: 1,

  // Chat/refinement conversation
  conversation: [],

  // Mock mode info (shown to user)
  isMockData: false,
  mockModeEnabled: false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

const designReducer = (state, action) => {
  switch (action.type) {
    case 'START_GENERATION':
      return {
        ...state,
        isGenerating: true,
        error: null,
        progress: { stage: 'start', message: 'Starting AI analysis...', percent: 0 },
        currentDesign: null,
        currentImageUrl: null,
        conversation: [],
      };

    case 'UPDATE_PROGRESS':
      return { ...state, progress: action.payload };

    case 'GENERATION_SUCCESS':
      return {
        ...state,
        isGenerating: false,
        currentDesign: action.payload.designSpec,
        currentDesignId: action.payload.designId,
        currentImageUrl: action.payload.imageUrl,
        currentViews: action.payload.views || action.payload.designSpec?.views || [],
        isMockData: action.payload.isMockData,
        mockModeEnabled: action.payload.mockModeEnabled,
        progress: { stage: 'complete', message: 'Design ready!', percent: 100 },
        error: null,
      };

    case 'GENERATION_ERROR':
      return {
        ...state,
        isGenerating: false,
        error: action.payload,
        progress: { stage: 'error', message: 'Generation failed.', percent: 0 },
      };

    case 'START_REFINEMENT':
      return { ...state, isRefining: true, error: null };

    case 'REFINEMENT_SUCCESS':
      return {
        ...state,
        isRefining: false,
        currentDesign: action.payload.designSpec,
        currentImageUrl: action.payload.imageUrl,
        currentViews: action.payload.views || action.payload.designSpec?.views || state.currentViews,
        isMockData: action.payload.isMockData,
        conversation: [
          ...state.conversation,
          { role: 'user', content: action.payload.userMessage, timestamp: new Date() },
          { role: 'assistant', content: action.payload.assistantMessage, timestamp: new Date() },
        ],
        error: null,
      };

    case 'REFINEMENT_ERROR':
      return { ...state, isRefining: false, error: action.payload };

    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        conversation: [...state.conversation, { role: 'user', content: action.payload, timestamp: new Date() }],
      };

    case 'SET_HISTORY':
      return {
        ...state,
        history: action.payload.designs,
        historyTotal: action.payload.total,
        historyPage: action.payload.page,
        historyLoading: false,
      };

    case 'SET_HISTORY_LOADING':
      return { ...state, historyLoading: action.payload };

    case 'LOAD_DESIGN':
      return {
        ...state,
        currentDesign: action.payload.design,
        currentDesignId: action.payload.design._id,
        currentImageUrl: action.payload.design.generatedImages?.[action.payload.design.generatedImages.length - 1]?.url,
        conversation: action.payload.design.conversationHistory || [],
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'NEW_DESIGN':
      return {
        ...state,
        currentDesign: null,
        currentDesignId: null,
        currentImageUrl: null,
        error: null,
        progress: { stage: 'idle', message: '', percent: 0 },
        conversation: [],
        isMockData: false,
      };

    default:
      return state;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const DesignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(designReducer, initialState);

  // Progress stages for the UI
  const progressStages = [
    { id: 'start', label: 'Starting AI Analysis', icon: '🚀' },
    { id: 'analyzing', label: 'Analyzing Your Space', icon: '🔍' },
    { id: 'vastu', label: 'Applying Vastu Shastra', icon: '🕉️' },
    { id: 'planning', label: 'Planning Furniture Layout', icon: '📐' },
    { id: 'image', label: 'Creating 6-View Visualization', icon: '🎨' },
    { id: 'complete', label: 'Design Ready!', icon: '✨' },
  ];

  const updateProgress = useCallback((stage, message, percent) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { stage, message, percent } });
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const startNewDesign = useCallback(() => dispatch({ type: 'NEW_DESIGN' }), []);

  return (
    <DesignContext.Provider
      value={{
        ...state,
        dispatch,
        progressStages,
        updateProgress,
        clearError,
        startNewDesign,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useDesignContext = () => {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesignContext must be used within <DesignProvider>');
  return ctx;
};

export default DesignContext;
