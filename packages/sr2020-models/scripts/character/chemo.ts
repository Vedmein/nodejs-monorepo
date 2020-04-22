import { EventModelApi, Event, UserVisibleError, EffectModelApi, Modifier } from '@sr2020/interface/models/alice-model-engine';
import { Sr2020Character, Concentrations } from '@sr2020/interface/models/sr2020-character.model';
import { kAllPills } from './chemo_library';
import { addTemporaryModifier, modifierFromEffect, validUntil } from './util';
import { duration, Duration } from 'moment';
import { increaseMentalAttack, increaseCharisma, increaseIntelligence, increaseResonance } from './basic_effects';
import { healthStateTransition } from './death_and_rebirth';

export type ChemoLevel = 'base' | 'uber' | 'super' | 'crysis';

interface InstantEffect {
  handler: (api: EventModelApi<Sr2020Character>, data: { amount: number }, event: Event) => void;
  amount: number;
}

interface DurationEffect {
  handler: (api: EffectModelApi<Sr2020Character>, m: Modifier) => void;
  duration: Duration;
  amount: number;
}

interface ChemoEffect {
  element: keyof Concentrations;
  level: ChemoLevel;
  instantEffect?: InstantEffect;
  durationEffect?: DurationEffect;
  message: string;
}

export const kAllChemoEffects: ChemoEffect[] = [
  // TODO(aeremin): Implement teqgel.
  {
    element: 'teqgel',
    level: 'base',
    message: 'TODO',
  },
  {
    element: 'teqgel',
    level: 'uber',
    message: 'TODO',
  },
  {
    element: 'teqgel',
    level: 'super',
    message: 'TODO',
  },
  {
    element: 'teqgel',
    level: 'crysis',
    message: 'TODO',
  },

  {
    element: 'iodine',
    level: 'base',
    message: 'Ты восстановил один хит.',
  },
  {
    element: 'iodine',
    level: 'uber',
    message: 'Ты вылечился из тяжелого ранения!',
    instantEffect: {
      handler: reviveTo1Hp,
      amount: 0,
    },
  },
  {
    element: 'iodine',
    level: 'super',
    message: 'Ты восстановил два хита.',
  },
  {
    element: 'iodine',
    level: 'crysis',
    message: 'Ты восстановил два хита. Появилась зависимость.',
  },

  {
    element: 'argon',
    level: 'base',
    message: 'У тебя увеличилась Харизма на 10 минут.',
    durationEffect: {
      handler: increaseCharisma,
      amount: 1,
      duration: duration(10, 'minutes'),
    },
  },
  {
    element: 'argon',
    level: 'uber',
    message: 'У тебя очень сильно увеличилась Харизма на 60 минут.',
    durationEffect: {
      handler: increaseCharisma,
      amount: 2,
      duration: duration(60, 'minutes'),
    },
  },
  {
    element: 'argon',
    level: 'super',
    message: 'У тебя увеличилась Харизма на 30 минут.',
    durationEffect: {
      handler: increaseCharisma,
      amount: 1,
      duration: duration(30, 'minutes'),
    },
  },
  {
    element: 'argon',
    level: 'crysis',
    message: 'У тебя увеличилась Харизма на 30 минут. Появилась зависимость.',
    durationEffect: {
      handler: increaseCharisma,
      amount: 1,
      duration: duration(30, 'minutes'),
    },
  },

  {
    element: 'radium',
    level: 'base',
    message: 'У тебя повысился Интеллект на 30 минут',
    durationEffect: {
      handler: increaseIntelligence,
      amount: 1,
      duration: duration(30, 'minutes'),
    },
  },
  {
    element: 'radium',
    level: 'uber',
    message: 'У тебя сильно повысился Интеллект на 60 минут',
    durationEffect: {
      handler: increaseIntelligence,
      amount: 3,
      duration: duration(60, 'minutes'),
    },
  },
  {
    element: 'radium',
    level: 'super',
    message: 'У тебя повысился Интеллект на 60 минут',
    durationEffect: {
      handler: increaseIntelligence,
      amount: 1,
      duration: duration(60, 'minutes'),
    },
  },
  {
    element: 'radium',
    level: 'crysis',
    message: 'У тебя повысился Интеллект на 60 минут, появилась зависимость',
    durationEffect: {
      handler: increaseIntelligence,
      amount: 1,
      duration: duration(60, 'minutes'),
    },
  },

  {
    element: 'junius',
    level: 'base',
    message: 'У тебя повысился Резонанс на 30 минут',
    durationEffect: {
      handler: increaseResonance,
      amount: 1,
      duration: duration(30, 'minutes'),
    },
  },
  {
    element: 'junius',
    level: 'uber',
    message: 'У тебя сильно повысился Резонанс на 60 минут',
    durationEffect: {
      handler: increaseResonance,
      amount: 3,
      duration: duration(60, 'minutes'),
    },
  },
  {
    element: 'junius',
    level: 'super',
    message: 'У тебя повысился Резонанс на 60 минут',
    durationEffect: {
      handler: increaseResonance,
      amount: 1,
      duration: duration(60, 'minutes'),
    },
  },
  {
    element: 'junius',
    level: 'crysis',
    message: 'У тебя повысился Резонанс на 60 минут, появилась зависимость',
    durationEffect: {
      handler: increaseResonance,
      amount: 1,
      duration: duration(60, 'minutes'),
    },
  },

  {
    element: 'custodium',
    level: 'base',
    message: 'Ускоряет восстановление Магии',
    instantEffect: {
      handler: reduceCurrentMagicFeedback,
      amount: 1,
    },
  },

  {
    element: 'custodium',
    level: 'uber',
    message: 'Ускоряет восстановление Магии',
    instantEffect: {
      handler: reduceCurrentMagicFeedback,
      amount: 3,
    },
  },

  {
    element: 'custodium',
    level: 'super',
    message: 'Ускоряет восстановление Магии',
    instantEffect: {
      handler: reduceCurrentMagicFeedback,
      amount: 2,
    },
  },

  {
    element: 'custodium',
    level: 'crysis',
    message: 'Ускоряет восстановление Магии',
    instantEffect: {
      handler: reduceCurrentMagicFeedback,
      amount: 2,
    },
  },

  {
    element: 'polonium',
    level: 'base',
    message: 'Ближайшие 5 минут тяжелое оружие бьет тебя по хитам (эффект лёгкой брони).',
    durationEffect: {
      handler: lightArmorEffect,
      duration: duration(5, 'minutes'),
      amount: 0,
    },
  },
  {
    element: 'polonium',
    level: 'uber',
    message:
      'На 30 минут ты Берсерк. Если у тебя сняли все хиты - издай дикий боевой крик и можешь продолжать сражаться. У тебя два хита. После их снятия нажми кнопку "тяжран"',
    durationEffect: {
      handler: berserkEffect,
      duration: duration(30, 'minutes'),
      amount: 0,
    },
  },
  {
    element: 'polonium',
    level: 'super',
    message: 'Ближайшие 30 минут тяжелое оружие бьет тебя по хитам (эффект лёгкой брони).',
    durationEffect: {
      handler: lightArmorEffect,
      duration: duration(30, 'minutes'),
      amount: 0,
    },
  },
  {
    element: 'polonium',
    level: 'crysis',
    message: 'Ближайшие 30 минут тяжелое оружие бьет тебя по хитам (эффект лёгкой брони). Появилась зависимость.',
    durationEffect: {
      handler: lightArmorEffect,
      duration: duration(5, 'minutes'),
      amount: 0,
    },
  },

  {
    element: 'opium',
    level: 'base',
    durationEffect: {
      handler: increaseMentalAttack,
      amount: 3,
      duration: duration(30, 'minutes'),
    },
    message: 'На 30 минут увеличивает способности персонажа-менталиста к ментальному воздействию.',
  },
  {
    element: 'opium',
    level: 'uber',
    durationEffect: {
      handler: increaseMentalAttack,
      amount: 10,
      duration: duration(30, 'minutes'),
    },
    message: 'На 30 минут сильно увеличивает способности персонажа-менталиста к ментальному воздействию.',
  },
  {
    element: 'opium',
    level: 'super',
    durationEffect: {
      handler: increaseMentalAttack,
      amount: 5,
      duration: duration(30, 'minutes'),
    },
    message: 'На 30 минут увеличивает способности персонажа-менталиста к ментальному воздействию.',
  },
  {
    element: 'opium',
    level: 'crysis',
    durationEffect: {
      handler: increaseMentalAttack,
      amount: 5,
      duration: duration(30, 'minutes'),
    },
    message: 'На 30 минут увеличивает способности персонажа-менталиста к ментальному воздействию. Появилась зависимость.',
  },
];

