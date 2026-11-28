import type { UseCase } from '../../../shared/application/use-case.js';
import { Money } from '../../../shared/domain/money.value-object.js';
import { ProductName } from '../../domain/vo/product-name.value-object.js';
import { loadProduct } from '../load-product.js';
import { toProductOutput, type ProductOutput } from '../product-output.js';
import type { ProductRepository } from '../product.repository.js';

export type UpdateProductInput = {
  productId: string;
  name?: string;
  priceInCents?: number;
};

function parseOptional<Raw, Parsed>(value: Raw | undefined, parse: (raw: Raw) => Parsed): Parsed | undefined {
  return value === undefined ? undefined : parse(value);
}

export class UpdateProductUseCase implements UseCase<UpdateProductInput, ProductOutput> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: UpdateProductInput): Promise<ProductOutput> {
    const product = await loadProduct(this.productRepository, input.productId);
    const name = parseOptional(input.name, (name) => ProductName.create(name));
    const price = parseOptional(input.priceInCents, (priceInCents) => Money.fromCents(priceInCents));
    if (name) {
      product.rename(name);
    }
    if (price) {
      product.changePrice(price);
    }
    await this.productRepository.save(product);
    return toProductOutput(product);
  }
}
