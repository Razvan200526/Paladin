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
import { UserSessionEntity } from '../entities/UserSessionEntity';

@repository()
export class UserSessionRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<UserSessionEntity>> {
    return await this.database.open(UserSessionEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<UserSessionEntity> {
    return {
      select: {
        id: true,
        token: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
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
    criteria: FindManyOptions<UserSessionEntity>,
  ): Promise<UserSessionEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<UserSessionEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserSessionEntity>,
  ): Promise<UserSessionEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<UserSessionEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('User session not found');
    }
    return entity;
  }

  public async findByUserId(userId: string): Promise<UserSessionEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  public async create(
    entity: UserSessionEntity,
    options?: SaveOptions,
  ): Promise<UserSessionEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: UserSessionEntity[],
    options?: SaveOptions,
  ): Promise<UserSessionEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(
    entity: UserSessionEntity,
    options?: SaveOptions,
  ): Promise<UserSessionEntity> {
    return await this.create(entity, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<UserSessionEntity>
      | FindOptionsWhere<UserSessionEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }

  public async hardDelete(
    criteria:
      | FindOptionsWhere<UserSessionEntity>
      | FindOptionsWhere<UserSessionEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }
}
