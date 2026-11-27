import type { UseCase } from '../../../shared/application/use-case.js';
import { loadProduct } from '../load-product.js';
import { toProductOutput, type ProductOutput } from '../product-output.js';
import type { ProductRepository } from '../product.repository.js';

export type GetProductInput = {
  productId: string;
};

export class GetProductUseCase implements UseCase<GetProductInput, ProductOutput> {
  constructor(private readonly products: ProductRepository) {}

  async execute(input: GetProductInput): Promise<ProductOutput> {
    const product = await loadProduct(this.products, input.productId);
    return toProductOutput(product);
  }
}
