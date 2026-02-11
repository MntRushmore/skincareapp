import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Shield,
  Scale,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const sections = [
    {
      id: 1,
      icon: FileText,
      color: colors.chart1,
      title: "Acceptance of Terms",
      content:
        "By accessing and using this skincare analysis application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      id: 2,
      icon: Shield,
      color: colors.chart2,
      title: "Use of Service",
      content:
        "Our service provides AI-powered skin analysis and product recommendations. You agree to use the service only for lawful purposes and in accordance with these Terms. You must not use our service:\n\n• In any way that violates any applicable national or international law\n• To transmit, or procure the sending of, any advertising or promotional material\n• To impersonate or attempt to impersonate the company, employee, another user, or any other person",
    },
    {
      id: 3,
      icon: AlertCircle,
      color: colors.chart3,
      title: "Medical Disclaimer",
      content:
        "IMPORTANT: This app provides general skincare information and recommendations only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.\n\n• Always seek the advice of your physician or qualified health provider\n• Never disregard professional medical advice because of something you have read in this app\n• If you have a medical emergency, call your doctor or emergency services immediately\n• We are not liable for any adverse reactions or consequences from following our recommendations",
    },
    {
      id: 4,
      icon: CheckCircle2,
      color: colors.chart4,
      title: "User Accounts",
      content:
        "When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.\n\nYou are responsible for:\n• Safeguarding the password you use to access the service\n• Any activities or actions under your password\n• Notifying us immediately of any unauthorized use of your account",
    },
    {
      id: 5,
      icon: Shield,
      color: colors.primary,
      title: "Privacy & Data",
      content:
        "Your privacy is important to us. We collect and use personal information including photos of your face for skin analysis purposes only.\n\n• All photos are encrypted and stored securely\n• We never share your personal data with third parties without consent\n• You can request deletion of your data at any time\n• See our Privacy Policy for complete details on data handling",
    },
    {
      id: 6,
      icon: Scale,
      color: colors.chart1,
      title: "Intellectual Property",
      content:
        "The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.\n\nOur trademarks and trade dress may not be used in connection with any product or service without prior written consent.",
    },
    {
      id: 7,
      icon: AlertCircle,
      color: colors.destructive,
      title: "Limitation of Liability",
      content:
        "In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:\n\n• Your access to or use of or inability to access or use the service\n• Any conduct or content of any third party on the service\n• Any content obtained from the service\n• Unauthorized access, use or alteration of your transmissions or content",
    },
    {
      id: 8,
      icon: FileText,
      color: colors.chart2,
      title: "Changes to Terms",
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.\n\nWhat constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.",
    },
    {
      id: 9,
      icon: Scale,
      color: colors.chart4,
      title: "Governing Law",
      content:
        "These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.\n\nOur failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
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
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <FileText size={32} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroSubtitle}>
            Last updated: January 27, 2026
          </Text>
          <Text style={styles.heroDescription}>
            Please read these terms and conditions carefully before using our
            skincare analysis service.
          </Text>
        </View>

        {/* Quick Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quick Summary</Text>
          <View style={styles.summaryItem}>
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={styles.summaryText}>
              This app is for informational purposes only
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={styles.summaryText}>
              Always consult a dermatologist for medical advice
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={styles.summaryText}>
              Your data is encrypted and secure
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={styles.summaryText}>
              You must be 13+ to use this service
            </Text>
          </View>
        </View>

        {/* Terms Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILED TERMS</Text>

          {sections.map((section, index) => (
            <View key={section.id} style={styles.termCard}>
              <View style={styles.termHeader}>
                <View
                  style={[
                    styles.termIcon,
                    { backgroundColor: section.color + "1A" },
                  ]}
                >
                  <section.icon size={24} color={section.color} />
                </View>
                <View style={styles.termNumber}>
                  <Text style={styles.termNumberText}>{index + 1}</Text>
                </View>
              </View>
              <Text style={styles.termTitle}>{section.title}</Text>
              <Text style={styles.termContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Questions about our Terms?</Text>
          <Text style={styles.contactDescription}>
            If you have any questions about these Terms and Conditions, please
            contact us.
          </Text>
          <Pressable
            style={styles.contactButton}
            onPress={() => router.push("/help-center")}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using our service, you acknowledge that you have read and
            understood these Terms and Conditions and agree to be bound by them.
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
    alignItems: "center",
    marginBottom: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    lineHeight: 20,
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
  termCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  termIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  termNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  termNumberText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  termTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 12,
    lineHeight: 26,
  },
  termContent: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.primaryForeground,
    marginBottom: 8,
    textAlign: "center",
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.primaryForeground,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 24,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  footer: {
    backgroundColor: colors.muted + "80",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
});
