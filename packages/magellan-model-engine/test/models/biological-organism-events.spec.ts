import 'jest-extended';
import { Event } from '@alice/alice-common/models/alice-model-engine';
import { merge } from 'lodash';
import { allSystemsIndices, OrganismModel, ScanQRData, System } from '../../helpers/basic-types';
import { getEvents, getNoOpEvent } from '../helpers/events';
import { getExampleBiologicalOrganismModel } from '../helpers/example-models';
import { process } from '../helpers/util';
import consts = require('../../helpers/constants');

interface Global {
  TEST_EXTERNAL_OBJECTS: any;
}

// eslint-disable-next-line no-var
declare var global: Global;

global.TEST_EXTERNAL_OBJECTS = merge(global.TEST_EXTERNAL_OBJECTS, {
  counters: {
    'ss-111': { _id: 'ss-111' },
    'ss-112': { _id: 'ss-112' },
    'ss-113': { _id: 'ss-113' },
    ship_7: {
      _id: 'ship_7',
      shield: '30',
    },
  },
});

function makeSystems(values: number[], lastModifieds: number[] = [0, 0, 0, 0, 0, 0, 0], nucleotides?: number[]): System[] {
  return allSystemsIndices().map((i) => {
    return {
      present: true,
      value: values[i],
      nucleotide: nucleotides ? nucleotides[i] : 0,
      lastModified: lastModifieds[i],
    };
  });
}

