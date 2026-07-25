import { SettingsService } from './settings.service';
export declare class SettingsController {
    private service;
    constructor(service: SettingsService);
    get(): Promise<import("./settings.entity").Settings>;
    update(dto: any, files: any): Promise<import("./settings.entity").Settings>;
}
