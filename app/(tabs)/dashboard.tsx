import { formatBalance, getGreeting } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { BankAccount, mockApiService } from "../../services/mockApi";
import { RootState } from "../../store";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => {
    return state.user;
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const accounts = await mockApiService.getBankAccounts();
      setAccounts(accounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      Alert.alert("Error", "Failed to load accounts");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return "card";
      case "savings":
        return "wallet";
      case "credit":
        return "card-outline";
      default:
        return "card";
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking":
        return "#007AFF";
      case "savings":
        return "#34C759";
      case "credit":
        return "#FF9500";
      default:
        return "#007AFF";
    }
  };

  const handleAccountPress = (account: BankAccount) => {
    Alert.alert(
      "Account Details",
      `${account.accountName}\nAccount: ${
        account.accountNumber
      }\nBalance: ${formatBalance(account.balance)}`
    );
  };

  const handleQuickAction = (action: string) => {
    Alert.alert("Coming Soon", `${action} feature will be available soon!`);
  };

  const actionButtons = [
    {
      title: "Transfer",
      onPress: () => handleQuickAction("Transfer Money"),
      color: "#007AFF",
      icon: "swap-horizontal" as "swap-horizontal",
    },
    {
      title: "Pay Bills",
      onPress: () => handleQuickAction("Pay Bills"),
      color: "#34C759",
      icon: "receipt" as "receipt",
    },
    {
      title: "Deposit",
      onPress: () => handleQuickAction("Deposit Check"),
      color: "#FF9500",
      icon: "camera" as "camera",
    },
    {
      title: "Invest",
      onPress: () => handleQuickAction("Investments"),
      color: "#AF52DE",
      icon: "trending-up" as "trending-up",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.name.split(" ")?.[0] || "User"}! 👋
        </Text>
        <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
      </View>

      {accounts.length > 0 && (
        <View style={styles.accountsSection}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentIndex(index);
            }}
            style={{ paddingVertical: 5 }}
          >
            {accounts.map((account, index) => (
              <TouchableOpacity
                key={account.id}
                style={[styles.accountCard, { width: width - 40 }]}
                onPress={() => handleAccountPress(account)}
              >
                <View style={styles.accountHeader}>
                  <View
                    style={[
                      styles.accountIcon,
                      { backgroundColor: getAccountColor(account.accountType) },
                    ]}
                  >
                    <Ionicons
                      name={getAccountIcon(account.accountType) as any}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>
                      {account.accountName}
                    </Text>
                    <Text style={styles.accountNumber}>
                      {account.accountNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <Text
                    style={[
                      styles.balance,
                      account.balance < 0 && styles.negativeBalance,
                    ]}
                  >
                    {formatBalance(account.balance)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {accounts.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {actionButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={button.onPress}
            >
              <Ionicons name={button.icon} size={24} color={button.color} />
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  accountsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  balance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  negativeBalance: {
    color: "#ff3b30",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: (width - 60) / 2,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginTop: 8,
  },
});
