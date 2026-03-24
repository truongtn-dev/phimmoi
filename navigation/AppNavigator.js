import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchScreen from '../screens/WatchScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WatchHistoryScreen from '../screens/WatchHistoryScreen';
import ReportScreen from '../screens/ReportScreen';
import AdminScreen from '../screens/AdminScreen';
import AdminCommentsScreen from '../screens/AdminCommentsScreen';
import AdminMoviesScreen from '../screens/AdminMoviesScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminCategoriesScreen from '../screens/AdminCategoriesScreen';
import AdminRatingsScreen from '../screens/AdminRatingsScreen';
import * as Icons from '../components/common/icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const darkHeader = {
  headerStyle: { backgroundColor: COLORS.background },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};

// ============ MAIN TABS (for regular users) ============
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...darkHeader,
        tabBarStyle: { backgroundColor: COLORS.background, borderTopColor: COLORS.border, borderTopWidth: 0.5, height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 4 },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false, tabBarLabel: 'Trang chủ', tabBarIcon: ({ color }) => <Icons.HomeIcon size={24} color={color} /> }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Tìm Kiếm', ...darkHeader, tabBarLabel: 'Tìm kiếm', tabBarIcon: ({ color }) => <Icons.Search size={24} color={color} /> }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} options={{ title: 'Yêu Thích', ...darkHeader, tabBarLabel: 'Yêu thích', tabBarIcon: ({ color }) => <Icons.Heart size={24} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Tài Khoản', ...darkHeader, tabBarLabel: 'Tài khoản', tabBarIcon: ({ color }) => <Icons.User size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

// ============ APP STACK (user role) ============
function AppStack() {
  return (
    <Stack.Navigator screenOptions={darkHeader}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Chi Tiết Phim' }} />
      <Stack.Screen name="Watch" component={WatchScreen} options={{ title: 'Xem Phim' }} />
      <Stack.Screen name="WatchHistory" component={WatchHistoryScreen} options={{ title: 'Lịch Sử Xem' }} />
      <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Báo Cáo' }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Quản Trị' }} />
      <Stack.Screen name="AdminComments" component={AdminCommentsScreen} options={{ title: 'Quản Lý Bình Luận' }} />
      <Stack.Screen name="AdminMovies" component={AdminMoviesScreen} options={{ title: 'Quản Lý Phim' }} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Quản Lý Thể Loại' }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Quản Lý Người Dùng' }} />
      <Stack.Screen name="AdminRatings" component={AdminRatingsScreen} options={{ title: 'Quản Lý Đánh Giá' }} />
      
      {/* Auth screens accessible from inside the app */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ============ ROOT NAVIGATOR ============
export default function AppNavigator() {
  const { loading } = useAuth(); // removed user since we always render AppStack

  if (loading) {
    return (
      <View style={loadStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={loadStyles.text}>Đang tải...</Text>
      </View>
    );
  }

  // Everyone sees the Main App (Home first)
  return <AppStack />;
}

const loadStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: COLORS.textSecondary, marginTop: 12, fontSize: FONT.sm },
});

