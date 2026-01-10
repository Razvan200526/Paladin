import { database, inject } from '@razvan11/paladin';
import {
  DataSource,
  type EntityManager,
  type EntityTarget,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';
import { PrimaryEntities } from './Entities';

@database({
  migrations: 'migrations',
})
export class PrimaryDatabase {
  private source: DataSource;

  constructor(
    @inject('APP_DATABASE_URL')
    private readonly url: string,
  ) {}

  public getSource(): DataSource {
    if (this.source) {
      return this.source;
    }

    this.source = new DataSource({
      type: 'postgres',
      url: this.url,
      synchronize: true,
      entities: PrimaryEntities,
      ssl : Bun.env.NODE_ENV === 'production'
    });

    return this.source;
  }

  public async open<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const source = this.getSource();

    if (!source.isInitialized) {
      await source.initialize();
    }

    return source.getRepository(entity);
  }

  public async close(): Promise<void> {
    const source = this.getSource();
    if (source.isInitialized) {
      await source.destroy();
    }
  }

  public getEntityManager(): EntityManager {
    return this.getSource().manager;
  }
}
