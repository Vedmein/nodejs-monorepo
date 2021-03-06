import * as cuid from 'cuid';
import {
  AddedActiveAbility,
  AddedPassiveAbility,
  AddedSpell,
  Feature,
  MetaRace,
  Sr2020Character,
} from '@alice/sr2020-common/models/sr2020-character.model';
import { EffectModelApi, EventModelApi, Modifier, UserVisibleError } from '@alice/alice-common/models/alice-model-engine';
import { ActiveAbility, PassiveAbility, Spell } from '@alice/sr2020-common/models/common_definitions';
import { cloneDeep, template } from 'lodash';
import {
  getAllActiveAbilities,
  getAllPassiveAbilities,
  getAllSpells,
} from '@alice/sr2020-model-engine/scripts/character/library_registrator';
import { Duration } from 'moment';
import { addTemporaryModifier, modifierFromEffect, validUntil } from '@alice/sr2020-model-engine/scripts/character/util';
import { TemporaryModifier } from '@alice/sr2020-model-engine/scripts/character/typedefs';
import { BadRequestException } from '@nestjs/common';

export function addFeature(api: EventModelApi<Sr2020Character>, data: { id: string }) {
  addFeatureToModel(api.model, data.id);
}

export function addFeatureToModel(model: Sr2020Character, featureId: string) {
  const passiveAbility = getAllPassiveAbilities().get(featureId);
  if (passiveAbility) {
    addPassiveAbility(model, passiveAbility);
    return;
  }

  const activeAbility = getAllActiveAbilities().get(featureId);
  if (activeAbility) {
    addActiveAbility(model, activeAbility);
    return;
  }

  const spell = getAllSpells().get(featureId);
  if (spell) {
    addSpell(model, spell);
    return;
  }

  throw new BadRequestException(`Feature ${featureId} not found in the features library`);
}

function addPassiveAbility(model: Sr2020Character, ability: PassiveAbility) {
  // Ability is already present in the character - won't add again.
  if (model.passiveAbilities.find((f) => f.id == ability.id)) return;

  const modifiersToAdd = Array.isArray(ability.modifier) ? ability.modifier : [ability.modifier];
  const modifierIds: string[] = [];
  for (const m of modifiersToAdd) modifierIds.push(addModifier(model, m).mID);
  const addedAbility: AddedPassiveAbility = {
    id: ability.id,
    humanReadableName: ability.humanReadableName,
    description: ability.description,
    modifierIds,
  };
  model.passiveAbilities.push(addedAbility);
}

function addActiveAbility(model: Sr2020Character, ability: ActiveAbility) {
  // Ability is already present in the character - won't add again.
  if (model.activeAbilities.find((f) => f.id == ability.id)) return;
  model.activeAbilities.push({
    id: ability.id,
    humanReadableName: ability.humanReadableName,
    description: ability.description,
    target: ability.target,
    targetsSignature: ability.targetsSignature,
    cooldownMinutes: 0,
    cooldownUntil: 0,
  });
}

function addSpell(model: Sr2020Character, spell: Spell) {
  // Spell is already present in the character - won't add again.
  if (model.spells.find((f) => f.id == spell.id)) return;
  model.spells.push({
    id: spell.id,
    description: spell.description,
    humanReadableName: spell.humanReadableName,
    hasTarget: spell.hasTarget ?? false,
    sphere: spell.sphere,
  });
}

export function removeFeature(api: EventModelApi<Sr2020Character>, data: { id: string }) {
  removeFeatureFromModel(api.model, data.id);
}

export function removeFeatureFromModel(model: Sr2020Character, featureId: string) {
  const passiveAbility = model.passiveAbilities.find((f) => f.id == featureId);
  if (passiveAbility) {
    removePassiveAbility(model, passiveAbility);
    return;
  }

  const activeAbility = model.activeAbilities.find((f) => f.id == featureId);
  if (activeAbility) {
    removeActiveAbility(model, activeAbility);
    return;
  }

  const spell = model.spells.find((f) => f.id == featureId);
  if (spell) {
    removeSpell(model, spell);
    return;
  }
}

