import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { IProduct } from '../types';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  private products: IProduct[] = [];

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
  }

  addProduct(product: IProduct) {
    if (product.price === null || product.price === 0) {
      const hasNonZeroPriceProduct = this.products.some(p => p.price !== null && p.price > 0);
      if (!hasNonZeroPriceProduct) {
        console.log('Cannot add product with zero price unless there is a product with a non-zero price:', product);
        return;
      }
    }

    this.products.push(product);
    this.updateView();
    this.events.emit('basket:updated', this.products);
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.updateView();
    this.events.emit('basket:updated', this.products);
  }

  updateView() {
    const items = this.products.map((product, index) => {
      const itemElement = createElement<HTMLLIElement>('li', {
        className: 'basket__item card card_compact',
        innerHTML: `
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${product.title}</span>
          <span class="card__price">${product.price !== null ? `${product.price} синапсов` : 'Бесценно'}</span>
          <button class="basket__item-delete" aria-label="удалить"></button>
        `
      });
      itemElement.querySelector('.basket__item-delete')?.addEventListener('click', () => {
        this.removeProduct(index);
      });
      return itemElement;
    });

    this.items = items;
    this.total = this.calculateTotal();

    // Toggle the checkout button based on total price
    const totalPrice = this.calculateTotal();
    this._button.disabled = totalPrice === 0;
  }

  calculateTotal(): number {
    return this.products.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._toggleButton(false);
      this._list.replaceChildren(...items);
    } else {
      this._toggleButton(true);
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Выберите хоть что нибудь)'
      }));
    }
  }

  set selected(items: string[]) {
    if (items.length) {
      this._toggleButton(false);
    } else {
      this._toggleButton(true);
    }
  }

  _toggleButton(state: boolean) {
    this.setDisabled(this._button, state);
  }

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }

  clear() {
    this.products = [];
    this.updateView();
  }

  getTotalPrice(): number {
    return this.calculateTotal();
  }

  getProducts(): IProduct[] {
    return this.products;
  }
}
