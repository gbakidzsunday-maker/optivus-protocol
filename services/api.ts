import { User, Transaction, JWTTokenResponse, TwoFactorRequiredResponse, KycStatusResponse, WithdrawalRequest, KycRequest, AdminStats, DashboardStats, TeamMember, RegistrationIntentResponse } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

async function apiRequest<T>(
    endpoint: string,
    method: HttpMethod,
    body?: any,
    isMultipart: boolean = false
): Promise<T> {
    const headers: HeadersInit = {};
    
    if (!isMultipart && body) {
        headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = isMultipart ? body : JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unexpected error occurred.' }));
        const errorMessage = errorData.detail || errorData.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    if (response.status === 204 || response.status === 201) { // No Content or Created
        return null as T;
    }

    return response.json();
}

// --- Validation Helpers ---
export const validateEmail = (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address.');
    }
};

export const validateInput = (input: string, fieldName: string) => {
    if (!input || input.trim() === '') {
        throw new Error(`${fieldName} cannot be empty.`);
    }
};


// --- Authentication & Users ---

export const login = (login_identifier: string, password: string): Promise<JWTTokenResponse | TwoFactorRequiredResponse> => 
    apiRequest(`/users/login/`, 'POST', { login_identifier, password });

export const verifyTwoFactor = (userId: string, token: string): Promise<JWTTokenResponse> =>
    apiRequest(`/users/2fa/verify/`, 'POST', { user_id: userId, token });

export const initiateRegistration = (data: Omit<any, 'confirmPassword'>): Promise<RegistrationIntentResponse> =>
    apiRequest(`/users/register/`, 'POST', {
        email: data.email,
        username: data.username,
        password: data.password,
        referralCode: data.referralCode
    });

export const confirmRegistration = (data: Omit<any, 'confirmPassword'> & { paymentIntentId: string }): Promise<void> =>
    apiRequest(`/users/register/confirm/`, 'POST', data);
    
export const getProfile = (): Promise<User> => apiRequest('/users/profile/', 'GET');

export const changePassword = (data: any): Promise<void> =>
    apiRequest('/users/password/change/', 'POST', data);

export const requestPasswordReset = (email: string): Promise<void> =>
    apiRequest('/users/password/request-reset/', 'POST', { email });

export const resetPassword = (token: string, password: string): Promise<void> =>
    apiRequest('/users/password/reset/', 'POST', { token, password });

// --- PIN Management ---

export const setPin = (pin: string): Promise<{ detail: string }> =>
    apiRequest('/users/pin/set/', 'POST', { pin });

export const verifyPin = (pin: string): Promise<{ detail: string }> =>
    apiRequest('/users/pin/verify/', 'POST', { pin });

// --- Dashboard ---

export const getDashboardStats = (): Promise<DashboardStats> => apiRequest('/dashboard/stats/', 'GET');
export const getTeamTree = (): Promise<TeamMember[]> => apiRequest('/team/tree/', 'GET');

// --- KYC ---

export const submitKyc = (formData: FormData): Promise<{ id: string, status: string }> =>
    apiRequest('/kyc/submit/', 'POST', formData, true);
    
export const getKycStatus = (): Promise<KycStatusResponse> => apiRequest('/kyc/status/', 'GET');

// --- Transactions ---

export const listTransactions = (): Promise<Transaction[]> => apiRequest('/transactions/', 'GET');
export const getTransaction = (id: string): Promise<Transaction> => apiRequest(`/transactions/${id}/`, 'GET');

// --- Withdrawals ---

export const createWithdrawal = (data: { amount: string, bank_name: string, account_number: string, account_name: string }): Promise<{id: string, status: string}> =>
    apiRequest('/withdrawals/', 'POST', data);
    
export const listWithdrawals = (): Promise<WithdrawalRequest[]> => apiRequest('/withdrawals/', 'GET');

// --- Admin Endpoints ---

export const getAdminStats = (): Promise<AdminStats> => apiRequest('/admin/stats/', 'GET');
export const adminListUsers = (): Promise<User[]> => apiRequest('/admin/users/', 'GET');
export const adminUpdateUser = (userId: string, data: Partial<User>): Promise<User> => apiRequest(`/admin/users/${userId}/`, 'PATCH', data);
export const adminCreateUser = (data: any): Promise<User> => apiRequest(`/admin/users/`, 'POST', data);

export const adminListWithdrawals = (): Promise<WithdrawalRequest[]> => apiRequest('/admin/withdrawals/', 'GET');
export const adminApproveWithdrawal = (id: string): Promise<{ message: string, status: string }> => apiRequest(`/withdrawals/${id}/approve/`, 'POST');
export const adminDenyWithdrawal = (id: string, reason: string): Promise<{ message: string, status: string, reason: string }> => apiRequest(`/withdrawals/${id}/deny/`, 'POST', { reason });

export const adminListKycRequests = (): Promise<KycRequest[]> => apiRequest('/admin/kyc/requests/', 'GET');
export const adminProcessKyc = (id: string, action: 'approve' | 'reject', reason?: string): Promise<{ success: boolean }> => apiRequest(`/admin/kyc/process/${id}/`, 'POST', { action, reason });

export const adminListTransactions = (): Promise<Transaction[]> => apiRequest('/admin/transactions/', 'GET');

// --- Mocked Functions for features without backend endpoints ---

export const mockSubmitContactForm = (data: any) => {
    console.log("Contact form submitted (mock):", data);
    return Promise.resolve({ success: true, message: 'Your message has been received.' });
};