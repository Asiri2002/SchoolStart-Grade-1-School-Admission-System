import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';


const ApplicationSummaryCard = ({ totalApplications = 0, onViewAll }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Applications</Text>
      <View style={styles.row}>
        <Text style={styles.count}>{totalApplications}</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 20,
    // Overlap the blue header by pulling up
    marginTop: -28,
    paddingVertical: 18,
    paddingHorizontal: 22,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 44,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default ApplicationSummaryCard;
