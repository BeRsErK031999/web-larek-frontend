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

#### Класс `Component`
Основной абстрактный класс для создания UI компонентов.
- `constructor(container: HTMLElement)`: Инициализация в указанном контейнере.
- Методы управления состоянием и отображением элементов.
-abstract render() - абстрактный метод для рендеринга элемента с данными
-setDisabled() - устанавливает свойство disabled элемента
-setText() - устанавливает текстовое содержание элемента
-toggleClass() - переключает класс элемента в зависимости от условия
-setHidden() - скрывает или отображает элемент
-setVisible() - отображает или скрывает элемент
-setImage()- устанавливает изображение для элемента

#### Класс `Modal`
Для создания и управления модальными окнами.
- Методы для открытия, закрытия и настройки содержимого модального окна.
-setContent(content: HTMLElement) - установка содержимого модального окна
-open() - открытие модального окна
-close() - закрытие модального окна
-render(data: null): HTMLElement - рендеринг модального окна

#### Класс `CatalogCard`
Представление карточки товара в каталоге.
- Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, actions: ICardActions): Инициализация карточки с действиями.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `PreviewCard`
Представление карточки товара в модальном окне предварительного просмотра.
- Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, onAddToBasket: () => void): Инициализация карточки с действием добавления в корзину.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `BasketCard`
Представление карточки товара в модальном окне предварительного просмотра.
- Методы для настройки и отображения деталей товара.
-constructor(container: HTMLElement, onDelete: () => void): Инициализация карточки с действием удаления.
-render(data: IProduct): HTMLElement: Рендеринг карточки с данными.

#### Класс `Basket`
Управление содержимым корзины покупок.
- Методы для добавления и удаления товаров, а также обработки заказа.
-addProduct(product: IProduct) - добавление продукта в корзину
-updateView() - обновление отображения корзины
-removeProduct(index: number) - удаление продукта из корзины
-calculateTotal(): string - вычисление общей суммы
-toggleButton(state: boolean) - изменение доступности кнопки

#### Класс `Order`
Форма оформления заказа с выбором оплаты и вводом адреса.
- Методы для управления процессом оформления заказа.
-selectPaymentMethod(method: string) - выбор способа оплаты
-render(): HTMLElement - рендеринг формы заказа

#### Класс `Page`
Класс, для отображения элементов страницы, таких счетчик товаров и каталог.
-Методы для счетчика, добавления карточек.
-updateCatalog(products: IProduct[]): void - обновление каталога товаров
-updateCounter(count: number): void - обновление счетчика товаров
-render(): HTMLElement - рендеринг страницы

#### Класс `Api`
Отвечает за взаимодействие с сервером.
- `constructor(baseUrl: string)`: Установка базового URL API.
- Методы для отправки и получения данных от сервера.

#### Класс `Model`
Обрабатывает данные и логику приложения.
- `constructor(data: object)`: Инициализация модели с начальными данными.
- Методы для обновления и получения данных.
-update(key: string, value: any) - обновление данных по ключу
-get(key: string): any - получение данных по ключу

#### Класс `EventEmitter`
Управление событиями внутри приложения.
- Методы подписки и отписки от событий, а также их инициации.
-on(event: string, handler: (event?: any) => void) - подписка на событие
-off(event: string, handler: (event?: any) => void) - отписка от события
-emit(event: string, data?: any) - генерация события

#### Класс `Form`
Класс для управления формами ввода.
- Методы для проверки валидности данных и отображения ошибок.
-validate(): boolean - проверка валидности данных
-getValues(): { [key: string]: string } - получение значений формы
-render(): HTMLElement - рендеринг формы

#### Класс `AppState`
Хранит и управляет состоянием приложения.
- Методы для обновления состояния приложения посредством событий.
-update(key: string, value: any) - обновление состояния по ключу
-get(key: string): any - получение состояния по ключу

## UML Диаграмма
'Схема в нотации UML'.drawio.png
[Component] <|-- [Modal]
[Component] <|-- [CatalogCard]
[Component] <|-- [PreviewCard]
[Component] <|-- [BasketCard]
[Component] <|-- [Basket]
[Component] <|-- [Order]
[Component] <|-- [Page]
[EventEmitter] <.. [AppState]
[EventEmitter] <.. [Page]
[EventEmitter] <.. [Modal]
[EventEmitter] <.. [Basket]
[EventEmitter] <.. [Order]
[LarekApi] <.. [index]
[AppState] <.. [index]