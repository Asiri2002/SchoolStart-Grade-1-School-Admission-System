import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../src/style/authStyles';
import { getAuthData } from '../src/storage/authStorage';
import { logoutUser } from '../src/services/authService';

export default function ParentDashboardScreen() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await getAuthData();

        if (stored) {
          setUserData(stored);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome Back,
            </Text>

            <Text style={styles.username}>
              {userData?.username || 'Parent User'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={COLORS.error}
            />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle"
              size={48}
              color={COLORS.primary}
            />

            <View style={styles.userInfo}>
              <Text style={styles.cardTitle}>
                {userData?.username || 'Parent Profile'}
              </Text>

              <Text style={styles.cardSubtitle}>
                {userData?.email || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Role */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Role:
            </Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {userData?.role || 'ROLE_PARENT'}
              </Text>
            </View>
          </View>

          {/* User ID */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              User ID:
            </Text>

            <Text style={styles.infoValue}>
              {userData?.userId || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Portal Section */}
        <Text style={styles.sectionTitle}>
          Grade 1 Admission Portal
        </Text>

        {/* Modules */}
        <View style={styles.grid}>
          {/* Applications */}
          <TouchableOpacity
            style={styles.gridItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name="document-text-outline"
              size={32}
              color={COLORS.primary}
            />

            <Text style={styles.gridItemTitle}>
              Applications
            </Text>

            <Text style={styles.gridItemSub}>
              Track & Apply
            </Text>
          </TouchableOpacity>

          {/* Children */}
          <TouchableOpacity
            style={styles.gridItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name="people-outline"
              size={32}
              color={COLORS.primary}
            />

            <Text style={styles.gridItemTitle}>
              Children
            </Text>

            <Text style={styles.gridItemSub}>
              Manage Profile
            </Text>
          </TouchableOpacity>

          {/* Schools */}
          <TouchableOpacity
            style={styles.gridItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name="school-outline"
              size={32}
              color={COLORS.primary}
            />

            <Text style={styles.gridItemTitle}>
              Schools
            </Text>

            <Text style={styles.gridItemSub}>
              Search & Details
            </Text>
          </TouchableOpacity>

          {/* Documents */}
          <TouchableOpacity
            style={styles.gridItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={COLORS.primary}
            />

            <Text style={styles.gridItemTitle}>
              Documents
            </Text>

            <Text style={styles.gridItemSub}>
              Upload Verification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },

  greeting: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  username: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 2,
  },

  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userInfo: {
    marginLeft: 12,
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    maxWidth: '65%',
  },

  badge: {
    backgroundColor: '#E0EDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },

  gridItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 10,
  },

  gridItemSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

