import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MasterQueuePage from './pages/MasterQueuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import CreateRequestModal from './components/CreateRequestModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import AssignRequestModal from './components/AssignRequestModal';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

export default function App() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'requests' | 'analytics' | 'settings'

  // Modals state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignTargetRequest, setAssignTargetRequest] = useState(null);

  // Data state
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', onDismissText = null) => {
    setToast({ message, type, onDismissText });
    if (!onDismissText) {
      setTimeout(() => setToast(null), 4000);
    }
  };

  // Fetch Requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getRequests({
        page,
        limit: rowsPerPage,
        search,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
        category: category !== 'All' ? category : undefined
      });

      if (res.success) {
        setRequests(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, status, priority, category]);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.getAnalyticsOverview();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchAnalytics();
    }
  }, [user, fetchRequests, fetchAnalytics]);

  // Handlers for Request actions
  const handleRequestCreated = (newReq, message) => {
    showToast(message || `Service Request ${newReq.ticketId} Created Successfully.`, 'success');
    fetchRequests();
    fetchAnalytics();
  };

  const handleRequestAssigned = (updatedReq, message) => {
    showToast(message || `Request ${updatedReq.ticketId} assigned successfully`, 'success');
    setSelectedRequest(updatedReq);
    fetchRequests();
    fetchAnalytics();
  };

  const handleStatusUpdated = (updatedReq, message) => {
    showToast(message || `Status Updated to ${updatedReq.status}`, 'success', 'Dismiss');
    setSelectedRequest(updatedReq);
    fetchRequests();
    fetchAnalytics();
  };

  const handleCommentAdded = (comment) => {
    showToast('Comment posted successfully', 'success');
    if (selectedRequest) {
      setSelectedRequest((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
    }
    fetchRequests();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    setPage(1);
  };

  // If user is not logged in, show Enterprise Login Page
  if (!user) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <LoginPage
          onLoginSuccess={() => {
            showToast('Authentication successful. Welcome back!', 'success', 'Dismiss');
          }}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Left Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenNewRequest={() => setIsNewRequestOpen(true)}
          searchQuery={search}
          onSearch={(query) => {
            setSearch(query);
            if (currentTab !== 'requests') setCurrentTab('requests');
          }}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0e17]">
          {currentTab === 'dashboard' && (
            <DashboardPage
              requests={requests}
              analytics={analytics}
              onOpenNewRequest={() => setIsNewRequestOpen(true)}
              onSelectRequest={(r) => setSelectedRequest(r)}
              onNavigateRequests={() => setCurrentTab('requests')}
            />
          )}

          {currentTab === 'requests' && (
            <MasterQueuePage
              requests={requests}
              pagination={pagination}
              search={search}
              status={status}
              priority={priority}
              category={category}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onCategoryChange={setCategory}
              onClearFilters={handleClearFilters}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              onSelectRequest={(r) => setSelectedRequest(r)}
              onOpenAssign={(r) => setAssignTargetRequest(r)}
              onOpenNewRequest={() => setIsNewRequestOpen(true)}
              onRefresh={fetchRequests}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage analytics={analytics} />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onRequestCreated={handleRequestCreated}
      />

      <RequestDetailsModal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onStatusUpdated={handleStatusUpdated}
        onCommentAdded={handleCommentAdded}
      />

      <AssignRequestModal
        isOpen={Boolean(assignTargetRequest)}
        onClose={() => setAssignTargetRequest(null)}
        request={assignTargetRequest}
        onAssigned={handleRequestAssigned}
      />
    </div>
  );
}