function removePassiveAbility(model: Sr2020Character, ability: AddedPassiveAbility) {
  if (ability.modifierIds != undefined) {
    for (const modifierId of ability.modifierIds) removeModifier(model, modifierId);
  }
  model.passiveAbilities = model.passiveAbilities.filter((f) => f.id != ability.id);
}

function removeActiveAbility(model: Sr2020Character, ability: AddedActiveAbility) {
  model.activeAbilities = model.activeAbilities.filter((f) => f.id != ability.id);
}

function removeSpell(model: Sr2020Character, spell: AddedSpell) {
  model.spells = model.spells.filter((f) => f.id != spell.id);
}

// We reimplement addModifier/removeModifier here to remove the dependency on API.
function addModifier(model: Sr2020Character, modifier: Modifier) {
  const m: Modifier = { ...cloneDeep(modifier), mID: cuid() };
  model.modifiers.push(m);
  return m;
}

function removeModifier(model: Sr2020Character, id: string) {
  model.modifiers = model.modifiers.filter((it) => it.mID != id);
}

// Beware: doesn't support abilities with modifiers
export function addTemporaryPassiveAbility(
  api: EventModelApi<Sr2020Character>,
  abilityId: string,
  d: Duration,
  descriptionSubstitutions: object = {},
  effectDescription: string | undefined = undefined,
) {
  const passiveAbility = getAllPassiveAbilities().get(abilityId);
  if (!passiveAbility) {
    throw new UserVisibleError(`Неизвестная способность ${abilityId}`);
  }

  if (passiveAbility.modifier instanceof Modifier || passiveAbility.modifier.length > 0) {
    throw new UserVisibleError(`Временная способность ${abilityId} содержит модификаторы!`);
  }

  if (!effectDescription) {
    effectDescription = `Добавление временной способности ${passiveAbility.humanReadableName}`;
  }

  addTemporaryModifier(
    api,
    modifierFromEffect(addTemporaryPassiveAbilityEffect, {
      validUntil: validUntil(api, d),
      abilityId,
      descriptionSubstitutions,
    }),
    d,
    effectDescription,
  );
}

// Beware: only supports one-time use abilities (i.e. ability will disappear after first use).
export function addTemporaryActiveAbility(
  api: EventModelApi<Sr2020Character>,
  abilityId: string,
  d: Duration,
  effectDescription: string | undefined = undefined,
) {
  const activeAbility = getAllActiveAbilities().get(abilityId);
  if (!activeAbility) {
    throw new UserVisibleError(`Неизвестная способность ${abilityId}`);
  }

  if (!effectDescription) {
    effectDescription = `Добавление временной способности ${activeAbility.humanReadableName}`;
  }

  const m = modifierFromEffect(addTemporaryActiveAbilityEffect, {
    validUntil: validUntil(api, d),
    ability: activeAbility,
  });
  m.name = `add-active-ability-${abilityId}`;
  addTemporaryModifier(api, m, d, effectDescription);
}

export function addTemporaryPassiveAbilityEffect(
  api: EffectModelApi<Sr2020Character>,
  m: TemporaryModifier & { abilityId: string; descriptionSubstitutions?: object },
) {
  const passiveAbility = getAllPassiveAbilities().get(m.abilityId)!;
  api.model.passiveAbilities.push({
    id: passiveAbility.id,
    humanReadableName: passiveAbility.humanReadableName,
    description: m.descriptionSubstitutions ? template(passiveAbility.description)(m.descriptionSubstitutions) : passiveAbility.description,
    validUntil: m.validUntil,
  });
}

export function addTemporaryActiveAbilityEffect(api: EffectModelApi<Sr2020Character>, m: TemporaryModifier & { ability: ActiveAbility }) {
  api.model.activeAbilities.push({
    id: m.ability.id,
    humanReadableName: m.ability.humanReadableName,
    description: m.ability.description,
    target: m.ability.target,
    targetsSignature: m.ability.targetsSignature,
    cooldownMinutes: 0,
    cooldownUntil: 0,
    validUntil: m.validUntil,
  });
}

type AddedFeature = AddedPassiveAbility | AddedActiveAbility | AddedSpell;

