import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Leaf, ArrowRight, CheckCircle } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  if (!loaded) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Pressable onPress={() => router.push("/(tabs)/home")}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.gradientBlur} />

        {/* Image with Badge */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/generation-assets/photos/wellness-centers/portrait/3.webp",
            }}
            style={styles.image}
          />
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Leaf size={20} color={colors.primaryForeground} />
            </View>
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>Daily Calm</Text>
              <Text style={styles.badgeSubtitle}>Streak: 12 days</Text>
            </View>
            <CheckCircle size={24} color={colors.primary} />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>
            Find Your <Text style={styles.titleAccent}>Balance</Text>
          </Text>
          <Text style={styles.description}>
            Discover daily routines that bring peace, mindfulness, and clarity
            to your busy life.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* CTA Button */}
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <ArrowRight size={20} color={colors.primaryForeground} />
        </Pressable>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text style={styles.signInLink}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
  },
  gradientBlur: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "120%",
    height: "50%",
    backgroundColor: colors.primary + "1A",
    borderRadius: 999,
    transform: [{ translateX: -200 }, { translateY: -150 }],
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 5,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  badgeSubtitle: {
    fontSize: 10,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  textContent: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 16,
  },
  titleAccent: {
    color: colors.primary,
  },
  description: {
    fontSize: 18,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: "90%",
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 32,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    gap: 8,
  },
  dotActive: {
    width: 32,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  signInLink: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
});
