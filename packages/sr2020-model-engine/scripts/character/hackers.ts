import { Effect, EffectModelApi, EventModelApi, Modifier, UserVisibleError } from '@alice/alice-common/models/alice-model-engine';
import { Sr2020Character } from '@alice/sr2020-common/models/sr2020-character.model';
import {
  increaseBody,
  increaseCharisma,
  increaseIntelligence,
  increaseResonance,
} from '@alice/sr2020-model-engine/scripts/character/basic_effects';
import * as cuid from 'cuid';
import { duration } from 'moment';
import { healthStateTransition } from '@alice/sr2020-model-engine/scripts/character/death_and_rebirth';
import { sendNotificationAndHistoryRecord } from '@alice/sr2020-model-engine/scripts/character/util';
import { ModifierWithAmount } from '@alice/sr2020-model-engine/scripts/character/typedefs';
import { ActiveAbilityData } from '@alice/sr2020-common/models/common_definitions';
import { template } from 'lodash';
import { getAllPassiveAbilities } from '@alice/sr2020-model-engine/scripts/character/library_registrator';
import { CyberDeckQrData, typedQrData } from '@alice/sr2020-model-engine/scripts/qr/datatypes';
import { QrCode } from '@alice/sr2020-common/models/qr-code.model';
import { startUsingCyberDeck, stopUsingCyberDeck } from '../qr/cyberdecks';

const kCyberDeckModifierId = 'in-the-deck';
interface DumpshockModifier extends Modifier {
  amount: number; // always positive or zero
}

const kDumpshockModifier: DumpshockModifier = {
  mID: 'dumpshock',
  priority: Modifier.kDefaultPriority,
  amount: 0,
  enabled: true,
  effects: [
    {
      enabled: true,
      type: 'normal',
      handler: dumpshockEffect.name,
    },
  ],
};

export function dumpshock(api: EventModelApi<Sr2020Character>, data: {}) {
  return;

  if (api.workModel.currentBody != 'physical') {
    throw new UserVisibleError('Цель не находится в мясном теле.');
  }

  if (api.model.healthState != 'biologically_dead') {
    healthStateTransition(api, 'clinically_dead', undefined);
  }

  adjustDumpshock(api, { amount: 1 });

  sendNotificationAndHistoryRecord(api, 'Дампшок!', 'Вы испытали дампшок! Клиническая смерть.');
  api.sendPubSubNotification('dumpshock', { characterId: api.model.modelId });
}

export function temporaryAntiDumpshock(api: EventModelApi<Sr2020Character>, data: { durationInMinutes: number }) {
  if (adjustDumpshock(api, { amount: -1 })) {
    api.setTimer(cuid(), 'Завершение эффекта уменьшения дампшока', duration(data.durationInMinutes, 'minutes'), adjustDumpshock, {
      amount: 1,
    });
  }
}

export function adjustDumpshock(api: EventModelApi<Sr2020Character>, data: { amount: number }): boolean {
  const m = api.getModifierById(kDumpshockModifier.mID);
  if (m) {
    const dumpshockModifier = m as ModifierWithAmount;
    if (dumpshockModifier.amount + data.amount >= 0) {
      dumpshockModifier.amount += data.amount;
      return true;
    } else {
      return false;
    }
  } else {
    if (data.amount < 0) return false;
    api.addModifier({ ...kDumpshockModifier, amount: data.amount });
    return true;
  }
}

export function dumpshockEffect(api: EffectModelApi<Sr2020Character>, m: DumpshockModifier) {
  increaseResonance(api, { ...m, amount: -m.amount });
  increaseCharisma(api, { ...m, amount: -m.amount });
  increaseBody(api, { ...m, amount: -m.amount });
  increaseIntelligence(api, { ...m, amount: -m.amount });
  const ability = getAllPassiveAbilities().get('dump-shock-survivor')!;
  api.model.passiveAbilities.push({
    id: ability.id,
    humanReadableName: ability.humanReadableName,
    description: template(ability.description)({ amount: m.amount }),
  });
}

export function createJackedInEffect(): Effect {
  return {
    enabled: true,
    type: 'normal',
    handler: jackedInEffect.name,
  };
}

export function jackedInEffect(api: EffectModelApi<Sr2020Character>, m: Modifier) {
  const abilityToRemove = api.model.hacking.jackedIn ? 'jack-in' : 'jack-out';
  api.model.activeAbilities = api.model.activeAbilities.filter((ability) => ability.id != abilityToRemove);
}

export function jackInAbility(api: EventModelApi<Sr2020Character>, data: ActiveAbilityData) {
  const cyberdeck = typedQrData<CyberDeckQrData>(api.aquired(QrCode, data.qrCodeId!));
  
  if (cyberdeck.broken) {
    throw new UserVisibleError('Кибердека сломана!');
  }
  if (cyberdeck.inUse) {
    throw new UserVisibleError('Эта кибердека уже используется!');
  }

  api.sendOutboundEvent(QrCode, data.qrCodeId!, startUsingCyberDeck, {});
  api.addModifier(createCyberDeckModifier(data.qrCodeId!));

  api.model.hacking.jackedIn = true;
}

export function jackOutAbility(api: EventModelApi<Sr2020Character>, data: ActiveAbilityData) {

//  const m = findInCyberdeckModifier(api);
  const m = api.getModifierById(kCyberDeckModifierId);
  api.sendOutboundEvent(QrCode, m.deckQrId, stopUsingCyberDeck, {});
  api.removeModifier(m.mID);

//  api.sendOutboundEvent(QrCode, data.qrCodeId!, stopUsingCyberDeck, {});
  api.model.hacking.jackedIn = false;
}

type InTheCyberDeckModifier = Modifier & {
  deckQrId: string;
};

function createCyberDeckModifier(deckQrId: string): InTheCyberDeckModifier {
  return {
    mID: kCyberDeckModifierId,
    priority: Modifier.kDefaultPriority,
    enabled: true,
    effects: [
      {
        type: 'normal',
        handler: inTheCyberDeck.name,
        enabled: true,
      },
    ],
    deckQrId,
  };
}
export function inTheCyberDeck(api: EffectModelApi<Sr2020Character>, m: InTheCyberDeckModifier) {
}
/*
function findInCyberdeckModifier(api: EventModelApi<Sr2020Character>) {
  const m = api.getModifierById(kCyberDeckModifierId);
  if (!m) {
    throw new UserVisibleError('Для отключения от дрона необходимо быть подключенным к нему.');
  }
  return m as kCyberDeckModifier;
}
*/
