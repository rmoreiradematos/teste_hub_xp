const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

const uri = 'mongodb://localhost:27017/nest-dev';

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('nest-dev');

    const categories = Array.from({ length: 5 }, () => ({
      name: faker.commerce.department(),
      isActive: true,
      productIds: [],
    }));
    const categoryResult = await db
      .collection('categories')
      .insertMany(categories);
    const categoryIds = Object.values(categoryResult.insertedIds);

    const products = Array.from({ length: 20 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(10, 1000, 2)),
      isActive: true,
      categoryIds: faker.helpers.arrayElements(categoryIds, 2),
      imageUrl: faker.commerce.productName(),
    }));
    const productResult = await db.collection('products').insertMany(products);
    const productIds = Object.values(productResult.insertedIds);

    // Gerar pedidos
    const orders = Array.from({ length: 50 }, () => {
      const selectedProducts = faker.helpers.arrayElements(productIds, 3);
      const total = selectedProducts.reduce((sum, productId) => {
        const product = products.find((p) => p._id.equals(productId));
        return sum + (product ? product.price : 0);
      }, 0);

      return {
        date: faker.date.past(),
        products: selectedProducts,
        total: parseFloat(total.toFixed(2)),
        isActive: true,
      };
    });
    await db.collection('orders').insertMany(orders);

    console.log('Banco de dados populado com sucesso!');
  } catch (err) {
    console.error('Erro ao popular o banco de dados:', err);
  } finally {
    await client.close();
  }
}

seedDatabase();
