import { Event, UserVisibleError, EventModelApi } from '@sr2020/interface/models/alice-model-engine';
import { QrCode } from '@sr2020/interface/models/qr-code.model';
import { duration } from 'moment';
import { kAllEthicGroups } from '../character/ethics_library';

export function consume(api: EventModelApi<QrCode>, data: { noClear?: boolean }, event: Event) {
  if (api.model.usesLeft <= 0 || api.model.type == 'empty') {
    throw new UserVisibleError('QR-код уже использован!');
  }
  api.model.usesLeft -= 1;
  if (api.model.usesLeft == 0 && !data.noClear) {
    clear(api, event);
  }
}

export function unconsume(api: EventModelApi<QrCode>) {
  if (api.model.type == 'empty') {
    throw new UserVisibleError('Нельзя зарядить пустышку!');
  }
  api.model.usesLeft += 1;
}

export function create(api: EventModelApi<QrCode>, data: Partial<QrCode>, _: Event) {
  if (api.model.type != 'empty') {
    throw new UserVisibleError('QR-код уже записан!');
  }

  api.model = { ...api.model, ...data, timestamp: api.model.timestamp, modelId: api.model.modelId, modifiers: [], timers: undefined };
}

export function clear(api: EventModelApi<QrCode>, _: Event) {
  api.model = {
    modelId: api.model.modelId,
    timestamp: api.model.timestamp,
    usesLeft: 0,
    type: 'empty',
    name: 'Пустышка',
    description: 'Не записанный QR-код. На него можно записать что угодно',
    modifiers: [],
  };
}

export interface MentalQrData {
  attackerId: string;
  attack: number;
  eventType: string;
  name: string;
  description: string;
}

export function writeMentalAbility(api: EventModelApi<QrCode>, data: MentalQrData, event: Event) {
  api.model.usesLeft = 1;
  api.model.type = 'ability';
  api.model.name = 'Способность ' + data.name;
  api.model.description = data.description;
  api.model.eventType = data.eventType;
  api.model.data = data;
  api.model.modifiers = [];
  api.model.timers = {};

  api.setTimer('clear', duration(5, 'minutes'), clearMentalAbility, event);
}

export function clearMentalAbility(api: EventModelApi<QrCode>, _: Event) {
  api.model = {
    usesLeft: 100,
    description: '',
    modelId: api.model.modelId,
    modifiers: [],
    timers: {},
    name: '',
    timestamp: api.model.timestamp,
    type: 'ability',
    eventType: 'scannedConsumedMentalAbility',
  };
}

export interface LocusQrData {
  groupId: string;
}

export function createLocusQr(api: EventModelApi<QrCode>, data: { groupId: string; numberOfUses: number }, _: Event) {
  if (api.model.type != 'empty') {
    throw new UserVisibleError('QR-код уже записан!');
  }

  const group = kAllEthicGroups.find((it) => it.id == data.groupId);

  if (!group) {
    throw new UserVisibleError('Такой этической группы не существует!');
  }

  if (data.numberOfUses < 0) {
    throw new UserVisibleError('Количество зарядов локуса не может быть отрицательным!');
  }

  const qrData: LocusQrData = {
    groupId: data.groupId,
  };

  api.model = {
    usesLeft: data.numberOfUses,
    description: `Относится к группе "${group.name}"`,
    modelId: api.model.modelId,
    modifiers: [],
    timers: {},
    name: 'Локус этической группы',
    timestamp: api.model.timestamp,
    type: 'locus',
    data: qrData,
  };
}
