import { useState, useCallback } from 'react';
import { Lead, SearchFilters, PaginationInfo, CSVUploadResult } from '../types';
import { api, ApiError } from '../services/api';
import { useApp, useNotifications } from '../contexts/AppContext';

export const useLeads = () => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Get leads with filters and pagination
  const fetchLeads = useCallback(async (
    filters?: SearchFilters,
    pagination?: Partial<PaginationInfo>
  ) => {
    dispatch({ type: 'SET_LEADS_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await api.leads.getLeads(filters, pagination);
      dispatch({ type: 'SET_LEADS', payload: response.leads });
      return response;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch leads';
      dispatch({ type: 'SET_ERROR', payload: message });
      showNotification(message, 'error');
      throw error;
    } finally {
      dispatch({ type: 'SET_LEADS_LOADING', payload: false });
    }
  }, [dispatch, showNotification]);

  // Get single lead
  const fetchLead = useCallback(async (id: string) => {
    try {
      const lead = await api.leads.getLead(id);
      return lead;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch lead';
      showNotification(message, 'error');
      throw error;
    }
  }, [showNotification]);

  // Create new lead
  const createLead = useCallback(async (leadData: Partial<Lead>) => {
    try {
      const newLead = await api.leads.createLead(leadData);
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      showNotification('Lead created successfully', 'success');
      return newLead;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to create lead';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Update lead
  const updateLead = useCallback(async (id: string, leadData: Partial<Lead>) => {
    try {
      const updatedLead = await api.leads.updateLead(id, leadData);
      dispatch({ type: 'UPDATE_LEAD', payload: { id, data: updatedLead } });
      showNotification('Lead updated successfully', 'success');
      return updatedLead;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to update lead';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Delete lead
  const deleteLead = useCallback(async (id: string) => {
    try {
      await api.leads.deleteLead(id);
      dispatch({ type: 'DELETE_LEAD', payload: id });
      showNotification('Lead deleted successfully', 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to delete lead';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Bulk delete leads
  const bulkDeleteLeads = useCallback(async (ids: string[]) => {
    try {
      await api.leads.bulkDeleteLeads(ids);
      ids.forEach(id => {
        dispatch({ type: 'DELETE_LEAD', payload: id });
      });
      showNotification(`${ids.length} leads deleted successfully`, 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to delete leads';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Upload leads from CSV
  const uploadLeads = useCallback(async (file: File): Promise<CSVUploadResult> => {
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await api.leads.uploadLeads(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add successfully uploaded leads to state
      if (result.leads && result.leads.length > 0) {
        result.leads.forEach(leadData => {
          if (leadData.id) {
            dispatch({ type: 'ADD_LEAD', payload: leadData as Lead });
          }
        });
      }
      
      showNotification(
        `Upload completed: ${result.validRows} leads imported, ${result.invalidRows} errors`,
        result.invalidRows > 0 ? 'warning' : 'success'
      );
      
      setTimeout(() => setUploadProgress(0), 2000);
      return result;
    } catch (error) {
      setUploadProgress(0);
      const message = error instanceof ApiError ? error.message : 'Failed to upload leads';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Enrich single lead
  const enrichLead = useCallback(async (id: string) => {
    try {
      const enrichedLead = await api.leads.enrichLead(id);
      dispatch({ type: 'UPDATE_LEAD', payload: { id, data: enrichedLead } });
      showNotification('Lead enriched successfully', 'success');
      return enrichedLead;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to enrich lead';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Bulk enrich leads
  const bulkEnrichLeads = useCallback(async (ids: string[]) => {
    try {
      const response = await api.leads.bulkEnrichLeads(ids);
      response.results.forEach(enrichedLead => {
        dispatch({ type: 'UPDATE_LEAD', payload: { id: enrichedLead.id, data: enrichedLead } });
      });
      showNotification(`${response.results.length} leads enriched successfully`, 'success');
      return response.results;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to enrich leads';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Import from LinkedIn
  const importFromLinkedIn = useCallback(async (url: string) => {
    try {
      const newLead = await api.leads.importFromLinkedIn(url);
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      showNotification('Lead imported from LinkedIn successfully', 'success');
      return newLead;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to import from LinkedIn';
      showNotification(message, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  // Export leads
  const exportLeads = useCallback(async (filters?: SearchFilters) => {
    try {
      const blob = await api.leads.exportLeads(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification('Leads exported successfully', 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to export leads';
      showNotification(message, 'error');
      throw error;
    }
  }, [showNotification]);

  return {
    // State
    leads: state.leads,
    loading: state.leadsLoading,
    error: state.error,
    uploadProgress,
    
    // Actions
    fetchLeads,
    fetchLead,
    createLead,
    updateLead,
    deleteLead,
    bulkDeleteLeads,
    uploadLeads,
    enrichLead,
    bulkEnrichLeads,
    importFromLinkedIn,
    exportLeads,
  };
};

export default useLeads;
