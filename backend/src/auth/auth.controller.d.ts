import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleAuth(): void;
    googleCallback(req: any, res: any): Promise<any>;
    adminLogin(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<import("../users/user.entity").User>;
}
