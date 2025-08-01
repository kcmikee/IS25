export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  token: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: "savings" | "checking" | "credit";
  balance: number;
  currency: string;
  accountName: string;
}

class MockApiService {
  private accounts = [
    {
      id: "1",
      accountNumber: "****1234",
      accountType: "checking" as const,
      balance: 5420.5,
      currency: "USD",
      accountName: "Main Checking",
      userId: "1",
    },
    {
      id: "2",
      accountNumber: "****5678",
      accountType: "savings" as const,
      balance: 12500.75,
      currency: "USD",
      accountName: "Savings Account",
      userId: "1",
    },
    {
      id: "3",
      accountNumber: "****9012",
      accountType: "credit" as const,
      balance: -1250.0,
      currency: "USD",
      accountName: "Credit Card",
      userId: "1",
    },
  ];

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const password = "password123";
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    const user = users.find(
      (u: any) =>
        u.username.toLowerCase() === credentials.username.toLowerCase() &&
        password === credentials.password
    );

    const token = `mock-jwt-token-${Date.now()}`;

    if (!user) {
      throw new Error("Invalid username or password");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    await this.delay(800);
    return this.accounts.map((account) => ({
      id: account.id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance,
      currency: account.currency,
      accountName: account.accountName,
    }));
  }
}

export const mockApiService = new MockApiService();
