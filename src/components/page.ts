import { ensureElement, cloneTemplate } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { IProduct } from "../types";
import { Card } from "./card";

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    })
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }

  renderCatalog(products: IProduct[], template: HTMLTemplateElement) {
    const items = products.map((item) => {
      const card = new Card(cloneTemplate(template), {
        onClick: () => this.events.emit('item:select', item),
      });
      return card.render({
        title: item.title,
        image: item.image,
        price: item.price,
        category: item.category,
        description: item.description,
      });
    });

    this.catalog = items;
  }
}
