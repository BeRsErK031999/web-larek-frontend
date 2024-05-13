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
// import { Contacts } from './components/contacts';
import { Modal } from './components/modal';
// import { Success } from './components/Success';
// import { Order } from './components/order';

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


api.getProducts()
  .then(products => {
    events.emit('items:changed', products);
  })
  .catch(err => {
    console.error(err);
  });

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

events.on('item:select', (item: IProduct) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit(appData.getButtonName(item.title) === 'Купить' ? 'item:add' : 'item:remove', item);
    }
  });
  card.render({
    category: item.category,
    title: item.title,
    description: item.description,
    image: item.image,
    price: item.price,
    button: appData.getButtonName(item.title),
  });
});

events.on('item:add', (item: IProduct) => {
  appData.addBasketList(item);
  events.emit('basket:changed');
});

events.on('item:remove', (item: IProduct) => {
  appData.changeBasketList(item.id);
  events.emit('basket:changed');
});

events.on('basket:changed', () => {
	basket.items = appData.basketList.map(
		(item: { title: string; price: number }, index) => {
			const card = new Card(cloneTemplate(basketItemTemplate), {
				onClick: () => events.emit('item:remove', item),
			});
			return card.render({
				title: item.title,
				price: item.price,
				index: index + 1,
			});
		}
	);
  basket.total = `${appData.getTotalPrice()} синапсов`;
});


events.on('basket:open', () => {
  basket.items = [];
  appData.clearBasket();
});