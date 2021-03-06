//Тесты для событий общего назначения (для хакеров и т.д.)

import { process } from '../test_helpers';
import { getExampleModel } from '../fixtures/models';
import { getEvents, getRefreshEvent } from '../fixtures/events';

describe('General events: ', () => {
  it('Add temporary condition', async function () {
    const eventData = {
      text: 'Test1',
      details: 'Test 1 details',
      class: 'mind',
    };

    const eventData2 = {
      text: 'Test2',
      details: 'Test 2 details',
      class: 'mind',
      duration: 600,
    };

    const model = getExampleModel();
    let events = getEvents(
      model.modelId,
      [
        { eventType: 'put-condition', data: eventData },
        { eventType: 'put-condition', data: eventData2 },
      ],
      model.timestamp + 100,
    );
    let { baseModel } = await process(model, events);

    let cond1 = baseModel.conditions.find((c: any) => c.text == 'Test1');
    let cond2 = baseModel.conditions.find((c: any) => c.text == 'Test2');

    expect(cond1).toBeDefined();
    expect(cond2).toBeDefined();

    //Проверить через 600 секунд
    events = [getRefreshEvent(model.modelId, baseModel.timestamp + 610 * 1000)];
    ({ baseModel } = await process(baseModel, events));

    cond1 = baseModel.conditions.find((c: any) => c.text == 'Test1');
    cond2 = baseModel.conditions.find((c: any) => c.text == 'Test2');

    expect(cond1).toBeDefined();
    expect(cond2).toBeFalsy();

    //Проверить через 2 часа секунд
    events = [getRefreshEvent(model.modelId, baseModel.timestamp + 7200 * 1000)];
    ({ baseModel } = await process(baseModel, events));

    cond1 = baseModel.conditions.find((c: any) => c.text == 'Test1');
    cond2 = baseModel.conditions.find((c: any) => c.text == 'Test2');

    expect(cond1).toBeFalsy();
    expect(cond2).toBeFalsy();
  });

  it('Send message', async function () {
    const msgData = {
      title: 'Test Message',
      text: 'Test Message details',
    };

    const model = getExampleModel();
    const events = getEvents(model.modelId, [{ eventType: 'send-message', data: msgData }], model.timestamp + 100);
    const { baseModel } = await process(model, events);

    const msg = baseModel.messages.find((c: any) => c.title == 'Test Message');

    expect(msg).toBeDefined();

    ///printModel(baseModel);
  });

  it('Change variable', async function () {
    const model = getExampleModel();
    const events = getEvents(
      model.modelId,
      [
        { eventType: 'change-model-variable', data: { name: 'sweethome', value: 'new_location' } },
        { eventType: 'change-model-variable', data: { name: 'login', value: 'test-login' } },
      ],
      model.timestamp + 100,
    );
    const { baseModel } = await process(model, events);

    expect(baseModel.sweethome).toBe('new_location');
    expect(baseModel.login).toBe('john.smith');
  });

  it('Change mind cube', async function () {
    const eventData = {
      operations: 'A2+20, B4-5, F1=27',
    };
    const model = getExampleModel();
    const events = getEvents(model.modelId, [{ eventType: 'change-mind-cube', data: eventData }], model.timestamp + 100);
    const { baseModel } = await process(model, events);

    expect(baseModel.mind.A[2]).toBe(76);
    expect(baseModel.mind.B[4]).toBe(50);
    expect(baseModel.mind.F[1]).toBe(27);
  });

  it('Change android owner', async function () {
    const model = getExampleModel();

    model.profileType = 'robot';
    model.owner = 'ivan.ivanovich';

    const events = getEvents(
      model.modelId,
      [{ eventType: 'change-android-owner', data: { owner: 'vasya.pupkin' } }],
      model.timestamp + 100,
    );
    const { baseModel } = await process(model, events);

    expect(baseModel.owner).toBe('vasya.pupkin');

    //printModel(baseModel);
  });

  it('Change memory', async function () {
    const model = getExampleModel();

    const data1 = {
      title: 'Новое воспоминание 1',
      text: 'Текст нового воспоминания 1',
    };

    const data2 = {
      title: 'Новое воспоминание 2',
      text: 'Текст нового воспоминания 2',
    };

    const data3 = {
      mID: '82eb411a-51cb-478d-9f90-5f6f52660a0d',
      title: 'Обновленное воспоминание №2',
      text: 'Текст Обновленное воспоминание №2',
    };

    const modelData = {
      remove: ['6acf27a6-fd6e-4477-b526-e1fbe25c416b'],
      add: [data1, data2],
      update: [data3],
    };

    const events = getEvents(model.modelId, [{ eventType: 'change-memory', data: modelData }], model.timestamp + 100);
    const { baseModel } = await process(model, events);

    //printModel(baseModel);

    const msg1 = baseModel.memory.find((c: any) => c.title == 'Название воспоминания №1');
    const msg2 = baseModel.memory.find((c: any) => c.title == 'Новое воспоминание 1');
    const msg3 = baseModel.memory.find((c: any) => c.title == 'Новое воспоминание 2');
    const msg4 = baseModel.memory.find((c: any) => c.title == 'Обновленное воспоминание №2');

    expect(msg1).toBeFalsy();
    expect(msg2).toBeDefined();
    expect(msg3).toBeDefined();
    expect(msg4).toBeDefined();
    expect(msg4.text).toBe('Текст Обновленное воспоминание №2');
  });

  it('Change insurance', async function () {
    const model = getExampleModel();

    const events = getEvents(
      model.modelId,
      [{ eventType: 'change-insurance', data: { Insurance: 'JJ', Level: 2 } }],
      model.timestamp + 100,
    );
    const { baseModel } = await process(model, events);

    expect(baseModel.insurance).toBe('JJ');
    expect(baseModel.insuranceLevel).toBe(2);
    expect(baseModel.insuranceDiplayName).toBe('Johnson & Johnson, L: 2');

    //printModel(baseModel);
  });
});
