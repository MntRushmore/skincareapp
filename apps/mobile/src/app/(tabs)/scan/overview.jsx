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
  HelpCircle,
  Heart,
  CheckCircle,
  RotateCw,
  Sun,
  Sparkles,
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

export default function ScanOverviewScreen() {
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

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Overview</Text>
        <Pressable style={styles.shareButton}>
          <Share2 size={24} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Image */}
        <View style={styles.scanImageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
            }}
            style={styles.scanImage}
          />
        </View>

        {/* Deep Dive Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>

          <Pressable
            style={[
              styles.diveCard,
              {
                backgroundColor: colors.chart1 + "1A",
                borderColor: colors.chart1 + "33",
              },
            ]}
            onPress={() => router.push("/(tabs)/scan/texture")}
          >
            <View style={styles.diveHeader}>
              <View style={styles.diveIcon}>
                <Sun size={24} color={colors.chart1} />
              </View>
              <View style={styles.diveInfo}>
                <Text style={styles.diveTitle}>Texture Analysis</Text>
                <Text style={styles.diveSubtitle}>
                  Moderate unevenness in T-zone
                </Text>
              </View>
              <ArrowLeft
                size={20}
                color={colors.chart1}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.diveCard,
              {
                backgroundColor: colors.chart2 + "1A",
                borderColor: colors.chart2 + "33",
              },
            ]}
            onPress={() => router.push("/(tabs)/scan/treatment")}
          >
            <View style={styles.diveHeader}>
              <View style={styles.diveIcon}>
                <Heart size={24} color={colors.chart2} />
              </View>
              <View style={styles.diveInfo}>
                <Text style={styles.diveTitle}>Treatment Guide</Text>
                <Text style={styles.diveSubtitle}>
                  Personalized 14-day protocol
                </Text>
              </View>
              <ArrowLeft
                size={20}
                color={colors.chart2}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </View>
          </Pressable>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/(tabs)/scan/treatment")}
          >
            <Heart size={24} color={colors.background} />
            <Text style={styles.primaryButtonText}>View Treatment Plan</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/camera")}
          >
            <RotateCw size={20} color={colors.foreground} />
            <Text style={styles.secondaryButtonText}>Retake Scan</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  scanImageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scanImage: {
    width: "100%",
    height: "100%",
  },
  scoreOverlay: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreNumber: {
    fontSize: 28,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
  },
  diveCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  diveHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  diveIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  diveInfo: {
    flex: 1,
  },
  diveTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  diveSubtitle: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  ctaContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.foreground,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.background,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
});
