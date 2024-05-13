import './scss/styles.scss';

import { AppState } from './components/AppState';
import { Card } from './components/card';
import { LarekApi } from './components/larekApi';
import { Page } from './components/page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { IOrder, IOrderForm, IProduct } from './types';
import { Modal } from './components/modal';
// import { Contacts } from './components/contacts';
// import { Success } from './components/Success';
// import { Order } from './components/order';

// Получение шаблонов из HTML документа через утилиту для обеспечения безопасности типов.
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Запрос продуктов через API и обработка полученных данных.
api.getProducts()
  .then(products => {
    events.emit('items:changed', products);
  })
  .catch(err => {
    console.error(err);
  });

  // Обработка события изменения списка товаров.
events.on('items:changed', (products: IProduct[]) => {
	page.catalog = products.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('item:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

