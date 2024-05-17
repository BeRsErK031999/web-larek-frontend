import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  private lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  private unlockScroll() {
    document.body.style.overflow = 'auto';
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.lockScroll();
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this._content.innerHTML = ''; // Очистка содержимого
    this.unlockScroll();
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    this.setContent(data.content);
    return this.container;
  }

  setContent(content: HTMLElement): void {
    this._content.replaceChildren(content);
  }
}
