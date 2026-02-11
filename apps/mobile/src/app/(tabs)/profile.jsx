import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Share2,
  User,
  Lock,
  Wallet,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/utils/auth/useUser";
import { useAuth } from "@/utils/auth/useAuth";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: authUser } = useUser();
  const { signOut, auth } = useAuth();
  const queryClient = useQueryClient();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  // Fetch user profile from API
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${auth?.jwt}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!authUser && !!auth?.jwt,
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      console.log("Starting delete account mutation");
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.jwt}`,
        },
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Delete error response:", errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `Failed to delete account: ${response.status} ${response.statusText}`,
          );
        }
        throw new Error(
          error.error || error.details || "Failed to delete account",
        );
      }

      const result = await response.json();
      console.log("Delete success:", result);
      return result;
    },
    onSuccess: async () => {
      console.log("Delete successful, signing out");
      // Sign out to clear auth state and navigate to onboarding
      await signOut();
      router.replace("/onboarding");
    },
    onError: (error) => {
      console.error("Delete account error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete account. Please try again.",
        [{ text: "OK" }],
      );
    },
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAccountMutation.mutate(),
        },
      ],
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  if (!loaded) return null;

  const displayName = profile?.full_name || authUser?.name || "User";
  const displayEmail = authUser?.email || "No email";
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            {displayPhoto ? (
              <Image source={{ uri: displayPhoto }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <User size={32} color={colors.mutedForeground} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editIcon}>✎</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{displayEmail}</Text>
          </View>
          <Pressable style={styles.shareButton}>
            <Share2 size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT MANAGEMENT</Text>
          <View style={styles.menuCard}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/personal-info")}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.chart1 + "1A" },
                ]}
              >
                <User size={20} color={colors.chart1} />
              </View>
              <Text style={styles.menuText}>Personal Info</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/security")}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.chart2 + "1A" },
                ]}
              >
                <Lock size={20} color={colors.chart2} />
              </View>
              <Text style={styles.menuText}>Security & Login</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/subscription")}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.chart4 + "1A" },
                ]}
              >
                <Wallet size={20} color={colors.chart4} />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.menuItem} onPress={handleDeleteAccount}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.destructive + "1A" },
                ]}
              >
                <User size={20} color={colors.destructive} />
              </View>
              <Text style={[styles.menuText, { color: colors.destructive }]}>
                Delete Account
              </Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.secondary + "33" },
                ]}
              >
                <Bell size={20} color={colors.secondaryForeground} />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              <View style={styles.toggle}>
                <View style={styles.toggleThumb} />
              </View>
            </View>

            <View style={styles.divider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/privacy")}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.chart3 + "1A" },
                ]}
              >
                <Shield size={20} color={colors.chart3} />
              </View>
              <Text style={styles.menuText}>Privacy & Data</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.menuCard}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/help-center")}
            >
              <View
                style={[styles.menuIcon, { backgroundColor: colors.muted }]}
              >
                <HelpCircle size={20} color={colors.foreground} />
              </View>
              <Text style={styles.menuText}>Help Center</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/terms")}
            >
              <View
                style={[styles.menuIcon, { backgroundColor: colors.muted }]}
              >
                <FileText size={20} color={colors.foreground} />
              </View>
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <ArrowLeft
                size={20}
                color={colors.mutedForeground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
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
    marginBottom: 24,
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary + "33",
  },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    fontSize: 10,
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
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
  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  signOutButton: {
    backgroundColor: colors.destructive + "1A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
  },
});
