import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

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

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Поиск и сохранение элементов списка, итоговой суммы и кнопки в корзине.
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

     // Назначение обработчика клика на кнопку, если она найдена.
    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open')
      })
    }

    // Инициализация списка элементов как пустого массива.
    this.items = [];
  }

  // Сеттер для управления элементами корзины.
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._toggleButton(false)
      this._list.replaceChildren(...items);// Обновление содержимого списка.
    } else {
      this._toggleButton(true)
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Выберите хоть что нибудь)'
      }));
    }
  }

  // Сеттер для выбранных элементов, контролирующий активность кнопки.
  set selected(items: string[]) {
    if (items.length) {
      this._toggleButton(false)
    } else {
      this._toggleButton(true)
    }
  }

  // Метод для изменения доступности кнопки.
  _toggleButton(state: boolean) {
    this.setDisabled(this._button, state);
  }

  // Сеттер для обновления отображаемой общей суммы.
  set total(total: string) {
    this.setText(this._total, total);
  }
}