export function consumeChemo(api: EventModelApi<Sr2020Character>, data: { id: string }, _: Event) {
  // TODO(aeremin) Check for body type
  const pill = kAllPills.find((it) => it.id == data.id);
  if (!pill) {
    throw new UserVisibleError('Такого препарата не существует');
  }
  for (const element in pill.content) {
    const amount = pill.content[element];
    const modifierClass = `${element}-concentration`;
    const mods = api.getModifiersByClass(modifierClass);
    if (mods.length) {
      mods[0].amount += amount;
    } else {
      addTemporaryModifier(api, modifierFromEffect(increaseConcentration, { element, amount }, modifierClass), duration(1, 'hour'));
    }
  }
  api.sendSelfEvent(checkConcentrations, { concentrations: pill.content });
}

export function checkConcentrations(api: EventModelApi<Sr2020Character>, data: { concentrations: Partial<Concentrations> }, _: Event) {
  for (const element in data.concentrations) {
    let level: ChemoLevel | undefined = undefined;
    if (api.workModel.chemo.concentration[element] >= api.workModel.chemo.crysisThreshold) {
      level = 'crysis';
    } else if (api.workModel.chemo.concentration[element] >= api.workModel.chemo.superEffectThreshold) {
      level = 'super';
    } else if (api.workModel.chemo.concentration[element] >= api.workModel.chemo.uberEffectThreshold) {
      level = 'uber';
    } else if (api.workModel.chemo.concentration[element] >= api.workModel.chemo.baseEffectThreshold) {
      level = 'base';
    }
    if (!level) continue;

    const effect = kAllChemoEffects.find((it) => it.level == level && it.element == element);
    if (!effect) continue;

    if (effect.instantEffect) {
      api.sendSelfEvent(effect.instantEffect.handler, { amount: effect.instantEffect.amount });
    }

    if (effect.durationEffect) {
      const modifierClass = `${element}-effect`;
      const mods = api.getModifiersByClass(modifierClass);
      for (const m of mods) api.removeModifier(m.mID);
      addTemporaryModifier(
        api,
        modifierFromEffect(
          effect.durationEffect.handler,
          {
            amount: effect.durationEffect.amount,
            durationSeconds: effect.durationEffect.duration.asSeconds(),
          },
          modifierClass,
        ),
        effect.durationEffect.duration,
      );
    }
  }
  // TODO(aeremin) Implement addictions
}

