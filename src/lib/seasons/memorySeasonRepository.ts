import { initialSeasons } from "@/data/seasons";
import type { Season, SeasonRepository } from "./types";

export class MemorySeasonRepository implements SeasonRepository {
  private seasons: Season[];

  constructor(initialData: Season[] = initialSeasons) {
    this.seasons = initialData.map((item) => ({ ...item }));
  }

  async getSeasons(includeInactive = true): Promise<Season[]> {
    return this.seasons
      .filter((s) => includeInactive || s.active)
      .map((item) => ({ ...item }))
      .sort((a, b) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0));
  }

  async getSeasonById(id: string): Promise<Season | null> {
    const found = this.seasons.find((s) => s.id === id);
    if (!found) return null;
    return { ...found };
  }

  async createSeason(season: Season): Promise<void> {
    const existingIndex = this.seasons.findIndex((s) => s.id === season.id);
    if (existingIndex >= 0) {
      this.seasons[existingIndex] = { ...season };
    } else {
      this.seasons.push({ ...season });
    }
  }

  async updateSeason(id: string, updates: Partial<Season>): Promise<void> {
    const index = this.seasons.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Season not found");
    }
    this.seasons[index] = { ...this.seasons[index], ...updates, id };
  }

  async deleteSeason(id: string): Promise<void> {
    this.seasons = this.seasons.filter((s) => s.id !== id);
  }

  async resetToSeedData(): Promise<void> {
    this.seasons = initialSeasons.map((item) => ({ ...item }));
  }

  async importSeasons(items: Season[]): Promise<void> {
    this.seasons = items.map((item) => ({ ...item }));
  }
}

export const memorySeasonRepository = new MemorySeasonRepository();
