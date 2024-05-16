import { FormErrors, IAppState, IOrder, IOrderForm, IProduct } from "../types";
import { Model } from "./model";

export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basketList: IProduct[] = [];
  order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };

  formErrors: FormErrors = {};  

  getTotal() {
    return this.basketList.length;
  }

  getTotalPrice() {
    return this.basketList.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', this.catalog);
  }

  clearOrder() {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  clearBasket() {
    this.basketList = [];
  }

  addBasketList(item: IProduct) {
    this.basketList.push(item); 
  }

  getBasketList(): IProduct[] {
    return this.basketList;
  }

  changeBasketList(id: string) {
    this.basketList = this.basketList.filter(item => item.id !== id);
  }

  setOrderItems() {
    this.order.items = this.basketList.map(item => item.id);
    this.order.total = this.getTotalPrice(); 
  }

  setOrderField(field: keyof IOrderForm | 'items', value: string | number | string[]) { // Allow string[] for items
    if (field === 'items') {
      this.order.items = value as string[]; 
    } else if (field === 'total') {
      this.order.total = value as number; 
    } else {
      this.order[field] = value as string;
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setContactsField(field: keyof IOrderForm, value: string) {
    if (field === 'total') {
      this.order[field] = Number(value); 
    } else {
      this.order[field] = value;
    }

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrder(): IOrder {
    return this.order;
  }
}
