import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, ArrowRight } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { useAuth } from "@/utils/auth/useAuth";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  if (!loaded) return null;

  const handleSignIn = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          action: "signin",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Sign in failed");
      }
      const data = await response.json();

      // Save auth data to store
      setAuth({
        jwt: data.token,
        user: data.user,
      });

      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.foreground} />
          </Pressable>
          <View style={{ width: 48 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Welcome <Text style={styles.titleAccent}>Back</Text>
            </Text>
            <Text style={styles.description}>
              Sign in to continue your skincare journey.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail
                size={20}
                color={colors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor={colors.mutedForeground + "99"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock
                size={20}
                color={colors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground + "99"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={[styles.input, { paddingRight: 48 }]}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye size={20} color={colors.mutedForeground} />
                ) : (
                  <Lock size={20} color={colors.mutedForeground} />
                )}
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.ctaButton, loading && styles.ctaButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={styles.ctaText}>Sign In</Text>
                <ArrowRight size={20} color={colors.primaryForeground} />
              </>
            )}
          </Pressable>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>New to the community? </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.signUpLink}>Join Now</Text>
            </Pressable>
          </View>
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
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    flex: 1,
    gap: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    lineHeight: 38,
    marginBottom: 12,
  },
  titleAccent: {
    color: colors.primary,
  },
  description: {
    fontSize: 18,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 26,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.foreground,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.foreground,
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 8,
    position: "absolute",
    right: 8,
  },
  errorContainer: {
    backgroundColor: colors.destructive + "15",
    borderWidth: 1,
    borderColor: colors.destructive + "33",
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.destructive,
    lineHeight: 20,
  },
  footer: {
    paddingTop: 32,
    gap: 24,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
});
