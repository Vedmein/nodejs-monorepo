import * as request from 'request-promise-native';
import { Sr2020Character } from '@sr2020/interface/models/sr2020-character.model';
import { QrCode } from '@sr2020/interface/models/qr-code.model';
import { initEthic } from '@sr2020/sr2020-models/scripts/character/ethics';

// Run with
//   npx ts-node -r tsconfig-paths/register packages/utility-scripts/beta-testers-creator.ts

interface User {
  email: string;
  name: string;
}

const users: User[] = [{ email: '', name: '' }];

for (let i = 0; i < 100; ++i) {
  users.push({ email: `t${i}@foo.bar`, name: `Tester #${i}` });
}

const gatewayAddress = 'http://gateway.evarun.ru/api/v1/';
const kQrsToRecreate = 1000;

interface LoginResponse {
  id: number;
  api_key: string;
}

async function loginOrRegister(email: string, name: string, password: string): Promise<LoginResponse> {
  try {
    return (
      await request.post(gatewayAddress + 'auth/register', { json: { email, password, name }, resolveWithFullResponse: true }).promise()
    ).body;
  } catch (e) {
    return (await request.post(gatewayAddress + 'auth/login', { json: { email, password }, resolveWithFullResponse: true }).promise()).body;
  }
}

async function provideCharacter(login: LoginResponse) {
  const characterData: Sr2020Character = {
    modelId: login.id.toString(),
    gender: 'мужчина',
    metarace: 'meta-norm',
    maxHp: 3,
    timestamp: 0,
    body: 0,
    intelligence: 0,
    charisma: 0,
    magic: 5,
    resonance: 0,
    maxTimeAtHost: 15,
    hostEntrySpeed: 5,
    conversionAttack: 5,
    conversionFirewall: 5,
    conversionSleaze: 5,
    conversionDataprocessing: 5,
    adminHostNumber: 3,
    spriteLevel: 0,
    maxTimeInVr: 30,
    magicFeedbackReduction: 0,
    magicRecoverySpeed: 1,
    spiritResistanceMultiplier: 1,
    auraReadingMultiplier: 1,
    auraMarkMultiplier: 1,
    auraMask: 0,
    magicPowerBonus: 0,
    magicAura: 'aaaabbbbccccddddeeee',
    healthState: 'healthy',
    ethicGroupMaxSize: 0,
    chemoBodyDetectableThreshold: 9000,
    chemoPillDetectableThreshold: 9000,
    chemoBaseEffectThreshold: 50,
    chemoSuperEffectThreshold: 70,
    chemoCrysisThreshold: 120,
    stockGainPercentage: 0,
    discountWeaponsArmor: 0,
    discountDrones: 0,
    discountChemo: 0,
    discountImplants: 0,
    discountMagicStuff: 0,
    spells: [],
    activeAbilities: [],
    passiveAbilities: [],
    ethicTrigger: [],
    ethicState: [],
    ethicLockedUntil: 0,
    history: [],
    modifiers: [],
    timers: {},
  };
  initEthic(characterData);
  await request.put('http://models-manager.evarun.ru/character/model', { json: characterData, resolveWithFullResponse: true }).promise();
  await request
    .post(gatewayAddress + 'models-manager/character/model', {
      json: { eventType: 'learnSpell', data: { spellName: 'fullHealSpell' } },
      auth: { bearer: login.api_key },
      resolveWithFullResponse: true,
    })
    .promise();
}

async function provideBilling(login: LoginResponse) {
  // TODO: Call new billing service
}

async function providePlayer(user: User) {
  console.log(`Generating data for ${user.email}`);
  const login = await loginOrRegister(user.email, user.name, '1');
  await provideCharacter(login);
  await provideBilling(login);
}

async function provideEmptyQr(modelId: string) {
  const qrData: QrCode = {
    modelId,
    usesLeft: 0,
    type: 'empty',
    name: '',
    description: '',
    eventType: '',
    data: {},
    timestamp: 0,
    modifiers: [],
    timers: {},
  };

  await request.put('http://models-manager.evarun.ru/qr/model', { json: qrData, resolveWithFullResponse: true }).promise();
}

async function main() {
  for (const user of users) {
    await providePlayer(user);
  }

  for (let i = 1; i < kQrsToRecreate; ++i) {
    await provideEmptyQr(i.toString());
  }
}

main()
  .then(() => console.log('Success'))
  .catch((e) => console.log(`Error: ${e}`));