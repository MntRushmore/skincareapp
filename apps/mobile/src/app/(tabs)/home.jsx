import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  Sparkles,
  Heart,
  ArrowRight,
  ShoppingBag,
  Activity,
  Zap,
  Sun,
  CheckCircle2,
  Circle,
  Moon,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/utils/auth/useUser";
import { useAuth } from "@/utils/auth/useAuth";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: authUser } = useUser();
  const { auth } = useAuth();
  const [checklist, setChecklist] = useState([]);

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  // Fetch user's latest scan from database
  const { data: latestScan } = useQuery({
    queryKey: ["userScans"],
    queryFn: async () => {
      const response = await fetch("/api/user/scans?limit=1", {
        headers: {
          Authorization: `Bearer ${auth?.jwt}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch scans");
      const scans = await response.json();
      return scans[0]; // Get the most recent scan
    },
    enabled: !!authUser && !!auth?.jwt,
  });

  // Convert database scan format to the format expected by the UI
  const scanData = latestScan
    ? {
        imageUri: latestScan.photo_url,
        analysis: {
          healthScore: latestScan.confidence_score || 75,
          skinType: latestScan.skin_type || "Unknown",
          texture: latestScan.texture_analysis || {},
          conditions: latestScan.concerns || [],
          recommendations: latestScan.recommendations || {},
        },
      }
    : null;

  // Load checklist from AsyncStorage
  useEffect(() => {
    loadChecklist();
  }, [scanData]);

  const loadChecklist = async () => {
    try {
      // Load or initialize checklist
      const today = new Date().toDateString();
      const savedChecklistDate = await AsyncStorage.getItem("checklistDate");

      if (savedChecklistDate === today) {
        // Load today's checklist
        const savedChecklist = await AsyncStorage.getItem("dailyChecklist");
        if (savedChecklist) {
          setChecklist(JSON.parse(savedChecklist));
        } else {
          initializeChecklist();
        }
      } else {
        // New day, reset checklist
        initializeChecklist();
        await AsyncStorage.setItem("checklistDate", today);
      }
    } catch (error) {
      console.error("[Home] Failed to load checklist:", error);
    }
  };

  const initializeChecklist = () => {
    // If user has scan data with routines, use those
    if (scanData?.analysis?.recommendations) {
      const morningRoutine =
        scanData.analysis.recommendations.morningRoutine || [];
      const nightRoutine = scanData.analysis.recommendations.nightRoutine || [];

      const routineChecklist = [
        ...morningRoutine.map((step, index) => ({
          id: `morning-${index}`,
          text: step.product,
          completed: false,
          time: "morning",
          instructions: step.instructions,
        })),
        ...nightRoutine.map((step, index) => ({
          id: `night-${index}`,
          text: step.product,
          completed: false,
          time: "night",
          instructions: step.instructions,
        })),
      ];

      if (routineChecklist.length > 0) {
        setChecklist(routineChecklist);
        return;
      }
    }

    // Default checklist if no scan data
    const defaultChecklist = [
      { id: 1, text: "Morning cleanser", completed: false, time: "morning" },
      { id: 2, text: "Apply moisturizer", completed: false, time: "morning" },
      { id: 3, text: "Apply sunscreen", completed: false, time: "morning" },
      { id: 4, text: "Evening cleanser", completed: false, time: "night" },
      { id: 5, text: "Night moisturizer", completed: false, time: "night" },
    ];
    setChecklist(defaultChecklist);
  };

  const toggleChecklistItem = async (id) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setChecklist(updatedChecklist);

    try {
      await AsyncStorage.setItem(
        "dailyChecklist",
        JSON.stringify(updatedChecklist),
      );
    } catch (error) {
      console.error("[Home] Failed to save checklist:", error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.chart3;
    if (score >= 60) return colors.chart2;
    return colors.chart1;
  };

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.aiBadge}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.aiBadgeText}>AI-Powered Analysis</Text>
            </View>
            <Text style={styles.heroTitle}>
              Your Personalized{"\n"}Skin Care Journey
            </Text>
            <Text style={styles.heroSubtitle}>
              Get instant insights and product recommendations
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push("/(tabs)/camera")}
        >
          <Camera size={24} color={colors.primaryForeground} />
          <Text style={styles.ctaText}>Start Your Skin Analysis</Text>
        </Pressable>

        {/* Personalized Section - Only show if user has scanned */}
        {scanData && scanData.analysis && (
          <>
            {/* Your Skin Profile */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Skin Profile</Text>

              {/* Health Score */}
              <Pressable
                style={styles.profileCard}
                onPress={() => router.push("/(tabs)/scan")}
              >
                <View style={styles.profileHeader}>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileLabel}>Health Score</Text>
                    <Text
                      style={[
                        styles.profileScore,
                        { color: getScoreColor(scanData.analysis.healthScore) },
                      ]}
                    >
                      {scanData.analysis.healthScore}/100
                    </Text>
                    <Text style={styles.profileSkinType}>
                      {scanData.analysis.skinType}
                    </Text>
                  </View>
                  {scanData.imageUri && (
                    <Image
                      source={{ uri: scanData.imageUri }}
                      style={styles.profileImage}
                    />
                  )}
                </View>
                <View style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Full Analysis</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </View>
              </Pressable>

              {/* Quick Products */}
              {scanData.analysis.recommendations?.productTypes &&
                scanData.analysis.recommendations.productTypes.length > 0 && (
                  <View style={styles.quickProductsSection}>
                    <Text style={styles.quickProductsTitle}>
                      Recommended For You
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.quickProductsScroll}
                    >
                      {scanData.analysis.recommendations.productTypes
                        .slice(0, 3)
                        .map((product, index) => (
                          <View key={index} style={styles.quickProductCard}>
                            <Sparkles size={20} color={colors.primary} />
                            <Text
                              style={styles.quickProductType}
                              numberOfLines={2}
                            >
                              {product.type}
                            </Text>
                            <Text
                              style={styles.quickProductReason}
                              numberOfLines={2}
                            >
                              {product.reason}
                            </Text>
                          </View>
                        ))}
                    </ScrollView>
                  </View>
                )}

              {/* Quick Routine Preview */}
              {scanData.analysis.recommendations?.morningRoutine &&
                scanData.analysis.recommendations.morningRoutine.length > 0 && (
                  <View style={styles.quickRoutineCard}>
                    <View style={styles.quickRoutineHeader}>
                      <Sun size={20} color={colors.primary} />
                      <Text style={styles.quickRoutineTitle}>
                        Morning Routine
                      </Text>
                    </View>
                    {scanData.analysis.recommendations.morningRoutine
                      .slice(0, 3)
                      .map((step, index) => (
                        <Text key={index} style={styles.quickRoutineStep}>
                          {step.step}. {step.product}
                        </Text>
                      ))}
                    <Pressable onPress={() => router.push("/(tabs)/scan")}>
                      <Text style={styles.viewFullRoutine}>
                        View full routine →
                      </Text>
                    </Pressable>
                  </View>
                )}
            </View>
          </>
        )}

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.chart1 + "33" },
                ]}
              >
                <Activity size={24} color={colors.chart1} />
              </View>
              <Text style={styles.featureTitle}>Health Score</Text>
              <Text style={styles.featureDescription}>
                Track your skin's overall health
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.chart2 + "33" },
                ]}
              >
                <Sparkles size={24} color={colors.chart2} />
              </View>
              <Text style={styles.featureTitle}>Skin Analysis</Text>
              <Text style={styles.featureDescription}>
                Detailed pore & texture insights
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.primary + "33" },
                ]}
              >
                <ShoppingBag size={24} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Products</Text>
              <Text style={styles.featureDescription}>
                Personalized recommendations
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.chart3 + "33" },
                ]}
              >
                <Sun size={24} color={colors.chart3} />
              </View>
              <Text style={styles.featureTitle}>Daily Routine</Text>
              <Text style={styles.featureDescription}>
                Morning & night skincare
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Take a Selfie</Text>
              <Text style={styles.stepDescription}>
                Capture a clear photo of your face in good lighting
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>AI Analysis</Text>
              <Text style={styles.stepDescription}>
                Our AI analyzes your skin type, texture, and concerns
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Recommendations</Text>
              <Text style={styles.stepDescription}>
                Receive personalized products and routines with real prices
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose AI Skin Analysis?</Text>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Zap size={20} color={colors.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Instant Results</Text>
              <Text style={styles.benefitDescription}>
                Get your skin analysis in seconds, not weeks
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <ShoppingBag size={20} color={colors.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Real Products</Text>
              <Text style={styles.benefitDescription}>
                Shop recommendations with actual prices and reviews
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Heart size={20} color={colors.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Personalized Care</Text>
              <Text style={styles.benefitDescription}>
                Routines tailored specifically to your skin type
              </Text>
            </View>
          </View>
        </View>

        {/* Start CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaCardTitle}>Ready to Transform Your Skin?</Text>
          <Text style={styles.ctaCardDescription}>
            Join thousands discovering their perfect skincare routine
          </Text>
          <Pressable
            style={styles.ctaCardButton}
            onPress={() => router.push("/(tabs)/camera")}
          >
            <Camera size={20} color={colors.background} />
            <Text style={styles.ctaCardButtonText}>Take Your First Scan</Text>
            <ArrowRight size={20} color={colors.background} />
          </Pressable>
        </View>

        {/* Daily Skincare Checklist */}
        {checklist.length > 0 && (
          <View style={styles.checklistSection}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistTitle}>Today's Skincare</Text>
              <Text style={styles.checklistProgress}>
                {checklist.filter((item) => item.completed).length}/
                {checklist.length}
              </Text>
            </View>

            {/* Morning Tasks */}
            <View style={styles.checklistTimeGroup}>
              <View style={styles.checklistTimeHeader}>
                <Sun size={16} color={colors.chart2} />
                <Text style={styles.checklistTimeLabel}>Morning</Text>
              </View>
              {checklist
                .filter((item) => item.time === "morning")
                .map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.checklistItem}
                    onPress={() => toggleChecklistItem(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle2
                        size={24}
                        color={colors.primary}
                        fill={colors.primary}
                      />
                    ) : (
                      <Circle size={24} color={colors.mutedForeground} />
                    )}
                    <Text
                      style={[
                        styles.checklistItemText,
                        item.completed && styles.checklistItemTextCompleted,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </Pressable>
                ))}
            </View>

            {/* Night Tasks */}
            <View style={styles.checklistTimeGroup}>
              <View style={styles.checklistTimeHeader}>
                <Moon size={16} color={colors.chart1} />
                <Text style={styles.checklistTimeLabel}>Night</Text>
              </View>
              {checklist
                .filter((item) => item.time === "night")
                .map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.checklistItem}
                    onPress={() => toggleChecklistItem(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle2
                        size={24}
                        color={colors.primary}
                        fill={colors.primary}
                      />
                    ) : (
                      <Circle size={24} color={colors.mutedForeground} />
                    )}
                    <Text
                      style={[
                        styles.checklistItemText,
                        item.completed && styles.checklistItemTextCompleted,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>
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
  heroSection: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  aiBadgeText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: "rgba(255,255,255,0.9)",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  stepCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  benefitCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  ctaCard: {
    backgroundColor: colors.primary + "0D",
    borderWidth: 2,
    borderColor: colors.primary + "33",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  ctaCardTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    textAlign: "center",
    marginBottom: 8,
  },
  ctaCardDescription: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  ctaCardButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.foreground,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaCardButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.background,
  },
  // Personalized Profile Styles
  profileCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  profileScore: {
    fontSize: 36,
    fontFamily: "BricolageGrotesque_700Bold",
    marginBottom: 4,
  },
  profileSkinType: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    textTransform: "capitalize",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.border,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary + "15",
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  quickProductsSection: {
    marginBottom: 16,
  },
  quickProductsTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 12,
  },
  quickProductsScroll: {
    flexGrow: 0,
  },
  quickProductCard: {
    width: 180,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  quickProductType: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginTop: 8,
    marginBottom: 4,
    height: 36,
  },
  quickProductReason: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 16,
    height: 32,
  },
  quickRoutineCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  quickRoutineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  quickRoutineTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  quickRoutineStep: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 6,
    lineHeight: 18,
  },
  viewFullRoutine: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
    marginTop: 8,
  },
  // Checklist Styles
  checklistSection: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checklistTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  checklistProgress: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  checklistTimeGroup: {
    marginBottom: 16,
  },
  checklistTimeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  checklistTimeLabel: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  checklistItemText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    flex: 1,
  },
  checklistItemTextCompleted: {
    color: colors.mutedForeground,
    textDecorationLine: "line-through",
  },
});
