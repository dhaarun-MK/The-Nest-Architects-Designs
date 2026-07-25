import { Reflector } from '@nestjs/core';
export declare class RolesGuard {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: any): boolean;
}
