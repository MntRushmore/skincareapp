import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Clock, BookOpen, Share2 } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function ArticleDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const articles = {
    featured: {
      id: "featured",
      title: "Winter Skincare Essentials",
      excerpt:
        "Protect your skin from harsh weather with expert tips for the cold season.",
      image:
        "https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80",
      readTime: "6 min read",
      category: "Seasonal",
      author: "Dr. Emily Roberts",
      date: "January 27, 2026",
      content: [
        {
          type: "paragraph",
          text: "Winter can be harsh on your skin. Cold temperatures, low humidity, and indoor heating can strip moisture from your skin, leading to dryness, flakiness, and irritation. But with the right routine, you can keep your skin healthy and glowing all season long.",
        },
        {
          type: "heading",
          text: "Switch to a Richer Moisturizer",
        },
        {
          type: "paragraph",
          text: "Your lightweight summer moisturizer won't cut it in winter. Switch to a richer, cream-based formula with ingredients like ceramides, shea butter, and squalane. These create a protective barrier to lock in moisture and shield skin from harsh elements.",
        },
        {
          type: "heading",
          text: "Don't Skip Sunscreen",
        },
        {
          type: "paragraph",
          text: "UV rays are just as damaging in winter, especially when reflected off snow. Continue using broad-spectrum SPF 30 or higher daily. Look for formulas with added moisturizing benefits for extra protection.",
        },
        {
          type: "heading",
          text: "Add a Facial Oil",
        },
        {
          type: "paragraph",
          text: "Layer a nourishing facial oil over your moisturizer at night. Oils like rosehip, marula, and jojoba provide an extra layer of protection and help repair your skin barrier while you sleep.",
        },
        {
          type: "heading",
          text: "Use a Humidifier",
        },
        {
          type: "paragraph",
          text: "Indoor heating zaps moisture from the air. Running a humidifier in your bedroom at night helps maintain optimal humidity levels (40-60%), preventing your skin from drying out overnight.",
        },
        {
          type: "heading",
          text: "Gentle Cleansing is Key",
        },
        {
          type: "paragraph",
          text: "Avoid harsh, foaming cleansers that strip your skin's natural oils. Switch to a creamy, hydrating cleanser that cleans without over-drying. Consider cleansing only once a day (at night) and just rinsing with water in the morning.",
        },
        {
          type: "heading",
          text: "Exfoliate Wisely",
        },
        {
          type: "paragraph",
          text: "Dead skin cells can build up in winter, making your skin look dull. But don't over-exfoliate! Use a gentle chemical exfoliant (like lactic acid) once or twice a week, not harsh scrubs that can damage your skin barrier.",
        },
        {
          type: "heading",
          text: "Protect Your Hands and Lips",
        },
        {
          type: "paragraph",
          text: "Don't forget these exposed areas! Keep a rich hand cream in your bag and apply it after every hand wash. Use a nourishing lip balm with SPF throughout the day and a thicker treatment at night.",
        },
        {
          type: "paragraph",
          text: "With these adjustments to your routine, your skin will stay comfortable, hydrated, and healthy all winter long.",
        },
      ],
    },
    1: {
      id: 1,
      title: "Understanding Your Skin Type",
      excerpt:
        "Learn how to identify your skin type and choose the right products for your unique needs.",
      image:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
      readTime: "5 min read",
      category: "Basics",
      author: "Dr. Sarah Johnson",
      date: "January 25, 2026",
      content: [
        {
          type: "paragraph",
          text: "Understanding your skin type is the foundation of an effective skincare routine. Your skin type determines which products will work best for you and which ingredients to avoid.",
        },
        {
          type: "heading",
          text: "The Five Main Skin Types",
        },
        {
          type: "paragraph",
          text: "There are five main skin types: normal, dry, oily, combination, and sensitive. Each type has unique characteristics and requires different care approaches.",
        },
        {
          type: "heading",
          text: "Normal Skin",
        },
        {
          type: "paragraph",
          text: "Normal skin is well-balanced, not too oily or too dry. It has a smooth texture, few imperfections, and small pores. If you have normal skin, you're lucky! Your main goal is to maintain this balance with gentle cleansers and lightweight moisturizers.",
        },
        {
          type: "heading",
          text: "Dry Skin",
        },
        {
          type: "paragraph",
          text: "Dry skin feels tight and may appear flaky or rough. It's often dull and shows fine lines more easily. Look for rich, creamy moisturizers with ingredients like hyaluronic acid, ceramides, and glycerin.",
        },
        {
          type: "heading",
          text: "Oily Skin",
        },
        {
          type: "paragraph",
          text: "Oily skin produces excess sebum, leading to a shiny appearance and enlarged pores. While it's prone to acne, oily skin tends to age more slowly. Use oil-free, non-comedogenic products and ingredients like salicylic acid and niacinamide.",
        },
        {
          type: "heading",
          text: "Combination Skin",
        },
        {
          type: "paragraph",
          text: "Combination skin is oily in the T-zone (forehead, nose, and chin) but normal or dry on the cheeks. You may need to use different products on different areas of your face.",
        },
        {
          type: "heading",
          text: "Sensitive Skin",
        },
        {
          type: "paragraph",
          text: "Sensitive skin is easily irritated and may react to certain ingredients with redness, itching, or burning. Choose fragrance-free, hypoallergenic products and patch test new items before full application.",
        },
        {
          type: "heading",
          text: "How to Determine Your Skin Type",
        },
        {
          type: "paragraph",
          text: "The simplest way is the 'bare-faced test.' Wash your face with a gentle cleanser, pat dry, and wait 30 minutes without applying any products. Observe how your skin feels:\n\n• Tight and flaky? You likely have dry skin.\n• Shiny all over? You have oily skin.\n• Shiny only in the T-zone? You have combination skin.\n• Comfortable with no excess shine? You have normal skin.\n• Red or irritated? You may have sensitive skin.",
        },
        {
          type: "paragraph",
          text: "Remember, your skin type can change with age, climate, diet, and hormones. Reassess periodically and adjust your routine as needed.",
        },
      ],
    },
    2: {
      id: 2,
      title: "The Science of Serums",
      excerpt:
        "Discover how active ingredients penetrate your skin and deliver powerful results.",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
      readTime: "7 min read",
      category: "Advanced",
      author: "Dr. Michael Chen",
      date: "January 23, 2026",
      content: [
        {
          type: "paragraph",
          text: "Serums are concentrated skincare products designed to deliver high concentrations of active ingredients deep into the skin. Unlike moisturizers, which primarily work on the surface, serums penetrate multiple layers of skin to target specific concerns.",
        },
        {
          type: "heading",
          text: "What Makes Serums Different?",
        },
        {
          type: "paragraph",
          text: "Serums have a lightweight, fast-absorbing texture that allows active ingredients to penetrate more effectively. They contain smaller molecules than creams and lotions, enabling deeper skin penetration.",
        },
        {
          type: "heading",
          text: "Key Active Ingredients",
        },
        {
          type: "paragraph",
          text: "Vitamin C is a powerful antioxidant that brightens skin, reduces hyperpigmentation, and stimulates collagen production. Look for L-ascorbic acid in concentrations of 10-20% for optimal results.",
        },
        {
          type: "paragraph",
          text: "Hyaluronic acid is a humectant that can hold up to 1000 times its weight in water. It plumps the skin, reduces the appearance of fine lines, and improves overall hydration.",
        },
        {
          type: "paragraph",
          text: "Retinol (Vitamin A) is the gold standard for anti-aging. It increases cell turnover, boosts collagen production, and improves skin texture. Start with a low concentration (0.25-0.5%) and gradually increase.",
        },
        {
          type: "paragraph",
          text: "Niacinamide (Vitamin B3) is a versatile ingredient that regulates oil production, minimizes pores, improves skin barrier function, and reduces inflammation.",
        },
        {
          type: "heading",
          text: "How to Layer Serums",
        },
        {
          type: "paragraph",
          text: "When using multiple serums, apply them in order of thinnest to thickest consistency. Generally, water-based serums go first, followed by oil-based ones. Wait 30-60 seconds between each layer to allow proper absorption.",
        },
        {
          type: "paragraph",
          text: "A typical morning routine might include: Vitamin C serum → Hyaluronic acid serum → Moisturizer → SPF",
        },
        {
          type: "paragraph",
          text: "A typical evening routine might include: Retinol serum → Hyaluronic acid serum → Moisturizer",
        },
        {
          type: "heading",
          text: "Common Mistakes to Avoid",
        },
        {
          type: "paragraph",
          text: "Don't use too much product. A few drops (about a pea-sized amount) is sufficient for the entire face. Using more won't make it work better and may irritate your skin.",
        },
        {
          type: "paragraph",
          text: "Avoid mixing certain ingredients. For example, vitamin C and retinol shouldn't be used together as they can destabilize each other. Use vitamin C in the morning and retinol at night.",
        },
        {
          type: "paragraph",
          text: "Be patient. Active ingredients take time to show results. Most serums require 4-12 weeks of consistent use before you'll see significant improvements.",
        },
        {
          type: "paragraph",
          text: "With the right serum and proper application, you can address a wide range of skin concerns and achieve healthier, more radiant skin.",
        },
      ],
    },
  };

  const article = articles[params.id] || articles["1"];

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: article.image }} style={styles.articleImage} />
          <Pressable
            style={[styles.backButton, { top: 12 }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.author}>By {article.author}</Text>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.mutedForeground} />
              <Text style={styles.readTime}>{article.readTime}</Text>
            </View>
          </View>

          <Text style={styles.date}>{article.date}</Text>

          <View style={styles.divider} />

          {article.content.map((block, index) => {
            if (block.type === "heading") {
              return (
                <Text key={index} style={styles.heading}>
                  {block.text}
                </Text>
              );
            }
            return (
              <Text key={index} style={styles.paragraph}>
                {block.text}
              </Text>
            );
          })}

          <Pressable style={styles.shareButton}>
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.shareText}>Share Article</Text>
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
  scrollContent: {},
  imageContainer: {
    position: "relative",
    height: 300,
    backgroundColor: colors.muted,
  },
  articleImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background + "F0",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 20,
    left: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
    lineHeight: 40,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readTime: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  date: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 28,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    lineHeight: 26,
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.primary + "20",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 32,
  },
  shareText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primary,
  },
});
