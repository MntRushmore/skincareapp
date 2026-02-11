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
  Heart,
  Star,
  ShoppingCart,
  Check,
  Info,
  Sparkles,
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

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  // Product data based on ID from params
  const products = {
    1: {
      id: 1,
      name: "Vitamin C Serum",
      brand: "The Ordinary",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      rating: 4.8,
      reviews: 2341,
      price: "$12.99",
      tag: "Brightening",
      description:
        "A highly stable, water-free solution of 30% pure L-Ascorbic Acid. This lightweight serum brightens skin tone, improves radiance, and reduces signs of aging.",
      benefits: [
        "Brightens skin tone and reduces dark spots",
        "Powerful antioxidant protection",
        "Boosts collagen production",
        "Improves overall skin texture",
      ],
      ingredients:
        "Ascorbic Acid, Propanediol, Ascorbyl Glucoside, Sodium Hyaluronate",
      howToUse:
        "Apply a few drops to face in the AM or PM. Avoid contact with eyes. Use sunscreen during the day.",
    },
    2: {
      id: 2,
      name: "Hyaluronic Acid",
      brand: "CeraVe",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      rating: 4.7,
      reviews: 1823,
      price: "$18.99",
      tag: "Hydrating",
      description:
        "Intensely hydrating serum with pure hyaluronic acid that holds up to 1000x its weight in water. Plumps and smooths skin while strengthening the moisture barrier.",
      benefits: [
        "Deeply hydrates all skin layers",
        "Plumps fine lines and wrinkles",
        "Improves skin elasticity",
        "Suitable for all skin types",
      ],
      ingredients: "Hyaluronic Acid, Glycerin, Ceramides, Niacinamide",
      howToUse:
        "Apply to damp skin twice daily. Follow with moisturizer to lock in hydration.",
    },
    3: {
      id: 3,
      name: "Retinol Night Cream",
      brand: "Neutrogena",
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
      rating: 4.6,
      reviews: 1456,
      price: "$24.99",
      tag: "Anti-Aging",
      description:
        "Advanced anti-aging night cream with retinol to visibly reduce wrinkles, even skin tone, and improve texture while you sleep.",
      benefits: [
        "Reduces fine lines and wrinkles",
        "Evens skin tone and texture",
        "Boosts cell turnover overnight",
        "Gentle formula for nightly use",
      ],
      ingredients: "Retinol, Hyaluronic Acid, Vitamin E, Glucose Complex",
      howToUse:
        "Apply at night to clean, dry skin. Start 2-3 times per week, gradually increase. Always use SPF during the day.",
    },
  };

  const product = products[params.id] || products["1"];

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <Pressable
            style={[styles.backButton, { top: 12 }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
          <Pressable style={[styles.favoriteButton, { top: 12 }]}>
            <Heart size={24} color={colors.destructive} />
          </Pressable>
          <View style={styles.productTag}>
            <Text style={styles.productTagText}>{product.tag}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Star size={18} color={colors.chart2} fill={colors.chart2} />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewsText}>
                ({product.reviews} reviews)
              </Text>
            </View>
            <Text style={styles.price}>{product.price}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <View style={styles.checkIcon}>
                  <Check size={16} color={colors.primary} />
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Info size={18} color={colors.mutedForeground} />
            </View>
            <Text style={styles.ingredientsText}>{product.ingredients}</Text>
          </View>

          {/* How to Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use</Text>
            <Text style={styles.howToUseText}>{product.howToUse}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.addToCartButton}>
          <ShoppingCart size={20} color={colors.primaryForeground} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
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
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    height: 400,
    backgroundColor: colors.muted,
  },
  productImage: {
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
  favoriteButton: {
    position: "absolute",
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background + "F0",
    alignItems: "center",
    justifyContent: "center",
  },
  productTag: {
    position: "absolute",
    bottom: 20,
    left: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  productTagText: {
    fontSize: 13,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  content: {
    padding: 24,
  },
  brand: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  productName: {
    fontSize: 28,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
    lineHeight: 34,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  reviewsText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  price: {
    fontSize: 28,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.primary,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 24,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    lineHeight: 22,
  },
  ingredientsText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  howToUseText: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    lineHeight: 24,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
});
