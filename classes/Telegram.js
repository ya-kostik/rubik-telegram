const { Kubik } = require('rubik-main');
const FormData = require('form-data');
const fetch = require('node-fetch');
const isObject = require('lodash/isObject');

const methods = require('./Telegram/methods');

const TelegramError = require('../errors/TelegramError');

const DEFAULT_HOST = 'https://api.telegram.org/';

/**
 * Кубик для запросов к API ботов Телеграма
 * @class
 * @prop {String} [token] токен для доступа к API
 * @prop {String} [host=DEFAULT_HOST] адрес API Телеграма
 */
class Telegram extends Kubik {
  constructor(token, host) {
    super(...arguments);
    this.token = token || null;
    this.host = host || null;
  }

  /**
   * Поднять кубик
   * @param  {Object} dependencies зависимости
   */
  up({ config }) {
    this.config = config;

    const options = this.config.get(this.name);

    this.token = this.token || options.token || null;
    this.host = this.host || options.host || DEFAULT_HOST;
  }

  getUrl(name, token, host) {
    if (!token) token = this.token;
    if (!host) host = this.host;

    if (!token) throw new TypeError('token is not defined');
    if (!host) throw new TypeError('host is not defined');

    return `${host}bot${token}/${name}`;
  }

  /**
   * Сделать запрос к API Ботов Телеграма
   * @param  {String} name  имя метода
   * @param  {Object|String} body тело запроса
   * @param  {String} [token=this.token] токен для запроса
   * @param  {String} [host=this.host] хост API Телеграма
   * @return {Promise<Object>} ответ от Телеграма
   */
  async request(name, body, token, host) {
    let headers = {}

    if (body instanceof FormData) {
      headers = body.getHeaders();
    } else if (isObject(body)) {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    const url = this.getUrl(name, token, host);
    const request = await fetch(url, { method: 'POST', body, headers });

    const result = await request.json();

    if (!result.ok) throw new TelegramError(result.description);
    return result;
  }
}

// Перебираем список имен методов API,
// создаем методы класса и внедряем их в прототип
methods.forEach((name) => {
  // Если мы переопределили поведение метода в классе по какой-то причине,
  // то не нужно ничего переписывать в прототипе
  if (Telegram.prototype[name]) return;
  Telegram.prototype[name] = async function(body, token, host) {
    return this.request(name, body, token, host);
  }
});

// Чтобы не создавать при каждой инициализации класса,
// пишем значения имени и зависимостей в протип
Telegram.prototype.dependencies = Object.freeze(['config']);
Telegram.prototype.name = 'telegram';

module.exports = Telegram;
