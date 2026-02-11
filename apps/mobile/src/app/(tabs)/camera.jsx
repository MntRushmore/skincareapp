import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Zap, RotateCw, X, Crown } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../constants/theme";
import { useRouter } from "expo-router";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useScanLimit from "../../utils/use-scan-limit";
import useSubscription from "../../utils/use-subscription";

export default function CameraScreen() {
  // Hooks must be called first, before any conditional returns
  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_700Bold,
    BricolageGrotesque_700Bold,
  });

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [facing, setFacing] = useState("front");
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bodyPart, setBodyPart] = useState("face"); // face, hand, arm
  const cameraRef = useRef(null);
  const [hasGivenConsent, setHasGivenConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { canScan, isPremium, scansRemaining, checkLimit, incrementScan } =
    useScanLimit();
  const { initiateSubscription } = useSubscription();

  // Load consent from storage on mount
  useEffect(() => {
    const loadConsent = async () => {
      const consent = await AsyncStorage.getItem("skinAnalysisConsent");
      if (consent === "true") {
        setHasGivenConsent(true);
      }
    };
    loadConsent();
  }, []);

  if (!loaded) return null;

  // Handle camera permissions
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <StatusBar style="dark" />
        <View
          style={[styles.permissionContent, { paddingTop: insets.top + 40 }]}
        >
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for skin analysis
          </Text>
          <Pressable
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    // Check scan limit first
    const limitCheck = await checkLimit();
    if (!limitCheck.canScan) {
      setShowUpgradeModal(true);
      return;
    }

    // Check if user has given consent
    if (!hasGivenConsent) {
      setShowConsentModal(true);
      return;
    }

    await performAnalysis();
  };

  const handleConsentAccept = async () => {
    await AsyncStorage.setItem("skinAnalysisConsent", "true");
    setHasGivenConsent(true);
    setShowConsentModal(false);
    await performAnalysis();
  };

  const performAnalysis = async () => {
    if (!cameraRef.current) return;

    try {
      setIsAnalyzing(true);

      console.log("[Camera] Taking picture...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      console.log("[Camera] Photo taken:", photo.uri);

      console.log("[Camera] Resizing and compressing image...");
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      // Create base64 data URL
      const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;
      console.log("[Camera] Base64 image ready, size:", base64Image.length);

      // Send to analysis API with timeout
      console.log("[Camera] Sending to analysis API...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error("[Camera] Request timeout after 60s");
        controller.abort();
      }, 60000);

      const response = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUri: base64Image,
          bodyPart: bodyPart, // Pass the selected body part
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("[Camera] API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Camera] API error response:", errorText);
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("[Camera] Analysis complete!");

      // Increment scan count for free users
      if (!isPremium) {
        await incrementScan();
      }

      // Clear loading state before navigation
      setIsAnalyzing(false);

      // Navigate to results page
      router.push({
        pathname: "/(tabs)/scan",
        params: {
          analysis: JSON.stringify(result.analysis),
          imageUri: photo.uri,
          bodyPart: bodyPart,
        },
      });
    } catch (error) {
      console.error("[Camera] Error:", error);
      setIsAnalyzing(false);

      // Show user-friendly error
      alert(
        error.name === "AbortError"
          ? "Analysis timed out. Please try again."
          : `Failed to analyze: ${error.message}`,
      );
    }
  };

  const getGuideComponent = () => {
    if (bodyPart === "face") {
      return <View style={styles.faceMask} />;
    } else if (bodyPart === "hand") {
      return <View style={styles.handGuide} />;
    } else {
      return <View style={styles.armGuide} />;
    }
  };

  const getInstructionText = () => {
    if (bodyPart === "face") {
      return "Hold steady and align your face";
    } else if (bodyPart === "hand") {
      return "Center your hand in the frame";
    } else {
      return "Position your arm in the center";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Camera View - Full Screen */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        zoom={0}
      >
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.faceMaskContainer}>{getGuideComponent()}</View>
        </View>
      </CameraView>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <View style={styles.consentOverlay}>
          <View style={styles.upgradeModal}>
            <View style={styles.upgradeIcon}>
              <Crown size={32} color={colors.primary} />
            </View>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
            <Text style={styles.upgradeText}>
              You've used all {scansRemaining === 0 ? "5" : ""} of your free
              scans this month.
              {"\n\n"}
              Upgrade to Premium for unlimited skin scans and detailed analysis!
            </Text>
            <View style={styles.pricingBox}>
              <Text style={styles.pricingText}>Just $2.99/month</Text>
              <Text style={styles.pricingSubtext}>Cancel anytime</Text>
            </View>
            <View style={styles.upgradeButtons}>
              <Pressable
                style={styles.upgradeButtonSecondary}
                onPress={() => setShowUpgradeModal(false)}
              >
                <Text style={styles.upgradeButtonSecondaryText}>
                  Maybe Later
                </Text>
              </Pressable>
              <Pressable
                style={styles.upgradeButtonPrimary}
                onPress={() => {
                  setShowUpgradeModal(false);
                  initiateSubscription();
                }}
              >
                <Crown size={16} color={colors.primaryForeground} />
                <Text style={styles.upgradeButtonPrimaryText}>Upgrade Now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <View style={styles.consentOverlay}>
          <View style={styles.consentModal}>
            <Text style={styles.consentTitle}>Skin Analysis Consent</Text>
            <Text style={styles.consentText}>
              We'll analyze your photo to provide skin insights. Your photo will
              be processed securely and saved to your scan history.
            </Text>
            <View style={styles.consentButtons}>
              <Pressable
                style={styles.consentButtonSecondary}
                onPress={() => setShowConsentModal(false)}
              >
                <Text style={styles.consentButtonSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.consentButtonPrimary}
                onPress={handleConsentAccept}
              >
                <Text style={styles.consentButtonPrimaryText}>I Agree</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your skin...</Text>
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              console.log("[Camera] User cancelled analysis");
              setIsAnalyzing(false);
            }}
          >
            <X size={16} color="#fff" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Header - Overlay */}
      <View
        style={[styles.header, { paddingTop: insets.top + 12 }]}
        pointerEvents={isAnalyzing ? "none" : "auto"}
      >
        <View style={{ width: 40 }} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Skin Analysis</Text>
          {!isPremium && (
            <Text style={styles.scanCounter}>
              {scansRemaining} scans remaining
            </Text>
          )}
          <View style={styles.bodyPartSelector}>
            <Pressable
              style={[
                styles.bodyPartButton,
                bodyPart === "face" && styles.bodyPartButtonActive,
              ]}
              onPress={() => setBodyPart("face")}
            >
              <Text
                style={[
                  styles.bodyPartButtonText,
                  bodyPart === "face" && styles.bodyPartButtonTextActive,
                ]}
              >
                Face
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.bodyPartButton,
                bodyPart === "hand" && styles.bodyPartButtonActive,
              ]}
              onPress={() => setBodyPart("hand")}
            >
              <Text
                style={[
                  styles.bodyPartButtonText,
                  bodyPart === "hand" && styles.bodyPartButtonTextActive,
                ]}
              >
                Hand
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.bodyPartButton,
                bodyPart === "arm" && styles.bodyPartButtonActive,
              ]}
              onPress={() => setBodyPart("arm")}
            >
              <Text
                style={[
                  styles.bodyPartButtonText,
                  bodyPart === "arm" && styles.bodyPartButtonTextActive,
                ]}
              >
                Arm
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.iconButton}
          onPress={toggleFlash}
          disabled={isAnalyzing}
        >
          <Zap
            size={20}
            color={flash === "on" ? "#FFD700" : "#fff"}
            fill={flash === "on" ? "#FFD700" : "transparent"}
          />
        </Pressable>
      </View>

      {/* Controls - Overlay */}
      <View
        style={[styles.controls, { paddingBottom: insets.bottom + 32 }]}
        pointerEvents={isAnalyzing ? "none" : "auto"}
      >
        <Pressable
          style={styles.flipButton}
          onPress={toggleCameraFacing}
          disabled={isAnalyzing}
        >
          <RotateCw size={24} color="#fff" />
        </Pressable>

        <Pressable
          style={[styles.captureButton, isAnalyzing && { opacity: 0.5 }]}
          onPress={takePicture}
          disabled={isAnalyzing}
        >
          <View style={styles.captureInner} />
        </Pressable>

        <View style={{ width: 56 }} />
      </View>

      {/* Instruction - Overlay */}
      <View
        style={[styles.instructionContainer, { bottom: insets.bottom + 120 }]}
      >
        <Text style={styles.instruction}>{getInstructionText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    paddingHorizontal: 40,
    alignItems: "center",
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    textAlign: "center",
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: "#fff",
    marginBottom: 8,
  },
  bodyPartSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 4,
  },
  bodyPartButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bodyPartButtonActive: {
    backgroundColor: "#fff",
  },
  bodyPartButtonText: {
    fontSize: 12,
    fontFamily: "Figtree_700Bold",
    color: "rgba(255,255,255,0.7)",
  },
  bodyPartButtonTextActive: {
    color: colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  faceMaskContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  faceMask: {
    width: "80%",
    aspectRatio: 3 / 4,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 200,
    borderStyle: "dashed",
  },
  handGuide: {
    width: "70%",
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 20,
    borderStyle: "dashed",
  },
  armGuide: {
    width: "75%",
    aspectRatio: 4 / 5,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 40,
    borderStyle: "dashed",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
  instructionContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instruction: {
    fontSize: 14,
    fontFamily: "Figtree_400Regular",
    color: "rgba(255,255,255,0.9)",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Figtree_700Bold",
    color: "#fff",
    marginTop: 16,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: "Figtree_700Bold",
    color: "#fff",
  },
  consentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  consentModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 32,
    maxWidth: 400,
  },
  consentTitle: {
    fontSize: 22,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 16,
    textAlign: "center",
  },
  consentText: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  consentButtons: {
    flexDirection: "row",
    gap: 12,
  },
  consentButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
  },
  consentButtonSecondaryText: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
  },
  consentButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  consentButtonPrimaryText: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
  scanCounter: {
    fontSize: 11,
    fontFamily: "Figtree_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  upgradeModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 32,
    maxWidth: 400,
    alignItems: "center",
  },
  upgradeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.foreground,
    marginBottom: 12,
    textAlign: "center",
  },
  upgradeText: {
    fontSize: 15,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  pricingBox: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  pricingText: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_700Bold",
    color: colors.primary,
    marginBottom: 4,
  },
  pricingSubtext: {
    fontSize: 13,
    fontFamily: "Figtree_400Regular",
    color: colors.mutedForeground,
  },
  upgradeButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  upgradeButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
  },
  upgradeButtonSecondaryText: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.mutedForeground,
  },
  upgradeButtonPrimary: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeButtonPrimaryText: {
    fontSize: 15,
    fontFamily: "Figtree_700Bold",
    color: colors.primaryForeground,
  },
});
