import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';
import { IOrder } from '../types';

export class Order extends Component<null> {
  protected _nextButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._nextButton = ensureElement<HTMLButtonElement>('button.order__button', container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this._paymentButtons = container.querySelectorAll<HTMLButtonElement>('.order__buttons button');

    console.log('Order elements initialized:', {
      _nextButton: this._nextButton,
      _addressInput: this._addressInput,
      _paymentButtons: this._paymentButtons,
    });

    this._nextButton.addEventListener('click', () => this.handleNextStep());
    this._paymentButtons.forEach(button => button.addEventListener('click', () => this.handlePaymentSelection(button)));
    this._addressInput.addEventListener('input', () => this.checkFormValidity());
  }

  checkFormValidity() {
    const isAddressValid = this._addressInput.value.trim() !== '';
    const isPaymentSelected = this.getSelectedPaymentMethod() !== null;
    const isValid = isAddressValid && isPaymentSelected;
    this._nextButton.disabled = !isValid;
    console.log('Order form validity checked:', isValid);
  }

  handleNextStep() {
    const paymentMethod = this.getSelectedPaymentMethod();
    if (paymentMethod) {
      this.events.emit('order:nextStep', { address: this._addressInput.value, payment: paymentMethod });
      console.log('Next step triggered');
    } else {
      console.error('No payment method selected');
    }
  }

  handlePaymentSelection(button: HTMLButtonElement) {
    this._paymentButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    this.checkFormValidity();
  }

  getSelectedPaymentMethod(): string | null {
    const selectedButton = Array.from(this._paymentButtons).find(button => button.classList.contains('selected'));
    return selectedButton ? selectedButton.name : null;
  }

  render(orderData: IOrder): HTMLElement {
    this._addressInput.value = orderData.address;
    this.checkFormValidity(); // Initial check
    return this.container;
  }
}
