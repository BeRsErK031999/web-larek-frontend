import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';
import { IOrder } from '../types';
import { LarekApi } from './larekApi';

export class Contacts extends Component<null> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  private api: LarekApi;
  private orderData: IOrder;

  constructor(container: HTMLElement, protected events: IEvents, api: LarekApi, orderData: IOrder) {
    super(container);

    this.api = api;
    this.orderData = orderData;

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);

    console.log('Contacts elements initialized:', {
      _emailInput: this._emailInput,
      _phoneInput: this._phoneInput,
      _submitButton: this._submitButton,
    });

    this._emailInput.addEventListener('input', () => this.checkFormValidity());
    this._phoneInput.addEventListener('input', () => this.checkFormValidity());
    this._submitButton.addEventListener('click', (event) => this.handleSubmit(event));
  }

  checkFormValidity() {
    const isValid = this._emailInput.value.trim() !== '' && this._phoneInput.value.trim() !== '';
    this._submitButton.disabled = !isValid;
    console.log('Contacts form validity checked:', isValid);
  }

  handleSubmit(event: Event) {
    event.preventDefault(); 
    console.log('Contacts form submitted');
    this.orderData.email = this._emailInput.value;
    this.orderData.phone = this._phoneInput.value;
    this.submitData(this.orderData);
  }

  async submitData(data: IOrder) {
    try {
      const response = await this.api.submitOrder(data);
      console.log('Order submitted successfully:', response);
      this.events.emit('contacts:submitted', data);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  render(): HTMLElement {
    this.checkFormValidity(); // Initial check
    return this.container;
  }
}
