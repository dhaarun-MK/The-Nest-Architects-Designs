import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({ order: { created_at: "DESC" } });
  }
  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  async remove(id: number) {
    await this.repo.delete(id);
    return { message: "User deleted" };
  }
  async block(id: number) {
    await this.repo.update(id, { is_blocked: true });
    return { message: "User blocked" };
  }
  count() {
    return this.repo.count();
  }
}
