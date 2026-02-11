import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          id: 1,
          question: "How do I analyze my skin?",
          answer:
            "Simply tap the Camera tab, take a clear photo of your face in good lighting, and our AI will analyze your skin type, texture, and recommend personalized treatments.",
        },
        {
          id: 2,
          question: "What skin types can be detected?",
          answer:
            "Our app can detect normal, dry, oily, combination, and sensitive skin types. We also identify specific concerns like acne, aging, pigmentation, and more.",
        },
        {
          id: 3,
          question: "How accurate is the skin analysis?",
          answer:
            "Our AI model has been trained on millions of skin images and achieves over 90% accuracy. For best results, take photos in natural daylight without makeup.",
        },
      ],
    },
    {
      id: "skin-analysis",
      title: "Skin Analysis",
      icon: "🔍",
      questions: [
        {
          id: 4,
          question: "Can I save multiple skin scans?",
          answer:
            "Yes! Your scan history is automatically saved in the Scan tab. You can track changes over time and compare results from different dates.",
        },
        {
          id: 5,
          question: "What lighting is best for scanning?",
          answer:
            "Natural daylight works best. Avoid direct sunlight or harsh indoor lighting. A well-lit room with diffused light gives the most accurate results.",
        },
        {
          id: 6,
          question: "Should I wear makeup during scanning?",
          answer:
            "No, please ensure your face is clean and makeup-free for the most accurate analysis. Makeup can interfere with skin texture and tone detection.",
        },
      ],
    },
    {
      id: "products",
      title: "Product Recommendations",
      icon: "✨",
      questions: [
        {
          id: 7,
          question: "How are products recommended?",
          answer:
            "Products are matched to your specific skin type, concerns, and goals using our AI algorithm. We prioritize ingredients proven to work for your skin profile.",
        },
        {
          id: 8,
          question: "Can I filter by price range?",
          answer:
            "Yes! In the Discover tab, you can filter products by price, brand, ingredients, and ratings to find options that fit your budget.",
        },
        {
          id: 9,
          question: "Are the products affiliate links?",
          answer:
            "Some product links are affiliate partnerships, which help us keep the app free. We only recommend products that meet our quality standards.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Privacy",
      icon: "🔒",
      questions: [
        {
          id: 10,
          question: "Is my data secure?",
          answer:
            "Absolutely. All photos and data are encrypted end-to-end. We never share your personal information with third parties without your explicit consent.",
        },
        {
          id: 11,
          question: "Can I delete my scan history?",
          answer:
            "Yes, you can delete individual scans or your entire history from the Scan tab. Go to scan details and tap the delete icon.",
        },
        {
          id: 12,
          question: "How do I update my email or password?",
          answer:
            "Go to Profile > Security & Login to update your email, password, or enable two-factor authentication for added security.",
        },
      ],
    },
  ];

  const contactOptions = [
    {
      id: "email",
      title: "Email Support",
      description: "support@skincare.app",
      icon: Mail,
      color: colors.chart2,
      availability: "Response within 24 hours",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            Search for answers or browse topics below
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.mutedForeground} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          {contactOptions.map((option) => (
            <Pressable key={option.id} style={styles.contactCard}>
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: option.color + "1A" },
                ]}
              >
                <option.icon size={24} color={option.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>
                  {option.description}
                </Text>
                <Text style={styles.contactAvailability}>
                  {option.availability}
                </Text>
              </View>
              <ExternalLink size={20} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* FAQ Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>

          {faqCategories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>

              {category.questions.map((item) => (
                <View key={item.id} style={styles.faqItem}>
                  <Pressable
                    style={styles.faqQuestion}
                    onPress={() => toggleExpand(item.id)}
                  >
                    <Text style={styles.questionText}>{item.question}</Text>
                    {expandedId === item.id ? (
                      <ChevronUp size={20} color={colors.primary} />
                    ) : (
                      <ChevronDown size={20} color={colors.mutedForeground} />
                    )}
                  </Pressable>

                  {expandedId === item.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Still Need Help Card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpCardTitle}>Still need help?</Text>
          <Text style={styles.helpCardDescription}>
            Can't find what you're looking for? Our support team is here to
            assist you.
          </Text>
          <Pressable style={styles.helpButton}>
            <Mail size={20} color={colors.primaryForeground} />
            <Text style={styles.helpButtonText}>Email Support</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted + "80",
    borderWidth: 1,
    borderColor: colors.border + "80",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    marginBottom: 24,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.primary,
    marginBottom: 2,
  },
  contactAvailability: {
    fontSize: 12,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
  },
  faqItem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 8,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
    marginRight: 12,
    lineHeight: 20,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  helpCardTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.primaryForeground,
    marginBottom: 8,
    textAlign: "center",
  },
  helpCardDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.primaryForeground,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 24,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
});
