import { EventModelApi, UserVisibleError, Event } from '@sr2020/interface/models/alice-model-engine';
import { Sr2020Character, AddedImplant } from '@sr2020/interface/models/sr2020-character.model';
import { Implant, kAllImplants } from './implants_library';
import { QrCode } from '@sr2020/interface/models/qr-code.model';
import { installImplant, removeImplant } from './merchandise';
import { createMerchandise, consume } from '../qr/events';

export function analyzeBody(api: EventModelApi<Sr2020Character>, data: { targetCharacterId: string }, _: Event) {
  const patient: Sr2020Character = api.aquired('Character', data.targetCharacterId);

  api.model.analyzedBody = {
    // TODO(https://trello.com/c/bMqcwbvv/280-сделать-параметр-персонажа-эссенс): Implement
    essence: 666,
    healthState: patient.healthState,
    implants: patient.implants,
  };
}

export function disconnectFromBody(api: EventModelApi<Sr2020Character>, data: {}, _: Event) {
  api.model.analyzedBody = undefined;
}

function checkIfCanWorkWithImplant(rigger: Sr2020Character, implant: AddedImplant | Implant) {
  if (implant.grade == 'bio' && !rigger.rigging.canWorkWithBioware) {
    throw new UserVisibleError('Вы не умеете работать с биоваром');
  }

  if (rigger.intelligence + rigger.rigging.implantDifficultyBonus < implant.installDifficulty) {
    throw new UserVisibleError('Вы не умеете работать с настолько сложными имплантами');
  }
}

// Tries to install implant from the QR code.
export function riggerInstallImplant(
  api: EventModelApi<Sr2020Character>,
  data: { targetCharacterId: string; qrCode: number },
  event: Event,
) {
  const qr: QrCode = api.aquired('QrCode', data.qrCode.toString());
  if (qr.type != 'merchandise') {
    throw new UserVisibleError('Отсканированный QR-код не является имплантом.');
  }

  const implant = kAllImplants.find((it) => it.id == qr.data.id);
  if (implant == undefined) {
    throw new UserVisibleError('Отсканированный QR-код не является имплантом.');
  }

  checkIfCanWorkWithImplant(api.workModel, implant);

  api.sendOutboundEvent(QrCode, data.qrCode.toString(), consume, {});
  api.sendOutboundEvent(Sr2020Character, data.targetCharacterId, installImplant, { id: qr.data.id });

  // Not calling analyzeBody directly as we need for install event above propagate first
  api.sendOutboundEvent(Sr2020Character, api.model.modelId, analyzeBody, data);
}

// Tries to extract implant. Writes extracted implant to the QR code.
export function riggerUninstallImplant(
  api: EventModelApi<Sr2020Character>,
  data: { targetCharacterId: string; implantId: string; qrCode: number },
  event: Event,
) {
  const patient: Sr2020Character = api.aquired('Character', data.targetCharacterId);
  const implant = patient.implants.find((it) => it.id == data.implantId);
  if (implant == undefined) {
    throw new UserVisibleError('Имплант не найден. Попробуйте переподключиться к пациенту для актуализации списка имплантов.');
  }

  checkIfCanWorkWithImplant(api.workModel, implant);

  const qr: QrCode = api.aquired('QrCode', data.qrCode.toString());
  if (qr.type != 'empty') {
    throw new UserVisibleError('Отсканированный QR-код не является пустышкой.');
  }

  api.sendOutboundEvent(Sr2020Character, data.targetCharacterId, removeImplant, { id: implant.id });
  api.sendOutboundEvent(QrCode, data.qrCode.toString(), createMerchandise, {
    id: implant.id,
    name: implant.name,
    description: implant.description,
    // TODO(aeremin): Should we have some data here, like a globally-unique implant id?
    additionalData: {},
  });

  // Not calling analyzeBody directly as we need for uninstall event above propagate first
  api.sendOutboundEvent(Sr2020Character, api.model.modelId, analyzeBody, data);
}