import { createProduct, getProducts } from './product.service';
import { generateSlug } from '@/utils/generateSlug';

const seedData = [
  {
    name: 'Laptop Gaming ASUS ROG',
    category: 'Laptop',
    price: 18500000,
    stock: 15,
    description: 'Laptop gaming dengan prosesor Intel Core i7 dan RTX.',
    image: 'https://placehold.co/600x600?text=ASUS+ROG',
  },
  {
    name: 'Mechanical Keyboard RGB',
    category: 'Keyboard',
    price: 850000,
    stock: 40,
    description: 'Mechanical keyboard switch merah RGB.',
    image: 'https://placehold.co/600x600?text=Keyboard+RGB',
  },
  {
    name: 'Wireless Mouse Logitech',
    category: 'Mouse',
    price: 350000,
    stock: 55,
    description: 'Wireless mouse ergonomis.',
    image: 'https://placehold.co/600x600?text=Logitech+Mouse',
  },
  {
    name: 'Gaming Headset HyperX',
    category: 'Headset',
    price: 1250000,
    stock: 20,
    description: 'Headset gaming surround 7.1.',
    image: 'https://placehold.co/600x600?text=HyperX+Headset',
  },
];

/**
 * Checks if the products collection is empty, and if so, seeds it with 4 default products.
 */
export async function seedProductsIfEmpty(): Promise<boolean> {
  try {
    const existing = await getProducts();
    if (existing.length > 0) {
      console.log('Firestore products collection is not empty, skipping seeding.');
      return false;
    }

    console.log('Firestore products collection is empty. Seeding initial data...');
    const now = new Date().toISOString();

    for (const item of seedData) {
      const slug = generateSlug(item.name);
      await createProduct({
        name: item.name,
        slug: slug,
        description: item.description,
        category: item.category,
        price: item.price,
        stock: item.stock,
        image: item.image,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Initial product seeding completed successfully.');
    return true;
  } catch (error) {
    console.error('Error during product seeding:', error);
    return false;
  }
}
