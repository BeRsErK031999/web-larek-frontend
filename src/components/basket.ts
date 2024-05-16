import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { IProduct } from '../types';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

// Класс Basket управляет интерфейсом корзины пользователя.
export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;    // DOM элемент списка товаров.
  protected _total: HTMLElement;   // DOM элемент для отображения общей суммы.
  protected _button: HTMLElement;  // Кнопка для совершения заказа.
  protected _counter: HTMLElement; // DOM элемент счетчика товаров.

  private products: IProduct[] = [];

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Поиск и сохранение элементов списка, итоговой суммы, кнопки и счетчика в корзине.
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLElement>('.basket__button', this.container);
    this._counter = ensureElement<HTMLElement>('.header__basket-counter', document.body);

    // Назначение обработчика клика на кнопку, если она найдена.
    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    // Инициализация списка элементов как пустого массива.
    this.items = [];
  }

  // Метод для добавления продукта в корзину
  addProduct(product: IProduct) {
    this.products.push(product);
    this.updateView();
  }

  // Метод для обновления отображения корзины
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
    this.updateCounter();
  }

  // Метод для удаления продукта из корзины
  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.updateView();
  }

  // Метод для вычисления общей суммы
  calculateTotal(): number {
    return this.products.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  // Сеттер для управления элементами корзины.
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._toggleButton(false);
      this._list.replaceChildren(...items); // Обновление содержимого списка.
    } else {
      this._toggleButton(true);
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Выберите хоть что нибудь)'
      }));
    }
  }

  // Сеттер для выбранных элементов, контролирующий активность кнопки.
  set selected(items: string[]) {
    if (items.length) {
      this._toggleButton(false);
    } else {
      this._toggleButton(true);
    }
  }

  // Метод для изменения доступности кнопки.
  _toggleButton(state: boolean) {
    this.setDisabled(this._button, state);
  }

  // Сеттер для обновления отображаемой общей суммы.
  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }

  // Метод для очистки корзины
  clear() {
    this.products = [];
    this.updateView();
  }

  // Метод для получения общей стоимости
  getTotalPrice(): number {
    return this.calculateTotal();
  }

  // Метод для получения продуктов из корзины
  getProducts(): IProduct[] {
    return this.products;
  }

  // Метод для обновления счетчика товаров в корзине
  updateCounter() {
    const count = this.products.length;
    this.setText(this._counter, String(count));
  }
}
