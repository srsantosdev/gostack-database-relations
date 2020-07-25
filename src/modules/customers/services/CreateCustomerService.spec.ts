import AppError from '@shared/errors/AppError';

import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomerService: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomerService = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomerService.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.email).toBe('johndoe@example.com');
  });

  it('should not be able to create a new customer with same email as another', async () => {
    await createCustomerService.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });

    await expect(
      createCustomerService.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
