export interface Product {
    _id: string;
    name: string;
    code: number;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: boolean;
}

export interface Promocao {
    _id: string;
    product: Product; 
    discount: number;
    newPrice: number;
    status: 'Ativa' | 'Inativa' | string;
    createdAt: string;
    updatedAt: string;
}

export interface PromotionResponse {
    message: string;
    data: Promocao[];
}