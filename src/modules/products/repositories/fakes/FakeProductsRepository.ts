import { uuid } from 'uuidv4';

import Product from '@modules/products/infra/typeorm/entities/Product';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import IProductsRepository from '../IProductsRepository';

interface IFindProducts {
  id: string;
}

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, { id: uuid(), name, price, quantity });

    this.products.push(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.name === name);

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findAll: Product[] = [];

    products.map(({ id }) => {
      const findProduct = this.products.find(product => product.id === id);

      if (findProduct) {
        findAll.push(findProduct);
      }

      return findProduct;
    });

    return findAll;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedProducts = products.map(({ id, quantity }) => {
      const productIndex = this.products.findIndex(
        product => product.id === id,
      );

      if (productIndex >= 0) {
        const product = this.products[productIndex];

        product.quantity = quantity;
        this.products[productIndex] = product;
      }

      return this.products[productIndex];
    });

    return updatedProducts;
  }
}
