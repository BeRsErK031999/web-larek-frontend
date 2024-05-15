import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

export class PaymentSuccess extends Component<null> {
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    console.log('PaymentSuccess elements initialized:', {
      _closeButton: this._closeButton,
    });

    this._closeButton.addEventListener('click', () => this.handleClose());
  }

  handleClose() {
    this.events.emit('payment:successClosed');
  }

  render(): HTMLElement {
    return this.container;
  }
}
