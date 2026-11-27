import { UniqueId } from '../../shared/domain/unique-id.value-object.js';
import type { Product } from '../domain/entity/product.entity.js';
import { ProductNotFoundError } from './error/product-not-found.error.js';
import type { ProductRepository } from './product.repository.js';

export async function loadProduct(products: ProductRepository, productId: string): Promise<Product> {
  const product = await products.findById(UniqueId.from(productId));
  if (!product) {
    throw new ProductNotFoundError();
  }
  return product;
}
