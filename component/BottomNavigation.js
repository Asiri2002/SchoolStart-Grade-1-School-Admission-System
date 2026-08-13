import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../theme/colors';

const TABS = [
  {
    key: 'Home',
    icon: 'home',
    iconOutline: 'home-outline',
    route: '/ParentDashboardScreen',
  },
  {
    key: 'Applications',
    icon: 'document-text',
    iconOutline: 'document-text-outline',
    route: '/ApplicationsScreen',
  },
  {
    key: 'Children',
    icon: 'people',
    iconOutline: 'people-outline',
    route: '/ChildrenScreen',
  },
  {
    key: 'Profile',
    icon: 'person',
    iconOutline: 'person-outline',
    route: '/profileScreen',
  },
];

const BottomNavigation = ({
  activeTab = 'Home',
  onTabPress,
}) => {
  const handleTabPress = (tabKey) => {
    // If parent wants to handle the tab press
    if (onTabPress) {
      onTabPress(tabKey);
      return;
    }

    const selectedTab = TABS.find(
      (item) => item.key === tabKey
    );

    if (!selectedTab) {
      return;
    }

    // Already on this screen
    if (activeTab === tabKey) {
      return;
    }

    // Expo Router navigation
    router.replace(selectedTab.route);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={tab.key}
            accessibilityState={{
              selected: isActive,
            }}
          >
            <Ionicons
              name={
                isActive
                  ? tab.icon
                  : tab.iconOutline
              }
              size={24}
              color={
                isActive
                  ? COLORS.primary
                  : COLORS.textMuted
              }
            />

            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
              ]}
            >
              {tab.key}
            </Text>

            {isActive && (
              <View style={styles.activeDot} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    backgroundColor: COLORS.card,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,

    paddingTop: 10,

    paddingBottom:
      Platform.OS === 'ios' ? 20 : 10,

    // Fix React Native Web shadow warning
    boxShadow:
      '0px -3px 8px rgba(0, 0, 0, 0.08)',

    elevation: 12,
  },

  tab: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',

    paddingVertical: 4,
  },

  label: {
    fontSize: 11,

    color: COLORS.textMuted,

    marginTop: 4,

    fontWeight: '500',
  },

  labelActive: {
    color: COLORS.primary,

    fontWeight: '700',
  },

  activeDot: {
    position: 'absolute',

    top: 0,

    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: COLORS.primary,
  },
});

export default BottomNavigation;