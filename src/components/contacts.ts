import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';
import { IOrderForm } from '../types';

export class Contacts extends Component<null> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);

    console.log('Contacts elements initialized:', {
      _emailInput: this._emailInput,
      _phoneInput: this._phoneInput,
      _submitButton: this._submitButton,
    });

    this._emailInput.addEventListener('input', () => this.handleInput('email', this._emailInput.value));
    this._phoneInput.addEventListener('input', () => this.handleInput('phone', this._phoneInput.value));
    this._submitButton.addEventListener('click', (event) => this.handleSubmit(event));
  }

  handleInput(field: keyof IOrderForm, value: string) {
    this.events.emit('contacts:formInput', { field, value });
    this.checkFormValidity();
  }

  checkFormValidity() {
    const isValid = this._emailInput.value.trim() !== '' && this._phoneInput.value.trim() !== '';
    this._submitButton.disabled = !isValid;
    console.log('Contacts form validity checked:', isValid);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Contacts form submitted');
    this.events.emit('contacts:formSubmit');
  }

  render(): HTMLElement {
    this.checkFormValidity(); // Initial check
    return this.container;
  }
}
