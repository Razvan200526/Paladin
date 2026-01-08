import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';
import { inject, repository } from '@razvan11/paladin';
import type {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from '../entities/UserEntity';

@repository()
export class UserRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<UserEntity>> {
    return await this.database.open(UserEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<UserEntity> {
    return {
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        sessions: {
          id: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
        account: {
          id: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        sessions: true,
        account: true,
      },
    };
  }

  public async find(
    criteria: FindManyOptions<UserEntity>,
  ): Promise<UserEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<UserEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<UserEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    const entity = await this.findOneBy(criteria);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findOneBy({ email });
  }

  public async findByEmailOrFail(email: string): Promise<UserEntity> {
    const entity = await this.findByEmail(email);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async create(
    entity: UserEntity,
    options?: SaveOptions,
  ): Promise<UserEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: UserEntity[],
    options?: SaveOptions,
  ): Promise<UserEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(entity: UserEntity): Promise<UserEntity> {
    const repository = await this.open();
    await repository.update(entity.id, {
      name: entity.name,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      image: entity.image,
    });
    return (await this.findOne(entity.id)) ?? entity;
  }

  public async updateMany(
    entities: UserEntity[],
    options?: SaveOptions,
  ): Promise<UserEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UpdateResult> {
    const repository = await this.open();
    return await repository.softDelete(criteria);
  }

  public async count(
    criteria?: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }
}
