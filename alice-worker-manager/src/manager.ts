import { Subject } from 'rxjs/Rx';

import { Event, SyncEvent } from 'alice-model-engine-api';

import { CatalogsStorageInterface } from './catalogs_storage';
import { SyncEventsSource } from './events_source';
import { LoggerInterface } from './logger';
import { WorkersPoolInterface } from './workers_pool';

import { Processor, ProcessorFactory } from './processor';

const MAX_ERRORS = 3;

export class Manager {
  private stopped: Subject<{}> = new Subject();

  private processors: {
    [characterId: string]: {
      current: Processor,
      pending?: Processor,
    },
  } = {};

  private errors: {
    [characterId: string]: number,
  } = {};

  constructor(
    private eventsSource: SyncEventsSource,
    private catalogsStorage: CatalogsStorageInterface,
    private pool: WorkersPoolInterface,
    private processorFactory: ProcessorFactory,
    private logger: LoggerInterface,
  ) { }

  public async init() {
    let catalogs;
    catalogs = await this.catalogsStorage.load();

    this.pool.init().setCatalogs(catalogs);
    this.subscribeEvents();
  }

  public subscribeEvents() {
    this.eventsSource.syncEvents()
      .takeUntil(this.stopped)
      .do(this.logEvent)
      .filter(this.filterErroredModels)
      .subscribe(this.onSyncEvent);

    this.eventsSource.follow();
  }

  public logEvent = (event: Event) => {
    switch (event.eventType) {
      case '_RefreshModel':
        this.logger.info(
          'manager', `Found refresh event for ${event.characterId}`, { characterId: event.characterId, event });
        break;
      default:
        this.logger.warn(
          'manager', `Unexpected event for ${event.characterId}`, { characterId: event.characterId, event });
    }
  }

  public filterErroredModels = (event: Event) => {
    const characterId = event.characterId;

    if (this.errors[characterId] && this.errors[characterId] >= MAX_ERRORS) {
      this.logger.warn('manager',
        'Character exceed MAX_ERRORS value', { characterId, totalErrors: this.errors[characterId], MAX_ERRORS });
      return false;
    }

    return true;
  }

  public onSyncEvent = (event: SyncEvent) => {
    const characterId = event.characterId;

    if (this.processors[characterId]) {
      const processors = this.processors[characterId];
      if (processors.current.acceptingEvents()) {
        processors.current.pushEvent(event);
      } else {
        if (!processors.pending) {
          processors.pending = this.processorFactory();
        }
        processors.pending.pushEvent(event);
      }
    } else {
      const processor = this.processorFactory();
      this.processors[characterId] = { current: processor };
      processor.pushEvent(event).run().then(this.processorFulfilled, this.processorRejected);
    }
  }

  public processorFulfilled = (event: SyncEvent) => {
    const characterId = event.characterId;

    delete this.errors[characterId];
    this.rotateProcessors(characterId);
  }

  public processorRejected = (event: SyncEvent) => {
    this.errors[event.characterId] = (this.errors[event.characterId] || 0) + 1;
    this.rotateProcessors(event.characterId);
  }

  public rotateProcessors(characterId: string) {
    if (!this.processors[characterId]) return;

    const processors = this.processors[characterId];
    if (processors.pending) {
      processors.current = processors.pending;
      delete processors.pending;
      processors.current.run().then(this.processorFulfilled, this.processorRejected);
    } else {
      delete this.processors[characterId];
    }
  }

  public stop() {
    this.stopped.next({});
    return this.pool.drain();
  }
}
