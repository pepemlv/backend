import axios from 'axios';
import { CardPaymentData } from './creditCardApi';

// Base URL for KECCEL KELPAY API
const API_URL = 'https://pay.keccel.com/kelpay/v1';

// Mock token for demo purposes - in a real app, this would be securely stored
const MERCHANT_TOKEN = 'Q1H51GS8W22A46K';
const MERCHANT_CODE = 'PMSTREAMING';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${MERCHANT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Mock payment function that mimics the KELPAY API behavior
export const processPayment = async (paymentData: {
  method: 'mobile' | 'card';
  mobileNumber?: string;
  cardInfo?: CardPaymentData;
  amount: number;
  description: string;
  reference: string;
}) => {
  // In a real app, this would make an actual API call
  // For demo purposes, we'll simulate the API response
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a transaction ID
    const transactionId = Date.now().toString();
    
    // Simulate successful API response
    return {
      code: "0",
      description: "Payment request received",
      reference: paymentData.reference,
      transactionId
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error("Failed to process payment");
  }
};

// Function to check transaction status
export const checkTransactionStatus = async (transactionId: string) => {
  // In a real app, this would make an actual API call
  // For demo purposes, we'll simulate the API response
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful transaction
    return {
      code: "0",
      description: "Payment successful",
      transactionId
    };
  } catch (error) {
    console.error("Transaction status check error:", error);
    throw new Error("Failed to check transaction status");
  }
};

export default api;