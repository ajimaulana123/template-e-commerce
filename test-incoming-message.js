// Test Incoming Message - Simulate Meta sending message to webhook

const WEBHOOK_URL = 'https://crm-wa.vercel.app/api/webhook'

const payload = {
  object: 'whatsapp_business_account',
  entry: [{
    id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
    changes: [{
      value: {
        messaging_product: 'whatsapp',
        metadata: {
          display_phone_number: '15551410892',
          phone_number_id: '988128274384219'
        },
        contacts: [{
          profile: {
            name: 'Test Customer'
          },
          wa_id: '6285175434869'
        }],
        messages: [{
          from: '6285175434869',
          id: 'wamid.test_' + Date.now(),
          timestamp: Math.floor(Date.now() / 1000).toString(),
          type: 'text',
          text: {
            body: 'Halo, ini test message dari customer'
          }
        }]
      },
      field: 'messages'
    }]
  }]
}

console.log('🧪 Testing Incoming Message...\n')
console.log('Webhook URL:', WEBHOOK_URL)
console.log('Payload:', JSON.stringify(payload, null, 2))
console.log('\n' + '─'.repeat(60) + '\n')

fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'facebookplatform/1.0'
  },
  body: JSON.stringify(payload)
})
  .then(response => {
    console.log('Response Status:', response.status)
    return response.json()
  })
  .then(data => {
    console.log('Response Body:', JSON.stringify(data, null, 2))
    console.log('\n' + '─'.repeat(60))
    
    if (data.status === 'ok') {
      console.log('\n✅ Test BERHASIL!')
      console.log('\nSekarang cek:')
      console.log('1. Vercel logs - harus ada log "📥 Webhook received"')
      console.log('2. Database - harus ada contact baru dengan waId: 6285175434869')
      console.log('3. Dashboard - buka https://crm-wa.vercel.app/dashboard/messages')
      console.log('   Harus ada pesan dari Test Customer')
    } else {
      console.log('\n❌ Test GAGAL!')
      console.log('Ada error di webhook processing')
    }
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message)
    console.log('\nKemungkinan:')
    console.log('1. Network error')
    console.log('2. Webhook endpoint tidak accessible')
    console.log('3. CORS issue')
  })
