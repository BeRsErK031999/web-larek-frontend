# Проектная работа "WEB-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Основные классы и архитектура

### Архитектурный подход: MVP
- **Model**: Управление данными и бизнес-логикой.
- **View**: Визуализация данных и интерактивность с пользователем.
- **Presenter**: Связующее звено между Model и View через систему событий.

### Компоненты системы (Свойства и методы компонентов сделаю по ходу)

#### Класс `Component `
Основной абстрактный класс для создания UI компонентов.
Слой: View
constructor(container: HTMLElement): Инициализация в указанном контейнере.
-Методы управления состоянием и отображением элементов.
-abstract render(data: any): HTMLElement: Абстрактный метод для рендеринга элемента с данными.
-setDisabled(element: HTMLElement, state: boolean): Устанавливает свойство disabled элемента.
-setText(element: HTMLElement, text: string): Устанавливает текстовое содержание элемента.
-toggleClass(element: HTMLElement, className: string, condition: boolean): Переключает класс элемента в зависимости от условия.
-setHidden(element: HTMLElement, hidden: boolean): Скрывает или отображает элемент.
-setVisible(element: HTMLElement, visible: boolean): Отображает или скрывает элемент.
-setImage(element: HTMLImageElement, src: string, alt: string): Устанавливает изображение для элемента.

#### Класс `Modal`
Для создания и управления модальными окнами.
Слой: View
Методы для открытия, закрытия и настройки содержимого модального окна.
-setContent(content: HTMLElement): Установка содержимого модального окна.
-open(): Открытие модального окна.
-close(): Закрытие модального окна.
-render(data: IModalData): HTMLElement: Рендеринг модального окна.

#### Класс `CatalogCard`
Представление карточки товара в каталоге.
Слой: View
Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, actions: ICardActions): Инициализация карточки с действиями.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `PreviewCard`
Представление карточки товара в модальном окне предварительного просмотра.
Слой: View
Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, onAddToBasket: () => void): Инициализация карточки с действием добавления в корзину.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `BasketCard`
Представление карточки товара в модальном окне предварительного просмотра.
Слой: View
-Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, onDelete: () => void): Инициализация карточки с действием удаления.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `Basket`
Управление содержимым корзины покупок.
Слой: Presenter
Методы для добавления и удаления товаров, а также обработки заказа.
-addProduct(product: IProduct): Добавление продукта в корзину.
-updateView(): Обновление отображения корзины.
-removeProduct(index: number): Удаление продукта из корзины.
-calculateTotal(): number: Вычисление общей суммы.
-toggleButton(state: boolean): Изменение доступности кнопки.
-getTotalPrice(): number: Получение общей стоимости товаров в корзине.
-getProducts(): IProduct[]: Получение списка товаров в корзине.
-clear(): Очистка корзины.

#### Класс `Order`
Форма оформления заказа с выбором оплаты и вводом адреса.
Слой: View
Методы для управления процессом оформления заказа.
-selectPaymentMethod(method: string): Выбор способа оплаты.
-render(data: IOrder): HTMLElement: Рендеринг формы заказа.

#### Класс `Page`
Класс, для отображения элементов страницы, таких счетчик товаров и каталог.
Слой: View
Методы для работы со страницей.
-constructor(container: HTMLElement, events: IEvents): Инициализация страницы с обработкой событий.
-set counter(value: number): Обновление счетчика товаров.
-set catalog(items: HTMLElement[]): Обновление каталога товаров.
-set locked(value: boolean): Установка состояния заблокированного вида.
-renderCatalog(products: IProduct[], template: HTMLTemplateElement): Рендеринг каталога товаров.

#### Класс `Api`
Отвечает за взаимодействие с сервером. Относится к слою Model.
constructor(baseUrl: string): Установка базового URL API.
-get(uri: string): Выполнение GET запроса.
-post(uri: string, data: object, method: ApiPostMethods = 'POST'): Выполнение POST, PUT или DELETE запроса.
-protected handleResponse(response: Response): Обработка ответа сервера.

#### Класс `LarekApi`
Отвечает за взаимодействие с сервером.
Слой: Model
Методы для отправки и получения данных от сервера.
-constructor(baseUrl: string, options: RequestInit = {}): Установка базового URL API и инициализация опций запроса.
-get(uri: string): Promise<object>: Отправка GET-запроса.
-post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>: Отправка POST-запроса с указанным методом.
-handleResponse(response: Response): Promise<object>: Обработка ответа от сервера.

#### Класс `Model`
Обрабатывает данные и логику приложения.
Слой: Model
Методы для работы с данными.
-constructor(data: Partial<T>, events: IEvents): Инициализация модели с начальными данными и событиями.
-emitChanges(event: string, payload?: object): Отправка уведомлений об изменениях через систему событий.

#### Класс `EventEmitter`
Управление событиями внутри приложения.
Слой: Presenter
Методы подписки и отписки от событий, а также их инициации.
-on(event: string, handler: (event?: any) => void): Подписка на событие.
-off(event: string, handler: (event?: any) => void): Отписка от события.
-emit(event: string, data?: any): Генерация события.

#### Класс `Form`
Класс для управления формами ввода.
Слой: View
Методы для проверки валидности данных и отображения ошибок.
-validate(): boolean: Проверка валидности данных.
-getValues(): { [key: string]: string }: Получение значений формы.
-render(): HTMLElement: Рендеринг формы.

#### Класс `AppState`
Хранит и управляет состоянием приложения.
Слой: Model
Методы для обновления состояния приложения посредством событий.
-constructor(data: object, events: IEvents): Инициализация состояния приложения.
-update(key: string, value: any): Обновление состояния по ключу.
-get(key: string): any: Получение состояния по ключу.
-getTotal(): Получение общего количества товаров в корзине.
-getTotalPrice(): Получение общей стоимости товаров в корзине.
-setCatalog(items: IProduct[]): Установка списка продуктов.
-clearOrder(): Очистка данных заказа.
-clearBasket(): Очистка корзины.
-addProductToBasket(item: IProduct): Добавление товара в корзину.
-removeProductFromBasket(id: string): Удаление товара из корзины.
-setOrderField(field: keyof IOrderForm, value: string | number): Установка значения поля заказа.
-setContactsField(field: keyof IOrderForm, value: string): Установка значения поля контактов.
-validateOrder(): Проверка валидности заказа.
-validateContacts(): Проверка валидности контактов.
-getOrder(): IOrder: Получение данных заказа.

#### Класс `Contacts`
Управление формой контактов для оформления заказа. 
Слой: View
-constructor(container: HTMLElement, events: IEvents): Инициализация формы контактов.
-handleInput(field: keyof IOrderForm, value: string): Обработка ввода данных.
-checkFormValidity(): Проверка валидности формы.
-handleSubmit(event: Event): Обработка отправки формы.
-render(): HTMLElement: Рендеринг формы.

## UML Диаграмма
[Component] <|-- [Modal]
[Component] <|-- [CatalogCard]
[Component] <|-- [PreviewCard]
[Component] <|-- [BasketCard]
[Component] <|-- [Basket]
[Component] <|-- [Order]
[Component] <|-- [Page]
[Component] <|-- [Contacts]
[EventEmitter] <.. [AppState]
[EventEmitter] <.. [Page]
[EventEmitter] <.. [Modal]
[EventEmitter] <.. [Basket]
[EventEmitter] <.. [Order]
[EventEmitter] <.. [Contacts]
[LarekApi] <.. [index]
[AppState] <.. [index]