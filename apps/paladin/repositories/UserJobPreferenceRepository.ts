/**
 * UserJobPreferencesRepository
 * Handles CRUD operations for user job preferences
 */

import { UserJobPreferencesEntity } from '@paladin/entities';
import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';
import { inject, repository } from '@razvan11/paladin';

@repository()
export class UserJobPreferencesRepository {
  constructor(@inject(PrimaryDatabase) private db: PrimaryDatabase) {}

  async findByUserId(userId: string): Promise<UserJobPreferencesEntity | null> {
    const repo = await this.db.open(UserJobPreferencesEntity);
    return repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<UserJobPreferencesEntity | null> {
    const repo = await this.db.open(UserJobPreferencesEntity);
    return repo.findOne({ where: { id } });
  }

  async create(
    data: Partial<UserJobPreferencesEntity>,
  ): Promise<UserJobPreferencesEntity> {
    const repo = await this.db.open(UserJobPreferencesEntity);
    return repo.save(data);
  }

  async update(
    id: string,
    data: Partial<UserJobPreferencesEntity>,
  ): Promise<UserJobPreferencesEntity | null> {
    const repo = await this.db.open(UserJobPreferencesEntity);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) return null;
    Object.assign(existing, data);
    return repo.save(existing);
  }

  /**
   * Create or update preferences for a user
   */
  async upsert(
    userId: string,
    data: Partial<UserJobPreferencesEntity>,
  ): Promise<UserJobPreferencesEntity> {
    const repo = await this.db.open(UserJobPreferencesEntity);

    // Check if preferences exist for this user
    const existing = await repo.findOne({
      where: { user: { id: userId } },
    });

    if (existing) {
      // Update existing preferences
      Object.assign(existing, data);
      return repo.save(existing);
    }

    // Create new preferences
    const newPrefs = repo.create({
      ...data,
      user: { id: userId } as any,
    });
    return repo.save(newPrefs);
  }
}
