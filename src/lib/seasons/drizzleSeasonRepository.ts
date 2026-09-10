import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb, isDatabaseInCooldown, markDatabaseFailure, type Database } from "@/db";
import { seasonFromRow, seasonToRow } from "@/db/mappers";
import { seasons } from "@/db/schema";
import { initialSeasons } from "@/data/seasons";
import { memorySeasonRepository } from "./memorySeasonRepository";
import type { Season, SeasonRepository } from "./types";

export class DrizzleSeasonRepository implements SeasonRepository {
  private database: Database | null;

  constructor(database?: Database | null) {
    this.database = database !== undefined ? database : getDb();
  }

  private canQueryDb(): boolean {
    return Boolean(this.database && !isDatabaseInCooldown());
  }

  async getSeasons(includeInactive = true): Promise<Season[]> {
    if (this.canQueryDb()) {
      try {
        const rows = await this.database!
          .select()
          .from(seasons)
          .where(includeInactive ? undefined : eq(seasons.active, true))
          .orderBy(desc(seasons.sortOrder));
        return rows.map(seasonFromRow);
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to hardcoded seasons due to database error.");
      }
    }
    return memorySeasonRepository.getSeasons(includeInactive);
  }

  async getSeasonById(id: string): Promise<Season | null> {
    if (this.canQueryDb()) {
      try {
        const [row] = await this.database!.select().from(seasons).where(eq(seasons.id, id)).limit(1);
        if (row) return seasonFromRow(row);
        return memorySeasonRepository.getSeasonById(id);
      } catch (error) {
        markDatabaseFailure(error);
        console.error(`Falling back to hardcoded seasons for season ID "${id}" due to database error.`);
      }
    }
    return memorySeasonRepository.getSeasonById(id);
  }

  async createSeason(season: Season): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.insert(seasons).values(seasonToRow(season));
        await memorySeasonRepository.createSeason(season);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory season storage for created season.");
      }
    }
    await memorySeasonRepository.createSeason(season);
  }

  async updateSeason(id: string, updates: Partial<Season>): Promise<void> {
    if (this.canQueryDb()) {
      try {
        const existing = await this.getSeasonById(id);
        if (!existing) throw new Error("Season not found");
        await this.database!
          .update(seasons)
          .set(seasonToRow({ ...existing, ...updates, id }))
          .where(eq(seasons.id, id));
        await memorySeasonRepository.updateSeason(id, updates);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory season storage for updated season.");
      }
    }
    await memorySeasonRepository.updateSeason(id, updates);
  }

  async deleteSeason(id: string): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.delete(seasons).where(eq(seasons.id, id));
        await memorySeasonRepository.deleteSeason(id);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory season storage for deleted season.");
      }
    }
    await memorySeasonRepository.deleteSeason(id);
  }

  async resetToSeedData(): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!
          .insert(seasons)
          .values(initialSeasons.map(seasonToRow))
          .onDuplicateKeyUpdate({ set: { active: true } });
        await memorySeasonRepository.resetToSeedData();
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory season storage for seed reset.");
      }
    }
    await memorySeasonRepository.resetToSeedData();
  }

  async importSeasons(items: Season[]): Promise<void> {
    if (this.canQueryDb()) {
      try {
        await this.database!.transaction(async (tx) => {
          await tx.delete(seasons);
          if (items.length) await tx.insert(seasons).values(items.map(seasonToRow));
        });
        await memorySeasonRepository.importSeasons(items);
        return;
      } catch (error) {
        markDatabaseFailure(error);
        console.error("Falling back to in-memory season storage for imported seasons.");
      }
    }
    await memorySeasonRepository.importSeasons(items);
  }
}
