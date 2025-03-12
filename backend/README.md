# Backend - API Documentation

## Rodar o Teste

Para rodar os testes da aplicação, siga as instruções abaixo:

1. **Rodar os containers e rodar os testes**:

```bash
docker compose -f docker-compose-test.yml up --build
```

1. **Rodar os testes diretamente no terminal:**:

```bash
npm t
```

2. **Rodar em ambiende de desenvolvimento (DEV)**

```bash
docker-compose --profile dev up --build
```

2.1 **Rodar o seed em ambiente de desenvolvimento (DEV)**
Uma vez com o container up e na hierarquia de pasta aonde está o script de seed

```bash
node seed.js
```

3. **Documentação do swagger**

```bash
http://localhost:3000/api
```

4. **Arquitetura**

Exemplo da Estrutura do Módulo Categories
Dentro do módulo Categories, você encontrará as seguintes pastas e arquivos:

1. dto/
2. entities/
3. repositories/
   3.1 Dentro de repositories/
   category.repository.ts.
   mongo/mongo-category.repository.ts
4. schemas/
   categories.controller.ts
   categories.controller.spec.ts
   categories.module.ts
   categories.service.ts
   categories.service.spect.ts

O padrão se repete para todos os módulos com CRUD.
