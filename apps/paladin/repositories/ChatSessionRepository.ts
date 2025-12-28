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
import { ChatSessionEntity } from '../entities/ChatSessionEntity';

@repository()
export class ChatSessionRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<ChatSessionEntity>> {
    return await this.database.open(ChatSessionEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<ChatSessionEntity> {
    return {
      select: {
        id: true,
        resourceType: true,
        resourceId: true,
        resourceName: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
          name: true,
        },
      },
      relations: {
        user: true,
        messages: true,
      },
    };
  }

  public async find(
    criteria: FindManyOptions<ChatSessionEntity>,
  ): Promise<ChatSessionEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<ChatSessionEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<ChatSessionEntity>,
  ): Promise<ChatSessionEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<ChatSessionEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Chat session not found');
    }
    return entity;
  }

  public async findByUserId(userId: string): Promise<ChatSessionEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  public async findByUserAndResource(
    userId: string,
    resourceType: 'resume' | 'coverletter',
    resourceId: string,
  ): Promise<ChatSessionEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: {
        user: { id: userId },
        resourceType,
        resourceId,
      },
    });
  }

  public async create(
    entity: ChatSessionEntity,
    options?: SaveOptions,
  ): Promise<ChatSessionEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async update(
    entity: ChatSessionEntity,
    options?: SaveOptions,
  ): Promise<ChatSessionEntity> {
    return await this.create(entity, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<ChatSessionEntity>
      | FindOptionsWhere<ChatSessionEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<ChatSessionEntity>
      | FindOptionsWhere<ChatSessionEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }
}
