import './scss/styles.scss';

import { AppState } from './components/AppState';
import { Card } from './components/card';
import { LarekApi } from './components/larekApi';
import { Page } from './components/page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { Order } from './components/order';
// import { Contact } from './components/contacts';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct } from './types';
import { Modal } from './components/modal';

// Получение шаблонов из HTML документа через утилиту для обеспечения безопасности типов.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

console.log('Templates loaded:', {
  cardCatalogTemplate,
  basketTemplate,
  cardPreviewTemplate,
  orderTemplate,
  contactsTemplate,
  basketItemTemplate
});

const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);


api.getProducts()
  .then(products => {
    console.log('Products fetched:', products);
    events.emit('items:changed', products);
  })
  .catch(err => {
    console.error('Error fetching products:', err);
  });

events.on('items:changed', (products: IProduct[]) => {
  console.log('Event items:changed received:', products);
  const catalogContainer = ensureElement<HTMLElement>('.gallery');
  catalogContainer.innerHTML = ''; 
  page.catalog = products.map((item) => {
    console.log('Creating card for item:', item);
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('item:select', item),
    });
    const renderedCard = card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      description: item.description,
    });
    console.log('Card rendered:', renderedCard);
    catalogContainer.appendChild(renderedCard);
    return renderedCard;
  });
  console.log('Catalog updated:', page.catalog);
});

events.on('item:select', (item: IProduct) => {
  console.log('Event item:select received:', item);
  const previewElement = cloneTemplate(cardPreviewTemplate);

  const titleElement = ensureElement<HTMLElement>('.card__title', previewElement);
  const imageElement = ensureElement<HTMLImageElement>('.card__image', previewElement);
  const priceElement = ensureElement<HTMLElement>('.card__price', previewElement);
  const categoryElement = ensureElement<HTMLElement>('.card__category', previewElement);
  const descriptionElement = ensureElement<HTMLElement>('.card__description', previewElement);
  const buttonElement = ensureElement<HTMLButtonElement>('.card__button', previewElement);

  titleElement.textContent = item.title;
  imageElement.src = item.image;
  imageElement.alt = item.title;
  priceElement.textContent = item.price > 0 ? `${item.price} синапсов` : 'Бесценно';
  categoryElement.textContent = item.category;
  descriptionElement.textContent = item.description;

  buttonElement.textContent = 'Купить';
  buttonElement.addEventListener('click', () => {
    basket.addProduct(item);
    modal.close();
    console.log('Product added to basket:', item);
  });

  modal.setContent(previewElement);
  modal.open();
  console.log('Modal opened with content:', previewElement);
});

events.on('order:open', () => {
  modal.setContent(order.render());
  modal.open();
  console.log('Order modal opened');
});

events.on('order:paymentSelected', (event: { method: string }) => {
  const { method } = event;
  console.log(`Payment method selected: ${method}`);
});

const basketButton = ensureElement<HTMLElement>('.header__basket');
basketButton.addEventListener('click', () => {
  modal.setContent(basket.render());
  modal.open();
  console.log('Basket modal opened');
});
