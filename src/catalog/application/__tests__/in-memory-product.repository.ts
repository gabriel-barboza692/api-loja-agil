import type { UniqueId } from '../../../shared/domain/unique-id.value-object.js';
import type { ProductSnapshot } from '../../domain/entity/product.entity.js';
import { Product } from '../../domain/entity/product.entity.js';
import type { Sku } from '../../domain/vo/sku.value-object.js';
import type { ProductRepository } from '../product.repository.js';

export class InMemoryProductRepository implements ProductRepository {
  private readonly snapshots = new Map<string, ProductSnapshot>();

  async save(product: Product): Promise<void> {
    this.snapshots.set(product.id.toString(), product.toSnapshot());
  }

  async findById(id: UniqueId): Promise<Product | null> {
    const productSnapshot = this.snapshots.get(id.toString());
    if (!productSnapshot) {
      return null;
    }
    return Product.restore(productSnapshot);
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const productSnapshot = [...this.snapshots.values()].find((product) => product.sku === sku.toString());
    if (!productSnapshot) {
      return null;
    }
    return Product.restore(productSnapshot);
  }
}
