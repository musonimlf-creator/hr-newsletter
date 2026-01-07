import { useState, useEffect, useCallback } from 'react';
import type { NewsletterData, CategoryKey, Employee, Event } from '@/types/newsletter';

export function useNewsletterData() {
  // --- Newsletter Version History ---
  const [history, setHistory] = useState<NewsletterData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const [newsletterData, setNewsletterData] = useState<NewsletterData>({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    newHires: [],
    promotions: [],
    transfers: [],
    birthdays: [],
    anniversaries: [],
    events: [],
    bestEmployee: null,
    bestPerformer: null,
    exitingEmployees: []
  });

  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const month = newsletterData.month;
        const year = newsletterData.year;
        const response = await fetch(`/api/newsletter?month=${encodeURIComponent(month)}&year=${year}`);
        
        if (!response.ok) {
          throw new Error('Failed to load newsletter data');
        }
        
        const result = await response.json();
        if (result.data) {
          setNewsletterData(result.data);
        }
      } catch (err: any) {
        console.error('Error loading newsletter data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Load once on mount

  // Reload data when month/year changes
  const reloadData = useCallback(async (month: string, year: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/newsletter?month=${encodeURIComponent(month)}&year=${year}`);
      
      if (!response.ok) {
        throw new Error('Failed to load newsletter data');
      }
      
      const result = await response.json();
      if (result.data) {
        setNewsletterData(result.data);
        // Reset history when loading new period
        setHistory([]);
        setHistoryStep(-1);
      }
    } catch (err: any) {
      console.error('Error loading newsletter data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Track history
  useEffect(() => {
    if (historyStep < 0 || JSON.stringify(newsletterData) !== JSON.stringify(history[historyStep])) {
      setHistory(prev => [...prev.slice(0, historyStep + 1), { ...newsletterData }]);
      setHistoryStep(prev => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletterData]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(step => step - 1);
      setNewsletterData({ ...history[historyStep - 1] });
    }
  }, [history, historyStep]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(step => step + 1);
      setNewsletterData({ ...history[historyStep + 1] });
    }
  }, [history, historyStep]);

  // Save data to database
  const saveData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: newsletterData.month,
          year: newsletterData.year,
          data: newsletterData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save newsletter data');
      }

      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    } catch (err: any) {
      console.error('Error saving newsletter data:', err);
      setError(err.message || 'Failed to save data');
      alert(`Failed to save: ${err.message}`);
    }
  }, [newsletterData]);

  // Add item with validation
  const addItem = useCallback((category: CategoryKey) => {
    const newItem: Employee = {
      id: Date.now().toString(),
      name: '',
      position: '',
      department: '',
      date: '',
      comments: [],
    };

    setNewsletterData(prev => {
      // Prevent more than one 'Best Employee' or 'Best Performer'
      if ((category === 'bestEmployee' || category === 'bestPerformer') && prev[category]) {
        alert('Only one '+category.replace(/([A-Z])/g, ' $1')+' allowed per period.');
        return prev;
      }
      if (category === 'events') {
        return {
          ...prev,
          events: [...prev.events, {
            id: Date.now().toString(),
            title: '',
            date: '',
            description: ''
          }]
        };
      } else if (category === 'bestEmployee' || category === 'bestPerformer') {
        return {
          ...prev,
          [category]: { ...newItem, achievement: '' }
        };
      } else {
        // Optional: Prevent duplicate empty items
        if ((prev[category] as Employee[]).some(e => !e.name)) {
          alert('Please fill in the previous empty entry before adding another.');
          return prev;
        }
        return {
          ...prev,
          [category]: [...(prev[category] as Employee[]), newItem]
        };
      }
    });
  }, []);

  // Update item
  const updateItem = useCallback((category: CategoryKey, id: string, field: string, value: string) => {
    setNewsletterData(prev => {
      if (category === 'bestEmployee' || category === 'bestPerformer') {
        return {
          ...prev,
          [category]: { ...(prev[category] as Employee), [field]: value }
        };
      } else if (category === 'events') {
        return {
          ...prev,
          events: prev.events.map(item =>
            item.id === id ? { ...item, [field]: value } : item
          )
        };
      } else {
        return {
          ...prev,
          [category]: (prev[category] as Employee[]).map(item =>
            item.id === id ? { ...item, [field]: value } : item
          )
        };
      }
    });
  }, []);

  // Remove item
  const removeItem = useCallback((category: CategoryKey, id?: string) => {
    setNewsletterData(prev => {
      if (category === 'bestEmployee' || category === 'bestPerformer') {
        return { ...prev, [category]: null };
      } else if (id) {
        return {
          ...prev,
          [category]: (prev[category] as any[]).filter(item => item.id !== id)
        };
      }
      return prev;
    });
  }, []);

  // Clear all data
  const clearAllData = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear all newsletter data? This cannot be undone.')) {
      const emptyData: NewsletterData = {
        month: newsletterData.month,
        year: newsletterData.year,
        newHires: [],
        promotions: [],
        transfers: [],
        birthdays: [],
        anniversaries: [],
        events: [],
        bestEmployee: null,
        bestPerformer: null,
        exitingEmployees: []
      };
      setNewsletterData(emptyData);
      // Save empty data to database
      await saveData();
    }
  }, [newsletterData.month, newsletterData.year, saveData]);

  // Update period
  const updatePeriod = useCallback(async (field: 'month' | 'year', value: string) => {
    const newMonth = field === 'month' ? value : newsletterData.month;
    const newYear = field === 'year' ? value : newsletterData.year;
    
    setNewsletterData(prev => ({ ...prev, [field]: value }));
    
    // Reload data for the new period
    await reloadData(newMonth, newYear);
  }, [newsletterData.month, newsletterData.year, reloadData]);

  // Get total entries
  const getTotalEntries = useCallback(() => {
    return (
      newsletterData.newHires.length +
      newsletterData.promotions.length +
      newsletterData.transfers.length +
      newsletterData.birthdays.length +
      newsletterData.anniversaries.length +
      newsletterData.events.length +
      newsletterData.exitingEmployees.length +
      (newsletterData.bestEmployee ? 1 : 0) +
      (newsletterData.bestPerformer ? 1 : 0)
    );
  }, [newsletterData]);

  return {
    newsletterData,
    showSaveNotification,
    isLoading,
    error,
    saveData,
    addItem,
    updateItem,
    removeItem,
    clearAllData,
    updatePeriod,
    getTotalEntries,
    // Versioning/undo
    canUndo: historyStep > 0,
    canRedo: historyStep < history.length - 1,
    undo,
    redo,
  };
}
