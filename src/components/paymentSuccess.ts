import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface PaymentSuccessData {
  total: number;
}

export class PaymentSuccess extends Component<PaymentSuccessData> {
  protected _closeButton: HTMLButtonElement;
  protected _totalElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('button.order-success__close', container);
    this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);

    this._closeButton.addEventListener('click', () => this.handleClose());
  }

  handleClose() {
    this.events.emit('payment:successClosed');
  }

  render(data: PaymentSuccessData): HTMLElement {
    this._totalElement.textContent = `Списано ${data.total} синапсов`;
    return this.container;
  }
}
