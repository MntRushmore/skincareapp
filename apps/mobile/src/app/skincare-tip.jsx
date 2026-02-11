import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Sun,
  Droplets,
  Leaf,
  Zap,
  Check,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function SkincareTipScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const tips = {
    1: {
      id: 1,
      title: "Morning Skincare Routine",
      description: "Start your day with these essential steps",
      icon: Sun,
      color: colors.chart2,
      steps: [
        {
          step: 1,
          title: "Gentle Cleanser",
          description:
            "Start with a mild cleanser to remove overnight oil and impurities without stripping your skin.",
        },
        {
          step: 2,
          title: "Toner or Essence",
          description:
            "Apply a hydrating toner to balance your skin's pH and prep it for better absorption of serums.",
        },
        {
          step: 3,
          title: "Vitamin C Serum",
          description:
            "Use an antioxidant serum like Vitamin C to protect against environmental damage and brighten your complexion.",
        },
        {
          step: 4,
          title: "Moisturizer",
          description:
            "Lock in hydration with a lightweight moisturizer suited to your skin type.",
        },
        {
          step: 5,
          title: "Sunscreen (SPF 30+)",
          description:
            "Never skip sunscreen! Apply broad-spectrum SPF 30 or higher as the final step, even on cloudy days.",
        },
      ],
    },
    2: {
      id: 2,
      title: "Hydration Secrets",
      description: "Keep your skin plump and moisturized",
      icon: Droplets,
      color: colors.chart1,
      steps: [
        {
          step: 1,
          title: "Drink Water",
          description:
            "Aim for at least 8 glasses of water daily to hydrate your skin from within.",
        },
        {
          step: 2,
          title: "Hyaluronic Acid",
          description:
            "Use a hyaluronic acid serum on damp skin to lock in moisture and plump fine lines.",
        },
        {
          step: 3,
          title: "Humidifier",
          description:
            "Run a humidifier at night to prevent moisture loss, especially in dry climates or during winter.",
        },
        {
          step: 4,
          title: "Avoid Hot Water",
          description:
            "Wash your face with lukewarm water. Hot water strips natural oils and can cause dryness.",
        },
      ],
    },
    3: {
      id: 3,
      title: "Natural Ingredients",
      description: "Discover the power of botanical skincare",
      icon: Leaf,
      color: colors.chart4,
      steps: [
        {
          step: 1,
          title: "Aloe Vera",
          description:
            "Soothes irritation, reduces inflammation, and provides deep hydration. Perfect for sensitive or sunburned skin.",
        },
        {
          step: 2,
          title: "Green Tea Extract",
          description:
            "Rich in antioxidants, it fights free radicals, reduces redness, and has anti-aging properties.",
        },
        {
          step: 3,
          title: "Rosehip Oil",
          description:
            "Packed with vitamins A and C, it brightens skin, fades scars, and improves texture.",
        },
        {
          step: 4,
          title: "Chamomile",
          description:
            "Calms inflammation, soothes redness, and is ideal for sensitive or reactive skin.",
        },
        {
          step: 5,
          title: "Turmeric",
          description:
            "Natural anti-inflammatory with brightening properties. Mix with honey for a DIY face mask.",
        },
        {
          step: 6,
          title: "Jojoba Oil",
          description:
            "Mimics skin's natural sebum, making it great for all skin types, even oily skin.",
        },
      ],
    },
    4: {
      id: 4,
      title: "Quick Glow Boost",
      description: "Get radiant skin in just 10 minutes",
      icon: Zap,
      color: colors.chart3,
      steps: [
        {
          step: 1,
          title: "Ice Facial",
          description:
            "Wrap an ice cube in a soft cloth and massage your face for 1-2 minutes. This reduces puffiness and boosts circulation.",
        },
        {
          step: 2,
          title: "Brightening Mask",
          description:
            "Apply a sheet mask or clay mask with Vitamin C or niacinamide for instant radiance.",
        },
        {
          step: 3,
          title: "Facial Massage",
          description:
            "Use your fingertips or a jade roller to massage your face in upward motions. This improves blood flow and gives you a natural glow.",
        },
      ],
    },
  };

  const tip = tips[params.id] || tips["1"];
  const Icon = tip.icon;

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: tip.color + "20" },
            ]}
          >
            <Icon size={40} color={tip.color} />
          </View>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.description}>{tip.description}</Text>
          <View style={styles.stepsBadge}>
            <Text style={styles.stepsBadgeText}>{tip.steps.length} Steps</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {tip.steps.map((stepItem, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View
                  style={[styles.stepNumber, { backgroundColor: tip.color }]}
                >
                  <Text style={styles.stepNumberText}>{stepItem.step}</Text>
                </View>
                <Text style={styles.stepTitle}>{stepItem.title}</Text>
              </View>
              <Text style={styles.stepDescription}>{stepItem.description}</Text>
              {index < tip.steps.length - 1 && (
                <View style={styles.stepDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaCard}>
          <Check size={24} color={colors.primary} />
          <Text style={styles.ctaText}>
            Follow these steps consistently for best results!
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
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  stepsBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepsBadgeText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  stepTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  stepDescription: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 24,
    marginLeft: 52,
  },
  stepDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 16,
  },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primary + "10",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  ctaText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
    lineHeight: 22,
  },
});
