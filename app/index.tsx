import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/dashboard" as any);
    } else {
      router.replace("/login" as any);
    }
  }, [isAuthenticated, router]);

  return null;
}
