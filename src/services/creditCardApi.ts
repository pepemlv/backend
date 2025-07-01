import axios from 'axios';

// Base URL for the payment API
const API_URL = 'https://api.pmstreaming.com/payments';

// Merchant bank details configuration
export type MerchantBankInfo = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
  bankAddress?: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export type CardPaymentData = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  amount: number;
  currency: string;
  description: string;
};

export type PaymentResponse = {
  success: boolean;
  transactionId?: string;
  error?: string;
};

// Process credit card payment
export const processCreditCardPayment = async (
  paymentData: CardPaymentData,
  merchantBank: MerchantBankInfo
): Promise<PaymentResponse> => {
  try {
    // Validate card data
    validateCardData(paymentData);
    
    // Format card data for API
    const formattedData = formatCardData(paymentData, merchantBank);
    
    // Mock API call - in production, this would be a real API endpoint
    const response = await mockProcessPayment(formattedData);
    
    return {
      success: true,
      transactionId: response.transactionId
    };
  } catch (error: any) {
    console.error('Credit card payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
};

// Validate card data
const validateCardData = (data: CardPaymentData) => {
  const {
    cardNumber,
    expiryDate,
    cvv,
    cardholderName,
    amount
  } = data;

  // Remove spaces from card number
  const cleanCardNumber = cardNumber.replace(/\s/g, '');

  if (cleanCardNumber.length !== 16) {
    throw new Error('Invalid card number');
  }

  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    throw new Error('Invalid expiry date format (MM/YY)');
  }

  // Check if card is expired
  const [month, year] = expiryDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  if (expiry < new Date()) {
    throw new Error('Card has expired');
  }

  if (!/^\d{3}$/.test(cvv)) {
    throw new Error('Invalid CVV');
  }

  if (!cardholderName.trim()) {
    throw new Error('Cardholder name is required');
  }

  if (amount <= 0) {
    throw new Error('Invalid amount');
  }
};

// Format card data for API
const formatCardData = (data: CardPaymentData, merchantBank: MerchantBankInfo) => {
  return {
    payment_method: {
      type: 'card',
      card: {
        number: data.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(data.expiryDate.split('/')[0]),
        exp_year: parseInt(data.expiryDate.split('/')[1]),
        cvv: data.cvv,
        holder_name: data.cardholderName
      }
    },
    amount: Math.round(data.amount * 100), // Convert to cents
    currency: data.currency.toLowerCase(),
    description: data.description,
    merchant_bank: {
      bank_name: merchantBank.bankName,
      account_name: merchantBank.accountName,
      account_number: merchantBank.accountNumber,
      routing_number: merchantBank.routingNumber,
      swift_code: merchantBank.swiftCode,
      bank_address: merchantBank.bankAddress,
      account_type: merchantBank.accountType,
      currency: merchantBank.currency
    }
  };
};

// Mock payment processing (replace with real API calls in production)
const mockProcessPayment = async (formattedData: any): Promise<{ transactionId: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate random failures (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Payment declined by bank');
  }

  // Generate mock transaction ID
  const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);

  // Log settlement details (remove in production)
  console.log('Payment will be settled to:', formattedData.merchant_bank);

  return { transactionId };
};

// Verify merchant bank account
export const verifyMerchantBankAccount = async (merchantBank: MerchantBankInfo): Promise<boolean> => {
  try {
    // In production, this would verify the merchant's bank account is valid
    // and properly set up to receive payments
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Merchant bank account verification error:', error);
    return false;
  }
};

export default {
  processCreditCardPayment,
  verifyMerchantBankAccount
};