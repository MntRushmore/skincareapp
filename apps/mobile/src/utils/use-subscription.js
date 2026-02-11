import { useRouter } from "expo-router";
import React, { useCallback, useState, useEffect } from "react";
import { Alert } from "react-native";
import { create } from "zustand";
import Purchases, { LOG_LEVEL, PRODUCT_CATEGORY } from "react-native-purchases";
import { Platform } from "react-native";
import { useAuth } from "@/utils/auth/useAuth";

const useSubscriptionStore = create((set, get) => ({
  status: null,
  loading: true,
  offerings: null,
  isReady: false,
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setOfferings: (offerings) => set({ offerings }),
  setIsReady: (isReady) => set({ isReady }),
  checkSubscription: async () => {
    if (get().loading === false) {
      return;
    }

    try {
      const response = await fetch("/api/get-subscription-status", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to check subscription: ${response.status}`);
      }
      const data = await response.json();

      const isActive = data.hasAccess;

      set({ status: isActive, loading: false });
    } catch (error) {
      console.error("Error checking subscription:", error);
      set({ loading: false });
    }
  },
  refetchSubscription: async () => {
    set({ loading: true });

    try {
      const response = await fetch("/api/get-subscription-status", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to refetch subscription: ${response.status}`);
      }
      const data = await response.json();

      const isActive = data.hasAccess;

      set({ status: isActive, loading: false });
    } catch (error) {
      console.error("Error refetching subscription:", error);
      set({ loading: false });
    }
  },
}));

export function useSubscription() {
  const {
    status,
    loading,
    checkSubscription,
    refetchSubscription,
    offerings,
    isReady,
    setOfferings,
    setIsReady,
  } = useSubscriptionStore();
  const { auth } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Initialize RevenueCat
  const initializeRevenueCat = useCallback(async () => {
    if (isReady) {
      return; // Already initialized
    }

    try {
      Purchases.setLogLevel(LOG_LEVEL.INFO);

      const apiKey = Platform.select({
        ios: process.env.EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY,
        android: process.env.EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY,
      });

      if (!apiKey) {
        console.error("No RevenueCat API key found for this platform");
        setIsReady(true);
        return;
      }

      Purchases.configure({ apiKey });

      // Fetch offerings
      const fetchedOfferings = await Purchases.getOfferings();
      console.log("RevenueCat offerings loaded:", fetchedOfferings);
      setOfferings(fetchedOfferings);

      setIsReady(true);
    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error);
      setIsReady(true);
    }
  }, [setOfferings, setIsReady, isReady]);

  const initiateSubscription = useCallback(async () => {
    try {
      // Make sure RevenueCat is initialized
      if (!isReady) {
        Alert.alert("Please wait", "Loading subscription packages...");
        await initializeRevenueCat();
      }

      if (!offerings?.current) {
        console.error("No current offering found. All offerings:", offerings);
        Alert.alert(
          "Error",
          "No subscription packages available. This may be because:\n\n1. RevenueCat products are not configured\n2. App Store Connect is not properly linked\n3. You're in development mode\n\nPlease check the console for more details.",
        );
        return;
      }

      // Get the first subscription package
      const subscriptionPackages = offerings.current.availablePackages.filter(
        (pkg) => pkg.product.productCategory === PRODUCT_CATEGORY.SUBSCRIPTION,
      );

      if (subscriptionPackages.length === 0) {
        console.error(
          "No subscription packages in offering:",
          offerings.current,
        );
        Alert.alert(
          "Error",
          "No subscription packages found in the current offering. Please contact support.",
        );
        return;
      }

      const packageToPurchase = subscriptionPackages[0];
      console.log("Attempting to purchase package:", packageToPurchase);

      setIsPurchasing(true);

      if (!auth?.user?.id) {
        throw new Error("User not authenticated");
      }

      await Purchases.setAttributes({ userId: auth.user.id.toString() });
      await Purchases.logIn(auth.user.id.toString());

      const purchaseResult = await Purchases.purchasePackage(packageToPurchase);
      console.log("Purchase successful:", purchaseResult);

      // Refresh subscription status
      await refetchSubscription();

      Alert.alert("Success", "Subscription activated!", [{ text: "OK" }]);

      return true;
    } catch (error) {
      console.error("Failed to start subscription:", error);

      // Don't show alert if user cancelled
      if (!error.userCancelled) {
        Alert.alert(
          "Error",
          error.message || "Could not complete the purchase. Please try again.",
          [{ text: "OK" }],
        );
      }

      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [offerings, auth, refetchSubscription, isReady, initializeRevenueCat]);

  useEffect(() => {
    initializeRevenueCat();
    checkSubscription();
  }, [initializeRevenueCat, checkSubscription]);

  return {
    isSubscribed: status,
    data: status,
    loading,
    initiateSubscription,
    refetchSubscription,
    refetch: refetchSubscription,
    isPurchasing,
    isReady,
  };
}

export default useSubscription;
