export const momoConfig = {
  apiUser: process.env.MOMO_API_USER,
  apiKey: process.env.MOMO_API_KEY,
  subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY,
  environment: process.env.MOMO_ENVIRONMENT || 'sandbox',
}

export const createPayment = async (amount: number, phoneNumber: string, externalId: string) => {
  // Phase 3: MTN MoMo API integration
  return { status: 'pending' }
}

export const checkPaymentStatus = async (transactionId: string) => {
  // Phase 3: MTN MoMo API integration
  return { status: 'pending' }
}
