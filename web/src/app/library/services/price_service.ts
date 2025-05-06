"use server"

export async function getPriceList() {
  return {
    "data": [
      {
        id: 'price_1RCkDv4N0ZpvGvcGtTPmMxna',
        name: 'Basic',
        price: '$9.99/month',
        features: ['All Format Conversions', '50 Credits/Month', 'Email Support'],
        cta: 'Get Started'
      },
      {
        id: 'price_1RCkEI4N0ZpvGvcGdU93GFnl',
        name: 'Pro',
        price: '$19.99/month',
        features: ['All Format Conversions', '100 Credits/mouth', 'Batch Processing', 'Priority Support'],
        cta: 'Go Pro'
      },
      {
        id: 'price_creditpack',
        name: 'Credits Pack',
        price: 'Starting at $4.99',
        features: ['Choose Your Amount', 'Pay Per Credit ($0.10 each)', 'No Subscription Required', 'Credits Never Expire'],
        cta: 'Buy Credits',
        customizable: true,
        basePrice: 4.99,
        unitPrice: 0.10,
        minQuantity: 50
      }
    ]
  }
}