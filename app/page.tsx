'use client';

import React, { useState } from 'react';
import { 
  Users, TrendingUp, Briefcase, Cake, Clock, 
  Calendar, Award, Star, LogOut, Edit, Sparkles, 
  CheckCircle, X 
} from 'lucide-react';

import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { PeriodSelector } from '@/components/PeriodSelector';
import { EditorSection } from '@/components/editor/EditorSection';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { EmployeeCard } from '@/components/preview/EmployeeCard';
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
            <p style={{ color: '#52275A' }} className="font-semibold text-lg">Loading newsletter data...</p>
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
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#52275A' }}
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
            style={canUndo ? { backgroundColor: '#52275A', color: '#FFFFFF' } : { backgroundColor: '#C2A2CB', color: '#52275A', opacity: 0.6 }}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-xl flex items-center gap-2 ${!canUndo ? 'cursor-not-allowed' : 'hover:opacity-90'}`}
            type="button"
            title="Undo"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H5v14h4M20 15a7 7 0 00-7-7H5" /></svg>
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            style={canRedo ? { backgroundColor: '#FFD058', color: '#52275A' } : { backgroundColor: '#FFF9E5', color: '#6E3371', opacity: 0.6 }}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-xl flex items-center gap-2 ${!canRedo ? 'cursor-not-allowed' : 'hover:opacity-90'}`}
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
                  style={{ backgroundColor: '#52275A', color: '#FFFFFF', borderColor: '#6E3371' }}
                  className="px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all border-2 hover:opacity-90"
                  type="button"
                >
                  <X size={20} />
                  Clear All Data
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {getTotalEntries() === 0 ? (
              <div style={{ backgroundColor: '#F7EED7', borderColor: '#6E3371' }} className="p-16 rounded-3xl shadow-xl text-center border-2 border-dashed">
                <div style={{ background: 'linear-gradient(to bottom right, #52275A, #FFD058)' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Sparkles className="text-white" size={48} />
                </div>
                <h3 style={{ color: '#52275A' }} className="text-2xl font-bold mb-3">No Content Yet</h3>
                <p style={{ color: '#6E3371' }} className="mb-6 font-medium">Start by switching to Edit mode and adding your first entry!</p>
                <button
                  onClick={() => setCurrentView('editor')}
                  style={{ background: 'linear-gradient(to right, #52275A, #6E3371)', color: '#FFFFFF', borderColor: '#6E3371' }}
                  className="px-8 py-3 rounded-2xl font-bold inline-flex items-center gap-2 shadow-xl border-2 hover:opacity-90"
                  type="button"
                >
                  <Edit size={20} />
                  Go to Editor
                </button>
              </div>
            ) : (
              <>
                {/* Preview Sections */}
                {newsletterData.newHires.length > 0 && (
                  <PreviewSection title="Welcome to Our New Hires!" icon={Users} gradient="from-blue-500 to-blue-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.newHires.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.promotions.length > 0 && (
                  <PreviewSection title="Congratulations on Your Promotions!" icon={TrendingUp} gradient="from-green-500 to-green-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.promotions.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.transfers.length > 0 && (
                  <PreviewSection title="Employee Transfers" icon={Briefcase} gradient="from-purple-500 to-purple-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.transfers.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.birthdays.length > 0 && (
                  <PreviewSection title="Upcoming Birthdays 🎂" icon={Cake} gradient="from-pink-500 to-pink-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.birthdays.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.anniversaries.length > 0 && (
                  <PreviewSection title="Work Anniversaries" icon={Clock} gradient="from-indigo-500 to-indigo-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.anniversaries.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.events.length > 0 && (
                  <PreviewSection title="Upcoming Events" icon={Calendar} gradient="from-orange-500 to-orange-700">
                    <div className="space-y-4">
                      {newsletterData.events.slice().reverse().map(event => (
                        <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-orange-100">
                          <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0 shadow-md">
                              <Calendar className="text-white" size={32} />
                            </div>
                            <div className="flex-1 pt-1">
                              <h4 className="font-serif font-bold text-2xl text-gray-900 mb-2">{event.title}</h4>
                              <p className="text-orange-600 font-medium text-sm mb-3 flex items-center gap-2">
                                <Calendar size={16} />
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {newsletterData.bestEmployee && (
                  <PreviewSection title="Employee of the Month ⭐" icon={Award} gradient="from-yellow-400 to-yellow-600">
                    <EmployeeCard employee={newsletterData.bestEmployee} showDate={false} />
                  </PreviewSection>
                )}

                {newsletterData.bestPerformer && (
                  <PreviewSection title="Best Performer 🏆" icon={Star} gradient="from-amber-500 to-amber-700">
                    <EmployeeCard employee={newsletterData.bestPerformer} showDate={false} />
                  </PreviewSection>
                )}

                {newsletterData.exitingEmployees.length > 0 && (
                  <PreviewSection title="Farewell & Best Wishes" icon={LogOut} gradient="from-gray-500 to-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {newsletterData.exitingEmployees.slice().reverse().map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  </PreviewSection>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
