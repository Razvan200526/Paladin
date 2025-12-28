import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';
import { inject, repository } from '@razvan11/paladin';
import type {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
} from 'typeorm';
import { CoverletterEntity } from '../entities/CoverletterEntity';

@repository()
export class CoverletterRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<CoverletterEntity>> {
    return await this.database.open(CoverletterEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<CoverletterEntity> {
    return {
      select: {
        id: true,
        filename: true,
        name: true,
        url: true,
        filetype: true,
        filesize: true,
        uploadedAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      },
      relations: {
        user: true,
      },
    };
  }

  public async find(
    criteria: FindManyOptions<CoverletterEntity>,
  ): Promise<CoverletterEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<CoverletterEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<CoverletterEntity>,
  ): Promise<CoverletterEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<CoverletterEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<CoverletterEntity>,
  ): Promise<CoverletterEntity> {
    const entity = await this.findOneBy(criteria);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findByUserId(userId: string): Promise<CoverletterEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { user: { id: userId } },
    });
  }

  public async findByIds(ids: string[]): Promise<CoverletterEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: ids.map((id) => ({ id })),
    });
  }

  public async create(
    entity: CoverletterEntity,
    options?: SaveOptions,
  ): Promise<CoverletterEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: CoverletterEntity[],
    options?: SaveOptions,
  ): Promise<CoverletterEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(
    entity: CoverletterEntity,
    options?: SaveOptions,
  ): Promise<CoverletterEntity> {
    return await this.create(entity, options);
  }

  public async updateMany(
    entities: CoverletterEntity[],
    options?: SaveOptions,
  ): Promise<CoverletterEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<CoverletterEntity>
      | FindOptionsWhere<CoverletterEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }

  public async deleteByIds(ids: number[]): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(ids);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<CoverletterEntity>
      | FindOptionsWhere<CoverletterEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }
}
