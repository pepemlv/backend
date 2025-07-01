import axios from 'axios';

//src/components/services/kelpayApi.ts  
const BACKEND_API_URL = 'http://localhost:3001/api';

export type KelpayPaymentRequest = {
  mobileNumber: string;
  amount: number;
  currency: 'USD' | 'CDF';
  description: string;
  movieId: string;
};

export type KelpayPaymentResponse = {
  success: boolean;
  code: string;
  description: string;
  reference: string;
  transactionId: string;
  operator?: string;
};

export type KelpayPaymentResult = {
  transactionId: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  operator?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
};

// Create axios instance for backend API
const api = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds
});

// Process mobile money payment via backend
export const processMobileMoneyPayment = async (
  mobileNumber: string,
  amount: number,
  currency: 'USD' | 'CDF',
  description: string,
  movieId: string
): Promise<KelpayPaymentResponse> => {
  try {
    console.log('Processing payment via backend:', {
      mobileNumber: maskMobileNumber(mobileNumber),
      amount,
      currency,
      movieId
    });

    const response = await api.post('/payments/mobile', {
      mobileNumber,
      amount,
      currency,
      description,
      movieId
    });

    console.log('Backend payment response:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('Backend payment error:', error);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start the backend server.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Payment processing failed');
    }
  }
};

// Check transaction status via backend
export const checkTransactionStatus = async (transactionId: string): Promise<KelpayPaymentResult> => {
  try {
    const response = await api.get(`/payments/status/${transactionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Transaction status check error:', error);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to check transaction status');
    }
  }
};

// Validate DRC mobile number format
export const isValidDRCMobileNumber = (mobileNumber: string): boolean => {
  // Remove any spaces or special characters
  const cleanNumber = mobileNumber.replace(/[\s\-\(\)]/g, '');
  
  // DRC mobile numbers should start with 243 and be 12 digits total
  // Or start with 0 and be 10 digits (we'll convert to international format)
  const drcPattern = /^(243[0-9]{9}|0[0-9]{9})$/;
  
  return drcPattern.test(cleanNumber);
};

// Format mobile number to international format
export const formatMobileNumber = (mobileNumber: string): string => {
  const cleanNumber = mobileNumber.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 0, replace with 243
  if (cleanNumber.startsWith('0')) {
    return '243' + cleanNumber.substring(1);
  }
  
  return cleanNumber;
};

// Get mobile operator from number
export const getMobileOperator = (mobileNumber: string): string => {
  const cleanNumber = formatMobileNumber(mobileNumber);
  
  // DRC operator prefixes (after 243)
  const prefix = cleanNumber.substring(3, 6);
  
  switch (prefix) {
    case '810': case '811': case '812': case '813': case '814':
    case '815': case '816': case '817': case '818': case '819':
      return 'Airtel Money';
    case '820': case '821': case '822': case '823': case '824':
    case '825': case '826': case '827': case '828': case '829':
      return 'Orange Money';
    case '970': case '971': case '972': case '973': case '974':
    case '975': case '976': case '977': case '978': case '979':
      return 'M-PESA';
    case '900': case '901': case '902': case '903': case '904':
    case '905': case '906': case '907': case '908': case '909':
      return 'AfriMoney';
    default:
      return 'Opérateur Mobile';
  }
};

// Mask mobile number for logging
const maskMobileNumber = (mobileNumber: string): string => {
  if (!mobileNumber || mobileNumber.length < 8) return mobileNumber;
  const start = mobileNumber.substring(0, 3);
  const end = mobileNumber.substring(mobileNumber.length - 3);
  return `${start}****${end}`;
};

export default {
  processMobileMoneyPayment,
  checkTransactionStatus,
  isValidDRCMobileNumber,
  formatMobileNumber,
  getMobileOperator
};