import React from "react";
import { create } from "zustand";

const useScanLimitStore = create((set) => ({
  canScan: true,
  isPremium: false,
  scansUsed: 0,
  scansRemaining: 5,
  limit: 5,
  loading: true,
  checkLimit: async () => {
    try {
      const response = await fetch("/api/user/scans/check-limit", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to check scan limit: ${response.status}`);
      }
      const data = await response.json();

      set({
        canScan: data.canScan,
        isPremium: data.isPremium,
        scansUsed: data.scansUsed || 0,
        scansRemaining: data.scansRemaining,
        limit: data.limit || 5,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error("Error checking scan limit:", error);
      set({ loading: false });
      return null;
    }
  },
  incrementScan: async () => {
    try {
      const response = await fetch("/api/user/scans/check-limit", {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error(`Failed to increment scan: ${response.status}`);
      }
      const data = await response.json();

      set({
        scansUsed: data.scansUsed,
        scansRemaining: data.scansRemaining,
      });

      return data;
    } catch (error) {
      console.error("Error incrementing scan:", error);
      return null;
    }
  },
}));

export function useScanLimit() {
  const {
    canScan,
    isPremium,
    scansUsed,
    scansRemaining,
    limit,
    loading,
    checkLimit,
    incrementScan,
  } = useScanLimitStore();

  React.useEffect(() => {
    checkLimit();
  }, []);

  return {
    canScan,
    isPremium,
    scansUsed,
    scansRemaining,
    limit,
    loading,
    checkLimit,
    incrementScan,
  };
}

export default useScanLimit;
