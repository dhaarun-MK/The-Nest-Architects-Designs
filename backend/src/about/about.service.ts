import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutPage } from './about.entity';

@Injectable()
export class AboutService implements OnModuleInit {
  constructor(@InjectRepository(AboutPage) private repo: Repository<AboutPage>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) await this.repo.save({ team_members: [] });
  }

  get() { return this.repo.findOne({ where: { id: 1 } }); }

  async update(dto: any) { await this.repo.update(1, dto); return this.get(); }

  async addTeamMember(member: { name: string; role: string; img: string }) {
    const about = await this.get();
    const members = about.team_members || [];
    members.push(member);
    await this.repo.update(1, { team_members: members });
    return this.get();
  }

  async removeTeamMember(index: number) {
    const about = await this.get();
    const members = about.team_members || [];
    members.splice(index, 1);
    await this.repo.update(1, { team_members: members });
    return this.get();
  }

  async updateTeamMember(index: number, member: Partial<{ name: string; role: string; img: string }>) {
    const about = await this.get();
    const members = about.team_members || [];
    members[index] = { ...members[index], ...member };
    await this.repo.update(1, { team_members: members });
    return this.get();
  }
}