describe('General Magellan events: ', () => {
  it('No-op refresh model', async () => {
    const model = getExampleBiologicalOrganismModel();
    const events = [getNoOpEvent(model.modelId, model.timestamp + 610 * 1000)];
    const { baseModel, workingModel } = await process(model, events);

    expect(baseModel.timestamp).toBe(610 * 1000);
    expect(workingModel.timestamp).toBe(610 * 1000);

    model.timestamp = 610 * 1000;

    expect(baseModel).toEqual(model);
  });

  it('Modify nucleotide instant', async () => {
    const model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, -1, 0, 2, 0, 0]);
    const events = getEvents(model.modelId, [{ eventType: 'modify-nucleotide-instant', data: [1, 2, 3, 4, 5, 6, 0] }], 100);

    const { baseModel, workingModel } = await process(model, events);

    expect(baseModel.systems).toEqual(makeSystems([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [2, 2, 2, 4, 7, 6, 0]));
    expect(workingModel.systems).toEqual(makeSystems([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [2, 2, 2, 4, 7, 6, 0]));
  });

  it('Modify systems instant', async () => {
    const model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, -1, 2, -3, 18, -2, 0]);
    const events = getEvents(model.modelId, [{ eventType: 'modify-systems-instant', data: [1, 2, 3, 4, 5, 6, 0] }], 100);

    const { baseModel, workingModel } = await process(model, events);

    expect(baseModel.systems).toEqual(makeSystems([1, 1, 5, 1, 23, 4, 0], [100, 100, 100, 100, 100, 100, 0]));
    expect(workingModel.systems).toEqual(makeSystems([1, 1, 5, 1, 23, 4, 0], [100, 100, 100, 100, 100, 100, 0]));
  });

  it('Can kill by modify-systems-instant', async () => {
    const model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);
    const events = getEvents(model.modelId, [{ eventType: 'modify-systems-instant', data: [8, 0, 0, 0, 0, 0, 0] }], 100);

    const { baseModel, workingModel } = await process(model, events);

    expect(baseModel.isAlive).toBe(false);
    expect(workingModel.isAlive).toBe(false);
  });

  it('No modification if is not alive', async () => {
    const model = getExampleBiologicalOrganismModel();
    model.isAlive = false;
    model.systems = makeSystems([3, -1, 0, 0, 2, 0, 0]);
    const events = getEvents(model.modelId, [{ eventType: 'modify-systems-instant', data: [1, 2, -1, 0, 3, 0, 0] }], 100);

    const { baseModel, workingModel } = await process(model, events);

    expect(baseModel.systems).toEqual(makeSystems([3, -1, 0, 0, 2, 0, 0]));
    expect(workingModel.systems).toEqual(makeSystems([3, -1, 0, 0, 2, 0, 0]));
  });

  it('Use pill', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    let events = getEvents(model.modelId, [{ eventType: 'biological-systems-influence', data: [1, 2, -2, -3, 0, 0, 0] }], 100);

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 1, -1, -1, 0, 0, 0], [100, 100, 100, 100, 0, 0, 0]));

    const p = consts.MAGELLAN_TICK_MILLISECONDS;

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -2, 0, 0, 0], [100, 100 + p, 100 + p, 100 + p, 0, 0, 0]));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -3, 0, 0, 0], [100, 100 + p, 100 + p, 100 + 2 * p, 0, 0, 0]));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -3, 0, 0, 0], [100, 100 + p, 100 + p, 100 + 2 * p, 0, 0, 0]));
  });

  it('Use pill via QR', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    const data = {
      type: 4,
      kind: 0,
      validUntil: 0,
      payload: '1,2,-2,-3,0,0,0',
    };

    let events = getEvents(model.modelId, [{ eventType: 'scanQR', data }], 100);

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 1, -1, -1, 0, 0, 0], [100, 100, 100, 100, 0, 0, 0]));

    const p = consts.MAGELLAN_TICK_MILLISECONDS;

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -2, 0, 0, 0], [100, 100 + p, 100 + p, 100 + p, 0, 0, 0]));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -3, 0, 0, 0], [100, 100 + p, 100 + p, 100 + 2 * p, 0, 0, 0]));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([1, 2, -2, -3, 0, 0, 0], [100, 100 + p, 100 + p, 100 + 2 * p, 0, 0, 0]));
  });

  it('Use blue mutation pill', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    let events = getEvents(model.modelId, [{ eventType: 'biological-systems-influence', data: [0, 2, -2, 0, 1, 0, 0] }], 100);

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([0, 1, -1, 0, 1, 0, 0], [0, 100, 100, 0, 100, 0, 0]));

    const p = consts.MAGELLAN_TICK_MILLISECONDS;

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([0, 2, -2, 0, 1, 0, 0], [0, 100 + p, 100 + p, 0, 100, 0, 0]));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([0, 2, -2, 0, 1, 0, 0], [0, 100 + p, 100 + p, 0, 100, 0, 0], [0, 2, -2, 0, 1, 0, 0]));
  });

  it('Use blue/orange mutation pill on plant', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    const disableSystems = (systems: System[]): System[] => {
      for (const i of [0, 1, 2, 5]) systems[i].present = false;
      return systems;
    };

    model.systems = disableSystems(model.systems);

    let events = getEvents(model.modelId, [{ eventType: 'biological-systems-influence', data: [0, 2, -2, 0, 2, 1, 0] }], 100);

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(disableSystems(makeSystems([0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 100, 0, 0])));

    const p = consts.MAGELLAN_TICK_MILLISECONDS;

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(disableSystems(makeSystems([0, 0, 0, 0, 2, 0, 0], [0, 0, 0, 0, 100 + p, 0, 0])));

    events = [getNoOpEvent(model.modelId, model.timestamp + p)];
    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(disableSystems(makeSystems([0, 0, 0, 0, 2, 0, 0], [0, 0, 0, 0, 100 + p, 0, 0], [0, 0, 0, 0, 2, 0, 0])));
  });

  it('Use blue mutation pill and introduce compatible change', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    const p = consts.MAGELLAN_TICK_MILLISECONDS;
    const events: Event[] = [
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [0, 2, -2, 0, 1, 0, 0],
        timestamp: 100,
      },
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [0, 1, 0, 0, 0, 0, 0],
        timestamp: 200,
      },
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [0, -1, 0, 0, 0, 0, 0],
        timestamp: 300,
      },
      getNoOpEvent(model.modelId, 100 + 2 * p),
    ];

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([0, 2, -2, 0, 1, 0, 0], [0, 100 + p, 100 + p, 0, 100, 0, 0], [0, 2, -2, 0, 1, 0, 0]));
  });

  it('Use blue mutation pill and introduce incompatible change', async () => {
    let model = getExampleBiologicalOrganismModel();
    model.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);

    const p = consts.MAGELLAN_TICK_MILLISECONDS;
    const events: Event[] = [
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [0, 2, -2, 0, 1, 0, 0],
        timestamp: 100,
      },
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [1, 0, 0, 0, 0, 0, 0],
        timestamp: 200,
      },
      {
        modelId: model.modelId,
        eventType: 'biological-systems-influence',
        data: [-1, 0, 0, 0, 0, 0, 0],
        timestamp: 300,
      },
      getNoOpEvent(model.modelId, 100 + 2 * p),
    ];

    model = (await process(model, events)).baseModel;
    expect(model.systems).toEqual(makeSystems([0, 2, -2, 0, 1, 0, 0], [300, 100 + p, 100 + p, 0, 100, 0, 0]));
  });

  it('Enter and leave ship', async () => {
    let baseModel = getExampleBiologicalOrganismModel();
    let workingModel: any;

    let events = getEvents(baseModel.modelId, [{ eventType: 'enter-ship', data: 17 }]);
    ({ baseModel, workingModel } = await process(baseModel, events));

    let cond = workingModel.conditions.find((c: any) => c.id == 'on-the-ship');
    expect(cond).toBeDefined();
    expect(cond.text).toEqual('Вы находитесь на корабле номер 17');
    expect(workingModel.location).toBe('ship_17');

    events = getEvents(baseModel.modelId, [{ eventType: 'enter-ship', data: 22 }]);
    ({ baseModel, workingModel } = await process(baseModel, events));

    cond = workingModel.conditions.find((c: any) => c.id == 'on-the-ship');
    expect(cond).toBeDefined();
    expect(cond.text).toEqual('Вы находитесь на корабле номер 22');
    expect(workingModel.location).toBe('ship_22');

    events = getEvents(baseModel.modelId, [{ eventType: 'leave-ship', data: {} }]);
    ({ baseModel, workingModel } = await process(baseModel, events));

    expect(workingModel.conditions).toHaveLength(0);
    expect(workingModel.location).toBeFalsy();
  });

  it('Enter and leave ship QR', async () => {
    let baseModel = getExampleBiologicalOrganismModel();
    let workingModel: any;

    let events = getEvents(baseModel.modelId, [{ eventType: 'scanQR', data: { type: 5, kind: 0, validUntil: 0, payload: '17' } }]);
    ({ baseModel, workingModel } = await process(baseModel, events));

    const cond = workingModel.conditions.find((c: any) => c.id == 'on-the-ship');
    expect(cond).toBeDefined();
    expect(cond.text).toEqual('Вы находитесь на корабле номер 17');
    expect(workingModel.location).toBe('ship_17');

    events = getEvents(baseModel.modelId, [{ eventType: 'scanQR', data: { type: 6, kind: 0, validUntil: 0, payload: '' } }]);
    ({ baseModel, workingModel } = await process(baseModel, events));

    expect(workingModel.conditions).toHaveLength(0);
    expect(workingModel.location).toBeFalsy();
  });

  describe('Space suit actions', () => {
    it('Autoexpiration', async () => {
      let baseModel = getExampleBiologicalOrganismModel();
      baseModel.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);
      let workingModel: OrganismModel;

      let events = getEvents(
        baseModel.modelId,
        [{ eventType: 'scanQR', data: { type: 7, kind: 0, validUntil: 0, payload: 'ss-111,10' } }],
        100,
      );
      ({ baseModel, workingModel } = await process(baseModel, events));
      expect(baseModel.spaceSuit).toMatchObject({ on: true, oxygenCapacity: 600000, timestampWhenPutOn: 100 });
      expect(workingModel.spaceSuit).toMatchObject({ on: true, oxygenCapacity: 600000, timestampWhenPutOn: 100 });

      events = getEvents(
        baseModel.modelId,
        [{ eventType: 'scanQR', data: { type: 9, kind: 0, validUntil: 0, payload: '1,0,0,0,0,0,0,100' } }],
        200,
      );
      ({ baseModel, workingModel } = await process(baseModel, events));
      expect(baseModel.systems).toEqual(makeSystems([0, 0, 0, 0, 0, 0, 0]));
      expect(workingModel.systems).toEqual(makeSystems([0, 0, 0, 0, 0, 0, 0]));

      ({ baseModel, workingModel } = await process(baseModel, getEvents(baseModel.modelId, [], 600000 + 100)));
      expect(baseModel.spaceSuit).toMatchObject({ on: false });
      expect(workingModel.spaceSuit).toMatchObject({ on: false });

      expect(baseModel.systems).toEqual(makeSystems([1, 0, 0, 0, 0, 0, 0], [600000 + 100, 0, 0, 0, 0, 0, 0]));
      expect(workingModel.systems).toEqual(makeSystems([1, 0, 0, 0, 0, 0, 0], [600000 + 100, 0, 0, 0, 0, 0, 0]));
    });

    it('Manual takeoff by entering ship', async () => {
      let baseModel = getExampleBiologicalOrganismModel();
      baseModel.systems = makeSystems([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 100, 0, 0, 0, 0]);
      let workingModel: OrganismModel;

      const qrs: ScanQRData[] = [{ type: 7, kind: 0, validUntil: 0, payload: 'ss-112,10' }];
      // Add "weak" xenodisease
      qrs.push({ type: 9, kind: 0, validUntil: 0, payload: '1,0,0,0,0,0,0,30' });
      // Add "strong" xenodisease
      qrs.push({ type: 9, kind: 0, validUntil: 0, payload: '0,1,0,0,0,0,0,130' });
      // Add "medium" xenodiseases
      // We expect 65% (95 - 30) of them to stay
      for (let i = 0; i < 100; ++i) qrs.push({ type: 9, kind: 0, validUntil: 0, payload: '0,0,1,0,0,0,0,95' });
      // Add manual space suit take off action
      qrs.push({ type: 5, kind: 0, validUntil: 0, payload: '7' });

      const events = getEvents(
        baseModel.modelId,
        qrs.map((data) => ({ eventType: 'scanQR', data })),
        100,
      );
      // eslint-disable-next-line prefer-const
      ({ baseModel, workingModel } = await process(baseModel, events));

      expect(baseModel.spaceSuit.on).toBe(false);
      expect(workingModel.spaceSuit.on).toBe(false);

      expect(baseModel.systems[0].value).toBe(0);
      expect(baseModel.systems[1].value).toBe(1);
      expect(baseModel.systems[2].value).toBeWithin(65 - 15, 65 + 15);

      expect(workingModel.systems[0].value).toBe(0);
      expect(workingModel.systems[1].value).toBe(1);
      expect(baseModel.systems[2].value).toBeWithin(65 - 15, 65 + 15);
    });

    it('Weak xenodisease without suit', async () => {
      let baseModel = getExampleBiologicalOrganismModel();
      baseModel.systems = makeSystems([0, 0, 0, 0, 0, 0, 0]);
      let workingModel: OrganismModel;

      const events = getEvents(
        baseModel.modelId,
        [{ eventType: 'scanQR', data: { type: 9, kind: 0, validUntil: 0, payload: '1,0,0,0,0,0,0,1' } }],
        200,
      );
      // eslint-disable-next-line prefer-const
      ({ baseModel, workingModel } = await process(baseModel, events));
      expect(baseModel.systems).toEqual(makeSystems([1, 0, 0, 0, 0, 0, 0], [200, 0, 0, 0, 0, 0, 0]));
      expect(workingModel.systems).toEqual(makeSystems([1, 0, 0, 0, 0, 0, 0], [200, 0, 0, 0, 0, 0, 0]));
    });

    it('Can not use same space suit second time', async () => {
      let baseModel = getExampleBiologicalOrganismModel();
      let workingModel: OrganismModel;

      let events = getEvents(
        baseModel.modelId,
        [{ eventType: 'scanQR', data: { type: 7, kind: 0, validUntil: 0, payload: 'ss-113,1' } }],
        100,
      );
      ({ baseModel, workingModel } = await process(baseModel, events));
      expect(baseModel.spaceSuit.on).toBe(true);
      expect(workingModel.spaceSuit.on).toBe(true);

      events = getEvents(
        baseModel.modelId,
        [{ eventType: 'scanQR', data: { type: 7, kind: 0, validUntil: 0, payload: 'ss-113,1' } }],
        60000 + 100,
      );
      ({ baseModel, workingModel } = await process(baseModel, events));
      expect(baseModel.spaceSuit.on).toBe(false);
      expect(workingModel.spaceSuit.on).toBe(false);
    });
  });
});
