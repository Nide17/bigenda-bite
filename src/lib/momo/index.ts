export interface MoMoConfig {
  apiUser: string
  apiKey: string
  subscriptionKey: string
  environment: 'sandbox' | 'production'
}

export interface MoMoPaymentRequest {
  amount: number
  phoneNumber: string
  externalId: string
  payerMessage?: string
  payeeNote?: string
}

export interface MoMoPaymentResponse {
  transactionId: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
  amount: number
  currency: string
  externalId: string
  payerMessage?: string
  payeeNote?: string
}

const SANDBOX_BASE = 'https://sandbox.momodeveloper.mtn.com'
const PRODUCTION_BASE = 'https://momodeveloper.mtn.com'

function getBaseUrl(environment: string): string {
  return environment === 'production' ? PRODUCTION_BASE : SANDBOX_BASE
}

export async function getAccessToken(config: MoMoConfig): Promise<string> {
  const baseUrl = getBaseUrl(config.environment)
  const auth = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString('base64')

  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function createPayment(
  config: MoMoConfig,
  payment: MoMoPaymentRequest
): Promise<MoMoPaymentResponse> {
  const baseUrl = getBaseUrl(config.environment)
  const token = await getAccessToken(config)
  const phoneNumber = payment.phoneNumber.replace(/^\+/, '')
  const externalId = payment.externalId || `payment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const requestBody = {
    amount: payment.amount.toString(),
    currency: 'RWF',
    externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: phoneNumber,
    },
    payerMessage: payment.payerMessage || 'Payment for membership',
    payeeNote: payment.payeeNote || 'Bigenda Bite membership',
  }

  console.log('MoMo createPayment request:', {
    url: `${baseUrl}/collection/v1_0/requesttopay`,
    phoneNumber,
    externalId,
    amount: payment.amount,
  })

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Content-Type': 'application/json',
      'X-Reference-Id': externalId,
      'X-Callback-URL': `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/momo`,
    },
    body: JSON.stringify(requestBody),
  })

  const responseText = await response.text()
  console.log('MoMo createPayment response:', { status: response.status, body: responseText })

  if (!response.ok) {
    throw new Error(`MoMo payment failed: ${response.status} - ${responseText}`)
  }

  return {
    transactionId: externalId,
    status: 'PENDING',
    amount: payment.amount,
    currency: 'RWF',
    externalId,
    payerMessage: payment.payerMessage,
    payeeNote: payment.payeeNote,
  }
}

export async function checkPaymentStatus(
  config: MoMoConfig,
  transactionId: string
): Promise<MoMoPaymentResponse> {
  const baseUrl = getBaseUrl(config.environment)
  const token = await getAccessToken(config)

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${transactionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to check payment status: ${response.status}`)
  }

  const data = await response.json()
  return {
    transactionId: data.transactionId || transactionId,
    status: data.status || 'PENDING',
    amount: parseFloat(data.amount || '0'),
    currency: data.currency || 'RWF',
    externalId: data.externalId || transactionId,
  }
}
