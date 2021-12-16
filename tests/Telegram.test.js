/* global describe test expect */
const path = require('path');
const { Kubiks: { Config } } = require('rubik-main');
const FormData = require('form-data');

const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const Telegram = require('../classes/Telegram.js');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const getApp = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));

  return app;
};

describe('Кубик для работы с Телеграмом', () => {
  test('Создается без проблем и добавляется в App', () => {
    const app = getApp();
    const kubik = createKubik(Telegram, app);
    expect(app.telegram).toBe(kubik);
    expect(app.get('telegram')).toBe(kubik);
  });

  test('Делает тестовый запрос к телеграму (не забудьте добавить токен в настройки)', async () => {
    const app = getApp();
    const kubik = createKubik(Telegram, app);
    await app.up();
    const response = await kubik.getMe();
    expect(response.ok).toBe(true);
    await app.down();
  });

  test('Отправляет запрос с кастомным токеном', async () => {
    const app = getApp();
    const config = app.config;
    const kubik = createKubik(Telegram, app);
    const token = config.get(kubik.name).token;
    config.get(kubik.name).token = null;
    await app.up();
    const response = await kubik.getMe({}, token);
    expect(response.ok).toBe(true);
    await app.down();
  });

  test('Отправляет запрос с form-data', async () => {
    const app = getApp();
    const kubik = createKubik(Telegram, app);
    await app.up();
    const response = await kubik.getMe(new FormData());
    expect(response.ok).toBe(true);
    await app.down();
  });

  test('Запрос с невалидным токеном падает', async () => {
    const app = getApp();
    const kubik = createKubik(Telegram, app);
    await app.up();
    await expect(kubik.getMe({}, '12345')).rejects.toThrow();
    await app.down();
  });
});
