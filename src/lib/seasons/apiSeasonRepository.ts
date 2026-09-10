import { requestJson } from "@/lib/api/client";
import type { Season, SeasonRepository } from "./types";

export class ApiSeasonRepository implements SeasonRepository {
  constructor(private readonly admin = false) {}

  private baseUrl(): string {
    return this.admin ? "/api/admin/seasons" : "/api/seasons";
  }

  async getSeasons(includeInactive = true): Promise<Season[]> {
    const url = this.admin
      ? this.baseUrl()
      : `${this.baseUrl()}?includeInactive=${includeInactive ? "true" : "false"}`;
    return requestJson<Season[]>(url);
  }

  async getSeasonById(id: string): Promise<Season | null> {
    return requestJson<Season | null>(`${this.baseUrl()}/${encodeURIComponent(id)}`);
  }

  async createSeason(season: Season): Promise<void> {
    if (!this.admin) throw new Error("Admin access required");
    await requestJson(this.baseUrl(), { method: "POST", body: JSON.stringify(season) });
  }

  async updateSeason(id: string, season: Partial<Season>): Promise<void> {
    if (!this.admin) throw new Error("Admin access required");
    await requestJson(`${this.baseUrl()}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(season),
    });
  }

  async deleteSeason(id: string): Promise<void> {
    if (!this.admin) throw new Error("Admin access required");
    await requestJson(`${this.baseUrl()}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  async resetToSeedData(): Promise<void> {
    if (!this.admin) throw new Error("Admin access required");
    await requestJson("/api/admin/reset", { method: "POST", body: "{}" });
  }

  async importSeasons(): Promise<void> {
    throw new Error("Use the transactional admin import endpoint");
  }
}
