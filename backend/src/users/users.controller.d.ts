import { UsersService } from './users.service';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
    block(id: string): Promise<{
        message: string;
    }>;
}
