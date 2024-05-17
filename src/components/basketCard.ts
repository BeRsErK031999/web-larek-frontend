import { Component } from './base/component'; 
import { IProduct } from '../types'; 
import { ensureElement } from '../utils/utils'; 
 
export class BasketCard extends Component<IProduct> { 
  private _titleElement: HTMLElement; 
  private _priceElement: HTMLElement; 
  private _deleteButtonElement: HTMLButtonElement; 
 
  constructor(container: HTMLElement, private onDelete: () => void) { 
    super(container); 
 
    this._titleElement = ensureElement<HTMLElement>('.card__title', container); 
    this._priceElement = ensureElement<HTMLElement>('.card__price', container); 
    this._deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', container); 
 
    this._deleteButtonElement.addEventListener('click', this.onDelete); 
  } 
 
  render(data: IProduct): HTMLElement { 
    this.setText(this._titleElement, data.title);
    this.setText(this._priceElement, data.price ? `${data.price} синапсов` : 'Бесценно');
 
    return this.container; 
  } 
}
