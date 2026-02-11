import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Crown,
  Zap,
  CheckCircle2,
  Info,
  CreditCard,
  Calendar,
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
import useSubscription from "../utils/use-subscription";
import useScanLimit from "../utils/use-scan-limit";
import { useState } from "react";
import { useAuth } from "@/utils/auth/useAuth";

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showDevButton, setShowDevButton] = useState(false);
  const [isTogglingPremium, setIsTogglingPremium] = useState(false);
  const { auth } = useAuth();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const {
    isSubscribed,
    loading: subLoading,
    initiateSubscription,
    refetch: refetchSubscription,
  } = useSubscription();
  const {
    isPremium,
    scansUsed,
    scansRemaining,
    limit,
    loading: scanLoading,
    refetch: refetchScanLimit,
  } = useScanLimit();

  if (!loaded) return null;

  const loading = subLoading || scanLoading;

  const handleDevTogglePremium = async () => {
    try {
      setIsTogglingPremium(true);

      // Check if user is authenticated
      if (!auth?.user?.id || !auth?.jwt) {
        Alert.alert("Error", "Not authenticated. Please sign in first.");
        setIsTogglingPremium(false);
        return;
      }

      const response = await fetch("/api/dev/toggle-premium", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Dev Mode", data.message, [
          {
            text: "OK",
            onPress: () => {
              // Refresh subscription and scan limit data
              refetchSubscription();
              refetchScanLimit();
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to toggle premium status");
      }
    } catch (error) {
      console.error("Error toggling premium:", error);
      Alert.alert("Error", "Failed to toggle premium status");
    } finally {
      setIsTogglingPremium(false);
    }
  };

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
          <Pressable
            onLongPress={() => setShowDevButton(!showDevButton)}
            delayLongPress={2000}
          >
            <Text style={styles.headerTitle}>Subscription</Text>
          </Pressable>
          <View style={{ width: 40 }} />
        </View>

        {/* Dev Mode Toggle Button - only shows after long press */}
        {showDevButton && (
          <Pressable
            style={styles.devButton}
            onPress={handleDevTogglePremium}
            disabled={isTogglingPremium}
          >
            {isTogglingPremium ? (
              <ActivityIndicator
                size="small"
                color={colors.primaryForeground}
              />
            ) : (
              <>
                <Zap size={16} color={colors.primaryForeground} />
                <Text style={styles.devButtonText}>[DEV] Toggle Premium</Text>
              </>
            )}
          </Pressable>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading subscription...</Text>
          </View>
        ) : (
          <>
            {/* Current Plan Card */}
            <View
              style={isPremium ? styles.premiumPlanCard : styles.freePlanCard}
            >
              <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                  {isPremium ? (
                    <Crown size={28} color={colors.primary} />
                  ) : (
                    <Zap size={28} color={colors.mutedForeground} />
                  )}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>
                    {isPremium ? "Premium Plan" : "Free Plan"}
                  </Text>
                  <Text style={styles.planSubtitle}>
                    {isPremium ? "Unlimited scans" : `${limit} scans per month`}
                  </Text>
                </View>
                {isPremium && (
                  <View style={styles.activeBadge}>
                    <CheckCircle2 size={14} color={colors.chart3} />
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>

              {!isPremium && (
                <View style={styles.usageSection}>
                  <View style={styles.usageHeader}>
                    <Text style={styles.usageTitle}>This Month's Usage</Text>
                    <Text style={styles.usageCount}>
                      {scansUsed} / {limit} scans
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(scansUsed / limit) * 100}%`,
                          backgroundColor:
                            scansRemaining === 0
                              ? colors.destructive
                              : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.usageSubtext}>
                    {scansRemaining > 0
                      ? `${scansRemaining} scans remaining this month`
                      : "You've used all your free scans this month"}
                  </Text>
                </View>
              )}
            </View>

            {/* Upgrade Section for Free Users */}
            {!isPremium && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>UPGRADE TO PREMIUM</Text>
                <View style={styles.premiumCard}>
                  <View style={styles.premiumHeader}>
                    <View style={styles.premiumIconBg}>
                      <Crown size={32} color={colors.primary} />
                    </View>
                    <View style={styles.premiumInfo}>
                      <Text style={styles.premiumTitle}>Unlock Premium</Text>
                      <Text style={styles.premiumPrice}>$2.99/month</Text>
                    </View>
                  </View>

                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <CheckCircle2 size={20} color={colors.primary} />
                      <Text style={styles.featureText}>
                        Unlimited skin scans
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckCircle2 size={20} color={colors.primary} />
                      <Text style={styles.featureText}>
                        Detailed texture analysis
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckCircle2 size={20} color={colors.primary} />
                      <Text style={styles.featureText}>
                        Personalized recommendations
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckCircle2 size={20} color={colors.primary} />
                      <Text style={styles.featureText}>
                        Scan history & tracking
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.upgradeButton}
                    onPress={initiateSubscription}
                  >
                    <Crown size={20} color={colors.primaryForeground} />
                    <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                  </Pressable>

                  <Text style={styles.cancelAnytime}>
                    Cancel anytime, no commitments
                  </Text>
                </View>
              </View>
            )}

            {/* Premium Benefits Info */}
            {isPremium && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>YOUR PREMIUM BENEFITS</Text>
                <View style={styles.benefitsCard}>
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Zap size={20} color={colors.primary} />
                    </View>
                    <View style={styles.benefitInfo}>
                      <Text style={styles.benefitTitle}>Unlimited Scans</Text>
                      <Text style={styles.benefitDescription}>
                        Analyze your skin as many times as you want
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <CheckCircle2 size={20} color={colors.primary} />
                    </View>
                    <View style={styles.benefitInfo}>
                      <Text style={styles.benefitTitle}>Detailed Analysis</Text>
                      <Text style={styles.benefitDescription}>
                        Get in-depth insights about your skin health
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Crown size={20} color={colors.primary} />
                    </View>
                    <View style={styles.benefitInfo}>
                      <Text style={styles.benefitTitle}>Priority Support</Text>
                      <Text style={styles.benefitDescription}>
                        Get help faster when you need it
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <Info size={16} color={colors.mutedForeground} />
                  <Text style={styles.infoText}>
                    Your subscription renews automatically. You can cancel
                    anytime from your account settings.
                  </Text>
                </View>
              </View>
            )}

            {/* Billing Information - only for premium users */}
            {isPremium && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BILLING INFORMATION</Text>
                <View style={styles.billingCard}>
                  <View style={styles.billingItem}>
                    <View style={styles.billingIconContainer}>
                      <CreditCard size={20} color={colors.primary} />
                    </View>
                    <View style={styles.billingInfo}>
                      <Text style={styles.billingLabel}>Payment Method</Text>
                      <Text style={styles.billingValue}>
                        •••• •••• •••• 4242
                      </Text>
                      <Text style={styles.billingSubtext}>Visa</Text>
                    </View>
                    <Pressable style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.billingItem}>
                    <View style={styles.billingIconContainer}>
                      <Calendar size={20} color={colors.primary} />
                    </View>
                    <View style={styles.billingInfo}>
                      <Text style={styles.billingLabel}>Next Billing Date</Text>
                      <Text style={styles.billingValue}>March 15, 2026</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.billingItem}>
                    <View style={styles.billingIconContainer}>
                      <Crown size={20} color={colors.primary} />
                    </View>
                    <View style={styles.billingInfo}>
                      <Text style={styles.billingLabel}>Billing Amount</Text>
                      <Text style={styles.billingValue}>$2.99 / month</Text>
                    </View>
                  </View>
                </View>

                <Pressable style={styles.cancelSubscriptionButton}>
                  <Text style={styles.cancelSubscriptionText}>
                    Cancel Subscription
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
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
  loadingContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginTop: 16,
  },
  freePlanCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  premiumPlanCard: {
    backgroundColor: colors.primary + "1A",
    borderWidth: 2,
    borderColor: colors.primary + "33",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  planIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.chart3 + "1A",
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.chart3,
  },
  usageSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  usageTitle: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  usageCount: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  usageSubtext: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
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
  },
  premiumCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  premiumIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  premiumPrice: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  featuresList: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  cancelAnytime: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
  },
  benefitsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.muted,
    padding: 16,
    borderRadius: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },

  billingCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  billingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  billingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  billingInfo: {
    flex: 1,
  },
  billingLabel: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  billingValue: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 2,
  },
  billingSubtext: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.muted,
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  cancelSubscriptionButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.destructive + "15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.destructive + "30",
  },
  cancelSubscriptionText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.destructive,
  },

  devButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.destructive,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.destructive,
  },
  devButtonText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
});
