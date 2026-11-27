import type { UseCase } from '../../../shared/application/use-case.js';
import { Money } from '../../../shared/domain/money.value-object.js';
import { Product } from '../../domain/entity/product.entity.js';
import { ProductName } from '../../domain/vo/product-name.value-object.js';
import { Sku } from '../../domain/vo/sku.value-object.js';
import { SkuAlreadyInUseError } from '../error/sku-already-in-error.js';

import { toProductOutput, type ProductOutput } from '../product-output.js';
import type { ProductRepository } from '../product.repository.js';

export type CreateProductInput = {
  sku: string;
  name: string;
  priceInCents: number;
};

export class CreateProductUseCase implements UseCase<CreateProductInput, ProductOutput> {
  constructor(private readonly products: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductOutput> {
    const sku = Sku.create(input.sku);
    const name = ProductName.create(input.name);
    const price = Money.fromCents(input.priceInCents);
    await this.ensureSkuIsAvailable(sku);

    const product = Product.create({ sku, name, price });
    await this.products.save(product);
    return toProductOutput(product);
  }

  private async ensureSkuIsAvailable(sku: Sku): Promise<void> {
    const existing = await this.products.findBySku(sku);
    if (existing) {
      throw new SkuAlreadyInUseError(sku.toString());
    }
  }
}
