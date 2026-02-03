'use client';

import React, { useState } from 'react';
import { 
  Users, TrendingUp, Briefcase, Cake, Clock, 
  Calendar, Award, Star, LogOut, Edit, Sparkles, MapPin, 
  CheckCircle, X 
} from 'lucide-react';

import { CARD_CONFIG } from '@/components/preview/cardConfig';
import { NewHiresCard } from '@/components/preview/NewHiresCard';
import { PromotionsCard } from '@/components/preview/PromotionsCard';

import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { PeriodSelector } from '@/components/PeriodSelector';
import { EditorSection } from '@/components/editor/EditorSection';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { EmployeeCard } from '@/components/preview/EmployeeCard';
import { BirthdayCard } from '@/components/preview/BirthdayCard';
import { AllTimeNewsletterFeed } from '@/components/landing/AllTimeNewsletterFeed';
import { useNewsletterData } from '@/hooks/useNewsletterData';
import type { ViewMode } from '@/types/newsletter';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('preview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const {
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
    undo,
    redo,
    canUndo,
    canRedo
  } = useNewsletterData();

  const getActiveSections = () => {
    return Object.entries(newsletterData).filter(([key, value]) =>
      key !== 'month' && key !== 'year' && (
        (Array.isArray(value) && value.length > 0) ||
        (value !== null && typeof value === 'object')
      )
    ).length;
  };

  const exportToPDF = () => {
    window.print();
  };

  const handleViewChange = () => {
    if (!isAdmin) {
      setShowLogin(true);
      return;
    }
    setCurrentView(prev => (prev === 'editor' ? 'preview' : 'editor'));
  };

  const handleLogin = async (code: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode: code.trim() }),
      });

      const result = await response.json();

      if (result.valid) {
        setIsAdmin(true);
        setShowLogin(false);
        setLoginError('');
        setCurrentView('editor');
      } else {
        setLoginError(result.error || 'Incorrect passcode. Please try again or contact HR.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to verify passcode. Please check your connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-lg text-[#52275A]">Loading newsletter data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="fixed top-24 right-6 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-slide-in max-w-md">
          <X size={24} />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="ml-4 underline">Retry</button>
        </div>
      )}

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-slide-in">
          <CheckCircle size={24} />
          <span className="font-semibold">Data saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <Header
        month={newsletterData.month}
        year={newsletterData.year}
        currentView={currentView}
        totalEntries={getTotalEntries()}
        onViewChange={handleViewChange}
        onSave={saveData}
        onExport={exportToPDF}
        isAdmin={isAdmin}
        onRequestLogin={() => {
          setLoginError('');
          setShowLogin(true);
        }}
      />

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900">HR / Admin Access</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the shared HR passcode to unlock editing for this device.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const code = String(formData.get('code') ?? '');
                await handleLogin(code);
              }}
              className="space-y-3"
            >
              <input
                autoFocus
                type="password"
                name="code"
                placeholder="Enter HR passcode"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setLoginError('');
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#52275A]"
                >
                  {isLoggingIn ? 'Verifying...' : 'Unlock Editor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor Controls */}
      {currentView === 'editor' && (
        <div className="flex gap-3 items-center max-w-7xl mx-auto px-6 pt-6 pb-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-xl flex items-center gap-2 ${!canUndo ? 'bg-[#C2A2CB] text-[#52275A] opacity-60 cursor-not-allowed' : 'bg-[#52275A] text-white hover:opacity-90'}`}
            type="button"
            title="Undo"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H5v14h4M20 15a7 7 0 00-7-7H5" /></svg>
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-xl flex items-center gap-2 ${!canRedo ? 'bg-[#C2A2CB] text-[#52275A] opacity-60 cursor-not-allowed' : 'bg-[#52275A] text-white hover:opacity-90'}`}
            type="button"
            title="Redo"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19h4V5h-4M4 9a7 7 0 017-7h8" /></svg>
            Redo
          </button>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {currentView === 'editor' && isAdmin ? (
          <>
            {/* Stats Cards */}
            <StatsCards
              totalEntries={getTotalEntries()}
              activeSections={getActiveSections()}
              upcomingEvents={newsletterData.events.length}
            />

            {/* Period Selector */}
            <PeriodSelector
              month={newsletterData.month}
              year={newsletterData.year}
              onMonthChange={(month) => updatePeriod('month', month)}
              onYearChange={(year) => updatePeriod('year', year)}
            />

            {/* Editor Sections */}
            <EditorSection
              title="New Hires"
              icon={Users}
              category="newHires"
              items={newsletterData.newHires}
              color="blue"
              onAdd={() => addItem('newHires')}
              onUpdate={(id, field, value) => updateItem('newHires', id, field, value)}
              onRemove={(id) => removeItem('newHires', id)}
            />

            <EditorSection
              title="Promoted Employees"
              icon={TrendingUp}
              category="promotions"
              items={newsletterData.promotions}
              color="green"
              onAdd={() => addItem('promotions')}
              onUpdate={(id, field, value) => updateItem('promotions', id, field, value)}
              onRemove={(id) => removeItem('promotions', id)}
            />

            <EditorSection
              title="Transferred Employees"
              icon={Briefcase}
              category="transfers"
              items={newsletterData.transfers}
              showFromTo={true}
              color="purple"
              onAdd={() => addItem('transfers')}
              onUpdate={(id, field, value) => updateItem('transfers', id, field, value)}
              onRemove={(id) => removeItem('transfers', id)}
            />

            <EditorSection
              title="Upcoming Birthdays"
              icon={Cake}
              category="birthdays"
              items={newsletterData.birthdays}
              color="pink"
              onAdd={() => addItem('birthdays')}
              onUpdate={(id, field, value) => updateItem('birthdays', id, field, value)}
              onRemove={(id) => removeItem('birthdays', id)}
            />

            <EditorSection
              title="Work Anniversaries"
              icon={Clock}
              category="anniversaries"
              items={newsletterData.anniversaries}
              showAchievement={true}
              color="indigo"
              onAdd={() => addItem('anniversaries')}
              onUpdate={(id, field, value) => updateItem('anniversaries', id, field, value)}
              onRemove={(id) => removeItem('anniversaries', id)}
            />

            <EditorSection
              title="Upcoming Events"
              icon={Calendar}
              category="events"
              items={newsletterData.events}
              color="orange"
              onAdd={() => addItem('events')}
              onUpdate={(id, field, value) => updateItem('events', id, field, value)}
              onRemove={(id) => removeItem('events', id)}
            />

            <EditorSection
              title="Best Employee"
              icon={Award}
              category="bestEmployee"
              items={newsletterData.bestEmployee}
              showAchievement={true}
              isSingle={true}
              color="yellow"
              onAdd={() => addItem('bestEmployee')}
              onUpdate={(id, field, value) => updateItem('bestEmployee', id, field, value)}
              onRemove={() => removeItem('bestEmployee')}
            />

            <EditorSection
              title="Best Performer"
              icon={Star}
              category="bestPerformer"
              items={newsletterData.bestPerformer}
              showAchievement={true}
              isSingle={true}
              color="amber"
              onAdd={() => addItem('bestPerformer')}
              onUpdate={(id, field, value) => updateItem('bestPerformer', id, field, value)}
              onRemove={() => removeItem('bestPerformer')}
            />

            <EditorSection
              title="Exiting Employees"
              icon={LogOut}
              category="exitingEmployees"
              items={newsletterData.exitingEmployees}
              color="gray"
              onAdd={() => addItem('exitingEmployees')}
              onUpdate={(id, field, value) => updateItem('exitingEmployees', id, field, value)}
              onRemove={(id) => removeItem('exitingEmployees', id)}
            />

            {/* Clear All Button */}
            {getTotalEntries() > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={clearAllData}
                  className="px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all border-2 hover:opacity-90 bg-[#52275A] text-white border-[#6E3371]"
                  type="button"
                >
                  <X size={20} />
                  Clear All Data
                </button>
              </div>
            )}
          </>
        ) : (
          <AllTimeNewsletterFeed />
        )}
      </div>
    </div>
  );
}
