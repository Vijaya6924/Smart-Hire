/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './AuthContext';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) return null;

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
