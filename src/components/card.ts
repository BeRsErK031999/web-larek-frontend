import { ensureElement } from "../utils/utils";
import { Component } from './base/component';

export interface ICard {
  title: string;
  description: string;
  image?: string;
  category?: string;
  price: number;
  index?: number;
  button?: string;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void; // Функция обработки клика по карточке
}

type CategoryKey = 'софт-скил' | 'другое' | 'хард-скил' | 'дополнительное' | 'кнопка';

export class Card extends Component<ICard> {
  private _title?: HTMLElement;
  private _price?: HTMLElement;
  private _category?: HTMLElement;
  private _image?: HTMLImageElement;
  private _button?: HTMLButtonElement;
  private _index?: HTMLSpanElement;
  private _description?: HTMLElement;

  private categoryClasses: Record<CategoryKey, string> = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'хард-скил': 'card__category_hard',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
  };

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    console.log('Card created:', container);
    this.attachEvents(actions);
  }

  // Метод для назначения обработчиков событий.
  private attachEvents(actions?: ICardActions): void {
    if (actions?.onClick && this.buttonElement) {
      this.buttonElement.addEventListener('click', actions.onClick);
      console.log('Attached onClick to buttonElement');
    } else {
      this.container.addEventListener('click', actions?.onClick || (() => {}));
      console.log('Attached onClick to container');
    }
  }

  // Утилитарный метод для безопасного получения элементов из DOM.
  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.container.querySelector(selector) as T;
    console.log(`Element ${selector} fetched:`, element);
    return element;
  }

  // Утилитарный метод для обновления текста элемента.
  private updateElement(element: HTMLElement | undefined, value: string | number, suffix?: string): void {
    if (element) {
      element.textContent = `${value}${suffix || ''}`;
      console.log('Element updated:', element);
    }
  }

  // Геттер и сеттер для свойства title.
  get title(): string {
    return this.titleElement.textContent || '';
  }

  set title(value: string) {
    this.updateElement(this.titleElement, value);
  }

  // Геттер для получения элемента заголовка, используя ensureElement.
  get titleElement(): HTMLElement {
    return this._title || (this._title = ensureElement<HTMLElement>('.card__title', this.container));
  }

  // Геттер и сеттер для свойства price.
  get price(): number {
    return parseFloat(this.priceElement.textContent || '0');
  }

  set price(value: number) {
    const priceText = value > 0 ? `${value} синапсов` : 'Бесценно';
    this.updateElement(this.priceElement, priceText);
  }

  // Геттер для получения элемента цены, используя ensureElement.
  get priceElement(): HTMLElement {
    return this._price || (this._price = ensureElement<HTMLElement>('.card__price', this.container));
  }

  // Сеттер для категории, применяет соответствующий CSS класс.
  set category(value: CategoryKey) {
    const className = this.categoryClasses[value];
    if (className && this.categoryElement) {
      this.categoryElement.className = ''; // Clear existing classes
      this.categoryElement.classList.add(className);
    }
    this.updateElement(this.categoryElement, value);
  }

  // Геттер для получения элемента категории, используя ensureElement.
  get categoryElement(): HTMLElement {
    return this._category || (this._category = ensureElement<HTMLElement>('.card__category', this.container));
  }

  // Сеттер для свойства image, обновляет атрибуты src и alt изображения.
  set image(value: string) {
    if (this._image) {
      this._image.src = value;
      this._image.alt = this.title;
    }
  }

  // Геттер для получения элемента изображения, используя getElement.
  get imageElement(): HTMLImageElement {
    return this._image || (this._image = this.getElement<HTMLImageElement>('.card__image'));
  }

  // Сеттер для свойства button, обновляет текст кнопки.
  set button(value: string) {
    this.updateElement(this.buttonElement, value);
  }

  // Геттер для получения элемента кнопки, используя getElement.
  get buttonElement(): HTMLButtonElement {
    return this._button || (this._button = this.getElement<HTMLButtonElement>('.card__button'));
  }

  // Сеттер для свойства description, обновляет текст описания.
  set description(value: string) {
    this.updateElement(this.descriptionElement, value);
  }

  // Геттер для получения элемента описания, используя ensureElement.
  get descriptionElement(): HTMLElement {
    return this._description || (this._description = ensureElement<HTMLElement>('.card__description', this.container));
  }

  render(data: ICard): HTMLElement {
    console.log('Rendering card with data:', data);
    this.title = data.title;
    this.price = data.price;
    this.category = data.category as CategoryKey;
    this.image = data.image || '';
    this.description = data.description;
    return this.container;
  }
}
