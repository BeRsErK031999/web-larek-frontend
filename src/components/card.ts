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
  onClick: (event: MouseEvent) => void; // Function to handle card click
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

  private attachEvents(actions?: ICardActions): void {
    if (actions?.onClick && this.buttonElement) {
      this.buttonElement.addEventListener('click', actions.onClick);
      console.log('Attached onClick to buttonElement');
    } else {
      this.container.addEventListener('click', actions?.onClick || (() => {}));
      console.log('Attached onClick to container');
    }
  }

  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.container.querySelector(selector) as T;
    console.log(`Element ${selector} fetched:`, element);
    return element;
  }

  private updateElement(element: HTMLElement | undefined, value: string | number, suffix?: string): void {
    if (element) {
      element.textContent = `${value}${suffix || ''}`;
      console.log('Element updated:', element);
    }
  }

  get title(): string {
    return this.titleElement.textContent || '';
  }

  set title(value: string) {
    this.updateElement(this.titleElement, value);
  }

  get titleElement(): HTMLElement {
    return this._title || (this._title = ensureElement<HTMLElement>('.card__title', this.container));
  }

  get price(): number {
    return parseFloat(this.priceElement.textContent || '0');
  }

  set price(value: number) {
    const priceText = value > 0 ? `${value} синапсов` : 'Бесценно';
    this.updateElement(this.priceElement, priceText);
  }

  get priceElement(): HTMLElement {
    return this._price || (this._price = ensureElement<HTMLElement>('.card__price', this.container));
  }

  set category(value: CategoryKey) {
    const className = this.categoryClasses[value];
    if (className && this.categoryElement) {
      this.categoryElement.className = ''; // Clear existing classes
      this.categoryElement.classList.add('card__category', className);
    }
    this.updateElement(this.categoryElement, value);
  }

  get categoryElement(): HTMLElement {
    return this._category || (this._category = ensureElement<HTMLElement>('.card__category', this.container));
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = value;
      this.imageElement.alt = this.title;
      console.log('Image updated:', this.imageElement.src);
    }
  }

  get imageElement(): HTMLImageElement {
    return this._image || (this._image = this.getElement<HTMLImageElement>('.card__image'));
  }

  set button(value: string) {
    this.updateElement(this.buttonElement, value);
  }

  get buttonElement(): HTMLButtonElement {
    return this._button || (this._button = this.getElement<HTMLButtonElement>('.card__button'));
  }

  set description(value: string) {
    this.updateElement(this.descriptionElement, value);
  }

  get descriptionElement(): HTMLElement {
    return this._description || (this._description = ensureElement<HTMLElement>('.card__description', this.container));
  }

  render(data: ICard): HTMLElement {
    console.log('Rendering card with data:', data);
    this.title = data.title;
    this.price = data.price;
    this.category = data.category as CategoryKey;
    if (data.image) {
      this.image = data.image;
    }
    this.description = data.description;

    // Hide the description element for the overview view
    if (this.descriptionElement) {
      this.descriptionElement.style.display = 'none';
    }
    
    return this.container;
  }
}
