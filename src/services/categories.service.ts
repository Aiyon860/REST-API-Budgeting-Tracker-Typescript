import type { PrismaClient, CategoryType } from '@prisma/client';
import { CategoryRepository } from '../repositories/category.repository';
import type { UpdateCategoryBody } from '../schemas/category.schema';
import { cleanUndefined } from '../utils/object.util';

export class CategoriesService {
  private readonly categoryRepository: CategoryRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.categoryRepository = new CategoryRepository(this.prisma);
  }

  create = async (
    userId: string,
    data: {
      name: string,
      type: CategoryType,
    }
  ) => {
    return await this.categoryRepository.create(userId, data);
  }

  list = async (userId: string, type?: CategoryType) => {
    return await this.categoryRepository.list(userId, type);
  }

  get = async (userId: string, id: string) => {
    return await this.categoryRepository.get(userId, id);
  }

  update = async (
    userId: string,
    id: string,
    body: UpdateCategoryBody
  ) => {
    const data = cleanUndefined(body);
    return await this.categoryRepository.update(userId, id, data);
  }

  delete = async (userId: string, id: string) => {
    return await this.categoryRepository.delete(userId, id);
  }
}
