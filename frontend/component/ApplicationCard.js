import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getStatusLabel, getStatusColor, getStatusBg } from '../theme/colors';


const ApplicationCard = ({ application, onPress }) => {
  const statusLabel = getStatusLabel(application.status);
  const statusColor = getStatusColor(application.status);
  const statusBg    = getStatusBg(application.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityLabel={`Application for ${application.schoolName}, status: ${statusLabel}`}
    >
      {/* School icon badge */}
      <View style={styles.iconWrapper}>
        <Ionicons name="school-outline" size={22} color={COLORS.primary} />
      </View>

      {/* School info */}
      <View style={styles.info}>
        <Text style={styles.schoolName}>{application.schoolName}</Text>
        <Text style={styles.appliedDate}>Applied on {application.appliedDate}</Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusBg }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {statusLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  appliedDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    maxWidth: 100,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ApplicationCard;
