import { ProjectImage } from './project-image.entity';
export declare class Project {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    budget: number;
    duration: string;
    cover_image: string;
    client_name: string;
    completed_date: string;
    materials_used: string;
    challenges: string;
    before_image: string;
    after_image: string;
    testimonial: string;
    is_featured: boolean;
    status: string;
    gallery: ProjectImage[];
    created_at: Date;
}
