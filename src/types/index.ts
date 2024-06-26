export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
}

export interface IOrder extends IOrderForm {
  items: string[];
}

export interface IAppState {
  catalog: IProduct[];
  basketList: IProduct[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}

export interface ILarekApi {
  getProducts: () => Promise<IProduct[]>;
  makeOrder: (value: IOrder) => Promise<IOrder>;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
