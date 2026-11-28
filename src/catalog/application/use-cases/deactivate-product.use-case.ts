import type { UseCase } from '../../../shared/application/use-case.js';
import { loadProduct } from '../load-product.js';
import type { ProductOutput } from '../product-output.js';
import { toProductOutput } from '../product-output.js';
import type { ProductRepository } from '../product.repository.js';

export type DeactivateProductInput = {
  productId: string;
};

export class DeactivateProductUseCase implements UseCase<DeactivateProductInput, ProductOutput> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: DeactivateProductInput): Promise<ProductOutput> {
    const product = await loadProduct(this.productRepository, input.productId);
    product.deactivate();
    await this.productRepository.save(product);
    return toProductOutput(product);
  }
}
