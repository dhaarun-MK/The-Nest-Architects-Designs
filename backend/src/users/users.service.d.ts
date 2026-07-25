import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    remove(id: number): Promise<{
        message: string;
    }>;
    block(id: number): Promise<{
        message: string;
    }>;
    count(): Promise<number>;
}
