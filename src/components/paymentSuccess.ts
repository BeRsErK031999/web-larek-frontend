import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface IPaymentSuccessData {
  total: string;
}

export class PaymentSuccess extends Component<IPaymentSuccessData> {
  protected _closeButton: HTMLButtonElement;
  protected _totalElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);

    console.log('PaymentSuccess elements initialized:', {
      _closeButton: this._closeButton,
      _totalElement: this._totalElement,
    });

    this._closeButton.addEventListener('click', () => this.handleClose());
  }

  handleClose() {
    this.events.emit('payment:successClosed');
  }

  render(data: IPaymentSuccessData): HTMLElement {
    this._totalElement.textContent = `Списано ${data.total}`;
    return this.container;
  }
}
