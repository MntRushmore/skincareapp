import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Share2,
  Droplets,
  Circle,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Heart,
  Camera,
  Star,
  ExternalLink,
  ShoppingBag,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function ScanResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [analysis, setAnalysis] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  useEffect(() => {
    loadAnalysis();
  }, [params]);

  const loadAnalysis = async () => {
    try {
      console.log("[Scan Results] Loading analysis...");
      console.log("[Scan Results] Params:", Object.keys(params));

      // Try to get from params first
      if (params.analysis) {
        console.log("[Scan Results] Found analysis in params");
        console.log("[Scan Results] Analysis type:", typeof params.analysis);
        console.log(
          "[Scan Results] Analysis preview:",
          params.analysis.substring(0, 100),
        );

        const parsedAnalysis = JSON.parse(params.analysis);
        console.log("[Scan Results] Parsed analysis successfully");
        console.log(
          "[Scan Results] Parsed object keys:",
          Object.keys(parsedAnalysis),
        );

        setAnalysis(parsedAnalysis);
        setImageUri(params.imageUri);

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          "lastScanAnalysis",
          JSON.stringify({
            analysis: parsedAnalysis,
            imageUri: params.imageUri,
          }),
        );
        console.log("[Scan Results] Saved to AsyncStorage");
      } else {
        console.log(
          "[Scan Results] No analysis in params, loading from AsyncStorage",
        );
        // Load from AsyncStorage
        const saved = await AsyncStorage.getItem("lastScanAnalysis");
        if (saved) {
          const data = JSON.parse(saved);
          setAnalysis(data.analysis);
          setImageUri(data.imageUri);
          console.log("[Scan Results] Loaded from AsyncStorage");
        } else {
          console.warn("[Scan Results] No saved analysis found");
        }
      }
    } catch (error) {
      console.error("[Scan Results] Failed to load analysis:", error);
      console.error("[Scan Results] Error stack:", error.stack);
      setError(error.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.chart3;
    if (score >= 60) return colors.chart2;
    return colors.chart1;
  };

  if (!loaded) {
    console.log("[Scan Results] Fonts not loaded yet");
    return null;
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 24 },
        ]}
      >
        <StatusBar style="dark" />
        <Text style={styles.headerTitle}>Error Loading Analysis</Text>
        <Text style={styles.loadingText}>{error}</Text>
        <Pressable style={styles.ctaButton} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!analysis) {
    console.log("[Scan Results] Analysis is null, showing loading");
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Loading your analysis...</Text>
      </View>
    );
  }

  console.log("[Scan Results] Rendering analysis screen");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Your Skin Analysis</Text>
            <Text style={styles.headerSubtitle}>COSMETIC INSIGHTS</Text>
          </View>

          <Pressable style={styles.iconButton}>
            <Share2 size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Important Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>
            For Informational Purposes Only
          </Text>
          <Text style={styles.disclaimerText}>
            This analysis provides cosmetic and general wellness insights. It
            does not diagnose, treat, or provide medical advice. Always consult
            a licensed dermatologist or healthcare professional for medical
            concerns.
          </Text>
        </View>

        {/* Photo Preview */}
        {imageUri && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: imageUri }} style={styles.photo} />
          </View>
        )}

        {/* Health Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text
              style={[
                styles.scoreNumber,
                { color: getScoreColor(analysis.healthScore) },
              ]}
            >
              {analysis.healthScore}
            </Text>
            <Text style={styles.scoreLabel}>Health Score</Text>
          </View>
          <Text style={styles.skinType}>{analysis.skinType}</Text>
          <Text style={styles.summary}>{analysis.summary}</Text>
        </View>

        {/* Skin Characteristics */}
        {analysis.conditions && analysis.conditions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observed Characteristics</Text>
            {analysis.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionCard}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      {
                        backgroundColor:
                          condition.severity === "mild"
                            ? colors.chart3 + "20"
                            : condition.severity === "moderate"
                              ? colors.chart2 + "20"
                              : colors.chart1 + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        {
                          color:
                            condition.severity === "mild"
                              ? colors.chart3
                              : condition.severity === "moderate"
                                ? colors.chart2
                                : colors.chart1,
                        },
                      ]}
                    >
                      {condition.severity}
                    </Text>
                  </View>
                </View>
                <Text style={styles.conditionLocation}>
                  {condition.location}
                </Text>
                <Text style={styles.conditionDescription}>
                  {condition.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Pore & Texture Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>

          {analysis.poreAnalysis && (
            <View style={styles.analysisCard}>
              <Droplets size={24} color={colors.primary} />
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisTitle}>Pore Analysis</Text>
                <Text style={styles.analysisDetail}>
                  Size: {analysis.poreAnalysis.size} • Visibility:{" "}
                  {analysis.poreAnalysis.visibility}
                </Text>
                {analysis.poreAnalysis.concernAreas &&
                  analysis.poreAnalysis.concernAreas.length > 0 && (
                    <Text style={styles.analysisAreas}>
                      Concern areas:{" "}
                      {analysis.poreAnalysis.concernAreas.join(", ")}
                    </Text>
                  )}
              </View>
            </View>
          )}

          {analysis.texture && (
            <View style={styles.analysisCard}>
              <Sparkles size={24} color={colors.primary} />
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisTitle}>Texture Quality</Text>
                <Text style={styles.analysisDetail}>
                  {analysis.texture.quality}
                </Text>
                {analysis.texture.concerns &&
                  analysis.texture.concerns.length > 0 && (
                    <Text style={styles.analysisAreas}>
                      {analysis.texture.concerns.join(", ")}
                    </Text>
                  )}
              </View>
            </View>
          )}
        </View>

        {/* Product Recommendations */}
        {analysis.recommendations?.productTypes &&
          analysis.recommendations.productTypes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Products</Text>
              {analysis.recommendations.productTypes.map(
                (productType, index) => (
                  <View key={index} style={styles.productTypeCard}>
                    <View style={styles.productTypeHeader}>
                      <ShoppingBag size={20} color={colors.primary} />
                      <Text style={styles.productTypeName}>
                        {productType.type}
                      </Text>
                    </View>
                    <Text style={styles.productTypeReason}>
                      {productType.reason}
                    </Text>

                    {productType.products &&
                      productType.products.length > 0 && (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.productsScroll}
                        >
                          {productType.products.map((product, pIndex) => (
                            <Pressable
                              key={pIndex}
                              style={styles.productCard}
                              onPress={() =>
                                product.url && Linking.openURL(product.url)
                              }
                            >
                              {product.image && (
                                <Image
                                  source={{ uri: product.image }}
                                  style={styles.productImage}
                                />
                              )}
                              <Text
                                style={styles.productTitle}
                                numberOfLines={2}
                              >
                                {product.title}
                              </Text>
                              <Text style={styles.productPrice}>
                                {product.price}
                              </Text>
                              {product.rating && (
                                <View style={styles.productRating}>
                                  <Star
                                    size={12}
                                    color={colors.chart2}
                                    fill={colors.chart2}
                                  />
                                  <Text style={styles.productRatingText}>
                                    {product.rating}
                                  </Text>
                                </View>
                              )}
                              <Pressable style={styles.productButton}>
                                <ExternalLink
                                  size={14}
                                  color={colors.primary}
                                />
                                <Text style={styles.productButtonText}>
                                  View
                                </Text>
                              </Pressable>
                            </Pressable>
                          ))}
                        </ScrollView>
                      )}
                  </View>
                ),
              )}
            </View>
          )}

        {/* Routines */}
        {(analysis.recommendations?.morningRoutine ||
          analysis.recommendations?.nightRoutine) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Routines</Text>

            {analysis.recommendations.morningRoutine &&
              analysis.recommendations.morningRoutine.length > 0 && (
                <View style={styles.routineCard}>
                  <View style={styles.routineHeader}>
                    <Sun size={20} color={colors.chart2} />
                    <Text style={styles.routineTitle}>Morning Routine</Text>
                  </View>
                  {analysis.recommendations.morningRoutine.map(
                    (step, index) => (
                      <View key={index} style={styles.routineStep}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{step.step}</Text>
                        </View>
                        <View style={styles.stepInfo}>
                          <Text style={styles.stepProduct}>{step.product}</Text>
                          <Text style={styles.stepInstructions}>
                            {step.instructions}
                          </Text>
                        </View>
                      </View>
                    ),
                  )}
                </View>
              )}

            {analysis.recommendations.nightRoutine &&
              analysis.recommendations.nightRoutine.length > 0 && (
                <View style={styles.routineCard}>
                  <View style={styles.routineHeader}>
                    <Moon size={20} color={colors.chart1} />
                    <Text style={styles.routineTitle}>Night Routine</Text>
                  </View>
                  {analysis.recommendations.nightRoutine.map((step, index) => (
                    <View key={index} style={styles.routineStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{step.step}</Text>
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={styles.stepProduct}>{step.product}</Text>
                        <Text style={styles.stepInstructions}>
                          {step.instructions}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* Daily Tips */}
        {analysis.recommendations?.dailyTips &&
          analysis.recommendations.dailyTips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Tips</Text>
              {analysis.recommendations.dailyTips.map((tip, index) => (
                <View key={index} style={styles.tipCard}>
                  <CheckCircle2 size={20} color={colors.chart3} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/(tabs)/camera")}
          >
            <Camera size={24} color={colors.background} />
            <Text style={styles.ctaText}>Take Another Scan</Text>
          </Pressable>
          <Text style={styles.disclaimer}>
            This analysis is for cosmetic and informational purposes only. It
            does not replace professional medical advice, diagnosis, or
            treatment. Always seek the advice of a qualified dermatologist or
            healthcare provider with any questions regarding skin conditions.
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
  loadingText: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    letterSpacing: 2,
  },
  disclaimerBox: {
    backgroundColor: colors.chart2 + "15",
    borderWidth: 1,
    borderColor: colors.chart2 + "33",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  photoContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
  },
  photo: {
    width: "100%",
    height: 300,
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    alignItems: "center",
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 56,
    fontFamily: "BricolageGrotesque_700Bold",
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  skinType: {
    fontSize: 20,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    textTransform: "capitalize",
    marginBottom: 12,
  },
  summary: {
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
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
  },
  conditionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  conditionName: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    textTransform: "capitalize",
  },
  conditionLocation: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.primary,
    marginBottom: 4,
  },
  conditionDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  analysisCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  analysisDetail: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  analysisAreas: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  productTypeCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  productTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  productTypeName: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  productTypeReason: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 12,
    lineHeight: 20,
  },
  productsScroll: {
    flexGrow: 0,
    marginTop: 8,
  },
  productCard: {
    width: 160,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
    marginBottom: 4,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  productRatingText: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  productButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    backgroundColor: colors.primary + "15",
    borderRadius: 8,
  },
  productButtonText: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  routineCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  routineTitle: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  routineStep: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  stepInfo: {
    flex: 1,
  },
  stepProduct: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  stepInstructions: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  tipCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    lineHeight: 20,
  },
  ctaContainer: {
    alignItems: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.foreground,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: "100%",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.background,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});
