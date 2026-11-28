import type { UseCase } from '../../../shared/application/use-case.js';
import { loadProduct } from '../load-product.js';
import { toProductOutput, type ProductOutput } from '../product-output.js';
import type { ProductRepository } from '../product.repository.js';

export type ActivateproductInput = {
  productId: string;
};

export class ActivateProductUseCase implements UseCase<ActivateproductInput, ProductOutput> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: ActivateproductInput): Promise<ProductOutput> {
    const product = await loadProduct(this.productRepository, input.productId);
    product.activate();
    await this.productRepository.save(product);
    return toProductOutput(product);
  }
}
