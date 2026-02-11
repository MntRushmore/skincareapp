import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Lock,
  Eye,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  if (!loaded) return null;

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
          <Text style={styles.headerTitle}>Security & Login</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PASSWORD</Text>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter current password"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  secureTextEntry
                  style={[styles.input, { paddingRight: 48 }]}
                />
                <Pressable style={styles.eyeButton}>
                  <Eye size={20} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  secureTextEntry
                  style={[styles.input, { paddingRight: 48 }]}
                />
                <Pressable style={styles.eyeButton}>
                  <Eye size={20} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  size={20}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.mutedForeground + "99"}
                  secureTextEntry
                  style={[styles.input, { paddingRight: 48 }]}
                />
                <Pressable style={styles.eyeButton}>
                  <Eye size={20} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Password</Text>
            </Pressable>
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementText}>• At least 8 characters</Text>
            <Text style={styles.requirementText}>
              • Contains uppercase and lowercase letters
            </Text>
            <Text style={styles.requirementText}>• Contains numbers</Text>
            <Text style={styles.requirementText}>
              • Contains special characters (!@#$%)
            </Text>
          </View>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TWO-FACTOR AUTHENTICATION</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Shield size={24} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Two-Factor Authentication
                </Text>
                <Text style={styles.settingDescription}>
                  Add an extra layer of security to your account
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={twoFactorEnabled ? colors.primary : colors.card}
              />
            </View>

            {twoFactorEnabled && (
              <>
                <View style={styles.divider} />
                <View style={styles.twoFactorOptions}>
                  <Pressable style={styles.twoFactorOption}>
                    <Smartphone size={20} color={colors.foreground} />
                    <Text style={styles.twoFactorText}>
                      Authenticator App (Recommended)
                    </Text>
                  </Pressable>
                  <Pressable style={styles.twoFactorOption}>
                    <Key size={20} color={colors.foreground} />
                    <Text style={styles.twoFactorText}>SMS Text Message</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Biometric Login */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BIOMETRIC LOGIN</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: colors.chart3 + "1A" },
                ]}
              >
                <Smartphone size={24} color={colors.chart3} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Face ID / Touch ID</Text>
                <Text style={styles.settingDescription}>
                  Use your device biometrics to sign in quickly
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={biometricEnabled ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVE SESSIONS</Text>

          <View style={styles.card}>
            <View style={styles.sessionItem}>
              <View style={styles.sessionInfo}>
                <View style={styles.deviceBadge}>
                  <Smartphone size={16} color={colors.primary} />
                </View>
                <View style={styles.sessionDetails}>
                  <Text style={styles.deviceName}>iPhone 15 Pro</Text>
                  <Text style={styles.sessionMeta}>
                    San Francisco, CA • Active now
                  </Text>
                </View>
              </View>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sessionItem}>
              <View style={styles.sessionInfo}>
                <View style={styles.deviceBadge}>
                  <Smartphone size={16} color={colors.mutedForeground} />
                </View>
                <View style={styles.sessionDetails}>
                  <Text style={styles.deviceName}>iPad Air</Text>
                  <Text style={styles.sessionMeta}>
                    San Francisco, CA • 2 days ago
                  </Text>
                </View>
              </View>
              <Pressable>
                <Text style={styles.revokeText}>Revoke</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.revokeAllButton}>
            <AlertTriangle size={18} color={colors.destructive} />
            <Text style={styles.revokeAllText}>Sign Out All Devices</Text>
          </Pressable>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 8,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  passwordRequirements: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  twoFactorOptions: {
    gap: 12,
  },
  twoFactorOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  twoFactorText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  deviceBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primary + "1A",
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 11,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  revokeText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
  },
  revokeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: colors.destructive + "1A",
    borderWidth: 1,
    borderColor: colors.destructive + "33",
    borderRadius: 12,
  },
  revokeAllText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
  },
});
