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
  ArrowLeft,
  Share2,
  Globe,
  Sparkles,
  Layers,
  Smile,
  RefreshCw,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function SkinTextureAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
            <Text style={styles.headerTitle}>Texture Analysis</Text>
            <Text style={styles.headerSubtitle}>DERMATOLOGY REPORT</Text>
          </View>

          <Pressable style={styles.iconButton}>
            <Share2 size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <View style={styles.scoreRing}>
              <View
                style={[
                  styles.scoreFill,
                  { transform: [{ rotate: "266deg" }] },
                ]}
              />
            </View>
            <View style={styles.scoreContent}>
              <Text style={styles.scoreNumber}>74%</Text>
              <Text style={styles.scoreLabel}>Smoothness</Text>
            </View>
          </View>
          <Text style={styles.scoreTitle}>Moderate Texture Unevenness</Text>
          <Text style={styles.scoreDescription}>
            Found subtle congestion and enlarged pores in the T-zone area.
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: colors.chart1 + "1A",
                borderColor: colors.chart1 + "33",
              },
            ]}
          >
            <Globe size={24} color={colors.chart1} />
            <Text style={styles.metricTitle}>Pore Visibility</Text>
            <Text style={styles.metricText}>
              High concentration on nose and cheeks.
            </Text>
          </View>

          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: colors.chart2 + "1A",
                borderColor: colors.chart2 + "33",
              },
            ]}
          >
            <Sparkles size={24} color={colors.chart2} />
            <Text style={styles.metricTitle}>Surface Grain</Text>
            <Text style={styles.metricText}>
              Minimal roughness detected on forehead.
            </Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dermatological Insights</Text>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View
                style={[styles.insightIcon, { backgroundColor: colors.accent }]}
              >
                <Layers size={20} color={colors.accentForeground} />
              </View>
              <Text style={styles.insightTitle}>Epidermal Turnover</Text>
            </View>
            <Text style={styles.insightText}>
              Texture is often a result of slow cellular renewal. When dead skin
              cells accumulate, the surface reflects light unevenly, making the
              skin appear dull or "grainy."
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View
                style={[styles.insightIcon, { backgroundColor: colors.accent }]}
              >
                <Smile size={20} color={colors.accentForeground} />
              </View>
              <Text style={styles.insightTitle}>Sebaceous Filaments</Text>
            </View>
            <Text style={styles.insightText}>
              Unlike blackheads, these are normal skin structures. However, when
              overactive, they can stretch pore walls, contributing to visible
              texture irregularities.
            </Text>
          </View>
        </View>

        {/* Recommended Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>

          <View style={styles.productItem}>
            <View
              style={[styles.productNumber, { backgroundColor: colors.chart1 }]}
            >
              <Text style={styles.productNumberText}>1</Text>
            </View>
            <View style={styles.productCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>2% BHA Liquid Exfoliant</Text>
                <Text style={styles.productDescription}>
                  Salicylic acid to clear deep pore congestion.
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>$29.00</Text>
                  <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add to Routine</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.productItem}>
            <View
              style={[styles.productNumber, { backgroundColor: colors.chart2 }]}
            >
              <Text style={styles.productNumberText}>2</Text>
            </View>
            <View style={styles.productCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>10% Niacinamide Booster</Text>
                <Text style={styles.productDescription}>
                  Refines pore appearance and smooths surface.
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>$42.00</Text>
                  <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add to Routine</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/(tabs)/camera")}
          >
            <RefreshCw size={24} color={colors.background} />
            <Text style={styles.ctaText}>Retake Texture Scan</Text>
          </Pressable>
          <Text style={styles.disclaimer}>
            Texture improvements are structural. Consistent use of actives for
            8-12 weeks is required for significant resurfacing.
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  scoreCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scoreCircle: {
    position: "relative",
    width: 128,
    height: 128,
    marginBottom: 16,
  },
  scoreRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 12,
    borderColor: colors.muted,
    transform: [{ rotate: "-90deg" }],
  },
  scoreFill: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 12,
    borderColor: colors.primary,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  scoreContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  scoreTitle: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginTop: 8,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  insightCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  productItem: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 48,
  },
  productNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  productNumberText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: "#fff",
  },
  productCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 160,
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  ctaContainer: {
    paddingTop: 16,
    paddingBottom: 48,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.foreground,
    paddingVertical: 20,
    borderRadius: 24,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.background,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 24,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});
