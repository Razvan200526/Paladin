import { inject, repository } from '@razvan11/paladin';
import type {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { ApplicationEntity } from '../entities/ApplicationEntity';
import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';

@repository()
export class ApplicationRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) { }

  public async open(): Promise<Repository<ApplicationEntity>> {
    return await this.database.open(ApplicationEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  private getFindOneOptions(): FindOneOptions<ApplicationEntity> {
    return {
      select: {
        id: true,
        employer: true,
        jobTitle: true,
        jobUrl: true,
        salaryRange: true,
        contact: true,
        location: true,
        platform: true,
        status: true,
        comments: true,
        suggestions: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
        },
        resume: {
          id: true,
          name: true,
          filename: true,
          url: true,
          filetype: true,
          filesize: true,
          uploadedAt: true,
        },
        coverletter: {
          id: true,
          name: true,
          filename: true,
          url: true,
          filetype: true,
          filesize: true,
          uploadedAt: true,
        },
      },
      relations: {
        user: true,
        resume: true,
        coverletter: true,
      },
    };
  }

  public async find(
    criteria: FindManyOptions<ApplicationEntity>,
  ): Promise<ApplicationEntity[] | null> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      ...criteria,
    });
  }

  public async findOne(id: string): Promise<ApplicationEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<ApplicationEntity>,
  ): Promise<ApplicationEntity | null> {
    const repository = await this.open();
    return await repository.findOne({
      ...this.getFindOneOptions(),
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<ApplicationEntity> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<ApplicationEntity>,
  ): Promise<ApplicationEntity> {
    const entity = await this.findOneBy(criteria);
    if (!entity) {
      throw new Error('Not found');
    }
    return entity;
  }

  public async findByUser(userId: string): Promise<ApplicationEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  public async findByUserAndStatus(
    userId: string,
    status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected',
  ): Promise<ApplicationEntity[]> {
    const repository = await this.open();
    return await repository.find({
      ...this.getFindOneOptions(),
      where: {
        user: { id: userId },
        status: status,
      },
      order: { createdAt: 'DESC' },
    });
  }

  public async create(
    entity: ApplicationEntity,
    options?: SaveOptions,
  ): Promise<ApplicationEntity> {
    const repository = await this.open();
    return await repository.save(entity, options);
  }

  public async createMany(
    entities: ApplicationEntity[],
    options?: SaveOptions,
  ): Promise<ApplicationEntity[]> {
    const repository = await this.open();
    return await repository.save(entities, options);
  }

  public async update(
    id: string,
    data: Partial<ApplicationEntity>,
  ): Promise<ApplicationEntity> {
    const repository = await this.open();
    repository.update(id, data);
    return await repository.findOneOrFail({ where: { id } });
  }

  public async updateMany(
    entities: ApplicationEntity[],
    options?: SaveOptions,
  ): Promise<ApplicationEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<ApplicationEntity>
      | FindOptionsWhere<ApplicationEntity>[],
  ): Promise<UpdateResult> {
    const repository = await this.open();
    return await repository.softDelete(criteria);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<ApplicationEntity>
      | FindOptionsWhere<ApplicationEntity>[],
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({ where: criteria });
  }

  public async countByUser(userId: string): Promise<number> {
    const repository = await this.open();
    return await repository.count({
      where: { user: { id: userId } },
    });
  }

  public async countByUserAndStatus(
    userId: string,
    status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected',
  ): Promise<number> {
    const repository = await this.open();
    return await repository.count({
      where: {
        user: { id: userId },
        status: status,
      },
    });
  }
}
