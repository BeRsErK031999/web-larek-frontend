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
  onClick: (event: MouseEvent) => void;
}

type CategoryKey = 'софт-скил' | 'другое' | 'хард-скил' | 'дополнительное' | 'кнопка';

export class Card extends Component<ICard> {
    private _title?: HTMLElement;
    private _price?: HTMLElement;
    private _category?: HTMLElement;
    private _image?: HTMLImageElement;
    private _button?: HTMLButtonElement;
    private _index?: HTMLSpanElement;
  
    private categoryClasses: Record<CategoryKey, string> = {
        'софт-скил': 'card__category_soft',
        'другое': 'card__category_other',
        'хард-скил': 'card__category_hard',
        'дополнительное': 'card__category_additional',
        'кнопка': 'card__category_button',
      };
  
    constructor(container: HTMLElement, actions?: ICardActions) {
      super(container);
      this.attachEvents(actions);
    }
  
    private attachEvents(actions?: ICardActions): void {
        if (actions?.onClick && this.buttonElement) {
            this.buttonElement.addEventListener('click', actions.onClick);
        } else {
            this.container.addEventListener('click', actions?.onClick || (() => {}));
        }
    }
  
    private getElement<T extends HTMLElement>(selector: string): T {
      return this.container.querySelector(selector) as T;
    }
  
    private updateElement(element: HTMLElement | undefined, value: string | number, suffix?: string): void {
      if (element) {
        element.textContent = `${value}${suffix || ''}`;
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
  
    get price(): string {
      return this.priceElement.textContent || '';
    }
  
    set price(value: string) {
      this.updateElement(this.priceElement, value ? `${value} синапсов` : 'Бесплатно');
    }
  
    get priceElement(): HTMLElement {
      return this._price || (this._price = ensureElement<HTMLElement>('.card__price', this.container));
    }
  
    set category(value: CategoryKey) {
        const className = this.categoryClasses[value];
        if (className && this.categoryElement) {
          this.categoryElement.className = ''; // Clear existing classes
          this.categoryElement.classList.add(className);
        }
        this.updateElement(this.categoryElement, value);
      }
  
    get categoryElement(): HTMLElement {
      return this._category || (this._category = ensureElement<HTMLElement>('.card__category', this.container));
    }
  
    set image(value: string) {
      if (this._image) {
        this._image.src = value;
        this._image.alt = this.title;
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
  }
  