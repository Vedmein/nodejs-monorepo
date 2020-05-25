import { Modifier } from '@sr2020/interface/models/alice-model-engine';
import { modifierFromEffect } from './util';
import {
  increaseBiofeedbackResistance,
  increaseBody,
  increaseFadingResistance,
  increaseIntelligence,
  increaseMatrixHp,
  increaseMaxDroneDifficulty,
  increaseMaxMeatHp,
  increaseMaxTimeInDrone,
  increaseMaxTimeInVr,
  increaseResonanceForControl,
} from './basic_effects';
import {
  onBadassNanohiveInstall,
  onBadassNanohiveRemove,
  onHorizonNanohiveInstall,
  onHorizonNanohiveRemove,
  onKokkoroNanohiveInstall,
  onKokkoroNanohiveRemove,
  onKoshcgheiNanohiveInstall,
  onKoshcgheiNanohiveRemove,
} from '@sr2020/sr2020-model-engine/scripts/character/nanohives';

export type ImplantSlot = 'body' | 'arm' | 'head' | 'rcc';

export interface Implant {
  id: string;
  name: string;
  description: string;
  slot: ImplantSlot;
  grade: 'alpha' | 'beta' | 'gamma' | 'delta' | 'bio';
  essenceCost: number;
  installDifficulty: number;
  modifiers: Modifier[];
  onInstallEvent?: string;
  onRemoveEvent?: string;
}

export const kReviveModifierId = 'medkit-revive-modifier';

function createReviveModifier(): Modifier {
  return { mID: kReviveModifierId, enabled: true, effects: [] };
}

