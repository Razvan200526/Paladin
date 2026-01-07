import { inject, repository } from '@razvan11/paladin';
import type {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
} from 'typeorm';
import { ResumeBuilderEntity } from '../entities/ResumeBuilderEntity';
import { PrimaryDatabase } from '../shared/database/PrimaryDatabase';

@repository()
export class ResumeBuilderRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<ResumeBuilderEntity>> {
    return await this.database.open(ResumeBuilderEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<ResumeBuilderEntity> {
    return {
      select: {
        id: true,
        name: true,
        templateId: true,
        data: true,
        status: true,
        thumbnailUrl: true,
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
    criteria: FindManyOptions<ResumeBuilderEntity>,
  ): Promise<ResumeBuilderEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<ResumeBuilderEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<ResumeBuilderEntity>,
  ): Promise<ResumeBuilderEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<ResumeBuilderEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Resume builder not found');
    }
    return entity;
  }

  public async findByUserId(userId: string): Promise<ResumeBuilderEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
  }

  public async findByUserIdAndId(
    userId: string,
    id: string,
  ): Promise<ResumeBuilderEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id, user: { id: userId } },
    });
  }

  public async create(
    entity: ResumeBuilderEntity,
    options?: SaveOptions,
  ): Promise<ResumeBuilderEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: ResumeBuilderEntity[],
    options?: SaveOptions,
  ): Promise<ResumeBuilderEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(
    entity: ResumeBuilderEntity,
    options?: SaveOptions,
  ): Promise<ResumeBuilderEntity> {
    return await this.create(entity, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<ResumeBuilderEntity>
      | FindOptionsWhere<ResumeBuilderEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }

  public async deleteByUserId(userId: string): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete({ user: { id: userId } });
  }

  public async count(
    criteria?:
      | FindOptionsWhere<ResumeBuilderEntity>
      | FindOptionsWhere<ResumeBuilderEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }

  public async countByUserId(userId: string): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: { user: { id: userId } } });
  }
}
