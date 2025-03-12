# Projeto - Notificação de Pedido

Este projeto permite enviar notificações de pedidos por meio de uma API. Abaixo estão as instruções para rodar o projeto localmente e testar o endpoint.

## Rodando o Projeto Localmente

### Instalar Dependências

Para instalar as dependências, execute o seguinte comando:

```bash
npm ci
```

1. **Executando serverless offline**

```bash
npx serverless offline
```

2. **Enviar requisição**

```bash
curl -X POST http://localhost:3000/dev/notify -d '{
  "orderId": "123456",
  "total": 150.00,
  "products": ["p1", "p2"]
}' -H "Content-Type: application/json"
```
