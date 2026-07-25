import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AboutPage } from './about.entity';
export declare class AboutService implements OnModuleInit {
    private repo;
    constructor(repo: Repository<AboutPage>);
    onModuleInit(): Promise<void>;
    get(): Promise<AboutPage>;
    update(dto: any): Promise<AboutPage>;
    addTeamMember(member: {
        name: string;
        role: string;
        img: string;
    }): Promise<AboutPage>;
    removeTeamMember(index: number): Promise<AboutPage>;
    updateTeamMember(index: number, member: Partial<{
        name: string;
        role: string;
        img: string;
    }>): Promise<AboutPage>;
}
