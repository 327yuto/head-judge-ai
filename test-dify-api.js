import dotenv from 'dotenv';
dotenv.config();

const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = process.env.DIFY_API_KEY;

console.log('Testing Dify API connection...');
console.log('API URL:', DIFY_API_URL);
console.log('API Key:', DIFY_API_KEY ? 'Set (hidden)' : 'Not set');

async function testDifyAPI() {
    try {
        // Test basic API connection
        const response = await fetch(`${DIFY_API_URL}/parameters`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', JSON.stringify(data, null, 2));
            console.log('✅ API connection successful!');
        } else {
            const errorText = await response.text();
            console.log('❌ API Error:', errorText);
        }

        // Test workflow/chat completion
        console.log('\nTesting chat completion...');
        const chatResponse = await fetch(`${DIFY_API_URL}/chat-messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {},
                query: "Hello, this is a test message",
                response_mode: "blocking",
                user: "test-user"
            })
        });

        console.log('Chat response status:', chatResponse.status);
        
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('Chat Response:', JSON.stringify(chatData, null, 2));
            console.log('✅ Chat API working!');
        } else {
            const errorText = await chatResponse.text();
            console.log('❌ Chat Error:', errorText);
        }

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testDifyAPI();