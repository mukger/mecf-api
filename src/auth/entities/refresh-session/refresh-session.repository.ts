import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { RefreshSession } from "./refresh-session.entity";
import { User } from "../user/user.entity";
import { Not, IsNull } from "typeorm";

@Injectable()
export class RefreshSessionsRepository extends Repository<RefreshSession> {
  constructor(private dataSource: DataSource) {
    super(RefreshSession, dataSource.createEntityManager());
  }

  async createRefreshSession(refreshToken: string, user: User, expiresIn: number): Promise<RefreshSession> {
    const refreshSession = this.create({
        user,
        refresh_token: refreshToken,
        expires_in: expiresIn
    })
    await this.deleteOldRefreshSession(user)
    return this.save(refreshSession)
  }

  async deleteOldRefreshSession(user: User): Promise<void> {
    this.delete({
      id: Not(IsNull()),
      user: { id: user.id }
    })
  }
}