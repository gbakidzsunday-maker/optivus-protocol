// --- API & Base Types ---

export interface JWTTokenResponse {
  refresh: string;
  access: string;
}

export interface TwoFactorRequiredResponse {
    two_factor_required: true;
    user_id: string;
}

export interface RegistrationIntentResponse {
  clientSecret: string;
}


// --- User Types ---

export interface User {
  id: string;
  email: string;
  username: string;
  referral_code: string;
  is_kyc_verified: boolean;
  firstName: string;
  lastName: string;

  balance: string;
  hasPin: boolean;
  is2faEnabled: boolean;
  role: 'user' | 'admin';
  status: 'active' | 'frozen';
  withdrawalStatus: 'active' | 'paused';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ twoFactorRequired: boolean, userId?: string } | void>;
  adminLogin: (identifier: string, pass: string) => Promise<void>;
  verifyTwoFactor: (userId: string, token: string) => Promise<void>;
  isAwaiting2FA: boolean;
  isAdmin: boolean;
  logout: () => void;
  updateUser: (newUser: Partial<User>) => void;
}

// --- Dashboard & Transaction Types ---

export interface DashboardStats {
  totalEarnings: string;
  totalTeamSize: number;
  directReferrals: number;
}

export interface DownlineLevel {
  level: number;
  users: number;
  earnings: number;
}

export interface Transaction {
  id: string;
  created_at: string;
  tx_type: 'deposit' | 'withdrawal' | 'commission' | 'bonus' | 'fee' | 'adjustment' | 'reversal';
  reference: string;
  amount: string; // Monetary values are strings from the backend
  status: 'completed' | 'pending' | 'failed';
  user?: { // For admin view
    name: string;
    email: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  level: number;
  joinDate: string;
  totalEarningsFrom: string;
  children: TeamMember[];
}


// --- KYC Types ---

export interface KycStatusResponse {
    status: 'unverified' | 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
}

// --- Admin Types ---

export interface AdminStats {
    totalUsers: number;
    totalUserReferralEarnings: string;
    pendingWithdrawalsCount: number;
    protocolBalance: string;
}

export interface KycRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    dateSubmitted: string;
    documentFrontUrl: string;
    documentBackUrl: string;
    selfieUrl: string;
}

export interface WithdrawalRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: string; // Monetary values are strings
    date: string;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    // The following are part of the GET response, not the POST request.
    bank_name: string;
    account_number: string;
    account_name: string;
}