import { useCallback } from 'react';
import { Campaign, SearchFilters, PaginationInfo, CampaignMetrics, Lead } from '../types';
import { api, ApiError } from '../services/api';
import { useApp, useNotifications } from '../contexts/AppContext';

export const useCampaigns = () => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();

  // Get campaigns with filters and pagination
  const fetchCampaigns = useCallback(async (
    filters?: SearchFilters,
    pagination?: Partial<PaginationInfo>
  ) => {
    dispatch({ type: 'SET_CAMPAIGNS_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await api.campaigns.getCampaigns(filters, pagination);
      dispatch({ type: 'SET_CAMPAIGNS', payload: response.campaigns });
      return response;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch campaigns';
      dispatch({ type: 'SET_ERROR', payload: message });
      showNotification(message, 'error');
      throw error;
    } finally {
      dispatch({ type: 'SET_CAMPAIGNS_LOADING', payload: false });
    }
  }, [dispatch, showNotification]);

  // Get single campaign
  const fetchCampaign = useCallback(async (id: string) => {
    try {
      const campaign = await api.campaigns.getCampaign(id);
      return campaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [showNotification]);

  // Create new campaign
  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    try {
      const newCampaign = await api.campaigns.createCampaign(campaignData);
      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
      showNotification('Campaign created successfully', 'success');
      return newCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to create campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Update campaign
  const updateCampaign = useCallback(async (id: string, campaignData: Partial<Campaign>) => {
    try {
      const updatedCampaign = await api.campaigns.updateCampaign(id, campaignData);
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, data: updatedCampaign } });
      showNotification('Campaign updated successfully', 'success');
      return updatedCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to update campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Delete campaign
  const deleteCampaign = useCallback(async (id: string) => {
    try {
      await api.campaigns.deleteCampaign(id);
      dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
      showNotification('Campaign deleted successfully', 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to delete campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Duplicate campaign
  const duplicateCampaign = useCallback(async (id: string) => {
    try {
      const duplicatedCampaign = await api.campaigns.duplicateCampaign(id);
      dispatch({ type: 'ADD_CAMPAIGN', payload: duplicatedCampaign });
      showNotification('Campaign duplicated successfully', 'success');
      return duplicatedCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to duplicate campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Start campaign
  const startCampaign = useCallback(async (id: string) => {
    try {
      const updatedCampaign = await api.campaigns.startCampaign(id);
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, data: updatedCampaign } });
      showNotification('Campaign started successfully', 'success');
      return updatedCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to start campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Pause campaign
  const pauseCampaign = useCallback(async (id: string) => {
    try {
      const updatedCampaign = await api.campaigns.pauseCampaign(id);
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, data: updatedCampaign } });
      showNotification('Campaign paused successfully', 'success');
      return updatedCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to pause campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Stop campaign
  const stopCampaign = useCallback(async (id: string) => {
    try {
      const updatedCampaign = await api.campaigns.stopCampaign(id);
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, data: updatedCampaign } });
      showNotification('Campaign stopped successfully', 'success');
      return updatedCampaign;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to stop campaign';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Get campaign metrics
  const fetchCampaignMetrics = useCallback(async (id: string) => {
    try {
      const metrics = await api.campaigns.getCampaignMetrics(id);
      return metrics;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch campaign metrics';
      showNotification(message, 'error');
      throw error;
    }
  }, [showNotification]);

  // Get campaign leads
  const fetchCampaignLeads = useCallback(async (
    id: string,
    pagination?: Partial<PaginationInfo>
  ) => {
    try {
      const response = await api.campaigns.getCampaignLeads(id, pagination);
      return response;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch campaign leads';
      showNotification(message, 'error');
      throw error;
    }
  }, [showNotification]);

  // Bulk actions
  const bulkStartCampaigns = useCallback(async (ids: string[]) => {
    try {
      const promises = ids.map(id => startCampaign(id));
      await Promise.all(promises);
      showNotification(`${ids.length} campaigns started successfully`, 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to start campaigns';
      showNotification(message, 'error');
      throw error;
    }
  }, [startCampaign, showNotification]);

  const bulkPauseCampaigns = useCallback(async (ids: string[]) => {
    try {
      const promises = ids.map(id => pauseCampaign(id));
      await Promise.all(promises);
      showNotification(`${ids.length} campaigns paused successfully`, 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to pause campaigns';
      showNotification(message, 'error');
      throw error;
    }
  }, [pauseCampaign, showNotification]);

  const bulkDeleteCampaigns = useCallback(async (ids: string[]) => {
    try {
      const promises = ids.map(id => deleteCampaign(id));
      await Promise.all(promises);
      showNotification(`${ids.length} campaigns deleted successfully`, 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to delete campaigns';
      showNotification(message, 'error');
      throw error;
    }
  }, [deleteCampaign, showNotification]);

  // Helper functions
  const getCampaignById = useCallback((id: string) => {
    return state.campaigns.find(campaign => campaign.id === id);
  }, [state.campaigns]);

  const getActiveCampaigns = useCallback(() => {
    return state.campaigns.filter(campaign => campaign.status === 'active');
  }, [state.campaigns]);

  const getPausedCampaigns = useCallback(() => {
    return state.campaigns.filter(campaign => campaign.status === 'paused');
  }, [state.campaigns]);

  const getDraftCampaigns = useCallback(() => {
    return state.campaigns.filter(campaign => campaign.status === 'draft');
  }, [state.campaigns]);

  return {
    // State
    campaigns: state.campaigns,
    loading: state.campaignsLoading,
    error: state.error,
    
    // Actions
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    startCampaign,
    pauseCampaign,
    stopCampaign,
    fetchCampaignMetrics,
    fetchCampaignLeads,
    
    // Bulk actions
    bulkStartCampaigns,
    bulkPauseCampaigns,
    bulkDeleteCampaigns,
    
    // Helpers
    getCampaignById,
    getActiveCampaigns,
    getPausedCampaigns,
    getDraftCampaigns,
  };
};

export default useCampaigns;
