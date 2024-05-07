export interface IOrderForm {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
    total?: number | string;
  }
  
  export interface IOrder extends IOrderForm{
    items: string[];
  }
  
  //data
  export interface IAppState {
    catalog: IProduct[];
    basketList: IProduct[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
  }
  
  //promise
  export interface ILarekApi {
    getProducts: () => Promise<IProduct[]>;
    makeOrder: (value: IOrder) => Promise<IOrder>;
  }
  
  //события
  export interface ICardActions {
    onClick: (event: MouseEvent) => void;
  }
  
  //product
  export interface IProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
  }
  
  //forms errors
  export type FormErrors = Partial<Record<keyof IOrder, string>>;
  