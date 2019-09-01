import { Event, Modifier } from '@sr2020/interface/models/alice-model-engine';
import { Location } from '@sr2020/interface/models/location.model';
import { Spell, Sr2020CharacterApi, Sr2020Character } from '@sr2020/interface/models/sr2020-character.model';
import { reduceManaDensity } from '../location/events';
import { QrCode } from '@sr2020/interface/models/qr-code.model';
import { create } from '../qr/events';
import { revive } from './death_and_rebirth';
import { sendNotificationAndHistoryRecord, addHistoryRecord, addTemporaryModifier, modifierFromEffect } from './util';
import { AllActiveAbilities } from './abilities';

const AllSpells: Spell[] = [
  {
    humanReadableName: 'Заглушка',
    description: 'Спелл-заглушка, просто увеличивает число скастованных спеллов. Может быть наложен на артефакт.',
    eventType: dummySpell.name,
    canTargetSelf: true,
    canTargetItem: true,
    canTargetLocation: false,
    canTargetSingleTarget: false,
  },
  {
    humanReadableName: 'Плотность пополам!',
    description: 'Уменьшает плотность маны в локации вдвое. Может быть наложен на артефакт.',
    eventType: densityHalveSpell.name,
    canTargetSelf: false,
    canTargetItem: true,
    canTargetLocation: true,
    canTargetSingleTarget: false,
  },
  {
    humanReadableName: 'Исцеление',
    description: 'Восстанавливает все хиты.',
    eventType: fullHealSpell.name,
    canTargetSelf: true,
    canTargetItem: true,
    canTargetLocation: false,
    canTargetSingleTarget: true,
  },
  {
    humanReadableName: 'Light Heal',
    description: 'Восстанавливает текущие хиты.',
    eventType: lightHealSpell.name,
    canTargetSelf: true,
    canTargetItem: false,
    canTargetLocation: false,
    canTargetSingleTarget: true,
  },
  {
    humanReadableName: 'Ground Heal',
    description: 'Дает временную одноразовую способность поднять одну цель из КС/тяжрана в полные хиты',
    eventType: groundHealSpell.name,
    canTargetSelf: true,
    canTargetItem: false,
    canTargetLocation: false,
    canTargetSingleTarget: false,
  },
];

function createArtifact(api: Sr2020CharacterApi, qrCode: number, whatItDoes: string, eventType: string, usesLeft: number = 1) {
  api.sendOutboundEvent(QrCode, qrCode.toString(), create, {
    type: 'artifact',
    description: `Этот артефакт позволяет ${whatItDoes} даже не будучи магом!`,
    eventType,
    usesLeft,
  });
  api.sendNotification('Успех', 'Артефакт зачарован!');
}

export function increaseSpellsCasted(api: Sr2020CharacterApi, _data: {}, _event: Event) {
  api.model.spellsCasted++;
}

export function dummySpell(api: Sr2020CharacterApi, data: { qrCode?: number }, _event: Event) {
  if (data.qrCode != undefined) {
    return createArtifact(api, data.qrCode, 'скастовать спелл-заглушку', dummySpell.name, 3);
  }
  api.sendSelfEvent(increaseSpellsCasted, {});
  api.sendNotification('Скастован спелл', 'Ура! Вы скастовали спелл-заглушку');
}

export function densityDrainSpell(api: Sr2020CharacterApi, data: { locationId: string; amount: number }, _: Event) {
  api.model.spellsCasted++;
  api.sendOutboundEvent(Location, data.locationId, reduceManaDensity, { amount: data.amount });
}

export function densityHalveSpell(api: Sr2020CharacterApi, data: { locationId: string; qrCode?: number }, _: Event) {
  if (data.qrCode != undefined) {
    return createArtifact(api, data.qrCode, 'поделить плотность маны пополам', densityHalveSpell.name, 3);
  }
  api.model.spellsCasted++;
  const location = api.aquired('Location', data.locationId) as Location;
  api.sendOutboundEvent(Location, data.locationId, reduceManaDensity, { amount: location.manaDensity / 2 });
}

export function fullHealSpell(api: Sr2020CharacterApi, data: { qrCode?: number; targetCharacterId?: number }, event: Event) {
  if (data.qrCode != undefined) {
    addHistoryRecord(api, 'Заклинание', 'Лечение: на артефакт');
    return createArtifact(api, data.qrCode, 'восстановить все хиты', fullHealSpell.name);
  }

  if (data.targetCharacterId != undefined) {
    addHistoryRecord(api, 'Заклинание', 'Лечение: на цель');
    api.sendOutboundEvent(Sr2020Character, data.targetCharacterId.toString(), fullHealSpell, {});
    return;
  }

  addHistoryRecord(api, 'Заклинание', 'Лечение: на себя');
  revive(api, data, event);
}

//
// Healing spells
//
export function lightHealSpell(api: Sr2020CharacterApi, data: { targetCharacterId?: number; power: number }, event: Event) {
  if (data.targetCharacterId != undefined) {
    addHistoryRecord(api, 'Заклинание', 'Light Heal: на цель');
    api.sendNotification('Успех', 'Заклинание совершено');
    api.sendOutboundEvent(Sr2020Character, data.targetCharacterId.toString(), lightHeal, data);
    return;
  } else {
    addHistoryRecord(api, 'Заклинание', 'Light Heal: на себя');
    api.sendSelfEvent(lightHeal, data);
  }
  magicFeedback(api, data.power, event);
}

export function lightHeal(api: Sr2020CharacterApi, data: { power: number }, event: Event) {
  const hpRestored = data.power;
  sendNotificationAndHistoryRecord(api, 'Лечение', `Восстановлено хитов: ${hpRestored}`);
}

export const GROUND_HEAL_MODIFIER_NAME = 'ground-heal-modifier';

export function groundHealSpell(api: Sr2020CharacterApi, data: { power: number }, event: Event) {
  sendNotificationAndHistoryRecord(api, 'Заклинание', 'Ground Heal: на себя');
  const durationInSeconds = 10 * data.power * 60;
  const m = modifierFromEffect(groundHealEffect, { name: GROUND_HEAL_MODIFIER_NAME });
  addTemporaryModifier(api, m, durationInSeconds);
  magicFeedback(api, data.power, event);
}

export function groundHealEffect(api: Sr2020CharacterApi, m: Modifier) {
  api.model.activeAbilities.push(AllActiveAbilities.find((a) => (a.humanReadableName = 'Ground Heal'))!!);
}

//
// Events for learning and forgetting spells
//
export function learnSpell(api: Sr2020CharacterApi, data: { spellName: string }, _: Event) {
  const spell = AllSpells.find((s) => s.eventType == data.spellName);
  if (!spell) {
    throw Error('learnSpell: Unknown spellName');
  }
  api.model.spells.push(spell);
}

export function forgetSpell(api: Sr2020CharacterApi, data: { spellName: string }, _: Event) {
  api.model.spells = api.model.spells.filter((s) => s.eventType != data.spellName);
}

export function forgetAllSpells(api: Sr2020CharacterApi, data: {}, _: Event) {
  api.model.spells = [];
}

// Magic feedback implementation
function magicFeedback(api: Sr2020CharacterApi, power: number, event: Event) {
  const feedbackTimeSeconds = Math.floor((power + 1) / 2) * 60;
  const feedbackAmount = Math.floor((power + 1) / 2);

  const m = modifierFromEffect(magicFeedbackEffect, { amount: feedbackAmount });
  addTemporaryModifier(api, m, feedbackTimeSeconds);
}

export function magicFeedbackEffect(api: Sr2020CharacterApi, m: Modifier) {
  api.model.magic -= m.amount;
}
