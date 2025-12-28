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
import { ChatMessageEntity } from '../entities/ChatMessageEntity';

@repository()
export class ChatMessageRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<ChatMessageEntity>> {
    return await this.database.open(ChatMessageEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<ChatMessageEntity> {
    return {
      select: {
        id: true,
        content: true,
        sender: true,
        timestamp: true,
      },
      relations: {
        chatSession: true,
      },
    };
  }

  public async find(
    criteria: FindManyOptions<ChatMessageEntity>,
  ): Promise<ChatMessageEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<ChatMessageEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<ChatMessageEntity>,
  ): Promise<ChatMessageEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findBySessionId(
    sessionId: string,
  ): Promise<ChatMessageEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { chatSession: { id: sessionId } },
      order: { timestamp: 'ASC' },
    });
  }

  public async create(
    entity: ChatMessageEntity,
    options?: SaveOptions,
  ): Promise<ChatMessageEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: ChatMessageEntity[],
    options?: SaveOptions,
  ): Promise<ChatMessageEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(
    entity: ChatMessageEntity,
    options?: SaveOptions,
  ): Promise<ChatMessageEntity> {
    return await this.create(entity, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<ChatMessageEntity>
      | FindOptionsWhere<ChatMessageEntity>[],
  ): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete(criteria);
  }

  public async deleteBySessionId(sessionId: string): Promise<DeleteResult> {
    const repository = await this.open();
    return await repository.delete({ chatSession: { id: sessionId } });
  }

  public async count(
    criteria?:
      | FindOptionsWhere<ChatMessageEntity>
      | FindOptionsWhere<ChatMessageEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }
}
