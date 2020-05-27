import { EventModelApi, UserVisibleError } from '@sr2020/interface/models/alice-model-engine';
import { AddedImplant, MetaRace, Sr2020Character } from '@sr2020/sr2020-common/models/sr2020-character.model';
import { ImplantSlot, kAllImplants } from './implants_library';
import { sendNotificationAndHistoryRecord } from './util';
import { createGapDueToImplantUninstall, reduceEssenceDueToImplantInstall } from './essence';
import { MerchandiseQrData } from '@sr2020/sr2020-model-engine/scripts/qr/datatypes';

export function installImplant(api: EventModelApi<Sr2020Character>, data: MerchandiseQrData) {
  if (api.workModel.currentBody != 'physical') {
    throw new UserVisibleError('Импланты можно устанавливать только в мясное тело');
  }

  const implant = kAllImplants.find((it) => it.id == data.id);
  if (!implant) {
    throw new UserVisibleError(`Импланта ${data.id} не существует`);
  }

  if (api.model.implants.filter((it) => it.slot == implant.slot).length >= maxImplantsPerSlot(implant.slot)) {
    throw new UserVisibleError(`Все слоты нужного типа заняты, сначала удалите имплант из одного из них.`);
  }

  const supportedRaces: MetaRace[] = ['meta-norm', 'meta-elf', 'meta-dwarf', 'meta-ork', 'meta-troll'];
  if (implant.grade == 'bio') {
    supportedRaces.push('meta-hmhvv1', 'meta-hmhvv3');
  }

  if (!supportedRaces.includes(api.model.metarace)) {
    throw new UserVisibleError('Данный имплант нельзя установить представителю этой метарасы');
  }

  reduceEssenceDueToImplantInstall(api, implant);

  if (implant.onInstallEvent) {
    api.sendSelfEvent(implant.onInstallEvent, {});
  }

  const addedImplant: AddedImplant = {
    id: implant.id,
    name: implant.name,
    description: implant.description,
    slot: implant.slot,
    grade: implant.grade,
    installDifficulty: implant.installDifficulty,
    essenceCost: implant.essenceCost,
    basePrice: data.basePrice,
    rentPrice: data.rentPrice,
    gmDescription: data.gmDescription,
    dealId: data.dealId,
    lifestyle: data.lifestyle,
    modifierIds: implant.modifiers.map((it) => api.addModifier(it).mID),
  };
  api.model.implants.push(addedImplant);
  sendNotificationAndHistoryRecord(api, 'Имплант установлен', `Установлен имплант ${addedImplant.name}`);
  api.sendPubSubNotification('implant_install', {
    characterId: api.model.modelId,
    id: implant.id,
    implantLifestyle: data.lifestyle,
    // TODO(aeremin) Send actual autodoc lifestyle.
    autodocLifestyle: 'irridium',
  });
}

export function removeImplant(api: EventModelApi<Sr2020Character>, data: { id: string }) {
  if (api.workModel.currentBody != 'physical') {
    throw new UserVisibleError('Импланты можно удалять только из мясного тела');
  }

  const libraryImplant = kAllImplants.find((it) => it.id == data.id);
  if (!libraryImplant) {
    throw new UserVisibleError(`Импланта ${data.id} не существует`);
  }

  const implantIndex = api.model.implants.findIndex((it) => it.id == data.id);
  if (implantIndex == -1) {
    throw new UserVisibleError(`Импланта ${data.id} не установлено`);
  }

  const implant = api.model.implants[implantIndex];
  createGapDueToImplantUninstall(api, implant);

  if (libraryImplant.onRemoveEvent) {
    api.sendSelfEvent(libraryImplant.onRemoveEvent, {});
  }

  sendNotificationAndHistoryRecord(api, 'Имплант удален', `Удален имплант ${implant.name}`);
  api.model.implants[implantIndex].modifierIds.forEach((id) => api.removeModifier(id));
  api.model.implants.splice(implantIndex, 1);
}

function maxImplantsPerSlot(slot: ImplantSlot) {
  if (slot == 'rcc') return 1;
  return 2;
}