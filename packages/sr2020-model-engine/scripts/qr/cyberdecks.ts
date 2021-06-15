import { EffectModelApi, EventModelApi, UserVisibleError } from '@alice/alice-common/models/alice-model-engine';
import { QrCode } from '@alice/sr2020-common/models/qr-code.model';
import { CyberDeckQrData, typedQrData } from '@alice/sr2020-model-engine/scripts/qr/datatypes';
import { modifierFromEffect } from '@alice/sr2020-model-engine/scripts/character/util';

const kCyberDeckIsBrokenModifier = 'суberdeck-is-broken';

export function startUsingCyberDeck(api: EventModelApi<QrCode>, data: {}) {
  typedQrData<CyberDeckQrData>(api.model).inUse = true;
}

export function stopUsingCyberDeck(api: EventModelApi<QrCode>, data: {}) {
  typedQrData<CyberDeckQrData>(api.model).inUse = false;
}

export function breakCyberDeck(api: EventModelApi<QrCode>, data: {}) {
  if (api.model.type != 'cyberdeck') throw new UserVisibleError('Это не QR кибердеки!');
  api.addModifier({ ...modifierFromEffect(cyberDeckIsBroken, {}), mID: kCyberDeckIsBrokenModifier});
}

export function repairCyberDeck(api: EventModelApi<QrCode>, data: {}) {
  api.removeModifier(kCyberDeckIsBrokenModifier);
} 
export function cyberDeckIsBroken(api: EffectModelApi<QrCode>, data: {}) {
  typedQrData<CyberDeckQrData>(api.model).broken = true;
  api.model.name = api.model.name + ' (сломана)';
}
