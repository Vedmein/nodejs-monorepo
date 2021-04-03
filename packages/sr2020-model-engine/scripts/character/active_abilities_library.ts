import {
  absoluteDeathAbility,
  activateSoft,
  alloHomorusAbility,
  arrowgant,
  biomonitorScanAbility,
  changeAuraAbility,
  cloudMemoryAbility,
  doNothingAbility,
  dummyAbility,
  finishHimAbility,
  hammerOfJustice,
  howMuchItCosts,
  howMuchTheRent,
  investigateScoring,
  iWillSurvive,
  letHimPay,
  letMePay,
  oneTimeRevive,
  pencilLargeAbility,
  repomanAbility,
  repomanBlackAbility,
  reRent,
  skinStoneAbility,
  takeNoHarmAbility,
  tincasmAbility,
  trollton,
  whoNeedsIt,
} from './active_abilities';
import {
  billionerWalkAbility,
  danilaINeedHelpAbility,
  flyYouFoolAbility,
  fullOblivionAbility,
  iDontTrustAnybody,
  increaseTheMentalProtectionAbility,
  killHimAbility,
  lieToMeAbility,
  lukeIAmYourFatherAbility,
  oblivionAbility,
  paralysis1Ability,
  paralysis2Ability,
  paralysis3Ability,
  reallyNeedItAbility,
  reduceTheMentalProtectionAbility,
  scornHimAbility,
  tellMeTheTruthAbility,
  youDontTrustAnybody,
} from './mental';
import { capsuleReanimate, medcartHealAbility, medcartReviveAbility, reviveAbsoluteOnTarget, reviveOnTarget } from './death_and_rebirth';
import { QrType } from '@alice/sr2020-common/models/qr-code.model';
import { TargetSignature } from '@alice/sr2020-common/models/sr2020-character.model';
import {
  chargeLocusAbility,
  discourseGroupAddAbility,
  discourseGroupAddGuru,
  discourseGroupExcludeAbility,
  discourseGroupInquisitor1,
  discourseGroupInquisitor2,
  prophetAbility,
} from './ethics';
import { setAllActiveAbilities } from '@alice/sr2020-model-engine/scripts/character/library_registrator';
import { droneEmergencyExit, enterDrone, exitDrone } from '@alice/sr2020-model-engine/scripts/character/rigger';
import { getPillNameAbility, usePillsOnOthersAbility, whatsInTheBodyAbility } from '@alice/sr2020-model-engine/scripts/character/chemo';
import { nanohiveArmorAbility, nanohiveBackupAbility, nanohiveHealhAbility, nanohiveShooterAbility } from './nanohives';
import { spiritsRelatedSpell } from '@alice/sr2020-model-engine/scripts/character/spells';
import { ghoulBite, gmRespawnHmhvv, vampireBite } from '@alice/sr2020-model-engine/scripts/character/hmhvv';
import { jackInAbility, jackOutAbility } from '@alice/sr2020-model-engine/scripts/character/hackers';
import { enterSpirit, exitSpirit, spiritEmergencyExit } from '@alice/sr2020-model-engine/scripts/character/spirits';
import { ActiveAbility } from '@alice/sr2020-common/models/common_definitions';
import { gmDecreaseMaxEssence, gmEssenceReset, gmIncreaseMaxEssence } from '@alice/sr2020-model-engine/scripts/character/essence';
const kHealthyBodyTargeted: TargetSignature[] = [
  {
    name: 'Персонаж',
    allowedTypes: ['HEALTHY_BODY'],
    field: 'targetCharacterId',
  },
];
const kMedcartHealthyBodyTargeted: TargetSignature[] = [
  {
    name: 'Пациент',
    allowedTypes: ['HEALTHY_BODY'],
    field: 'targetCharacterId',
  },
];
const kMedcartWoundedBodyTargeted: TargetSignature[] = [
  {
    name: 'Пациент',
    allowedTypes: ['WOUNDED_BODY'],
    field: 'targetCharacterId',
  },
];
const kMedcartDeadBodyTargeted: TargetSignature[] = [
  {
    name: 'Пациент',
    allowedTypes: ['CLINICALLY_DEAD_BODY'],
    field: 'targetCharacterId',
  },
];
const kNonDeadBodyTargeted: TargetSignature[] = [
  {
    name: 'Персонаж',
    allowedTypes: ['HEALTHY_BODY', 'WOUNDED_BODY'],
    field: 'targetCharacterId',
  },
];
const kAstralBodyTargeted: TargetSignature[] = [
  {
    name: 'Дух',
    allowedTypes: ['ASTRAL_BODY'],
    field: 'targetCharacterId',
  },
];
const kPhysicalBodyTargeted: TargetSignature[] = [
  {
    name: 'Персонаж',
    allowedTypes: ['HEALTHY_BODY', 'WOUNDED_BODY', 'CLINICALLY_DEAD_BODY', 'ABSOLUTELY_DEAD_BODY'],
    field: 'targetCharacterId',
  },
];
const kLocusAndPhysicalBody: TargetSignature[] = [
  {
    name: 'Локус',
    allowedTypes: ['locus'],
    field: 'locusId',
  },
  ...kPhysicalBodyTargeted,
];
const kNoTarget: TargetSignature[] = [];
const kMerchandiseQrTypes: QrType[] = [
  'implant',
  'pill',
  'reagent',
  'locus_charge',
  'box',
  'drone',
  'drone_mod',
  'cyberdeck',
  'cyberdeck_mod',
  'reagent',
  'focus',
];
const kMerchandiseTargeted: TargetSignature = {
  name: 'Товар',
  allowedTypes: kMerchandiseQrTypes,
  field: 'qrCodeId',
};
const kBodyStorageTarget: TargetSignature = {
  name: 'Телохранилище',
  allowedTypes: ['body_storage'],
  field: 'bodyStorageId',
};
const kPillTarget: TargetSignature = {
  name: 'Препарат',
  allowedTypes: ['pill'],
  field: 'pillId',
};
const kBodyStorageTargeted = [kBodyStorageTarget];
const kDroneAndBodyStorageTargeted: TargetSignature[] = [
  {
    name: 'Дрон',
    allowedTypes: ['drone'],
    field: 'droneId',
  },
  kBodyStorageTarget,
];
const kSpiritAndBodyStorageTargeted: TargetSignature[] = [
  {
    name: 'Дух',
    allowedTypes: ['spirit'],
    field: 'droneId',
  },
  kBodyStorageTarget,
];
const kEmptyQrTarget: TargetSignature = {
  name: 'Контейнер',
  allowedTypes: ['empty'],
  field: 'qrCodeId',
};
const kBodyAndContainerTargeted: TargetSignature[] = [...kPhysicalBodyTargeted, kEmptyQrTarget];
// Not exported by design, use kAllActiveAbilities instead.
export const kAllActiveAbilitiesList: ActiveAbility[] = [
  //
  {
    id: 'ground-heal-ability',
    humanReadableName: 'Ground Heal',
    description: 'Поднимает одну цель из КС/тяжрана в полные хиты.',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Персонаж',
        allowedTypes: ['WOUNDED_BODY', 'CLINICALLY_DEAD_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: oneTimeRevive.name,
  },
  // добивание до АС (из тяжрана или КС)
  {
    id: 'absolutely-finish-him',
    humanReadableName: 'абсолютная смерть',
    description: 'Ты можешь добивать персонажа в Абсолютную смерть',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Жертва',
        allowedTypes: ['WOUNDED_BODY', 'CLINICALLY_DEAD_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 240,
    prerequisites: [],
    availability: 'master',
    karmaCost: 100,
    minimalEssence: 0,
    eventType: absoluteDeathAbility.name,
  },
  // Применяется к мясному телу в состоянии "тяжело ранен" - переводит его в состояние КС.
  //
  {
    id: 'finish-him',
    humanReadableName: 'добивание тела из тяжрана в КС',
    description: 'Добей это тело!  *работает только на биологические объекты',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Жертва',
        allowedTypes: ['WOUNDED_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 30,
    prerequisites: [],
    pack: { id: 'chummer-zero', level: 1 },
    availability: 'master',
    karmaCost: 120,
    minimalEssence: 0,
    eventType: finishHimAbility.name,
  },
  // TODO(https://trello.com/c/npKNMNV9/323-вход-нахождение-и-выход-из-вр): Add proper implementation
  // дает возможность персонажу зайти в Виар на 2 часа (или сколько-то), кулдаун есть.  Увеличение длительности виара ИЛИ уменьшение кулдауна - спец абилки.
  {
    id: 'enter-vr',
    humanReadableName: 'зайти в Виар',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 1,
    prerequisites: ['master-of-the-universe'],
    pack: { id: 'null', level: 0 },
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Целевой персонаж забывает события "этой сцены", если персонажу не был нанесен физический урон (снят хотя бы 1 хит) за это время.
  {
    id: 'oblivion',
    humanReadableName: 'Забвение',
    description:
      'Целевой персонаж не помнит события последней сцены. Работает только, если персонажу не был нанесен урон (снят хотя бы 1 хит). ',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: oblivionAbility.name,
  },
  // Персонаж забывает события "этой сцены", даже если персонажу был нанесен физический урон (снят хотя бы 1 хит) за это время.
  {
    id: 'full-oblivion',
    humanReadableName: 'Полное Забвение',
    description: 'Персонаж не помнит события последней сцены.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'oblivion'],
    availability: 'open',
    karmaCost: 80,
    minimalEssence: 0,
    eventType: fullOblivionAbility.name,
  },
  // Целевой персонаж не забывает события перед КС, срок действия - 6 часов. Для менталиста эта абилка  активная. У целевого персонажа появляется абилка cloud-memory-temporary на 6 часов.
  {
    id: 'cloud-memory',
    humanReadableName: 'Облачная память ',
    description: 'Следующие 6 часов целевой персонаж не забывает события перед КС',
    target: 'scan',
    targetsSignature: kHealthyBodyTargeted,
    cooldownMinutes: (character) => (character.magic < 1 ? 360 : 360 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'full-oblivion'],
    availability: 'open',
    karmaCost: 80,
    minimalEssence: 0,
    eventType: cloudMemoryAbility.name,
  },
  // Цель честно отвечает на 3 вопроса.
  {
    id: 'tell-me-truth',
    humanReadableName: 'Скажи как есть.',
    description: 'Целевой персонаж честно отвечает на 3 вопроса. \nТы честно отвечаешь на 3 вопроса',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: tellMeTheTruthAbility.name,
  },
  // Цель озвучивает какой-то признак (щелканье пальцами, пожимание плечами, заикание), и в течение беседы в следующие 15 минут должна воспроизводить этот признак, если врет.
  {
    id: 'lie-to-me',
    humanReadableName: 'Лай ту ми',
    description:
      'Целевой персонаж не может скрыть свою ложь. Ты говоришь маркер цели (например щелканье пальцами). Если она лжет, то выполняет это маркер. Эффект длится 15 минут',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 30 : 30 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: lieToMeAbility.name,
  },
  // Цель оказывает услугу, даже если это грозит ей средними проблемами (потеря дохода за 1 экономический цикл). Выполнение услуги не должно занимать больше 10 минут.
  {
    id: 'danila-i-need-help',
    humanReadableName: 'Оказать услугу',
    description:
      'Данила, ай нид хелп. Цель оказывает услугу, даже если это грозит ей средними проблемами (потеря дохода за 1 экономический цикл). Выполнение услуги не должно занимать больше 10 минут.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: danilaINeedHelpAbility.name,
  },
  // Цель выполняет любую просьбу (кроме самоубийства). Выполнение услуги не должно занимать больше 30 минут.
  {
    id: 'luke-i-am-your-father',
    humanReadableName: 'Выполнить любую просьбу',
    description:
      'Люк. Я твой отец. Цель выполняет любую просьбу (кроме самоубийства). Выполнение услуги не должно занимать больше 30 минут. ',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 180 : 120 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'really-need-it'],
    availability: 'open',
    karmaCost: 70,
    minimalEssence: 0,
    eventType: lukeIAmYourFatherAbility.name,
  },
  // цели выдается текстовое сообщение с эффектом
  // (вы боитесь, убегаете, не можете.... )
  // У цели заблокирована активация всех активных абилок на 10 минут (надпись "Вы очень боитесь и не можете сосредоточиться")
  // Было бы круто сделать пуш об окончании действия эффекта.
  {
    id: 'fly-you-fool',
    humanReadableName: 'Беги отсюда',
    description:
      'Цель боится и убегает как можно дальше от менталиста. У цели заблокирована активация всех активных абилок на 10 минут. Через 10 минут эффект проходит.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: [],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: flyYouFoolAbility.name,
  },
  // Цель не может двигаться 10 минут или пока ей не нанесён физический урон (-1хит).
  //
  {
    id: 'paralysis-1',
    humanReadableName: 'Оцепенение',
    description: 'Цель не может двигаться 10 минут или пока ей не нанесён физический урон (-1хит). ',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 40 : 30 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: paralysis1Ability.name,
  },
  // Цель не может двигаться 10 минут.
  // У цели заблокирована активация всех активных абилок. Надпись: Не получается, вы парализованы.
  {
    id: 'paralysis-2',
    humanReadableName: 'Паралич движения',
    description: 'Цель не может двигаться 10 минут.\nНе может пользоваться активными абилками.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'paralysis-1'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: paralysis2Ability.name,
  },
  // Цель не может двигаться и говорить 10 минут.
  // У цели заблокирована активация всех активных абилок. Надпись: Не получается, вы парализованы.
  {
    id: 'paralysis-3',
    humanReadableName: 'Паралич полный',
    description: 'Цель не может двигаться и произносить звуки 10 минут.\nНе может пользоваться активными абилками.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 60 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'paralysis-2'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: paralysis3Ability.name,
  },
  // Цель старается сделать агрессивное, но не смертельное действие к выбранному персонажу.  (оскорбить, плюнуть на одежду, выразить презрение убеждениям )
  {
    id: 'scorn-him',
    humanReadableName: 'Презрение',
    description:
      'Цель старается сделать агрессивное, но не смертельное действие к выбранному персонажу.  (оскорбить, плюнуть на одежду, выразить презрение убеждениям ) ',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 20 : 10 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: scornHimAbility.name,
  },
  // Цель активно пытается убить персонажа, на которого указывает менталист.
  {
    id: 'kill-him',
    humanReadableName: 'Агрессия',
    description:
      'Цель активно пытается убить персонажа, на которого указывает менталист. Если цель убита - эффект воздействия прекращается. Пока цель жива - твоя жертва пытается её убить.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 360 : 360 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'scorn-him'],
    availability: 'open',
    karmaCost: 60,
    minimalEssence: 0,
    eventType: killHimAbility.name,
  },
  // Сканируется код локуса, код персонажа, персонаж приобретает абилку “член группы” для соответствующей локусу группы, локус теряет заряд. Запускается процедура пересчета дискурс-абилок. Если на локусе нет зарядов, абилка не работает. Дает карму владельцу абилки.
  {
    id: 'dgroup-add',
    humanReadableName: 'Принять в дискурс-группу',
    description: 'Принять персонажа в дискурс-группу',
    target: 'scan',
    targetsSignature: kLocusAndPhysicalBody,
    cooldownMinutes: (character) => 30,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: discourseGroupAddAbility.name,
  },
  // Сканируется код локуса, код персонажа, персонаж теряет абилку “член группы” для соответствующей локусу группы. Запускается процедура пересчета дискурс-абилок. Дает карму владельцу абилки.
  {
    id: 'dgroup-exclude',
    humanReadableName: 'Исключить из дискурс-группы',
    description: 'Исключить персонажа из дискурс-группы',
    target: 'scan',
    targetsSignature: kLocusAndPhysicalBody,
    cooldownMinutes: (character) => 30,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: discourseGroupExcludeAbility.name,
  },
  // Сканируется код локуса, код пополнения заряда. Количество зарядов на локусе увеличивается на 1.
  {
    id: 'dm-inc-counter',
    humanReadableName: 'Пропаганда',
    description: 'Добавить один заряд к локусу',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Локус',
        allowedTypes: ['locus'],
        field: 'locusId',
      },
      {
        name: 'Заряд',
        allowedTypes: ['locus_charge'],
        field: 'qrCodeId',
      },
    ],
    cooldownMinutes: (character) => 0,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: chargeLocusAbility.name,
  },
  // Сканируется код локуса, код персонажа, персонаж приобретает абилку “член группы” для соответствующей локусу группы. Запускается процедура пересчета дискурс-абилок. Если на локусе нет зарядов, абилка не работает.  Дает карму владельцу абилки.
  {
    id: 'dm-add-guru',
    humanReadableName: 'Гуру',
    description: 'Принять персонажа в дискурс-группу, не расходуя заряд локуса',
    target: 'scan',
    targetsSignature: kLocusAndPhysicalBody,
    cooldownMinutes: (character) => 60,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: discourseGroupAddGuru.name,
  },
  // Сканируется код локуса, код персонажа, персонаж теряет абилку “член группы” для соответствующей локусу группы. Количество зарядов локуса увеличивается на 1. Запускается процедура пересчета дискурс-абилок.  Дает карму владельцу абилки.
  {
    id: 'dm-exclude-inq-1',
    humanReadableName: 'Инквизитор-1',
    description: 'Выгнать персонажа из дискурс-группы, восстановив заряд локуса',
    target: 'scan',
    targetsSignature: kLocusAndPhysicalBody,
    cooldownMinutes: (character) => 30,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: discourseGroupInquisitor1.name,
  },
  // Сканируется код локуса, код персонажа, персонаж теряет абилку “член группы” для соответствующей локусу группы. Количество зарядов локуса увеличивается на 2. Запускается процедура пересчета дискурс-абилок.  Дает карму владельцу абилки.
  {
    id: 'dm-exclude-inq-2',
    humanReadableName: 'Инквизитор-2',
    description: 'Выгнать персонажа из дискурс-группы, восстановив два заряда локуса',
    target: 'scan',
    targetsSignature: kLocusAndPhysicalBody,
    cooldownMinutes: (character) => 30,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: discourseGroupInquisitor2.name,
  },
  // Абилка-сертификат с кулдауном. Предъявителю выдается QR локуса дискурс-группы, к которой он принадлежит.
  {
    id: 'dm-prophet',
    humanReadableName: 'Пророк',
    description: 'Предъявите экран с описанием абилки региональному мастеру, чтобы получить новый QR локуса.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 360,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: prophetAbility.name,
  },
  // Цель дарит менталисту 1 игровой предмет по выбору менталиста.
  {
    id: 'really-need-it',
    humanReadableName: 'Очень надо.',
    description:
      'Цель дарит менталисту 1 игровой предмет по выбору менталиста. Предмет должен быть отчуждаем (например, нельзя попросить подарить установленный имплант)',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 180 : 120 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 70,
    minimalEssence: 0,
    eventType: reallyNeedItAbility.name,
  },
  // Убеждает жертву перевести со своего на счет менталиста 50%
  {
    id: 'billioner-walk',
    humanReadableName: 'Прогулка миллионера',
    description: 'Цель переводит на счет менталиста половину денег со своего счета.',
    target: 'show',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 120 : 60 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: billionerWalkAbility.name,
  },
  // Добавляет +8 к ментальной защите целевого персонажа  на 12 часов
  {
    id: 'increase-the-mental-protection',
    humanReadableName: 'увеличение м. защиты другого персонажа',
    description: 'на 12 часов увеличивает сопротивляемость целевого персонажа ментальному воздействию. ',
    target: 'scan',
    targetsSignature: kNonDeadBodyTargeted,
    cooldownMinutes: (character) => (character.magic < 1 ? 240 : 180 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'closed',
    karmaCost: 80,
    minimalEssence: 0,
    eventType: increaseTheMentalProtectionAbility.name,
  },
  // Добавляет -8 к ментальной защите целевого персонажа на 6 часов
  {
    id: 'reduce-the-mental-protection',
    humanReadableName: 'уменьшение м. защиты другого персонажа',
    description: 'на 6 часов  уменьшает сопротивляемость целевого персонажа ментальному воздействию. ',
    target: 'scan',
    targetsSignature: kNonDeadBodyTargeted,
    cooldownMinutes: (character) => (character.magic < 1 ? 180 : 120 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'master',
    karmaCost: 80,
    minimalEssence: 0,
    eventType: reduceTheMentalProtectionAbility.name,
  },
  // Менталист увеличивает свою ментальную защиту на +8 на 30 минут.
  {
    id: 'i-dont-trust-anybody',
    humanReadableName: 'Я никому не верю',
    description: 'Временно увеличивает сопротивляемость менталиста ментальному воздействию.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => (character.magic < 1 ? 240 : 120 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face', 'you-dont-trust-anybody'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: iDontTrustAnybody.name,
  },
  // Менталист увеличивает ментальную защиту другого персонажа на +8 на 30 минут
  {
    id: 'you-dont-trust-anybody',
    humanReadableName: 'Ты никому не веришь',
    description: 'Временно на 30 минут увеличивает сопротивляемость другого персонажа ментальному воздействию.',
    target: 'scan',
    targetsSignature: kNonDeadBodyTargeted,
    cooldownMinutes: (character) => (character.magic < 1 ? 240 : 180 * (1 / Math.sqrt(character.magic))),
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: youDontTrustAnybody.name,
  },
  // qr товара содержит информацию о базовой стоимости товара при его покупке
  // При применении абилки на экране отображается записанная на QR baseprice товара.
  // Если товар не был продан через магазин - возвращает 0.
  {
    id: 'how-much-it-costs',
    humanReadableName: 'Чо почем',
    description: 'посмотреть на qr и сказать сколько это стоит, базовую цену товара',
    target: 'scan',
    targetsSignature: [kMerchandiseTargeted],
    cooldownMinutes: (character) => 1,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 10,
    minimalEssence: 0,
    eventType: howMuchItCosts.name,
  },
  // Выводит на экран гм информацию из скрытого текстового поля товара .
  // Текст по умолчанию: Ты не знаешь ничего интересного про этот товар.
  {
    id: 'who-needs-it',
    humanReadableName: 'знание редкостей',
    description: 'Ты можешь узнать что-то интересное про этот товар. ',
    target: 'scan',
    targetsSignature: [kMerchandiseTargeted],
    cooldownMinutes: (character) => 10,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: whoNeedsIt.name,
  },
  // Показывает (возвращает) размер рентного платежа по данному товару. Данная информация записывается на QR при его покупке.
  // Если товар не был продан через магазин - возвращает 0.
  {
    id: 'how-much-is-rent',
    humanReadableName: 'ПлачУ и ПлАчу',
    description: 'посмотреть на qr и сказать размер рентного платежа чаммера. ',
    target: 'scan',
    targetsSignature: [kMerchandiseTargeted],
    cooldownMinutes: (character) => 1,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: howMuchTheRent.name,
  },
  // ГМ переписывает кредит за предмет с другого перонажа на себя. При этом сумма последующих рентных платежей пересчитывается. Новые рентные платежи рассчитываются исходя из скоринга гма на момент активации абилки.
  // Механика:
  // Активировать абилку, отсканировать QR-код товара.
  // Если на данном товаре нет рентного платежа - отображается "на данном товаре нет рентного платежа"
  {
    id: 'let-me-pay',
    humanReadableName: 'Давай я заплачу',
    description: 'Гешефтмахер может переписать кредит за 1 предмет на себя. Работает только если есть QR-код товара.',
    target: 'scan',
    targetsSignature: [kMerchandiseTargeted],
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: letMePay.name,
  },
  // Переписать долг за 1 предмет c QR с персонажа А на персонажа Б.
  // При этом сумма последующих рентных платежей пересчитывается. Новые рентные платежи рассчитываются исходя из скоринга гма на момент активации абилки.
  // Механика:
  // Активировать абилку, отсканировать QR-код товара, отсканировать QR код персонажа, на которого .
  // Если на данном товаре нет рентного платежа - отображается "на данном товаре нет рентного платежа"
  {
    id: 'let-him-pay',
    humanReadableName: 'Давай он заплатит',
    description: 'переписать долг за 1 предмет по выбору с персонажа А на персонажа Б.',
    target: 'scan',
    targetsSignature: [
      kMerchandiseTargeted,
      {
        name: 'Новый плательщик',
        field: 'targetCharacterId',
        allowedTypes: ['HEALTHY_BODY'],
      },
    ],
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: letHimPay.name,
  },
  // ГМ переписывает кредит за предмет: пересчитывается сумма последующих рентных платежей . Новые рентные платежи рассчитываются исходя из скоринга персонажа, на которого записан кредит на момент активации абилки.
  // Механика:
  // Активировать абилку, отсканировать QR-код товара.
  // Если на данном товаре нет рентного платежа - отображается "на данном товаре нет рентного платежа"
  {
    id: 're-rent',
    humanReadableName: 'Переоформить ренту',
    description: 'ГМ может целевому персонажу переоформить контракт с новым коэфициентом скоринга. ',
    target: 'scan',
    targetsSignature: [kMerchandiseTargeted],
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: reRent.name,
  },
  // Показывает актуальные коэффициенты, которые влияют на скоринг. У целевого персонажа в течение следующих 5 минут отображаются его коэффициенты скоринга.
  {
    id: 'investigate-scoring',
    humanReadableName: 'Посмотрим скоринг',
    description: 'другой персонаж сможет видеть свои коэффициенты скоринга в течение 5 минут.',
    target: 'scan',
    targetsSignature: kHealthyBodyTargeted,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-face'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: investigateScoring.name,
  },
  // На допросе цель развернуто отвечает на заданный вопрос и теряет одну единицу эссенса (начисляется на Папу Драконов). Абилка-сертификат с кулдауном
  {
    id: 'chain-interrogation',
    humanReadableName: 'Конвейерный допрос',
    description: 'На допросе цель развернуто отвечает на заданный вопрос и теряет единицу эссенса.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: ['master-of-the-universe'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: doNothingAbility.name,
  },
  // TODO(https://trello.com/c/XHT0b9Oj/155-реализовать-заклинания-работающие-с-духами)
  // При использовании абилки Exorcizamus ее коэффициент К=5 (значение может быть изменено для нужд балансировки).
  {
    id: 'orthodox-exorcism',
    humanReadableName: 'Отчитка',
    description: 'Благословением Божиим ваша способность Exorcizamus срабатывает с кратно увеличенной вероятностью.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: spiritsRelatedSpell.name,
  },
  // TODO(https://trello.com/c/J2QfWUnU/286-реализовать-абилки-pray-my-lame-name-fame): Add proper implementation
  // При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 5 минут
  {
    id: 'pray-s',
    humanReadableName: 'Pray my lame',
    description: 'При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 5 минут',
    target: 'scan',
    targetsSignature: kAstralBodyTargeted,
    cooldownMinutes: (character) => 10,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 4,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/J2QfWUnU/286-реализовать-абилки-pray-my-lame-name-fame): Add proper implementation
  // При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 10 минут
  {
    id: 'pray-m',
    humanReadableName: 'Pray my name',
    description: 'При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 10 минут',
    target: 'scan',
    targetsSignature: kAstralBodyTargeted,
    cooldownMinutes: (character) => 10,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 8,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/J2QfWUnU/286-реализовать-абилки-pray-my-lame-name-fame): Add proper implementation
  // При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 30 минут
  {
    id: 'pray-xl',
    humanReadableName: 'Pray my fame',
    description: 'При сканировании qr-кода астрального тела духа сокращает у этого духа кулдаун способности Fleshpoint на 30 минут',
    target: 'scan',
    targetsSignature: kAstralBodyTargeted,
    cooldownMinutes: (character) => 10,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 16,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/GpCUz0q2/138-магия-реализовать-способности-для-астрала-астральное-тельце-астральное-тело-корпус-а)
  // Выдаётся Серебряная нить, amount=30
  {
    id: 'astral-body-2',
    humanReadableName: 'Астральное тело',
    description:
      'Перейти в астральное тело на 30 минут. Почти полная физическая неуязвимость и возможность наблюдать за реальным миром.\nМаркер: красный дождевик.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 55,
    prerequisites: ['astral-body-1-summ', 'master-of-the-universe'],
    availability: 'open',
    karmaCost: 50,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/GpCUz0q2/138-магия-реализовать-способности-для-астрала-астральное-тельце-астральное-тело-корпус-а)
  // Выдаётся Серебряная нить, amount=120
  {
    id: 'astral-body-3',
    humanReadableName: 'Корпус А',
    description:
      'Перейти в астральное тело на 120 минут. Почти полная физическая неуязвимость и возможность наблюдать за реальным миром.\nМаркер: красный дождевик.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 125,
    prerequisites: ['astral-body-2', 'master-of-the-universe'],
    availability: 'open',
    karmaCost: 70,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Время действия 60 минут. Кулдаун 40 минут. Аура цели на это время случайным образом меняется на 20% (и случайный фрагмент, и на случайное значение).
  {
    id: 'silentium-est-aurum',
    humanReadableName: 'Silentium est aurum',
    description: 'Временно частично изменить цели ее ауру. Требуемая эссенция мага: больше 4',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Персонаж',
        allowedTypes: ['ASTRAL_BODY', 'HEALTHY_BODY', 'WOUNDED_BODY', 'CLINICALLY_DEAD_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 40,
    prerequisites: ['master-of-the-universe'],
    pack: { id: 'mage-adept-healer', level: 3 },
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 4,
    eventType: changeAuraAbility.name,
  },
  // - время действия 10+N минут, кулдаун 5 минут. Дает на время действия абилку hammer-of-justice-effect. N=умвл*3 минут
  {
    id: 'hammer-of-justice',
    humanReadableName: 'Hammer of Justice',
    description:
      'Активируемый статус "тяжелое" для одноручного оружия.  Требуемая эссенция: больше 3. Время действия "10+3*уровень маны в локации" минут. Кулдаун 5 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 5,
    prerequisites: [],
    pack: { id: 'mage-adept-fighter', level: 1 },
    availability: 'open',
    karmaCost: 90,
    minimalEssence: 3,
    eventType: hammerOfJustice.name,
  },
  // - время действия 5+N минут, кулдаун 15 минут. Дает абилку arrowgant-effect на это время. N=умвл*1 минут
  {
    id: 'arrowgant',
    humanReadableName: 'Arrowgant',
    description:
      'Активируемая защита от дистанционного легкого оружия.  Требуемая эссенция: больше 4. Время действия "5+уровень маны в локации" минут. Кулдаун 5 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    pack: { id: 'mage-adept-fighter', level: 2 },
    availability: 'open',
    karmaCost: 90,
    minimalEssence: 4,
    eventType: arrowgant.name,
  },
  // - время действия 5+N минут, кулдаун 30 минут. Дает абилку trollton-effect. N=умвл*2 минут
  {
    id: 'trollton',
    humanReadableName: 'Trollton',
    description:
      'Активируемая тяжелая броня.  Требуемая эссенция: больше 2.  Время действия "5+2*уровень маны в локации" минут. Кулдаун 30 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: [],
    pack: { id: 'mage-adept-healer', level: 3 },
    availability: 'closed',
    karmaCost: 50,
    minimalEssence: 2,
    eventType: trollton.name,
  },
  // - время действия 5+N минут, кулдаун 20 минут. Позволяет автоматически подняться из тяжрана через 30с с полным запасом текущих хитов. N=умвл*2 минут
  {
    id: 'i-will-survive',
    humanReadableName: 'I will survive ',
    description:
      'Возможность в течение "5+2*уровень маны в локации" минут один раз автоматически перейти из тяжрана в состояние Здоров. Требуемая эссенция: больше 2. Кулдаун 20 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: [],
    pack: { id: 'mage-adept-fighter', level: 3 },
    availability: 'open',
    karmaCost: 90,
    minimalEssence: 2,
    eventType: iWillSurvive.name,
  },
  // - мгновенное, кулдаун 5 минут. Позволяет поднять из тяжрана одного другого персонажа с полным запасом текущих хитов
  {
    id: 'stand-up-and-fight',
    humanReadableName: 'Stand up and fight ',
    description: 'Мгновенное поднятие цели из тяжрана. Требуемая эссенция: больше 5. Кулдаун 5 минут.',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Персонаж',
        allowedTypes: ['WOUNDED_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 5,
    prerequisites: [],
    pack: { id: 'mage-adept-healer', level: 2 },
    availability: 'open',
    karmaCost: 90,
    minimalEssence: 5,
    eventType: reviveOnTarget.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 40 минут. Позволяет восстановить активированный (то есть потраченный) артефакт с любым заклинанием - в такое же состояние, какое они имели до активации.
  {
    id: 'fresh-new-day',
    humanReadableName: 'Fresh new day ',
    description: 'Перезарядка артефакта. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 40,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Enlarge Your Pencil - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-enlarge-pencil',
    humanReadableName: 'Crate of the art: Enlarge Your Pencil',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Enlarge Your Pencil. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Stone skin - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-stone-skin',
    humanReadableName: 'Crate of the art: Stone skin',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Stone skin. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Tempus Fugit - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-tempus-fugit',
    humanReadableName: 'Crate of the art: Tempus Fugit',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Tempus Fugit. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Beacon - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-beacon',
    humanReadableName: 'Crate of the art: Beacon',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Beacon. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Run, spirit, run - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-run-spirit-run',
    humanReadableName: 'Crate of the art: Run, spirit, run',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Run, spirit, run. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание InputStream - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-input-stream',
    humanReadableName: 'Crate of the art: InputStream',
    description: 'Ты можешь создавать артефакты, содержащие заклинание InputStream. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание OutputStream - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-output-stream',
    humanReadableName: 'Crate of the art: OutputStream',
    description: 'Ты можешь создавать артефакты, содержащие заклинание OutputStream. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Mosquito Tree - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-mosquito-tree',
    humanReadableName: 'Crate of the art: Mosquito Tree',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Mosquito Tree. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Feed the cat - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-feed-the-cat',
    humanReadableName: 'Crate of the art: Feed the cat',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Feed the cat. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Tame the dog - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-tame-the-dog',
    humanReadableName: 'Crate of the art: Tame the dog',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Tame the dog. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/TwTAHAut/142-магия-реализовать-способности-адептов-связанные-с-артефактами-fresh-new-day-и-набор-crate-of-the-art)
  // - мгновенное, кулдаун 120 минут. Позволяет создать артефакт, содержащий подготовленное заклинание Exorcizamus - из расчета как будто у адепта Магия=2. Вместо активации заклинание привязывается к материальному носителю (что-то с qr-кодом), и активация произойдет только после сканирования qr-кода и подтверждения активации в интерфейсе.
  {
    id: 'artifact-exorcizamus',
    humanReadableName: 'Crate of the art: Exorcizamus',
    description: 'Ты можешь создавать артефакты, содержащие заклинание Exorcizamus. Требуемая эссенция: больше 4',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // Активация дает возможность открыть замок (см.правила по взломам в "Прочих моделях"). Кулдаун - 20 минут
  {
    id: 'allo-homorus',
    humanReadableName: 'Allo, homorus!',
    description: 'Активация дает возможность открыть один замок. Требуемая эссенция: больше 2. Кулдаун 20 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 50,
    minimalEssence: 2,
    eventType: alloHomorusAbility.name,
  },
  // Для мчс
  //
  // Переводит чаммера из состояния КС в состояние Здоров
  // надо отсканировать:
  // - QR воскрешательной капсулы
  // - QR ИИ
  // - QR целевого чаммера
  // Делается запись в лог использования абилок (кто использовал, какая капсула, какой ИИ, какой символ чаммер)
  // В зависимости от параметров Капсулы делает вот что:
  // drain-essense = Снимает с целевого чаммера Эссенс
  // get-essence = записывает в таблицу Имя ИИ и количество get-essence
  // air-essense  = записывает в таблици количество Air Essense
  // reanimate-cooldown = кулдаун в минутах у персонажа, применившего абилку
  // price-reanimate  = Это коэффициент цены, его надо как-то учесть в экономике (прописать в цену услуги "воскрешение на оборудовании таком-то ???)
  //
  // Зависимости, которые были у персонажа до КС сохраняются. После воскрешения таймер зависимостей переходит в состояние ноль.
  {
    id: 'reanimate',
    humanReadableName: 'Встань и иди',
    description: 'Поднять персонажа из состояния клинической смерти',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Капсула',
        allowedTypes: ['reanimate_capsule'],
        field: 'droneId',
      },
      {
        name: 'ИИ',
        allowedTypes: ['ai_symbol'],
        field: 'qrCodeId',
      },
      {
        name: 'Пациент',
        allowedTypes: ['CLINICALLY_DEAD_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 10,
    prerequisites: [],
    availability: 'master',
    karmaCost: 10,
    minimalEssence: 0,
    eventType: capsuleReanimate.name,
  },
  // TODO(https://trello.com/c/lbmO5n8E/337-дроны-модификация-дронов-реализовать-возможность-установки-и-снятия-модов-в-дроны): Add proper implementation
  // Активирует процесс установки мода.
  // надо отсканировать:
  // - QR Мастерской
  // - QR мода
  // - QR целевого дрона \ кибердеки
  //
  // особый экран НЕ показывается, все проверки проходят в бэкнде, выдается только результат "получилось \ не получилось"
  {
    id: 'tuning-active',
    humanReadableName: 'Тюнинг: установка мода в дрон\\кибердеку',
    description: 'Для установки мода в дрон\\кибердеку используй эту способность.Необходима мастерская!',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: ['arch-rigger', 'master-of-the-universe'],
    pack: { id: 'rigger-eng-mech', level: 1 },
    availability: 'master',
    karmaCost: 60,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Активирует процесс снятия импланта\мода.
  // надо отсканировать
  // QR чаммера \ дрона \ кибердеки
  // QR пустышки, куда запишется трофей
  // Выбираем самый слабый мод по параметру Сложности.
  // Если несколько одинаково слабых - любой.
  // Если параметр rigging.repomanBonus + Int ниже или равен сложности установки имплант - снятия не происходит.
  {
    id: 'repoman-active',
    humanReadableName: 'Рипомен',
    description: 'Активируй, чтобы снять имплант\\мод. Выберется самый слабый.',
    target: 'scan',
    targetsSignature: kBodyAndContainerTargeted,
    cooldownMinutes: (character) => 20,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-medic-repo', level: 1 },
    availability: 'open',
    karmaCost: 60,
    minimalEssence: 0,
    eventType: repomanAbility.name,
  },
  // TODO(https://trello.com/c/OBEicfEg/330-реализовать-вырезание-имплантов-рипоменами): Add proper implementation
  // Активирует процесс снятия импланта\мода (надо отсканировать QR пустышки, куда запишется трофей и QR чаммера \ дрона \ кибердеки ).
  // Смотрим параметр rigging.repomanBonus + Int ,
  // Выбираем самый дорогой мод по параметру Сложности, но не больше чем параметр rigging.repomanBonus+int. Если несколько одинаково дорогих - любой. Если rigging.repomanBonus+int не хватило - ничего не происходит.
  {
    id: 'repoman-black',
    humanReadableName: 'Черный рипомен',
    description: 'Активируй, чтобы снять имплант\\мод. Выберется самый сильный.',
    target: 'scan',
    targetsSignature: kBodyAndContainerTargeted,
    cooldownMinutes: (character) => 40,
    prerequisites: ['arch-rigger', 'repoman-active', 'repoman-3'],
    availability: 'open',
    karmaCost: 80,
    minimalEssence: 0,
    eventType: repomanBlackAbility.name,
  },
  // Активирует процесс включения в дрона.
  // надо отсканировать:
  // - QR дрона
  // - QR телохранилища
  {
    id: 'medicart-active',
    humanReadableName: 'Управление медицинским дроном',
    description: 'Активируй, чтобы включиться в дрона-медикарт.',
    target: 'scan',
    targetsSignature: kDroneAndBodyStorageTargeted,
    cooldownMinutes: (character) => 40,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-medic-combat', level: 1 },
    availability: 'open',
    karmaCost: 50,
    minimalEssence: 0,
    eventType: enterDrone.name,
  },
  // Активирует процесс включения в автодок.
  // надо отсканировать:
  // - QR дрона
  // - QR телохранилища
  {
    id: 'autodoc-active',
    humanReadableName: 'Управление автодоком',
    description: 'Активируй, чтобы подключиться к Автодоку.',
    target: 'scan',
    targetsSignature: kDroneAndBodyStorageTargeted,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-medic-bio', level: 1 },
    availability: 'open',
    karmaCost: 50,
    minimalEssence: 0,
    eventType: enterDrone.name,
  },
  // Активирует процесс включения в дрона.
  // надо отсканировать:
  // - QR дрона
  // - QR телохранилища
  {
    id: 'groundcraft-active',
    humanReadableName: 'Управление наземным дроном',
    description: 'Активируй, чтобы включиться в наземного дрона.',
    target: 'scan',
    targetsSignature: kDroneAndBodyStorageTargeted,
    cooldownMinutes: (character) => 40,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-pilot-ground', level: 1 },
    availability: 'master',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: enterDrone.name,
  },
  // Активирует процесс включения в дрона.
  // надо отсканировать:
  // - QR дрона
  // - QR телохранилища
  {
    id: 'aircraft-active',
    humanReadableName: 'Управление воздушным дроном',
    description: 'Активируй, чтобы включиться в воздушного дрона.',
    target: 'scan',
    targetsSignature: kDroneAndBodyStorageTargeted,
    cooldownMinutes: (character) => 40,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-pilot-air', level: 1 },
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: enterDrone.name,
  },
  // При активации кнопки необходимо выбрать ЯЧЕЙКУ телохранилища, в котором лежит тело ригги.
  // Риггер выходит из дрона, пропадают абилки дрона, появляются абилки риггера.
  // Статус сообщение при выходе "Вы потеряли  DroneFeedbaсk хитов"
  // где DroneFeedback = DroneFeedback1 + DroneFeedback2 + DroneFeedback3
  {
    id: 'drone-logoff',
    humanReadableName: 'Отключиться от дрона',
    description: 'Отключиться от дрона.',
    target: 'scan',
    targetsSignature: kBodyStorageTargeted,
    cooldownMinutes: (character) => 3,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: exitDrone.name,
  },
  // Эта кнопка символизирует аварийное отключение.
  // Используется в случае если
  // - с дрона сняли все хиты.
  // Кроме того, происходит автоматически если:
  // - закончилось время на включение в дрона
  // - было атаковано мясное тело риггера
  // DroneFeedback1 = 1
  {
    id: 'drone-danger',
    humanReadableName: 'Дрон поврежден',
    description: 'Дрон поврежден! Необходимо срочно вернуться к телу!',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 3,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: droneEmergencyExit.name,
  },
  // При активации аблики игрок сканирует куар-код с препаратом, видит его название и самый крупный компонент.
  // формат:
  // название препарата - основное вещество - дозировка в мг
  // Таблица препаратов сейчас составлена так, что самый крупный всегда в левой колонке записан.
  // второй и далее компоненты НЕ показываем, только первый!
  {
    id: 'pill-name',
    humanReadableName: 'Фармацевтика (что за таблетка?)',
    description: 'Позволяет узнать название препарата и его основной компонент.',
    target: 'scan',
    targetsSignature: [kPillTarget],
    prerequisites: ['arch-rigger'],
    pack: { id: 'arch-rigger', level: 1 },
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: getPillNameAbility.name,
    cooldownMinutes: (character) => 0,
  },
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  восстанавливаются все хиты.
  //
  // Зависимости, которые были у персонажа до КС сохраняются. После воскрешения таймер зависимостей переходит в состояние ноль
  {
    id: 'gm-respawn-normal',
    humanReadableName: 'Воскрешение общее',
    description: 'Воскрешение Норм, эльф, орк, тролль, гном',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Персонаж',
        allowedTypes: ['HEALTHY_BODY', 'WOUNDED_BODY', 'CLINICALLY_DEAD_BODY', 'ABSOLUTELY_DEAD_BODY'],
        field: 'targetCharacterId',
      },
    ],
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: reviveAbsoluteOnTarget.name,
    cooldownMinutes: (character) => 0,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-light-heal-1',
    humanReadableName: 'Лечение легких ранений (1)',
    description: 'Вылечить легкое ранение (1)',
    target: 'scan',
    targetsSignature: kMedcartHealthyBodyTargeted,
    cooldownMinutes: (character) => 5,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartHealAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-light-heal-2',
    humanReadableName: 'Лечение легких ранений (2)',
    description: 'Вылечить легкое ранение (2)',
    target: 'scan',
    targetsSignature: kMedcartHealthyBodyTargeted,
    cooldownMinutes: (character) => 5,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartHealAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-light-heal-3',
    humanReadableName: 'Лечение легких ранений (3)',
    description: 'Вылечить легкое ранение (3)',
    target: 'scan',
    targetsSignature: kMedcartHealthyBodyTargeted,
    cooldownMinutes: (character) => 5,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartHealAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-heavy-heal-1',
    humanReadableName: 'Лечение тяжелых ранений (1)',
    description: 'Вылечить тяжелое ранение (1)',
    target: 'scan',
    targetsSignature: kMedcartWoundedBodyTargeted,
    cooldownMinutes: (character) => 15,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartReviveAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-heavy-heal-2',
    humanReadableName: 'Лечение тяжелых ранений (2)',
    description: 'Вылечить тяжелое ранение (2)',
    target: 'scan',
    targetsSignature: kMedcartWoundedBodyTargeted,
    cooldownMinutes: (character) => 15,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartReviveAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-heavy-heal-3',
    humanReadableName: 'Лечение тяжелых ранений (3)',
    description: 'Вылечить тяжелое ранение (3)',
    target: 'scan',
    targetsSignature: kMedcartWoundedBodyTargeted,
    cooldownMinutes: (character) => 15,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: medcartReviveAbility.name,
  },
  // Активная абилка Медикарта
  {
    id: 'medcart-reanimate',
    humanReadableName: 'Лечение состояния КС',
    description: 'Вылечить состояние КС',
    target: 'scan',
    targetsSignature: kMedcartDeadBodyTargeted,
    cooldownMinutes: (character) => 30,
    prerequisites: ['in-drone'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: reviveOnTarget.name,
  },
  // появляется абилка granite-skin-effect на 15 минут
  // itGapEssense +5
  {
    id: 'kokkoro-armor',
    humanReadableName: 'Гранитная кожа',
    description:
      'С тебя снимаются хиты, как если бы ты находился в легкой броне. Активация абилки хитов не добавляет. Продолжительность - 15  минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveArmorAbility.name,
  },
  // появляется абилка automatic-weapons-unlock на 15 минут
  // itGapEssense +5
  {
    id: 'kokkoro-shooter',
    humanReadableName: 'Стрелок',
    description: 'Ты можешь использовать автоматическое оружие 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveShooterAbility.name,
  },
  // мясное тело +2 хита на 15 минут
  // itGapEssense +5
  {
    id: 'kokkoro-health',
    humanReadableName: 'Здоровяк ',
    description: 'Ты получаешь +2 хита на 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveHealhAbility.name,
  },
  // появляется текст "ты забыл эпизод"
  // itGapEssense +5"
  {
    id: 'kokkoro-backup',
    humanReadableName: 'Бэкап ',
    description: 'Ты можешь забыть эпизод, если расскажешь о нем Искусственному интеллекту',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveBackupAbility.name,
  },
  // появляется абилка granite-skin-effect на 15 минут
  // itGapEssense +5
  {
    id: 'koshcghei-armor',
    humanReadableName: 'Гранитная кожа',
    description:
      'С тебя снимаются хиты, как если бы ты находился в легкой броне. Активация абилки хитов не добавляет. Продолжительность - 15  минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveArmorAbility.name,
  },
  // появляется абилка automatic-weapons-unlock на 15 минут
  // itGapEssense +5
  {
    id: 'koshcghei-shooter',
    humanReadableName: 'Стрелок',
    description: 'Ты можешь использовать автоматическое оружие 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveShooterAbility.name,
  },
  // мясное тело +2 хита на 15 минут
  // itGapEssense +5"
  {
    id: 'koshcghei-health',
    humanReadableName: 'Здоровяк ',
    description: 'Ты получаешь +2 хита на 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveHealhAbility.name,
  },
  // появляется текст "ты забыл эпизод"
  // itGapEssense +5"
  {
    id: 'koshcghei-backup',
    humanReadableName: 'Бэкап ',
    description: 'Ты можешь забыть эпизод, если расскажешь о нем Искусственному интеллекту',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveBackupAbility.name,
  },
  // появляется абилка granite-skin-effect на 15 минут
  // itGapEssense +5
  {
    id: 'horizon-armor',
    humanReadableName: 'Гранитная кожа',
    description:
      'С тебя снимаются хиты, как если бы ты находился в легкой броне. Активация абилки хитов не добавляет. Продолжительность - 15  минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveArmorAbility.name,
  },
  // появляется абилка automatic-weapons-unlock на 15 минут
  // itGapEssense +5
  {
    id: 'horizon-shooter',
    humanReadableName: 'Стрелок',
    description: 'Ты можешь использовать автоматическое оружие 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveShooterAbility.name,
  },
  // мясное тело +2 хита на 15 минут
  // itGapEssense +5"
  {
    id: 'horizon-health',
    humanReadableName: 'Здоровяк ',
    description: 'Ты получаешь +2 хита на 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveHealhAbility.name,
  },
  // появляется текст "ты забыл эпизод"
  // itGapEssense +5"
  {
    id: 'horizon-backup',
    humanReadableName: 'Бэкап ',
    description: 'Ты можешь забыть эпизод, если расскажешь о нем Искусственному интеллекту',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveBackupAbility.name,
  },
  // появляется абилка granite-skin-effect на 15 минут
  // itGapEssense +5
  {
    id: 'badass-armor',
    humanReadableName: 'Гранитная кожа',
    description:
      'С тебя снимаются хиты, как если бы ты находился в легкой броне. Активация абилки хитов не добавляет. Продолжительность - 15  минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveArmorAbility.name,
  },
  // появляется абилка automatic-weapons-unlock на 15 минут
  // itGapEssense +5
  {
    id: 'badass-shooter',
    humanReadableName: 'Стрелок',
    description: 'Ты можешь использовать автоматическое оружие 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveShooterAbility.name,
  },
  // мясное тело +2 хита на 15 минут
  // itGapEssense +5"
  {
    id: 'badass-health',
    humanReadableName: 'Здоровяк ',
    description: 'Ты получаешь +2 хита на 15 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveHealhAbility.name,
  },
  // появляется текст "ты забыл эпизод"
  // itGapEssense +5"
  {
    id: 'badass-backup',
    humanReadableName: 'Бэкап ',
    description: 'Ты можешь забыть эпизод, если расскажешь о нем Искусственному интеллекту',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 15,
    prerequisites: [],
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: nanohiveBackupAbility.name,
  },
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  восстанавливаются все хиты.
  // Эссенс становится равен 0,8
  // itEssense пересчитывается
  // itGapEssence=920
  //
  // Зависимости, которые были у персонажа до КС сохраняются. После воскрешения таймер зависимостей переходит в состояние ноль
  {
    id: 'gm-respawn-hmhvv',
    humanReadableName: 'Воскрешение HMHVV',
    description: 'Воскрешение HMHVV',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: gmRespawnHmhvv.name,
  },
  // Гуль сканирует QR другого персонажа, находящегося в тяжелом ранении ИЛИ добровольно показавшего свой QR.
  //
  // может иметь целью только персонажей метарас эльф, орк, гном, норм, тролль, находящихся в базовом мясном теле при применении абилки.
  //
  // Эссенс гуля увеличивается на  min (100, itEssense жертвы)
  // Эссенс персонажа уменьшается на min ( 100, itEssense жертвы). Укушенный персонаж переходит в состояние КС
  // itGapEssense Жертвы = itGapEssense + [min ( 100, itEssense жертвы)]
  // itGapEssense гуля = itGapEssense -кусь гуля
  {
    id: 'ghoul-feast',
    humanReadableName: 'Питание гулей',
    description: 'Отсканируй QR жертвы для питания\nТвой Эссенс увеличится на 1.',
    target: 'scan',
    targetsSignature: kNonDeadBodyTargeted,
    cooldownMinutes: (character) => 10,
    prerequisites: ['meta-ghoul'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: ghoulBite.name,
  },
  // Вампир сканирует QR другого персонажа, находящегося в тяжелом ранении ИЛИ добровольно показавшего свой QR.
  // При применении абилки вампиром жертва  получает инъекцию вещества vampirium (слюна вампира).
  // может иметь целью только персонажей метарас эльф, орк, гном, норм, тролль, находящихся в базовом мясном теле при применении абилки.
  //
  // Эссенс вампира увеличивается на  min (200, itEssense жертвы)
  // Эссенс персонажа уменьшается на min ( 200, itEssense жертвы). Укушенный персонаж переходит в состояние КС
  // itGapEssense Жертвы = itGapEssense + [min ( 200, itEssense жертвы)]
  // itGapEssense вампира= itGapEssense - кусьВампира
  {
    id: 'vampire-feast',
    humanReadableName: 'Питание вампиров',
    description: 'Отсканируй QR жертвы для питания\nТвой Эссенс увеличится на 2.',
    target: 'scan',
    targetsSignature: kNonDeadBodyTargeted,
    cooldownMinutes: (character) => 10,
    prerequisites: ['meta-vampire'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: vampireBite.name,
  },
  // TODO(aeremin): Add proper implementation
  // выдает абилку Форма зверя - выдает игроку текст на экране
  {
    id: 'meta-werewolf',
    humanReadableName: 'Оборотень',
    description: 'Нажми, чтобы принять форму зверя - не более чем на 60 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 120,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  пересчитывается itEssense
  // itUsedEssense = 0
  // itGapEssense = 0
  // Все импланты, установленные в тело персонажа-объекта - ломаются и выходят из строя. Тело их отторгает. (Импланты как товары - ломаются, слоты в теле персонажа - пустые)
  {
    id: 'rd-reset-essence',
    humanReadableName: 'РД Полное восстановление Эссенс',
    description: 'РД Эссенс персонажа станет =6, все импланты деактивируются(ломаются)\nдействует на расы: эльф, орк, норм, тролль, гном',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 360,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // На допросе цель развернуто отвечает на заданный вопрос и теряет один хит. Абилка-сертификат с кулдауном
  {
    id: 'termorectal-analysis',
    humanReadableName: 'Терморектальный криптоанализ',
    description: 'На допросе цель развернуто отвечает на заданный вопрос и теряет один хит.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: ['master-of-the-universe'],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // При активации на 5 минут выдаёт способность Magic Shield
  {
    id: 'take-no-harm',
    humanReadableName: 'Take no harm',
    description:
      'Раскрыть "магический щит" (прозрачный зонтик, защищает от любого легкого оружия), требуется активация способности перед использованием. После активации действует 5 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 100000,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: takeNoHarmAbility.name,
  },
  // При активации на 5 минут выдаёт способность PENCIL
  {
    id: 'pencil-large',
    humanReadableName: 'Pencil, large!',
    description: 'Получить силу - одно оружие в руках будет считаться тяжёлым. После активации действует 5 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 100000,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: pencilLargeAbility.name,
  },
  // При активации на 5 минут выдаёт способность Stone Skin
  {
    id: 'skin-stone',
    humanReadableName: 'Skin, Stone!',
    description: 'Поднять щиты - имеющаяся броня будет считаться тяжёлой. После активации действует 5 минут.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 100000,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: skinStoneAbility.name,
  },
  // После активации абилки у мага появляется на 10 минут пассивная абилка tincasm-able.
  {
    id: 'tincasm',
    humanReadableName: 'Think as a master',
    description: 'Последнее китайское предупреждение уже было.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: [],
    availability: 'master',
    karmaCost: 300,
    minimalEssence: 0,
    eventType: tincasmAbility.name,
  },
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  его  базовый показатель Эссенса увеличивается на +1.
  //  itMaxEssense = itMaxEssense + 100.
  {
    id: 'gm-increase-essence',
    humanReadableName: 'Эссенс "+1"',
    description: 'Увеличить Эссенс персонажа +1',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: gmIncreaseMaxEssence.name,
  },
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  его  базовый показатель Эссенса уменьшается на -1
  //  itMaxEssense = itMaxEssense - 100
  {
    id: 'gm-decrease-essence',
    humanReadableName: 'Эссенс "-1"',
    description: 'Уменьшить Эссенс на -1',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: gmDecreaseMaxEssence.name,
  },
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  меняются показатели:
  // itUsedEssense = 0
  // itGapEssense = 0
  // Все импланты, установленные в тело персонажа-объекта - ломаются и выходят из строя. Тело их отторгает. (Импланты как товары - ломаются, слоты в теле персонажа - пустые)
  {
    id: 'gm-reset-essence',
    humanReadableName: 'Полное восстановление Эссенс',
    description: 'Эссенс персонажа станет =6, все импланты деактивируются(ломаются)\nдействует на расы: эльф, орк, норм, тролль, гном',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: gmEssenceReset.name,
  },
  // TODO(aeremin): Add proper implementation
  // Эта абилка нужна как мастерская.
  // Активировать абилку, отсканировать QR-код персонажа-объекта. У персонажа-объекта  восстанавливаются все хиты.
  //
  // Зависимости, которые были у персонажа до КС сохраняются. После воскрешения таймер зависимостей переходит в состояние ноль
  {
    id: 'gm-respawn-digital',
    humanReadableName: 'Воскрешение цифровой',
    description: 'Воскрешение Цифровой',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // Увеличение нехуеватости Магии "+1".
  {
    id: 'gm-increase-magic',
    humanReadableName: 'Увеличение магии "+1"',
    description: 'Увеличение магии +1',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(https://trello.com/c/EqKhMPbH/373-реализовать-абилку-fleshpoint)
  // Время действия 120 минут, кулдаун 20 минут. Эктоплазменное тело имеет 3 хита, 0 эссенции и все абилки, которые были у духа (кроме Материализации).
  // Current body меняется на Ecto
  // Добавляется абилка Disfleshment / Развоплощение
  //
  // по идее, надо добавить какой-то счетчик, чтобы если спирит сам не нажал кнопку Disfleshment, чтобы его выкидывало. Или накладывало какой-то жесткий штраф. Например: (время в эктоплазменном теле - 120), если >0 -  то умножаем на десять и прибавляем к кулдауну абилки при следующем нажатии
  {
    id: 'fleshpoint',
    humanReadableName: 'Fleshpoint',
    description: 'Дух из астрального тела на время переходит в реал - в магически создаваемое эктоплазменное тело.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 16,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // В качестве ответа на применение абилки, надо сформировать текстовое сообщение ( в лог?), в котором перечислены все вещества, которые находятся в чаммере в формате
  // имя_чаммера
  // Название вещества - количество в мг.
  // Указываем только вещества с содержанием более чем  ( 280 - Интеллект * 10)  милиграмм
  {
    id: 'whats-in-the-body-1',
    humanReadableName: 'Диагностика (что в чаммере)',
    description: 'Ты можешь проверить, какие вещества находятся в теле пациенте.\n',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 15,
    prerequisites: ['arch-rigger'],
    pack: { id: 'arch-rigger', level: 1 },
    availability: 'open',
    karmaCost: 50,
    minimalEssence: 0,
    eventType: whatsInTheBodyAbility.name,
  },
  // Показывает текстовое сообщение ( в лог?) формата
  // имя_чаммера
  // название препарата  - время приема
  // за последние 4 часа
  {
    id: 'biomonitor-scan',
    humanReadableName: 'Сканер биомонитора',
    description: 'Ты можешь увидеть список препаратов, которые пациент принимал за последние 4 часа.',
    target: 'scan',
    targetsSignature: kPhysicalBodyTargeted,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-rigger', 'whats-in-the-body-2'],
    availability: 'closed',
    karmaCost: 60,
    minimalEssence: 0,
    eventType: biomonitorScanAbility.name,
  },
  // Сама абилка ничего не делает, но посылает PubSub ability_used
  {
    id: 'jack-in',
    humanReadableName: 'Jack-in',
    description: 'Джекнуться (jack-out) в кибердеку. \nОтсканируй QR код своей деки',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Кибердека',
        field: 'qrCodeId',
        allowedTypes: ['cyberdeck'],
      },
    ],
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-hackerman-decker'],
    pack: { id: 'gen-arch-hackerman-decker', level: 1 },
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: jackInAbility.name,
  },
  // Сама абилка ничего не делает, но посылает PubSub ability_used. ничего страшного если ее будут жамкать пока не заджеканы. если есть какой-то простой способ дизейблить- я его не знаю
  {
    id: 'jack-out',
    humanReadableName: 'Jack-out',
    description: 'Выстегруться из деки (jack-out).\nВНИМАНИЕ: ты получишь дампшок, если еще соединен с терминалом',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 0,
    prerequisites: ['arch-hackerman-decker'],
    pack: { id: 'gen-arch-hackerman-decker', level: 1 },
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: jackOutAbility.name,
  },
  // Выдаётся Серебряная нить, amount=15
  {
    id: 'astral-body-1-cast',
    humanReadableName: 'Астральное тельце',
    description:
      'Перейти в астральное тело на 15 минут. Почти полная физическая неуязвимость и возможность наблюдать за реальным миром.\nМаркер: красный дождевик.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 45,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Выдаётся Серебряная нить, amount=15
  {
    id: 'astral-body-1-summ',
    humanReadableName: 'Астральное тельце',
    description:
      'Перейти в астральное тело на 15 минут. Почти полная физическая неуязвимость и возможность наблюдать за реальным миром.\nМаркер: красный дождевик.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 45,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Сама абилка ничего не делает, но посылает PubSub ability_used
  {
    id: 'activate-soft',
    humanReadableName: 'Активация софта',
    description:
      'Активирует софт, после чего его можно загрузить в память кибердеки\nВНИМАНИЕ: нельзя использовать, когда ты уже соединен с кибердекой.',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Софт',
        field: 'qrCodeId',
        allowedTypes: ['software'],
      },
    ],
    cooldownMinutes: (character) => 0,
    prerequisites: ['arch-hackerman-decker'],
    pack: { id: 'gen-arch-hackerman-decker', level: 1 },
    availability: 'open',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: activateSoft.name,
  },
  // TODO(aeremin): Add proper implementation
  // применяется к телу, которое лежит в телохранилище - запускает процедуру "недобровольный выход из сменного тела"
  {
    id: 'finish-his-body',
    humanReadableName: '',
    description: 'Добей это тело!  *работает только на тело, находящееся в телохранилище',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: [],
    pack: { id: 'null', level: 1 },
    availability: 'master',
    karmaCost: 120,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // Применяет препарат на другого персонажа
  // цель 1: куар препарата
  // цель2: куар цели (куар мясного тела, показаный добровольно или куар тела в жижране)
  {
    id: 'use-pills-on-others',
    humanReadableName: 'Вколоть препарат',
    description: 'Активируй, чтобы применить препарат на другого персонажа',
    target: 'scan',
    targetsSignature: [kPillTarget, ...kNonDeadBodyTargeted],
    cooldownMinutes: (character) => 2,
    prerequisites: ['arch-rigger'],
    pack: { id: 'rigger-medic-combat', level: 2 },
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: usePillsOnOthersAbility.name,
  },
  // При активации игроку показывается список духов, присутствующих в этой локации в этот момент. При выборе одного из них (и подтверждении выбора) делается попытка с вероятностью (M*10-W)/100 захватить указанного духа. Если попытка удалась, то магу предлагается поместить этого духа в свободное телохранилище (через сканирование QR-кода, ранее записанного как "телохранилище"). При закрытии этого диалога попытка ловли отменяется и можно сделать новую (если Own Spirit ещё доступна). При успешной записи в телохранилище захваченный свободный дух (не персонаж) исчезает из пространства игры (не слышен в океане маны, не входит в списки целей "присутствующие духи" и тд), зато доступен для Suit Up (через сканирование этого духохранилища). W это текущая Сопротивляемость духа*Коэффициент Сопротивления духов этого мага. M = {{ might }}, с которой выдавалась эта абилка
  // Если попытка взять духа под контроль не удалась, то на Магию ловца накладывается штраф - величиной W (округлённое вверх) на время 10 минут.
  // Поскольку кулдаун у абилки 0, то маг может продолжать свои попытки ловить духов.
  {
    id: 'own-spirit',
    humanReadableName: 'Own spirit',
    description:
      'Попытаться поймать духа, находящегося в этой локации. Потребуется свободное духохранилище. При неудаче будет временный штраф на Магию. Вероятность зависит от Сопротивляемости духа (базовой и лично этому магу) и от Мощи заклинания (чем мощнее, тем вероятнее)',
    target: 'scan',
    targetsSignature: kSpiritAndBodyStorageTargeted,
    cooldownMinutes: (character) => 0,
    prerequisites: [],
    pack: { id: 'mage-summon-spirit', level: 1 },
    availability: 'closed',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: enterSpirit.name,
  },
  // Деятельность в качестве духа прекращается, игроку необходимо вернуться в телохранилище, чтобы продолжить действовать в своём мясном теле.
  {
    id: 'dispirit',
    humanReadableName: 'Dispirit',
    description: 'Вылезти из духа\n*Применяется для нормального выхода из эктотела*',
    target: 'scan',
    targetsSignature: kBodyStorageTargeted,
    cooldownMinutes: (character) => 20,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: exitSpirit.name,
  },
  // Эта кнопка символизирует разрушение оболочки духа
  // Используется в случае если
  // - с духа сняли все хиты.
  // Кроме того, происходит автоматически если:
  // - закончилось время на включение в духа
  // - было атаковано мясное тело мага
  {
    id: 'spirit-danger',
    humanReadableName: 'Если оболочка разрушена...',
    description: 'Эктотело духа разрушено! Необходимо срочно вернуться к своему телу!\n*Применяется если тебя в эктотеле уничтожили*',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: [],
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: spiritEmergencyExit.name,
  },
  // Применяется к мясному телу в состоянии "тяжело ранен" - переводит его в состояние КС.
  //
  {
    id: 'executioner-1',
    humanReadableName: 'Быстрое добивание',
    description: 'Используй эту способность чтобы быстро добить из тяжрана в КС',
    target: 'scan',
    targetsSignature: [
      {
        name: 'Жертва',
        allowedTypes: ['WOUNDED_BODY'],
        field: 'targetCharacterId',
      },
    ],
    cooldownMinutes: (character) => 3,
    prerequisites: ['arch-samurai', 'binding'],
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: finishHimAbility.name,
  },
  // Абилка доступна для применения только из мясного тела (т.е. из физического мира)
  // На 20 минут выдаётся AstralopithecusRage
  {
    id: 'astralopithecus',
    humanReadableName: 'Astralopithecus',
    description:
      'Сможешь из реала видеть и изгонять сущности, находящиеся в астрале. Требуемая эссенция: больше 3. Время действия 20 минут. Кулдаун 30 минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: ['master-of-the-universe'],
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 3,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // По аналогии с дронами - игрок активирует эту абилку, сканирует QR-код духохранилища (где лежит нужный дух), сканирует QR -код свободного телохранилища. После этого телохранилище занято его мясным телом, духохранилище свободно, а сам игрок действует в эктоплазменном теле - согласно описанию конкретного духа и общим свойствам эктоплазменного духа https://docs.google.com/document/d/1TBug3i5LFEW7BTm-iSgBRf9Snpknuu7sSkhVgP_Iko0/edit#heading=h.gcmlf4uf63ju
  //
  // Переход в тело духа совершается на 20 минут, но может быть модифицировано другими абилками
  {
    id: 'suit-up',
    humanReadableName: 'Suit Up',
    description:
      'Временно (базово - на 20 минут) перейти в эктоплазменное тело духа, находящегося в духохранилище. Своё мясное тело маг должен оставить в телохранилище.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 20,
    prerequisites: [],
    pack: { id: 'mage-summon-spirit', level: 1 },
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 4,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // При активации абилки открывается окно сканирования QR-кода, необходимо сосканировать пустой QR-код. После этого будет создано свободное телохранилище, действующее в течение 600 минут. По окончании этого срока QR-код освободится, и если там находился дух - он окажется на свободе
  {
    id: 'spirit-jar',
    humanReadableName: 'Spirit Jar',
    description: 'Создать телохранилище (нужен QR-код пустышка).  Срок действия - 600минут',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 240,
    prerequisites: [],
    pack: { id: 'mage-summon-spirit', level: 1 },
    availability: 'open',
    karmaCost: 30,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // текстовая абилка
  {
    id: 'rummage',
    humanReadableName: 'Обыск',
    description:
      ' Покажи этот текст тому, кого хочешь обыскать. Тот, кого обыскивают, должен показать тебе все игровые предметы, не встроенные в тело. Показывать надо все, на чем есть qr-код. Также он показывает игровые документы, письма, записки. обыскивающий может их прочесть и сфотографировать.  НЕ показывает чаты, импланты, содержание телефона и игрового приложения.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-samurai'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // показывает игроку текст абилки, больше ничего
  {
    id: 'marauder-1',
    humanReadableName: 'Сломать оружие',
    description: 'Ты можешь порвать (разрушить по игре) куар оружия.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60 - 5 * character.body,
    prerequisites: ['arch-samurai', 'rummage'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // показывает игроку текст абилки, больше ничего
  {
    id: 'marauder-3',
    humanReadableName: 'Разрушить предмет',
    description: 'Ты можешь порвать (разрушить по игре) куар доспеха, дрона, кибердеки, магического фокуса или импланта.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 130 - 10 * character.body,
    prerequisites: ['arch-samurai', 'marauder-1'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // показывает игроку текст абилки, больше ничего
  {
    id: 'executioner-3',
    humanReadableName: 'Допрос раненого',
    description: 'Ты можешь допросить тяжело раненного персонажа. Допрашиваемый обязан честно и полно ответить на три вопроса.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60 - 5 * character.charisma - 5 * character.intelligence,
    prerequisites: ['arch-samurai', 'rummage'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // Сканирует тело, находящееся  в тяжране.
  // Со счета жертвы на счет самурая переводится 10% средств. После применения абилки тело переходит в КС
  {
    id: 'marauder-2',
    humanReadableName: 'Забрать деньги у раненого',
    description:
      'Ты можешь ограбить тяжелораненного персонажа, для этого отсканируй его куар - тебе переведется 10% с его счета. После грабежа жертва перейдет в состояние клинической смерти.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: ['arch-samurai', 'rummage'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // текстовая абилка
  {
    id: 'rowing',
    humanReadableName: 'Забрать предмет',
    description:
      'Если вы обыскиваете человека - вы можете его ограбить. Покажите этот текст тому, кого вы собираетесь ограбить.  Вы можете забрать у жертвы три любые игровые предмета из числа тех, которые вы нашли при обыске. Телефон и доступ в сеть заблокировать обыском нельзя. Оружие (оружие, броня и т.п, все, на чем чип “оружие допущено”) при обыске забрать нельзя.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: ['rummage', 'arch-samurai'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // текстовая абилка
  {
    id: 'binding',
    humanReadableName: 'Cвязывание',
    description:
      ' Ты можешь связать человека, который не сопротивляется (добровольно) или оглушен или тяжело ранен. Для моделирования связывания человеку надевают на кисти рук две веревочные петли (чисто символические, на самом деле ничего связывать не надо). Эти петли запрещено прятать, по человеку всегда должно быть понятно, что он связан.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-samurai'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // текстовая абилка
  {
    id: 'unbinding',
    humanReadableName: 'Освобождение связанного',
    description:
      'Ты можешь освободить связанного. Надо 30 секунд изображать как ты оружием перепиливаешь\\отстреливаешь\\пережигаешь заклинанием связующие путы. Это должно быть хорошо заметное внешнее воздействие. ',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 60,
    prerequisites: ['arch-samurai', 'binding'],
    pack: undefined,
    availability: 'open',
    karmaCost: 20,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  // текстовая абилка
  {
    id: 'stunning',
    humanReadableName: 'Оглушение',
    description:
      'Нужно подойти к цели сзади и нанести слабый удар по плечу ты можешь оглушать рукоятью холодного оружия или нерфа и произнести маркер “оглушен”. Оглушение можно производить только в небоевой ситуции.',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 30,
    prerequisites: ['arch-samurai', 'binding'],
    pack: undefined,
    availability: 'open',
    karmaCost: 40,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'levitation',
    humanReadableName: 'левитация',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'magnetism',
    humanReadableName: 'магнетизм(притянуть нужный предмет)',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'bond-breaker',
    humanReadableName: 'освобождение от пут',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'one-for-all',
    humanReadableName: 'один за всех',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-time-1',
    humanReadableName: 'больше времени +1',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-time-2',
    humanReadableName: 'больше времени +2',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-time-3',
    humanReadableName: 'больше времени +3',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-time-4',
    humanReadableName: 'Больше времени +4',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-time-5',
    humanReadableName: 'больше времени +5',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'add-basement',
    humanReadableName: 'добавить опору',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'bell-silence',
    humanReadableName: 'молчание колокольчиков',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'photo-memory',
    humanReadableName: 'фотографическая память(выслать фото конструкции)',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'second-sight',
    humanReadableName: 'ясновидение(игротех подсказывает, где взять еще два шарика)',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'remove-excees',
    humanReadableName: 'убрать все лишнее',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'remove-half',
    humanReadableName: 'оставить половину предметов',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'backdoor-set',
    humanReadableName: 'установка бэкдора',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'lockpicking',
    humanReadableName: 'вскрытие замков',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'attack-drone',
    humanReadableName: 'нападение на дрона',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'pipe-install',
    humanReadableName: 'установить трубу',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'identity-scan',
    humanReadableName: 'узнавание личности любой простой аватары',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'initiative-add-2',
    humanReadableName: 'инициатива +2 (у нападающих базовая и = 1, у защитников базовая и = 0)',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-add-ally-1',
    humanReadableName: 'добавить 1 хит союзнику',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-add-ally-2',
    humanReadableName: 'добавить 2 хита союзнику',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-add-ally-all-1',
    humanReadableName: 'добавить 1 хит всем союзникам',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-add-ally-all-2',
    humanReadableName: 'добавить 2 хита всем союзникам',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-remove-foe-1',
    humanReadableName: 'снять 1 хит противника',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-remove-foe-2',
    humanReadableName: 'снять 2 хита противника',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-remove-foe-all-1',
    humanReadableName: 'снять 1 хит всем противникам',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'hp-remove-foe-all-2',
    humanReadableName: 'снять 2 хита всем противникам',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'bind-foe',
    humanReadableName: 'путы (1 рука за спину) на одного противника',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'bind-foe-all',
    humanReadableName: 'путы на всех противников',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
  // TODO(aeremin): Add proper implementation
  //
  {
    id: 'magic-remove',
    humanReadableName: '"безмагия" на всех, кто в комнате(не позволяет использовать кф и отменяет все предыдущие)',
    description: '',
    target: 'scan',
    targetsSignature: kNoTarget,
    cooldownMinutes: (character) => 9000,
    prerequisites: [],
    pack: undefined,
    availability: 'master',
    karmaCost: 0,
    minimalEssence: 0,
    eventType: dummyAbility.name,
  },
];
setAllActiveAbilities(
  (() => {
    const result = new Map<string, ActiveAbility>();
    kAllActiveAbilitiesList.forEach((f) => {
      if (result.has(f.id)) throw new Error('Non-unique active ability id: ' + f.id);
      result.set(f.id, f);
    });
    return result;
  })(),
);
