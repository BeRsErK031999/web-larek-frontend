import { IEvents } from "./base/events";

// Функция для проверки, является ли переданный объект экземпляром класса Model.
export const isModel = (obj: unknown): obj is Model<any> => {
    // Проверяет, является ли obj экземпляром класса Model.
    return obj instanceof Model;
  }
  
  // Абстрактный класс Model, предназначенный для работы с данными определенного типа T.
  export abstract class Model<T> {
    // Конструктор класса, который принимает данные (частично заполненные) и экземпляр интерфейса IEvents.
    constructor(data: Partial<T>, protected events: IEvents) {
      // Использование Object.assign для копирования свойств из объекта data в текущий экземпляр класса.
      Object.assign(this, data)
    }
  
    // Метод для отправки уведомлений об изменениях через систему событий.
    emitChanges(event: string, payload?: object) {
      // Вызывает метод emit объекта events, передавая название события и данные (payload).
      // Если payload не предоставлен, передается пустой объект.
      this.events.emit(event, payload ?? {})
    }
  }