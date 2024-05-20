import './scss/styles.scss';

import { AppState } from './components/AppState';
import { LarekApi } from './components/larekApi';
import { Page } from './components/page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { PaymentSuccess } from './components/paymentSuccess';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct, IOrderForm } from './types';
import { Modal } from './components/modal';
import { PreviewCard } from './components/previewCard';

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
const orderComponent = new Order(cloneTemplate(orderTemplate), events);

// Обновляем счетчик корзины при каждом изменении
events.on('basket:updated', (products: IProduct[]) => {
  const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
  basketCounter.textContent = String(products.length);
});

// Обновляем счетчик корзины после очистки
events.on('basket:cleared', () => {
  const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
  basketCounter.textContent = '0';
});

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
  page.renderCatalog(products, cardCatalogTemplate);
  console.log('Catalog updated:', page.catalog);
});

events.on('item:select', (item: IProduct) => {
  console.log('Event item:select received:', item);
  const previewElement = cloneTemplate(cardPreviewTemplate);
  const previewCard = new PreviewCard(previewElement, () => {
    basket.addProduct(item);
    modal.close();
    console.log('Product added to basket:', item);
  });
  modal.setContent(previewCard.render(item));
  modal.open();
  console.log('Modal opened with content:', previewElement);
});

events.on('order:open', () => {
  const orderProducts = basket.getProducts().filter((product: IProduct) => product.price !== null && product.price !== 0);
  const orderData: IOrder = {
    address: '',
    payment: '',
    email: '',
    phone: '',
    total: orderProducts.reduce((sum, product) => sum + (product.price || 0), 0),
    items: orderProducts.map((product: IProduct) => product.id)
  };
  modal.setContent(orderComponent.render(orderData)); // Используем orderComponent
  modal.open();
  console.log('Order modal opened', orderData);
});

events.on('order:nextStep', (data: { address: string, payment: string }) => {
  console.log('Order data received:', data);
  appData.setOrderField('address', data.address);
  appData.setOrderField('payment', data.payment);

  const orderProducts = basket.getProducts().filter((product: IProduct) => product.price !== null && product.price !== 0);
  appData.setOrderField('total', orderProducts.reduce((sum, product) => sum + (product.price || 0), 0));
  appData.setOrderField('items', orderProducts.map((product: IProduct) => product.id));

  const contactsForm = cloneTemplate(contactsTemplate);
  const contacts = new Contacts(contactsForm, events);
  modal.setContent(contacts.render());
  modal.open();
  console.log('Contacts form opened');
});

events.on('contacts:formInput', (formData: { field: keyof IOrderForm, value: string }) => {
  console.log('Form input received:', formData);
  appData.setContactsField(formData.field, formData.value);
});

events.on('contacts:formSubmit', () => {
  const orderData = appData.getOrder();
  console.log('Form submitted with data:', orderData);
  api.submitOrder(orderData)
    .then(response => {
      console.log('Order submitted successfully:', response);
      events.emit('contacts:submitted', orderData);
    })
    .catch(error => {
      console.error('Error submitting order:', error);
    });
});

events.on('contacts:submitted', (data: IOrder) => {
  console.log('Order data submitted:', data);
  const paymentSuccessElement = cloneTemplate(paymentSuccessTemplate);
  const paymentSuccess = new PaymentSuccess(paymentSuccessElement, events);
  modal.setContent(paymentSuccess.render({ total: data.total }));
  modal.open();
  basket.clear();
  events.emit('basket:cleared'); // Emit event for basket cleared
  console.log('Payment success modal opened');
});

events.on('order:paymentSelected', (event: { method: string }) => {
  const { method } = event;
  console.log(`Payment method selected: ${method}`);
});

events.on('payment:successClosed', () => {
  modal.close();
  console.log('Payment success modal closed');
});

events.on('basket:open', () => {
  modal.setContent(basket.render());
  modal.open();
  console.log('Basket modal opened');
});
