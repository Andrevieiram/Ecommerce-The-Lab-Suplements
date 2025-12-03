export interface Promocao {
  _id?: string;
  productId: string;
  code: string;
  name: string;
  category: string;
  stock: string;
  unit: string;
  price: string;
  discount?: string;
  newPrice?: string;
  status: 'Ativa' | 'Inativa';
}
