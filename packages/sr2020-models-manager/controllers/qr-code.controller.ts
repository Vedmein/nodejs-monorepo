import { del, get, param, post, put, requestBody } from '@loopback/rest';
import { Empty } from '@sr2020/interface/models/empty.model';
import { PushService } from '@sr2020/interface/services/push.service';
import { ModelEngineService } from '@sr2020/interface/services/model-engine.service';
import { inject } from '@loopback/core';
import { EventRequest } from '@sr2020/interface/models/alice-model-engine';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { QrCode, QrCodeProcessResponse } from '@sr2020/interface/models/qr-code.model';
import { ModelAquirerService } from '@sr2020/alice-models-manager/services/model-aquirer.service';
import { EventDispatcherService } from '@sr2020/alice-models-manager/services/event-dispatcher.service';
import { PubSubService } from '@sr2020/alice-models-manager/services/pubsub.service';
import { TimeService } from '@sr2020/alice-models-manager/services/time.service';
import { AnyModelController } from '@sr2020/alice-models-manager/controllers/anymodel.controller';

export class QrCodeController extends AnyModelController<QrCode> {
  constructor(
    @inject('services.ModelEngineService')
    protected modelEngineService: ModelEngineService,
    @inject('services.TimeService')
    protected timeService: TimeService,
    @inject('services.EventDispatcherService')
    protected eventDispatcherService: EventDispatcherService,
    @inject('services.ModelAquirerService')
    protected modelAquirerService: ModelAquirerService,
    @inject('services.PushService')
    protected pushService: PushService,
    @inject('services.PubSubService')
    protected pubSubService: PubSubService,
  ) {
    super(QrCode, modelEngineService, timeService, eventDispatcherService, modelAquirerService, pushService, pubSubService);
  }

  @put('/qr/model', {
    responses: {
      '200': {
        description: 'Transaction PUT success',
      },
    },
  })
  async replaceById(@requestBody() model: QrCode): Promise<Empty> {
    return super.replaceById(model);
  }

  @del('/qr/model/{id}', {
    responses: {
      '200': {
        description: 'Transaction DELETE success',
        content: { 'application/json': { schema: { 'x-ts-type': Empty } } },
      },
    },
  })
  @Transaction()
  async delete(@param.path.number('id') id: number, @TransactionManager() manager: EntityManager): Promise<Empty> {
    return super.delete(id, manager);
  }

  @get('/qr/model/{id}', {
    responses: {
      '200': {
        description: 'Transaction GET success',
        content: { 'application/json': { schema: { 'x-ts-type': QrCodeProcessResponse } } },
      },
    },
  })
  @Transaction()
  async get(@param.path.number('id') id: number, @TransactionManager() manager: EntityManager): Promise<QrCodeProcessResponse> {
    return super.get(id, manager);
  }

  @get('/qr/model/{id}/predict', {
    responses: {
      '200': {
        description: 'Transaction GET success',
        content: { 'application/json': { schema: { 'x-ts-type': QrCodeProcessResponse } } },
      },
    },
  })
  async predict(@param.path.number('id') id: number, @param.query.number('t') timestamp: number): Promise<QrCodeProcessResponse> {
    return super.predict(id, timestamp);
  }

  @post('/qr/model/{id}', {
    responses: {
      '200': {
        description: 'Transaction GET success',
        content: { 'application/json': { schema: { 'x-ts-type': QrCodeProcessResponse } } },
      },
    },
  })
  @Transaction()
  async postEvent(
    @param.path.number('id') id: number,
    @requestBody() event: EventRequest,
    @TransactionManager() manager: EntityManager,
  ): Promise<QrCodeProcessResponse> {
    return super.postEvent(id, event, manager);
  }

  @post('/qr/broadcast', {
    responses: {
      '200': {
        description: 'Event successfully broadcasted',
      },
    },
  })
  broadcast(@requestBody() event: EventRequest): Promise<void> {
    return this.broadcastEvent(event);
  }
}