export function increaseConcentration(api: EffectModelApi<Sr2020Character>, m: Modifier) {
  api.model.chemo.concentration[m.element] += m.amount;
}

export function reviveTo1Hp(api: EventModelApi<Sr2020Character>, _data: {}, _: Event) {
  if (api.model.healthState != 'wounded') return;
  healthStateTransition(api, 'healthy');
}

export function reduceCurrentMagicFeedback(api: EventModelApi<Sr2020Character>, data: { amount: number }, _: Event) {
  // TODO(https://trello.com/c/dmKERpbb/215-реализовать-реагенты-в-игре) Implement
  // Ускоряет восстановление Магии, уменьшает время действия всех текущих штрафов
  // на Магию на data.amount минут. Не может снизить ниже 30с.
}

export function lightArmorEffect(api: EffectModelApi<Sr2020Character>, m: Modifier) {
  api.model.passiveAbilities.push({
    name: 'Легкая броня',
    description: 'Тяжелое оружие бьет тебя по хитам (эффект лёгкой брони).',
    id: 'light-armor-chemo',
    validUntil: validUntil(api, duration(m.durationSeconds, 'seconds')),
  });
}

export function berserkEffect(api: EffectModelApi<Sr2020Character>, m: Modifier) {
  api.model.passiveAbilities.push({
    name: 'Берсерк',
    description:
      'Если у тебя сняли все хиты - издай дикий боевой крик и можешь продолжать сражаться. У тебя два хита. После их снятия нажми кнопку "тяжран".',
    id: 'berserk-chemo',
    validUntil: validUntil(api, duration(m.durationSeconds, 'seconds')),
  });
}