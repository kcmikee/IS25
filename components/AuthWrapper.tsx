import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login" as any);
    } else {
      router.replace("/(tabs)/dashboard" as any);
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
