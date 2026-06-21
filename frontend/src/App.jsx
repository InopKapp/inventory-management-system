import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import ClientStorefront from './ClientStoreFront';
import ClientStore from './ClientStore';
import ClientOrders from './ClientOrders';
import ClientSettings from './ClientSettings';
import DealerDashboard from './DealerDashboard';
import DealerCatalog from './DealerCatalog';
import DealerOrders from './DealerOrders';
import DealerPerformance from './DealerPerformance';
import AdminDashboard from './AdminDashboard';
import AdminInventory from './AdminInventory';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import './App.css';
import Header from './Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route index element={<Navigate to="inventory" replace />} />
        </Route>
        <Route path="/client" element={
          <ProtectedRoute requiredRole="client">
            <ClientStorefront />
          </ProtectedRoute>
        }>
          <Route path="store" element={<ClientStore />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="settings" element={<ClientSettings />} />
          <Route index element={<Navigate to="store" replace />} />
        </Route>
        <Route path="/dealer" element={
          <ProtectedRoute requiredRole="dealer">
            <DealerDashboard />
          </ProtectedRoute>
        }>
          <Route path="catalog" element={<DealerCatalog />} />
          <Route path="orders" element={<DealerOrders />} />
          <Route path="performance" element={<DealerPerformance />} />
          <Route index element={<Navigate to="catalog" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