export const kAllImplants: Implant[] = [
  {
    id: 'strong-bones-alpha',
    name: 'Усиленные кости',
    slot: 'body',
    description: 'Имплант +2 хита, иммунитет к Легкому холодному и легкому дистанционному оружию. Можешь надевать лёгкую и тяжёлую броню',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-bones-beta',
    name: 'Усиленные кости',
    slot: 'body',
    description: 'Имплант +2 хита, иммунитет к Легкому холодному и легкому дистанционному оружию. Можешь надевать лёгкую и тяжёлую броню',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-bones-gamma',
    name: 'Усиленные кости',
    slot: 'body',
    description: 'Имплант +2 хита, иммунитет к Легкому холодному и легкому дистанционному оружию. Можешь надевать лёгкую и тяжёлую броню',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-bones-delta',
    name: 'Усиленные кости',
    slot: 'body',
    description: 'Имплант +2 хита, иммунитет к Легкому холодному и легкому дистанционному оружию. Можешь надевать лёгкую и тяжёлую броню',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-bones-bio',
    name: 'Усиленные кости',
    slot: 'body',
    description: 'Имплант +2 хита, иммунитет к Легкому холодному и легкому дистанционному оружию. Можешь надевать лёгкую и тяжёлую броню',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-back-alpha',
    name: 'крепкая спина',
    slot: 'body',
    description: 'Имплант +2 хита, снижение урона от тяжелого оружия. Можешь пользоваться лёгкой бронёй',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-back-beta',
    name: 'крепкая спина',
    slot: 'body',
    description: 'Имплант +2 хита, снижение урона от тяжелого оружия. Можешь пользоваться лёгкой бронёй',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-back-gamma',
    name: 'крепкая спина',
    slot: 'body',
    description: 'Имплант +2 хита, снижение урона от тяжелого оружия. Можешь пользоваться лёгкой бронёй',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-back-delta',
    name: 'крепкая спина',
    slot: 'body',
    description: 'Имплант +2 хита, снижение урона от тяжелого оружия. Можешь пользоваться лёгкой бронёй',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'strong-back-bio',
    name: 'крепкая спина',
    slot: 'body',
    description: 'Имплант +2 хита, снижение урона от тяжелого оружия. Можешь пользоваться лёгкой бронёй',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxMeatHp, { amount: 2 })],
  },
  {
    id: 'cyber-hand-alpha',
    name: 'Кибер-рука',
    slot: 'arm',
    description: 'позволяет использовать автоматическое оружие',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [],
  },
  {
    id: 'cyber-hand-beta',
    name: 'Кибер-рука',
    slot: 'arm',
    description: 'позволяет использовать автоматическое оружие',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [],
  },
  {
    id: 'cyber-hand-gamma',
    name: 'Кибер-рука',
    slot: 'arm',
    description: 'позволяет использовать автоматическое оружие',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [],
  },
  {
    id: 'cyber-hand-delta',
    name: 'Кибер-рука',
    slot: 'arm',
    description: 'позволяет использовать автоматическое оружие',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [],
  },
  {
    id: 'cyber-hand-bio',
    name: 'Кибер-рука',
    slot: 'arm',
    description: 'позволяет использовать автоматическое оружие',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [],
  },
  {
    id: 'сerebellum-alpha',
    name: 'мозжечок',
    slot: 'head',
    description:
      'Твой мозг нужен тебе для настоящих дел. Тупую работу - надо можно сплавить тупой железяке. Пусть вкалывает!\nЭто небольшой квантовый процессор, подключенный напрямую к мозгу.\n\nВ среде техномантов иметь такой имплант - стыдно.\n\n[+2] Резонанс (только для целей работы с контролем)\n',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseResonanceForControl, { amount: 2 })],
  },
  {
    id: 'сerebellum-beta',
    name: 'мозжечок',
    slot: 'head',
    description:
      'Твой мозг нужен тебе для настоящих дел. Тупую работу - надо можно сплавить тупой железяке. Пусть вкалывает!\nЭто небольшой квантовый процессор, подключенный напрямую к мозгу.\n\nВ среде техномантов иметь такой имплант - стыдно.\n\n[+2] Резонанс (только для целей работы с контролем)\n',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseResonanceForControl, { amount: 2 })],
  },
  {
    id: 'сerebellum-gamma',
    name: 'мозжечок',
    slot: 'head',
    description:
      'Твой мозг нужен тебе для настоящих дел. Тупую работу - надо можно сплавить тупой железяке. Пусть вкалывает!\nЭто небольшой квантовый процессор, подключенный напрямую к мозгу.\n\nВ среде техномантов иметь такой имплант - стыдно.\n\n[+2] Резонанс (только для целей работы с контролем)\n',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseResonanceForControl, { amount: 2 })],
  },
  {
    id: 'сerebellum-delta',
    name: 'мозжечок',
    slot: 'head',
    description:
      'Твой мозг нужен тебе для настоящих дел. Тупую работу - надо можно сплавить тупой железяке. Пусть вкалывает!\nЭто небольшой квантовый процессор, подключенный напрямую к мозгу.\n\nВ среде техномантов иметь такой имплант - стыдно.\n\n[+2] Резонанс (только для целей работы с контролем)\n',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseResonanceForControl, { amount: 2 })],
  },
  {
    id: 'сerebellum-bio',
    name: 'мозжечок',
    slot: 'head',
    description:
      'Твой мозг нужен тебе для настоящих дел. Тупую работу - надо можно сплавить тупой железяке. Пусть вкалывает!\nЭто небольшой квантовый процессор, подключенный напрямую к мозгу.\n\nВ среде техномантов иметь такой имплант - стыдно.\n\n[+2] Резонанс (только для целей работы с контролем)\n',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseResonanceForControl, { amount: 2 })],
  },
  {
    id: 'scratcher-alpha',
    name: 'Чесалка',
    slot: 'head',
    description: 'Хитроумный имплант, который следит за состоянием мозга при работе в Основании. Повышает устойчивость к фейдингу на 50.',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseFadingResistance, { amount: 50 })],
  },
  {
    id: 'scratcher-beta',
    name: 'Чесалка',
    slot: 'head',
    description: 'Хитроумный имплант, который следит за состоянием мозга при работе в Основании. Повышает устойчивость к фейдингу на 50.',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseFadingResistance, { amount: 50 })],
  },
  {
    id: 'scratcher-gamma',
    name: 'Чесалка',
    slot: 'head',
    description: 'Хитроумный имплант, который следит за состоянием мозга при работе в Основании. Повышает устойчивость к фейдингу на 50.',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseFadingResistance, { amount: 50 })],
  },
  {
    id: 'scratcher-delta',
    name: 'Чесалка',
    slot: 'head',
    description: 'Хитроумный имплант, который следит за состоянием мозга при работе в Основании. Повышает устойчивость к фейдингу на 50.',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseFadingResistance, { amount: 50 })],
  },
  {
    id: 'scratcher-bio',
    name: 'Чесалка',
    slot: 'head',
    description: 'Хитроумный имплант, который следит за состоянием мозга при работе в Основании. Повышает устойчивость к фейдингу на 50.',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseFadingResistance, { amount: 50 })],
  },
  {
    id: 'shaper-alpha',
    name: 'Шейпер',
    slot: 'head',
    description:
      'Собственных сил никогда не бывает много, и подстраховаться всегда не грех. Этот несложный имплант образует дублирующий канал для данных матрицы, что повышает матричное состояние на 1',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'shaper-beta',
    name: 'Шейпер',
    slot: 'head',
    description:
      'Собственных сил никогда не бывает много, и подстраховаться всегда не грех. Этот несложный имплант образует дублирующий канал для данных матрицы, что повышает матричное состояние на 1',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'shaper-bio',
    name: 'Шейпер',
    slot: 'head',
    description:
      'Собственных сил никогда не бывает много, и подстраховаться всегда не грех. Этот несложный имплант образует дублирующий канал для данных матрицы, что повышает матричное состояние на 1',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'shaper-gamma',
    name: 'Шейпер',
    slot: 'head',
    description:
      'Собственных сил никогда не бывает много, и подстраховаться всегда не грех. Этот несложный имплант образует дублирующий канал для данных матрицы, что повышает матричное состояние на 1',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'shaper-bio',
    name: 'Шейпер',
    slot: 'head',
    description:
      'Собственных сил никогда не бывает много, и подстраховаться всегда не грех. Этот несложный имплант образует дублирующий канал для данных матрицы, что повышает матричное состояние на 1',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'condom-alpha',
    name: 'Гондон',
    slot: 'body',
    description:
      'Официальное название этого импланта "Биофидбек-фильтр", но так его называют разве что вейд-слейвы на митингах в коворкингах. Его придумали много лет назад, чтобы повысить безопасность в хот-симе Матрицы, ценой значительной потери остроты ощущений.\n\n[+10%] устойчивость к биофидбеку',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseBiofeedbackResistance, { amount: 10 })],
  },
  {
    id: 'condom-beta',
    name: 'Гондон',
    slot: 'body',
    description:
      'Официальное название этого импланта "Биофидбек-фильтр", но так его называют разве что вейд-слейвы на митингах в коворкингах. Его придумали много лет назад, чтобы повысить безопасность в хот-симе Матрицы, ценой значительной потери остроты ощущений.\n\n[+10%] устойчивость к биофидбеку',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseBiofeedbackResistance, { amount: 10 })],
  },
  {
    id: 'condom-gamma',
    name: 'Гондон',
    slot: 'body',
    description:
      'Официальное название этого импланта "Биофидбек-фильтр", но так его называют разве что вейд-слейвы на митингах в коворкингах. Его придумали много лет назад, чтобы повысить безопасность в хот-симе Матрицы, ценой значительной потери остроты ощущений.\n\n[+10%] устойчивость к биофидбеку',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseBiofeedbackResistance, { amount: 10 })],
  },
  {
    id: 'condom-delta',
    name: 'Гондон',
    slot: 'body',
    description:
      'Официальное название этого импланта "Биофидбек-фильтр", но так его называют разве что вейд-слейвы на митингах в коворкингах. Его придумали много лет назад, чтобы повысить безопасность в хот-симе Матрицы, ценой значительной потери остроты ощущений.\n\n[+10%] устойчивость к биофидбеку',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseBiofeedbackResistance, { amount: 10 })],
  },
  {
    id: 'condom-bio',
    name: 'Гондон',
    slot: 'body',
    description:
      'Официальное название этого импланта "Биофидбек-фильтр", но так его называют разве что вейд-слейвы на митингах в коворкингах. Его придумали много лет назад, чтобы повысить безопасность в хот-симе Матрицы, ценой значительной потери остроты ощущений.\n\n[+10%] устойчивость к биофидбеку',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseBiofeedbackResistance, { amount: 10 })],
  },
  {
    id: 'backup-alpha',
    name: 'бэкап',
    slot: 'head',
    description: 'Персонаж не забывает события перед КС',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [],
  },
  {
    id: 'backup-beta',
    name: 'бэкап',
    slot: 'head',
    description: 'Персонаж не забывает события перед КС',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [],
  },
  {
    id: 'backup-gamma',
    name: 'бэкап',
    slot: 'head',
    description: 'Персонаж не забывает события перед КС',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [],
  },
  {
    id: 'backup-delta',
    name: 'бэкап',
    slot: 'head',
    description: 'Персонаж не забывает события перед КС',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [],
  },
  {
    id: 'backup-bio',
    name: 'бэкап',
    slot: 'head',
    description: 'Персонаж не забывает события перед КС',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [],
  },
  {
    id: 'auto-soft-1-alpha',
    name: 'автософт 1',
    slot: 'head',
    description: 'понижает сложность управления дроном на 2',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 2 })],
  },
  {
    id: 'auto-soft-1-beta',
    name: 'автософт 1',
    slot: 'head',
    description: 'понижает сложность управления дроном на 2',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 2 })],
  },
  {
    id: 'auto-soft-1-gamma',
    name: 'автософт 1',
    slot: 'head',
    description: 'понижает сложность управления дроном на 2',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 2 })],
  },
  {
    id: 'auto-soft-1-delta',
    name: 'автософт 1',
    slot: 'head',
    description: 'понижает сложность управления дроном на 2',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 2 })],
  },
  {
    id: 'auto-soft-1-bio',
    name: 'автософт 1',
    slot: 'head',
    description: 'понижает сложность управления дроном на 2',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 2 })],
  },
  {
    id: 'auto-soft-2-alpha',
    name: 'автософт 2',
    slot: 'head',
    description: 'понижает сложность управления дроном на 4',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 4 })],
  },
  {
    id: 'auto-soft-2-beta',
    name: 'автософт 2',
    slot: 'head',
    description: 'понижает сложность управления дроном на 4',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 4 })],
  },
  {
    id: 'auto-soft-2-gamma',
    name: 'автософт 2',
    slot: 'head',
    description: 'понижает сложность управления дроном на 4',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 4 })],
  },
  {
    id: 'auto-soft-2-delta',
    name: 'автософт 2',
    slot: 'head',
    description: 'понижает сложность управления дроном на 4',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 4 })],
  },
  {
    id: 'auto-soft-2-bio',
    name: 'автософт 2',
    slot: 'head',
    description: 'понижает сложность управления дроном на 4',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 4 })],
  },
  {
    id: 'auto-soft-3-alpha',
    name: 'автософт 3',
    slot: 'head',
    description: 'понижает сложность управления дроном на 8',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 8 })],
  },
  {
    id: 'auto-soft-3-beta',
    name: 'автософт 3',
    slot: 'head',
    description: 'понижает сложность управления дроном на 8',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 8 })],
  },
  {
    id: 'auto-soft-3-gamma',
    name: 'автософт 3',
    slot: 'head',
    description: 'понижает сложность управления дроном на 8',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 8 })],
  },
  {
    id: 'auto-soft-3-delta',
    name: 'автософт 3',
    slot: 'head',
    description: 'понижает сложность управления дроном на 8',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 8 })],
  },
  {
    id: 'auto-soft-3-bio',
    name: 'автософт 3',
    slot: 'head',
    description: 'понижает сложность управления дроном на 8',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 8 })],
  },
  {
    id: 'medkit-alpha',
    name: 'MedKit',
    slot: 'body',
    description:
      'Выводит из состояния "тяжран" хозяина импланта через 10 минут после получения статуса, если он не был снят раньше другими способами. CD импланта 4 часа. ',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [createReviveModifier()],
  },
  {
    id: 'medkit-beta',
    name: 'MedKit',
    slot: 'body',
    description:
      'Выводит из состояния "тяжран" хозяина импланта через 10 минут после получения статуса, если он не был снят раньше другими способами. CD импланта 4 часа. ',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [createReviveModifier()],
  },
  {
    id: 'medkit-gamma',
    name: 'MedKit',
    slot: 'body',
    description:
      'Выводит из состояния "тяжран" хозяина импланта через 10 минут после получения статуса, если он не был снят раньше другими способами. CD импланта 4 часа. ',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [createReviveModifier()],
  },
  {
    id: 'medkit-delta',
    name: 'MedKit',
    slot: 'body',
    description:
      'Выводит из состояния "тяжран" хозяина импланта через 10 минут после получения статуса, если он не был снят раньше другими способами. CD импланта 4 часа. ',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [createReviveModifier()],
  },
  {
    id: 'medkit-bio',
    name: 'MedKit',
    slot: 'body',
    description:
      'Выводит из состояния "тяжран" хозяина импланта через 10 минут после получения статуса, если он не был снят раньше другими способами. CD импланта 4 часа. ',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [createReviveModifier()],
  },
  {
    id: 'rcc-alpha',
    name: 'RCC',
    slot: 'rcc',
    description: 'позволяет подключаться к дронам Сенсор 6',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 1006 })],
  },
  {
    id: 'rcc-beta',
    name: 'RCC',
    slot: 'rcc',
    description: 'позволяет подключаться к дронам Сенсор 10',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 1010 })],
  },
  {
    id: 'rcc-gamma',
    name: 'RCC',
    slot: 'rcc',
    description: 'позволяет подключаться к дронам Сенсор 14',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 1014 })],
  },
  {
    id: 'rcc-delta',
    name: 'RCC',
    slot: 'rcc',
    description: 'позволяет подключаться к дронам Сенсор 18',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 1018 })],
  },
  {
    id: 'rcc-bio',
    name: 'RCC',
    slot: 'rcc',
    description: 'позволяет подключаться к дронам Сенсор 18',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxDroneDifficulty, { amount: 1018 })],
  },
  {
    id: 'under-oak-alpha',
    name: 'Поддубный',
    slot: 'body',
    description: 'добавляет +1 к параметру body',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseBody, { amount: 1 })],
  },
  {
    id: 'under-oak-beta',
    name: 'Поддубный',
    slot: 'body',
    description: 'добавляет +1 к параметру body',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseBody, { amount: 1 })],
  },
  {
    id: 'under-oak-gamma',
    name: 'Поддубный',
    slot: 'body',
    description: 'добавляет +1 к параметру body',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseBody, { amount: 1 })],
  },
  {
    id: 'under-oak-delta',
    name: 'Поддубный',
    slot: 'body',
    description: 'добавляет +1 к параметру body',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseBody, { amount: 1 })],
  },
  {
    id: 'under-oak-bio',
    name: 'Поддубный',
    slot: 'body',
    description: 'добавляет +1 к параметру body',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseBody, { amount: 1 })],
  },
  {
    id: 'neuroprocessor-alpha',
    name: 'нейропроцессор',
    slot: 'head',
    description: 'Добавляет +1 к параметру int\n',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseIntelligence, { amount: 1 })],
  },
  {
    id: 'neuroprocessor-beta',
    name: 'нейропроцессор',
    slot: 'head',
    description: 'Добавляет +1 к параметру int\n',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseIntelligence, { amount: 1 })],
  },
  {
    id: 'neuroprocessor-gamma',
    name: 'нейропроцессор',
    slot: 'head',
    description: 'Добавляет +1 к параметру int\n',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseIntelligence, { amount: 1 })],
  },
  {
    id: 'neuroprocessor-delta',
    name: 'нейропроцессор',
    slot: 'head',
    description: 'Добавляет +1 к параметру int\n',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseIntelligence, { amount: 1 })],
  },
  {
    id: 'neuroprocessor-bio',
    name: 'нейропроцессор',
    slot: 'head',
    description: 'Добавляет +1 к параметру int\n',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseIntelligence, { amount: 1 })],
  },
  {
    id: 'elbrus-alpha',
    name: 'Эльбрус',
    slot: 'body',
    description: 'Добавляет +1 матричное состояние\n',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'elbrus-beta',
    name: 'Эльбрус',
    slot: 'body',
    description: 'Добавляет +1 матричное состояние\n',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'elbrus-gamma',
    name: 'Эльбрус',
    slot: 'body',
    description: 'Добавляет +1 матричное состояние\n',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'elbrus-delta',
    name: 'Эльбрус',
    slot: 'body',
    description: 'Добавляет +1 матричное состояние\n',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'elbrus-bio',
    name: 'Эльбрус',
    slot: 'body',
    description: 'Добавляет +1 матричное состояние\n',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMatrixHp, { amount: 1 })],
  },
  {
    id: 'dreamcast-alpha',
    name: 'Dreamcast',
    slot: 'head',
    description: 'макс время в VR + 60 минут',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxTimeInVr, { amount: 60 })],
  },
  {
    id: 'dreamcast-beta',
    name: 'Dreamcast',
    slot: 'head',
    description: 'макс время в VR + 60 минут',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxTimeInVr, { amount: 60 })],
  },
  {
    id: 'dreamcast-gamma',
    name: 'Dreamcast',
    slot: 'head',
    description: 'макс время в VR + 60 минут',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxTimeInVr, { amount: 60 })],
  },
  {
    id: 'dreamcast-delta',
    name: 'Dreamcast',
    slot: 'head',
    description: 'макс время в VR + 60 минут',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxTimeInVr, { amount: 60 })],
  },
  {
    id: 'dreamcast-bio',
    name: 'Dreamcast',
    slot: 'head',
    description: 'макс время в VR + 60 минут',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxTimeInVr, { amount: 60 })],
  },
  {
    id: 'autopilot-alpha',
    name: 'Автопилот\n',
    slot: 'body',
    description: 'макс время в дроне + 15 минут\n',
    grade: 'alpha',
    essenceCost: 1.5,
    installDifficulty: 3,
    modifiers: [modifierFromEffect(increaseMaxTimeInDrone, { amount: 15 })],
  },
  {
    id: 'autopilot-beta',
    name: 'Автопилот\n',
    slot: 'body',
    description: 'макс время в дроне + 15 минут\n',
    grade: 'beta',
    essenceCost: 1.2,
    installDifficulty: 4,
    modifiers: [modifierFromEffect(increaseMaxTimeInDrone, { amount: 15 })],
  },
  {
    id: 'autopilot-gamma',
    name: 'Автопилот\n',
    slot: 'body',
    description: 'макс время в дроне + 15 минут\n',
    grade: 'gamma',
    essenceCost: 0.9,
    installDifficulty: 5,
    modifiers: [modifierFromEffect(increaseMaxTimeInDrone, { amount: 15 })],
  },
  {
    id: 'autopilot-delta',
    name: 'Автопилот\n',
    slot: 'body',
    description: 'макс время в дроне + 15 минут\n',
    grade: 'delta',
    essenceCost: 0.6,
    installDifficulty: 6,
    modifiers: [modifierFromEffect(increaseMaxTimeInDrone, { amount: 15 })],
  },
  {
    id: 'autopilot-bio',
    name: 'Автопилот\n',
    slot: 'body',
    description: 'макс время в дроне + 15 минут\n',
    grade: 'bio',
    essenceCost: 0.3,
    installDifficulty: 7,
    modifiers: [modifierFromEffect(increaseMaxTimeInDrone, { amount: 15 })],
  },
  {
    id: 'nanohive-kokkoro-1',
    name: ' Properly Organised Resources Nothern hub',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как персонаж, но знаешь как человек',
    grade: 'delta',
    essenceCost: 0.9,
    installDifficulty: 6,
    modifiers: [],
    onInstallEvent: onKokkoroNanohiveInstall.name,
    onRemoveEvent: onKokkoroNanohiveRemove.name,
  },
  {
    id: 'nanohive-koshchej-1',
    name: 'EIS_neurointerface',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как персонаж, но знаешь как человек',
    grade: 'delta',
    essenceCost: 0.9,
    installDifficulty: 6,
    modifiers: [],
    onInstallEvent: onKoshcgheiNanohiveInstall.name,
    onRemoveEvent: onKoshcgheiNanohiveRemove.name,
  },
  {
    id: 'nanohive-horizon-1',
    name: "Heaven's_key_mod",
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как персонаж, но знаешь как человек',
    grade: 'delta',
    essenceCost: 0.9,
    installDifficulty: 6,
    modifiers: [],
    onInstallEvent: onHorizonNanohiveInstall.name,
    onRemoveEvent: onHorizonNanohiveRemove.name,
  },
  {
    id: 'nanohive-badass-1',
    name: 'MindP_datanalyst',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как персонаж, но знаешь как человек',
    grade: 'delta',
    essenceCost: 0.9,
    installDifficulty: 6,
    modifiers: [],
    onInstallEvent: onBadassNanohiveInstall.name,
    onRemoveEvent: onBadassNanohiveRemove.name,
  },
  {
    id: 'nanohive-kokkoro-2',
    name: 'GLaDOS central core',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как игрок, но знаешь как человек',
    grade: 'delta',
    essenceCost: 1,
    installDifficulty: 3,
    modifiers: [],
    onInstallEvent: onKokkoroNanohiveInstall.name,
    onRemoveEvent: onKokkoroNanohiveRemove.name,
  },
  {
    id: 'nanohive-koshchej-2',
    name: 'ESG_neurointerface',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как игрок, но знаешь как человек',
    grade: 'delta',
    essenceCost: 1,
    installDifficulty: 3,
    modifiers: [],
    onInstallEvent: onKoshcgheiNanohiveInstall.name,
    onRemoveEvent: onKoshcgheiNanohiveRemove.name,
  },
  {
    id: 'nanohive-horizon-2',
    name: 'SofAlphaeus_mod',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как игрок, но знаешь как человек',
    grade: 'delta',
    essenceCost: 1,
    installDifficulty: 3,
    modifiers: [],
    onInstallEvent: onHorizonNanohiveInstall.name,
    onRemoveEvent: onHorizonNanohiveRemove.name,
  },
  {
    id: 'nanohive-badass-2',
    name: 'AoF System',
    slot: 'body',
    description:
      '- У тебя появилась активная аблика "каменная кожа". Нажав на кнопку ты получаешь эффект лёгкой брони на 15 минут\n- У тебя появилась активная абилка "Стрелок". Нажав кнопку ты можешь использовать автоматическое оружие 15 минут\n- У тебя появилась активная абилка "Здоровяк". Нажав кнопку, ты получаешь +2 хита на 15 минут\n- У тебя появилась активная абилка "Бэкап". Ты можешь рассказать своему патрону (ИИ) то, что забыл как персонаж, но знаешь как человек',
    grade: 'delta',
    essenceCost: 1,
    installDifficulty: 3,
    modifiers: [],
    onInstallEvent: onBadassNanohiveInstall.name,
    onRemoveEvent: onBadassNanohiveRemove.name,
  },
];
