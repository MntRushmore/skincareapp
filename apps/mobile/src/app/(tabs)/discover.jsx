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
  Sparkles,
  BookOpen,
  Heart,
  ArrowRight,
  Sun,
  Droplets,
  Leaf,
  Zap,
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

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const skincareTips = [
    {
      id: 1,
      title: "Morning Skincare Routine",
      description: "Start your day with these essential steps",
      icon: Sun,
      color: colors.chart2,
      steps: 5,
    },
    {
      id: 2,
      title: "Hydration Secrets",
      description: "Keep your skin plump and moisturized",
      icon: Droplets,
      color: colors.chart1,
      steps: 4,
    },
    {
      id: 3,
      title: "Natural Ingredients",
      description: "Discover the power of botanical skincare",
      icon: Leaf,
      color: colors.chart4,
      steps: 6,
    },
    {
      id: 4,
      title: "Quick Glow Boost",
      description: "Get radiant skin in just 10 minutes",
      icon: Zap,
      color: colors.chart3,
      steps: 3,
    },
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding Your Skin Type",
      excerpt:
        "Learn how to identify your skin type and choose the right products for your unique needs.",
      image:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
      readTime: "5 min read",
      category: "Basics",
    },
    {
      id: 2,
      title: "The Science of Serums",
      excerpt:
        "Discover how active ingredients penetrate your skin and deliver powerful results.",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
      readTime: "7 min read",
      category: "Advanced",
    },
  ];

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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>SKINCARE TIPS & ARTICLES</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <Heart size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Featured Banner */}
        <Pressable
          style={styles.featuredBanner}
          onPress={() => router.push("/article-detail?id=featured")}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80",
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerBadge}>
              <Sparkles size={14} color={colors.primary} />
              <Text style={styles.bannerBadgeText}>Featured Article</Text>
            </View>
            <Text style={styles.bannerTitle}>
              Winter Skincare{"\n"}Essentials
            </Text>
            <Text style={styles.bannerDescription}>
              Protect your skin from harsh weather with expert tips
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Read Now</Text>
              <ArrowRight size={16} color={colors.primaryForeground} />
            </View>
          </View>
        </Pressable>

        {/* Skincare Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrapper}>
              <BookOpen size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Skincare Tips</Text>
            </View>
          </View>

          <View style={styles.tipsGrid}>
            {skincareTips.map((tip) => (
              <Pressable
                key={tip.id}
                style={styles.tipCard}
                onPress={() => router.push(`/skincare-tip?id=${tip.id}`)}
              >
                <View
                  style={[
                    styles.tipIcon,
                    { backgroundColor: tip.color + "20" },
                  ]}
                >
                  <tip.icon size={24} color={tip.color} />
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
                <View style={styles.tipFooter}>
                  <Text style={styles.tipSteps}>{tip.steps} steps</Text>
                  <ArrowRight size={16} color={colors.primary} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Educational Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrapper}>
              <Sparkles size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Learn More</Text>
            </View>
            <Pressable>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          {articles.map((article) => (
            <Pressable
              key={article.id}
              style={styles.articleCard}
              onPress={() => router.push(`/article-detail?id=${article.id}`)}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <View style={styles.articleMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                  <Text style={styles.readTime}>{article.readTime}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleExcerpt} numberOfLines={2}>
                  {article.excerpt}
                </Text>
                <View style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <ArrowRight size={14} color={colors.primary} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* CTA Card */}
        <View style={styles.ctaCard}>
          <Sparkles size={32} color={colors.primaryForeground} />
          <Text style={styles.ctaTitle}>Ready to Analyze Your Skin?</Text>
          <Text style={styles.ctaDescription}>
            Get personalized product recommendations based on your unique skin
            type
          </Text>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/(tabs)/camera")}
          >
            <Text style={styles.ctaButtonText}>Start Analysis</Text>
            <ArrowRight size={20} color={colors.background} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    letterSpacing: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredBanner: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 24,
    justifyContent: "flex-end",
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.background,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  bannerBadgeText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  bannerTitle: {
    fontSize: 28,
    fontFamily: "BricolageGrotesque_700Bold",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 34,
  },
  bannerDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: "#fff",
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bannerButtonText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  tipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tipCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 6,
    lineHeight: 20,
  },
  tipDescription: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 12,
    lineHeight: 18,
  },
  tipFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipSteps: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  articleCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  articleImage: {
    width: "100%",
    height: 160,
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  readTime: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.primaryForeground,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.primaryForeground,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
});
