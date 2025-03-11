npm ci

npx serverless offline

curl -X POST http://localhost:3000/dev/notify -d '{
"orderId": "123456",
"total": 150.00,
"products": ["p1", "p2"]
}' -H "Content-Type: application/json"
