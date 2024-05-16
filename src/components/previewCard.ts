import { Component } from './base/component';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';

export class PreviewCard extends Component<IProduct> {
  private _titleElement: HTMLElement;
  private _imageElement: HTMLImageElement;
  private _priceElement: HTMLElement;
  private _categoryElement: HTMLElement;
  private _descriptionElement: HTMLElement;
  private _buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, private onAddToBasket: () => void) {
    super(container);

    this._titleElement = ensureElement<HTMLElement>('.card__title', container);
    this._imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this._priceElement = ensureElement<HTMLElement>('.card__price', container);
    this._categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this._descriptionElement = ensureElement<HTMLElement>('.card__description', container);
    this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

    this._buttonElement.addEventListener('click', this.onAddToBasket);
  }

  render(data: IProduct): HTMLElement {
    this._titleElement.textContent = data.title;
    this._imageElement.src = data.image || '';
    this._imageElement.alt = data.title;
    this._priceElement.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
    this._categoryElement.textContent = data.category || '';
    this._descriptionElement.textContent = data.description || '';

    return this.container;
  }
}