export function getFeatureIdsInModel(model: Sr2020Character): string[] {
  const getId = (f: AddedFeature) => f.id;
  return [...model.passiveAbilities.map(getId), ...model.activeAbilities.map(getId), ...model.spells.map(getId)];
}

export function satisfiesPrerequisites(model: Sr2020Character, f: Feature): boolean {
  const modelFeatureIds = getFeatureIdsInModel(model);
  if (modelFeatureIds.includes(f.id)) return false;
  return f.prerequisites.every((prerequisiteId) => {
    if (prerequisiteId.startsWith('!')) {
      return !modelFeatureIds.includes(prerequisiteId.replace('!', ''));
    } else {
      return modelFeatureIds.includes(prerequisiteId);
    }
  });
}

export function getAllFeatures(): Feature[] {
  const extractFeatureFields = (f: Feature): Feature => ({
    id: f.id,
    humanReadableName: f.humanReadableName,
    description: f.description,
    prerequisites: f.prerequisites,
    availability: f.availability,
    karmaCost: f.karmaCost,
    pack: f.pack,
  });
  return [...getAllActiveAbilities().values(), ...getAllPassiveAbilities().values(), ...getAllSpells().values()].map(extractFeatureFields);
}

// Returns all features with 'open' availability and satisfied prerequisites for a given character.
export function getAllAvailableFeatures(model: Sr2020Character): Feature[] {
  return getAllFeatures()
    .filter((f: Feature) => f.availability == 'open')
    .filter((f: Feature) => satisfiesPrerequisites(model, f))
    .map((f: Feature) => ({ ...f, karmaCost: getFeatureKarmaCost(model, f) }));
}

export function getFeatureKarmaCost(model: Sr2020Character, feature: Feature) {
  const discount = kAllKarmaDiscounts
    .filter((it) => it.metarace == model.metarace)
    .find((it) => feature.prerequisites.includes(it.archetype));

  if (discount) {
    return (feature.karmaCost * (100 - discount.discount)) / 100;
  } else {
    return feature.karmaCost;
  }
}

interface KarmaDiscount {
  archetype: string;
  metarace: MetaRace;
  discount: number;
}

export const kAllKarmaDiscounts: KarmaDiscount[] = [
  { archetype: 'arch-hackerman-decker', metarace: 'meta-norm', discount: 10 },
  { archetype: 'arch-hackerman-technomancer', metarace: 'meta-norm', discount: 5 },
  { archetype: 'arch-face', metarace: 'meta-norm', discount: 5 },
  { archetype: 'arch-rigger', metarace: 'meta-dwarf', discount: 10 },
  { archetype: 'arch-mage', metarace: 'meta-dwarf', discount: 5 },
  { archetype: 'arch-hackerman-decker', metarace: 'meta-dwarf', discount: 5 },
  { archetype: 'arch-hackerman-decker', metarace: 'meta-elf', discount: 5 },
  { archetype: 'arch-mage', metarace: 'meta-elf', discount: 5 },
  { archetype: 'arch-face', metarace: 'meta-elf', discount: 10 },
  { archetype: 'arch-hackerman-technomancer', metarace: 'meta-ork', discount: 10 },
  { archetype: 'arch-rigger', metarace: 'meta-ork', discount: 5 },
  { archetype: 'arch-samurai', metarace: 'meta-ork', discount: 5 },
  { archetype: 'arch-samurai', metarace: 'meta-troll', discount: 10 },
  { archetype: 'arch-hackerman-technomancer', metarace: 'meta-troll', discount: 5 },
  { archetype: 'arch-rigger', metarace: 'meta-troll', discount: 5 },
  { archetype: 'arch-mage', metarace: 'meta-vampire', discount: 10 },
  { archetype: 'arch-face', metarace: 'meta-vampire', discount: 5 },
  { archetype: 'arch-samurai', metarace: 'meta-vampire', discount: 5 },
  { archetype: 'arch-mage', metarace: 'meta-ghoul', discount: 10 },
  { archetype: 'arch-face', metarace: 'meta-ghoul', discount: 5 },
  { archetype: 'arch-samurai', metarace: 'meta-ghoul', discount: 5 },
];
