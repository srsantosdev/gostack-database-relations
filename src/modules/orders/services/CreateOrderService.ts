import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const findProducts = await this.productsRepository.findAllById(products);

    if (findProducts.length !== products.length) {
      throw new AppError('Some products were not found');
    }

    const validProducts = findProducts.map(({ id, quantity, price }) => {
      const findProductIndex = products.findIndex(product => product.id === id);
      const product = products[findProductIndex];

      if (product.quantity > quantity) {
        throw new AppError('Product with insufficient quantity');
      }

      return {
        product_id: product.id,
        price,
        quantity: product.quantity,
        updatedQuantity: quantity - product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: validProducts,
    });

    const updatedProducts = validProducts.map(product => {
      return {
        id: product.product_id,
        quantity: product.updatedQuantity,
      };
    });

    await this.productsRepository.updateQuantity(updatedProducts);

    return order;
  }
}

export default CreateOrderService;
