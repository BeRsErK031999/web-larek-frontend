import './scss/styles.scss';

import { AppState } from './components/AppState';
import { Card } from './components/card';
import { LarekApi } from './components/larekApi';
import { Page } from './components/page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { PaymentSuccess } from './components/paymentSuccess';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct } from './types';
import { Modal } from './components/modal';

// Define CategoryKey type
type CategoryKey = 'софт-скил' | 'другое' | 'хард-скил' | 'дополнительное' | 'кнопка';

// Получение шаблонов из HTML документа через утилиту для обеспечения безопасности типов.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

console.log('Templates loaded:', {
  cardCatalogTemplate,
  basketTemplate,
  cardPreviewTemplate,
  orderTemplate,
  contactsTemplate,
  basketItemTemplate,
  paymentSuccessTemplate
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
  const textElement = ensureElement<HTMLElement>('.card__text', previewElement);
  const descriptionElement = ensureElement<HTMLElement>('.card__description', previewElement);
  const buttonElement = ensureElement<HTMLButtonElement>('.card__button', previewElement);

  titleElement.textContent = item.title;
  imageElement.src = item.image;
  imageElement.alt = item.title;
  priceElement.textContent = item.price > 0 ? `${item.price} синапсов` : 'Бесценно';
  categoryElement.textContent = item.category;
  categoryElement.className = ''; // Clear existing classes

  const categoryClasses: Record<CategoryKey, string> = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'хард-скил': 'card__category_hard',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
  };

  const categoryClass = categoryClasses[item.category as CategoryKey] || '';
  categoryElement.classList.add('card__category', categoryClass);

  // Hide card__text and show card__description
  textElement.style.display = 'none';
  descriptionElement.textContent = item.description;
  descriptionElement.style.display = 'block';

  buttonElement.textContent = 'Купить';
  buttonElement.addEventListener('click', () => {
    basket.addProduct(item);
    modal.close(); // Close the modal after adding the product
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

events.on('order:nextStep', () => {
  const contactsForm = cloneTemplate(contactsTemplate);
  const contacts = new Contacts(contactsForm, events);
  modal.setContent(contacts.render());
  modal.open();
  console.log('Contacts form opened');
});

events.on('order:paymentSelected', (event: { method: string }) => {
  const { method } = event;
  console.log(`Payment method selected: ${method}`);
});

events.on('contacts:submitted', (data: { email: string, phone: string }) => {
  console.log('Contacts form submitted with data:', data);
  const paymentSuccessElement = cloneTemplate(paymentSuccessTemplate);
  const paymentSuccess = new PaymentSuccess(paymentSuccessElement, events);
  const totalAmount = basket.calculateTotal(); // Calculate the total amount
  modal.setContent(paymentSuccess.render({ total: totalAmount }));
  modal.open();
  basket.clear(); // Clear the basket after order is placed
  console.log('Payment success modal opened');
});

events.on('payment:successClosed', () => {
  modal.close();
  console.log('Payment success modal closed');
});

const basketButton = ensureElement<HTMLElement>('.header__basket');
basketButton.addEventListener('click', () => {
  modal.setContent(basket.render());
  modal.open();
  console.log('Basket modal opened');
});
