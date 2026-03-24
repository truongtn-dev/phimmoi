import 'expo';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CommentsProvider } from './context/CommentsContext';
import { ReportsProvider } from './context/ReportsContext';
import AppNavigator from './navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CommentsProvider>
          <ReportsProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </QueryClientProvider>
          </ReportsProvider>
        </CommentsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
