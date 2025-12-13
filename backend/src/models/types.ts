export interface User {
    id?: number;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    created_at?: Date;
    updated_at?: Date;
}

export interface Sweet {
    id?: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    image_url?: string;
    created_by?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Purchase {
    id?: number;
    user_id: number;
    sweet_id: number;
    quantity: number;
    total_price: number;
    purchase_date?: Date;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}
