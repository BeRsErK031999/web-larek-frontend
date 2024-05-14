import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

export class Order extends Component<null> {
  protected _title: HTMLElement;
  protected _onlineButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _nextButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._title = ensureElement<HTMLElement>('.modal__title', container);
    this._onlineButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this._nextButton = ensureElement<HTMLButtonElement>('button.order__button', container);

    console.log('Order elements initialized:', {
      _title: this._title,
      _onlineButton: this._onlineButton,
      _cashButton: this._cashButton,
      _addressInput: this._addressInput,
      _nextButton: this._nextButton,
    });

    this._onlineButton.addEventListener('click', () => this.selectPaymentMethod('online'));
    this._cashButton.addEventListener('click', () => this.selectPaymentMethod('cash'));
    this._addressInput.addEventListener('input', () => this.checkFormValidity());
    this._nextButton.addEventListener('click', (event) => this.handleNextStep(event));
  }

  selectPaymentMethod(method: string) {
    console.log(`Selected payment method: ${method}`);
    this.events.emit('order:paymentSelected', { method });
  }

  checkFormValidity() {
    const isValid = this._addressInput.value.trim() !== '';
    this._nextButton.disabled = !isValid;
    console.log('Form validity checked:', isValid);
  }

  handleNextStep(event: Event) {
    event.preventDefault(); // Предотвращаем поведение формы по умолчанию
    console.log('Next step triggered');
    this.events.emit('order:nextStep');
  }

  render(): HTMLElement {
    this.checkFormValidity(); // Initial check
    return this.container;
  }
}
