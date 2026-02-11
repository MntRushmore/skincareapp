import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  MapPin,
  Camera,
  Users,
  BarChart3,
  Database,
  FileText,
  Download,
  Trash2,
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

export default function PrivacyDataScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [dataCollection, setDataCollection] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [analytics, setAnalytics] = useState(true);

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
          <Text style={styles.headerTitle}>Privacy & Data</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Privacy Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewIcon}>
            <Eye size={28} color={colors.primary} />
          </View>
          <Text style={styles.overviewTitle}>Your Privacy Matters</Text>
          <Text style={styles.overviewDescription}>
            Control how your data is collected, used, and shared. We're
            committed to protecting your information.
          </Text>
        </View>

        {/* Data Collection & Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA COLLECTION & USAGE</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Database size={24} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Data Collection</Text>
                <Text style={styles.settingDescription}>
                  Allow us to collect usage data to improve the app
                </Text>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={dataCollection ? colors.primary : colors.card}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: colors.chart1 + "1A" },
                ]}
              >
                <BarChart3 size={24} color={colors.chart1} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personalization</Text>
                <Text style={styles.settingDescription}>
                  Use my data to personalize content and recommendations
                </Text>
              </View>
              <Switch
                value={personalization}
                onValueChange={setPersonalization}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={personalization ? colors.primary : colors.card}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: colors.chart2 + "1A" },
                ]}
              >
                <BarChart3 size={24} color={colors.chart2} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Analytics</Text>
                <Text style={styles.settingDescription}>
                  Share anonymous usage statistics to help us improve
                </Text>
              </View>
              <Switch
                value={analytics}
                onValueChange={setAnalytics}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={analytics ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERMISSIONS</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: colors.chart3 + "1A" },
                ]}
              >
                <MapPin size={24} color={colors.chart3} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Location Tracking</Text>
                <Text style={styles.settingDescription}>
                  Access your location for nearby recommendations
                </Text>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={locationTracking ? colors.primary : colors.card}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: colors.chart4 + "1A" },
                ]}
              >
                <Camera size={24} color={colors.chart4} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Camera Access</Text>
                <Text style={styles.settingDescription}>
                  Enable camera for skin analysis and profile photos
                </Text>
              </View>
              <Switch
                value={cameraAccess}
                onValueChange={setCameraAccess}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={cameraAccess ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>

        {/* Visibility & Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VISIBILITY & SHARING</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Users size={24} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Profile Visibility</Text>
                <Text style={styles.settingDescription}>
                  Make my profile visible to other users
                </Text>
              </View>
              <Switch
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{
                  false: colors.muted,
                  true: colors.primary + "80",
                }}
                thumbColor={profileVisibility ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>

        {/* Your Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR DATA</Text>

          <View style={styles.actionCard}>
            <Pressable style={styles.actionItem}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.chart1 + "1A" },
                ]}
              >
                <FileText size={20} color={colors.chart1} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Privacy Policy</Text>
                <Text style={styles.actionDescription}>
                  Read our full privacy policy and terms
                </Text>
              </View>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            Your privacy settings are saved automatically. Some changes may
            require you to restart the app. Learn more about how we protect your
            data in our <Text style={styles.infoLink}>Privacy Policy</Text>.
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
  overviewCard: {
    backgroundColor: colors.primary + "0D",
    borderWidth: 1,
    borderColor: colors.primary + "33",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  overviewIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  overviewDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
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
  settingsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  infoNote: {
    backgroundColor: colors.muted + "80",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  infoLink: {
    color: colors.primary,
    fontFamily: "Figtree_700Bold",
  },
});
