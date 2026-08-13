import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';


const DashboardHeader = ({ parentName = '', onBellPress }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Greeting */}
        <Text style={styles.greeting}>
          Hello, {parentName || 'Parent'}! 👋
        </Text>

        {/* Notification bell */}
        <TouchableOpacity
          style={styles.bellButton}
          onPress={onBellPress}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Blue extension below so the white card can overlap nicely */}
      <View style={styles.headerExtension} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  // Extra blue space so the card below can sit on top via negative marginTop
  headerExtension: {
    height: 36,
  },
});

export default DashboardHeader;
