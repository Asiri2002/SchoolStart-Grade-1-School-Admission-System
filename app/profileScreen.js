import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../theme/colors';

import {
  fetchParentProfile,
  updateParentProfile,
} from '../src/services/parentService';

import BottomNavigation from '../component/BottomNavigation';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchParentProfile();

      console.log('Parent profile:', data);

      setProfile(data);

      setFirstName(data?.firstName || '');
      setLastName(data?.lastName || '');
      setPhone(data?.phone || '');
      setAddress(data?.address || '');
    } catch (error) {
      console.error('Profile loading error:', error);
      setError('Unable to load parent profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleEdit = () => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setPhone(profile?.phone || '');
    setAddress(profile?.address || '');

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setPhone(profile?.phone || '');
    setAddress(profile?.address || '');

    setIsEditing(false);
  };

  const handleSave = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      Alert.alert(
        'Validation',
        'Please fill in all fields.'
      );
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      const data = await updateParentProfile(updatedProfile);

      console.log('Updated profile:', data);

      setProfile(data);

      setFirstName(data?.firstName || '');
      setLastName(data?.lastName || '');
      setPhone(data?.phone || '');
      setAddress(data?.address || '');

      setIsEditing(false);

      Alert.alert(
        'Success',
        'Profile updated successfully.'
      );
    } catch (error) {
      console.error('Profile update error:', error);

      Alert.alert(
        'Update Failed',
        error?.response?.data?.message ||
          'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Parent profile not found.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER */}
          <View style={styles.header}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                router.replace('/ParentDashboardScreen')
              }
            >
              <Text style={styles.backText}>
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Parent Profile
            </Text>

            <View style={styles.headerSpacer} />

          </View>

          {/* PROFILE HEADER */}
          <View style={styles.profileHeader}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.profileName}>
              {`${firstName || 'Parent'} ${lastName || ''}`}
            </Text>

            <Text style={styles.profileRole}>
              Parent
            </Text>

          </View>

          {/* PERSONAL INFORMATION */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Personal Information
            </Text>

            {isEditing ? (
              <>
                <InputField
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                />

                <InputField
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                />

                <InputField
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />

                <InputField
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  multiline
                />
              </>
            ) : (
              <>
                <ProfileRow
                  label="First Name"
                  value={profile.firstName}
                />

                <ProfileRow
                  label="Last Name"
                  value={profile.lastName}
                />

                <ProfileRow
                  label="Phone"
                  value={profile.phone}
                />

                <ProfileRow
                  label="Address"
                  value={profile.address}
                />
              </>
            )}

          </View>

          {/* ACCOUNT INFORMATION */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Account Information
            </Text>

            <ProfileRow
              label="User ID"
              value={profile.userId}
            />

            <ProfileRow
              label="Profile ID"
              value={profile.id}
            />

            <ProfileRow
              label="Number of Children"
              value={String(
                profile.childIds?.length || 0
              )}
            />

          </View>

          {/* CHILDREN */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Children
            </Text>

            {profile.childIds?.length > 0 ? (
              profile.childIds.map((childId, index) => (
                <View
                  key={childId}
                  style={styles.childRow}
                >
                  <View style={styles.childNumber}>
                    <Text style={styles.childNumberText}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.childInfo}>
                    <Text style={styles.childLabel}>
                      Child {index + 1}
                    </Text>

                    <Text style={styles.childId}>
                      {childId}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No children added yet.
              </Text>
            )}

          </View>

          {/* BUTTONS */}
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    color={COLORS.white}
                  />
                ) : (
                  <Text style={styles.buttonText}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

            </View>
          )}

        </ScrollView>

        <BottomNavigation activeTab="Profile" />

      </View>
    </SafeAreaView>
  );
}

const ProfileRow = ({ label, value }) => (
  <View style={styles.profileRow}>
    <Text style={styles.profileLabel}>
      {label}
    </Text>

    <Text style={styles.profileValue}>
      {value || 'Not provided'}
    </Text>
  </View>
);

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.profileLabel}>
      {label}
    </Text>

    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    height: 70,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '300',
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 40,
  },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.primary,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },

  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },

  profileRole: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 18,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },

  profileRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  profileLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 5,
  },

  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  inputContainer: {
    marginBottom: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: '#fafafa',
  },

  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  childNumber: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  childNumberText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },

  childInfo: {
    flex: 1,
  },

  childLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  childId: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },

  editButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },

  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },

  saveButton: {
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  errorText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },

  retryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});