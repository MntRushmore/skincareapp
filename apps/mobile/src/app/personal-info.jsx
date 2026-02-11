import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/utils/auth/useUser";
import { useState } from "react";

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser } = useUser();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  // Form state
  const [fullName, setFullName] = useState("");
  const [skinType, setSkinType] = useState("");
  const [ageRange, setAgeRange] = useState("");

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!authUser,
    onSuccess: (data) => {
      setFullName(data?.full_name || "");
      setSkinType(data?.skin_type || "");
      setAgeRange(data?.age_range || "");
    },
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      router.back();
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      full_name: fullName,
      skin_type: skinType,
      age_range: ageRange,
    });
  };

  if (!loaded) return null;

  const displayPhoto = profile?.profile_photo_url || authUser?.image;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
          <Text style={styles.headerTitle}>Personal Info</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            {displayPhoto ? (
              <Image
                source={{ uri: displayPhoto }}
                style={styles.profilePhoto}
              />
            ) : (
              <View
                style={[
                  styles.profilePhoto,
                  {
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <User size={48} color={colors.mutedForeground} />
              </View>
            )}
            <Pressable style={styles.cameraButton}>
              <Camera size={20} color={colors.primaryForeground} />
            </Pressable>
          </View>
          <Text style={styles.photoLabel}>Profile Photo</Text>
          <Text style={styles.photoHint}>
            Choose a photo that represents you
          </Text>
        </View>

        {/* Form */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email (read-only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={authUser?.email || ""}
                  editable={false}
                  placeholderTextColor={colors.mutedForeground + "99"}
                  style={[styles.input, { color: colors.mutedForeground }]}
                />
              </View>
              <Text style={styles.inputHint}>Email cannot be changed here</Text>
            </View>

            {/* Skin Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Skin Type</Text>
              <View style={styles.inputWrapper}>
                <User
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={skinType}
                  onChangeText={setSkinType}
                  placeholder="e.g., Oily, Dry, Combination"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  style={styles.input}
                />
              </View>
              <Text style={styles.inputHint}>Optional</Text>
            </View>

            {/* Age Range */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age Range</Text>
              <View style={styles.inputWrapper}>
                <Calendar
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={ageRange}
                  onChangeText={setAgeRange}
                  placeholder="e.g., 20-30, 30-40"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  style={styles.input}
                />
              </View>
              <Text style={styles.inputHint}>
                This helps us personalize your experience
              </Text>
            </View>
          </View>
        )}

        {/* Save Button */}
        <Pressable
          style={[
            styles.saveButton,
            updateMutation.isLoading && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>

        {/* Delete Account */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Pressable style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete My Account</Text>
          </Pressable>
          <Text style={styles.dangerHint}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted + "80",
    borderWidth: 1,
    borderColor: colors.border + "80",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  photoWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.border,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  photoLabel: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  photoHint: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
  input: {
    height: 56,
    paddingLeft: 48,
    paddingRight: 20,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
  },
  inputHint: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginTop: 6,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  dangerZone: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: colors.destructive + "1A",
    borderWidth: 1,
    borderColor: colors.destructive + "33",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
  },
  dangerHint: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
});
