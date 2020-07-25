import AppError from '@shared/errors/AppError';

import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: FakeProductsRepository;
let createProductService: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
  });

  it('should be able to create a new product', async () => {
    const product = await createProductService.execute({
      name: 'Cadeira Gamer',
      price: 999.99,
      quantity: 10,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Cadeira Gamer');
  });

  it('should not be able to create a new product with same name as another', async () => {
    await createProductService.execute({
      name: 'Cadeira Gamer',
      price: 999.99,
      quantity: 10,
    });

    await expect(
      createProductService.execute({
        name: 'Cadeira Gamer',
        price: 999.99,
        quantity: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
