import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

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

    this._emailInput.addEventListener('input', () => this.checkFormValidity());
    this._phoneInput.addEventListener('input', () => this.checkFormValidity());
    this._submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  checkFormValidity() {
    const isValid = this._emailInput.value.trim() !== '' && this._phoneInput.value.trim() !== '';
    this._submitButton.disabled = !isValid;
    console.log('Contacts form validity checked:', isValid);
  }

  handleSubmit() {
    const formData = {
      email: this._emailInput.value,
      phone: this._phoneInput.value
    };
    this.events.emit('contacts:formSubmit', formData);
  }

  render(): HTMLElement {
    this.checkFormValidity(); // Initial check
    return this.container;
  }
}
