import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

// Определение интерфейса для данных, которые использует модальное окно.
interface IModalData {
    content: HTMLElement;
}

// Определение класса Modal, который расширяет базовый класс Component, параметризованный типом IModalData.
export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  // Конструктор класса Modal.
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); 
    // Инициализация кнопки закрытия модального окна, поиск элемента по селектору.
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    // Инициализация контейнера для содержимого модального окна.
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    // Добавление обработчика клика для кнопки закрытия.
    this._closeButton.addEventListener('click', this.close.bind(this));
    // Добавление обработчика клика для закрытия модального окна при клике на фон.
    this.container.addEventListener('click', this.close.bind(this));
    // Предотвращение распространения события клика на самом содержимом.
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  // Метод для блокировки скролла страницы.
  private lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  // Метод для разблокировки скролла страницы.
  private unlockScroll() {
    document.body.style.overflow = 'auto';
  }

  // Сеттер для изменения содержимого модального окна.
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  // Метод для открытия модального окна.
  open() {
    this.container.classList.add('modal_active'); // Добавление класса для активации видимости.
    this.lockScroll(); // Блокировка скролла страницы.
    this.events.emit('modal:open'); // Генерация события открытия.
  }

  // Метод для закрытия модального окна.
  close() {
    this.container.classList.remove('modal_active'); // Удаление класса, делающего окно видимым.
    this.content = null; // Очистка содержимого.
    this.unlockScroll(); // Разблокировка скролла страницы.
    this.events.emit('modal:close'); // Генерация события закрытия.
  }

  // Метод для установки данных и подготовки окна, но без его открытия
  render(data: IModalData): HTMLElement {
    this.setContent(data.content); // Метод для установки содержимого
    return this.container;
  }

  // Отдельный метод для установки содержимого
  setContent(content: HTMLElement): void {
    this._content.replaceChildren(content);
  }
}
