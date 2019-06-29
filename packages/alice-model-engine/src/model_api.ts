import {
  AquiredObjects,
  Condition,
  EmptyModel,
  Event,
  LogApiInterface,
  ModelApiInterface,
  PreprocessApiInterface,
  ReadModelApiInterface,
  ViewModelApiInterface,
  Modifier,
  Effect,
} from 'alice-model-engine-api';
import cuid = require('cuid');
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';

import { Context } from './context';
import Logger from './logger';

class ReadModelApi<T extends EmptyModel> implements ReadModelApiInterface<T>, LogApiInterface {
  constructor(protected contextGetter: () => Context<T>) {}

  get model() {
    return this.contextGetter().model;
  }

  public getCatalogObject(catalogName: string, id: string) {
    const catalog = this.contextGetter().getDictionary(catalogName);
    if (catalog) {
      return cloneDeep(catalog.find((c) => c.id == id));
    }
  }

  public getModifierById(id: string) {
    return this.contextGetter().modifiers.find((m) => m.mID == id);
  }

  public getModifiersByName(name: string) {
    return this.getModifiersBy((m) => m.name == name);
  }

  public getModifiersByClass(className: string) {
    return this.getModifiersBy((m) => m.class == className);
  }

  public getModifiersBySystem(systemName: string) {
    return this.getModifiersBy((m) => m.system == systemName);
  }

  public getEffectsByClass(className: string) {
    return this.getEffectsBy((e) => e.class == className);
  }

  public getConditionById(id: string) {
    return this.contextGetter().conditions.find((c) => c.id == id);
  }

  public getConditionsByClass(className: string) {
    return this.getConditionsBy((c) => c.class == className);
  }

  public getConditionsByGroup(group: string) {
    return this.getConditionsBy((c) => c.group == group);
  }

  public getTimer(name: string) {
    return this.contextGetter().timers[name];
  }

  public debug(msg: string, additionalData?: any) {
    Logger.debug('model', msg, additionalData);
  }

  public info(msg: string, additionalData?: any) {
    Logger.info('model', msg, additionalData);
  }

  public notice(msg: string, additionalData?: any) {
    Logger.notice('model', msg, additionalData);
  }

  public warn(msg: string, additionalData?: any) {
    Logger.warn('model', msg, additionalData);
  }

  public error(msg: string, additionalData?: any) {
    Logger.error('model', msg, additionalData);
  }

  private getModifiersBy(predicate: (m: Modifier) => boolean) {
    return this.contextGetter().modifiers.filter(predicate);
  }

  private getEffectsBy(predicate: (e: Effect) => boolean) {
    const effects = this.contextGetter().effects.filter(predicate);
    return effects;
  }

  private getConditionsBy(predicate: (c: Condition) => boolean) {
    return this.contextGetter().conditions.filter(predicate);
  }
}

class ModelApi<T extends EmptyModel> extends ReadModelApi<T> implements ModelApiInterface<T> {
  constructor(contextGetter: () => Context<T>, private currentEvent?: Event) {
    super(contextGetter);
  }

  public addModifier(modifier: Modifier) {
    const m = cloneDeep(modifier);

    if (!m.mID) {
      m.mID = cuid();
    }

    this.contextGetter().modifiers.push(m);
    return m;
  }

  public aquired(db: string, id: string): AquiredObjects {
    return _.get(this.contextGetter(), ['aquired', db, id]);
  }

  public removeModifier(mID: string) {
    _.remove(this.contextGetter().modifiers, (m) => m.mID == mID);
    return this;
  }

  public addCondition(condition: Condition): Condition {
    let c = _.find(this.contextGetter().conditions, (cond) => cond.id == condition.id);

    if (c) return c;

    c = cloneDeep(condition);

    if (c) {
      if (!c.id) {
        c.id = cuid();
      }

      this.contextGetter().conditions.push(c);
    }

    return c;
  }

  public removeCondition(id: string) {
    _.remove(this.contextGetter().conditions, (c) => c.id == id);
    return this;
  }

  public setTimer(name: string, miliseconds: number, eventType: string, data: any) {
    this.contextGetter().setTimer(name, miliseconds, eventType, data);
    return this;
  }

  public removeTimer(name: string) {
    delete this.contextGetter().timers[name];
    return this;
  }

  public sendEvent(modelId: string | null, event: string, data: any) {
    const timestamp = this.currentEvent ? this.currentEvent.timestamp : this.contextGetter().timestamp;
    this.contextGetter().sendEvent(modelId, event, timestamp, data);
    return this;
  }
}

class ViewModelApi<T extends EmptyModel> extends ReadModelApi<T> implements ViewModelApiInterface<T> {
  constructor(contextGetter: () => Context<T>, protected baseContextGetter: () => Context<T>) {
    super(contextGetter);
  }

  get baseModel() {
    return this.baseContextGetter().model;
  }
}

class PreprocessApi<T extends EmptyModel> extends ReadModelApi<T> implements PreprocessApiInterface<T> {
  public aquire(db: string, id: string) {
    this.contextGetter().pendingAquire.push([db, id]);
    return this;
  }
}

export function ModelApiFactory<T extends EmptyModel>(context: Context<T>, event?: Event): ModelApiInterface<T> {
  return new ModelApi(() => context, event);
}

export function ViewModelApiFactory<T extends EmptyModel>(context: Context<T>, baseContext: Context<T>): ViewModelApiInterface<T> {
  return new ViewModelApi(() => context, () => baseContext);
}

export function PreprocessApiFactory<T extends EmptyModel>(context: Context<T>): PreprocessApiInterface<T> {
  return new PreprocessApi(() => context);
}
