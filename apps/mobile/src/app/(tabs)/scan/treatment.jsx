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
  Calendar,
  Info,
  CheckCircle,
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

export default function TreatmentStepsScreen() {
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
            <Text style={styles.headerTitle}>Mild Acne</Text>
            <Text style={styles.headerSubtitle}>TREATMENT GUIDE</Text>
          </View>

          <Pressable style={styles.iconButton}>
            <Share2 size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Protocol Badge */}
        <View style={styles.protocolBadge}>
          <View style={styles.protocolIcon}>
            <Calendar size={24} color={colors.primaryForeground} />
          </View>
          <View style={styles.protocolInfo}>
            <Text style={styles.protocolTitle}>14-Day Protocol</Text>
            <Text style={styles.protocolSubtitle}>
              Personalized for your skin profile
            </Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />

          {/* Step 1 */}
          <View style={styles.timelineItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.chart1 }]}
            >
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Morning Cleanse</Text>
              <Text style={styles.stepDescription}>
                Wash your face with a gentle salicylic acid cleanser. This helps
                dissolve excess sebum and keeps pores clear.
              </Text>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
                }}
                style={styles.stepImage}
              />
              <View style={styles.tipBox}>
                <Info size={16} color={colors.chart1} />
                <Text style={styles.tipText}>
                  Use lukewarm water, never hot
                </Text>
              </View>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.timelineItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.chart2 }]}
            >
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Oil-Free Hydration</Text>
              <Text style={styles.stepDescription}>
                Apply a lightweight, non-comedogenic moisturizer. Hydrated skin
                actually produces less oil over time.
              </Text>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1611080626919-7cf5a9cdab5b?w=800&q=80",
                }}
                style={styles.stepImage}
              />
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.timelineItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.chart3 }]}
            >
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Sun Protection</Text>
              <Text style={styles.stepDescription}>
                Finish with SPF 30+. Acne-prone skin is sensitive to UV rays,
                which can darken post-acne marks.
              </Text>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
                }}
                style={styles.stepImage}
              />
            </View>
          </View>

          {/* Step 4 */}
          <View style={[styles.timelineItem, { marginBottom: 0 }]}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Targeted Repair</Text>
              <Text style={styles.stepDescription}>
                In the evening, apply a thin layer of benzoyl peroxide or
                retinoid only on active breakouts. Avoid picking!
              </Text>
              <View style={styles.doctorTip}>
                <View style={styles.doctorTipHeader}>
                  <Info size={20} color={colors.chart3} />
                  <Text style={styles.doctorTipTitle}>Expert Suggestion</Text>
                </View>
                <Text style={styles.doctorTipText}>
                  Consider starting with retinoids only 2-3 times a week at
                  night to build tolerance. Consult a dermatologist for
                  personalized advice.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable style={styles.ctaButton}>
            <CheckCircle size={24} color={colors.primary} />
            <Text style={styles.ctaText}>Mark Today's Routine Complete</Text>
          </Pressable>
          <Text style={styles.disclaimer}>
            Results typically visible in 4-6 weeks of consistent use. Contact a
            professional if irritation persists.
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
  protocolBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 24,
    backgroundColor: colors.primary + "1A",
    borderWidth: 1,
    borderColor: colors.primary + "33",
    marginBottom: 32,
  },
  protocolIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  protocolSubtitle: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  timeline: {
    position: "relative",
    marginBottom: 32,
  },
  timelineLine: {
    position: "absolute",
    left: 19,
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 48,
  },
  stepNumber: {
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
    zIndex: 1,
  },
  stepNumberText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 24,
    marginBottom: 16,
  },
  stepImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border + "80",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.chart1,
  },
  doctorTip: {
    backgroundColor: colors.chart5 + "4D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.chart5 + "80",
    padding: 16,
  },
  doctorTipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  doctorTipTitle: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  doctorTipText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
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
