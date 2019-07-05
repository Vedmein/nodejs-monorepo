import { Client, expect } from '@loopback/testlab';
import * as nock from 'nock';
import { ModelsManagerApplication } from '../application';
import { setupApplication } from '../test-helper';
import { DeusExModelRepository } from '../repositories/deus-ex-model.repository';
import * as modelImport from '@sr2020/interface/models/deus-ex-model-example.json';
import { DeusExModelDbEntity } from 'models-manager/models/deus-ex-model-db-entity';
import { DeusExModel, DeusExProcessModelResponse } from '@sr2020/interface/models/deus-ex-model';

const model = modelImport as DeusExModel;

describe('ModelController', () => {
  let app: ModelsManagerApplication;
  let client: Client;
  let repo: DeusExModelRepository;

  beforeEach('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    repo = await app.getRepository(DeusExModelRepository);
  });

  afterEach(async () => {
    await app.stop();
  });

  it('invokes PUT /model', async () => {
    await client
      .put('/model')
      .send(model)
      .expect(200);

    const allEntries = await repo.find();
    expect(allEntries.length).to.equal(1);
    expect(JSON.parse(allEntries[0].model)).to.containEql(model);
  });

  it('GET /model', async () => {
    await repo.create(DeusExModelDbEntity.fromModel(model));

    const r: DeusExProcessModelResponse = { baseModel: model, workModel: model };
    const scope = nock('http://instance.evarun.ru:7006')
      .post('/process')
      .reply(200, r);

    await client.get(`/model/${model.modelId}`).expect(200);

    expect(scope.isDone()).to.be.true();
  });

  it.skip('GET /model many requests', async () => {
    await repo.create(DeusExModelDbEntity.fromModel(model));

    const scope = nock('http://instance.evarun.ru:7006')
      .post('/process')
      .times(21)
      .reply(200, (url, body) => {
        (body as any).baseModel.hp += 1;
        return JSON.stringify(body);
      });

    const promises: any[] = [];
    for (let i = 0; i < 20; ++i) promises.push(client.get(`/model/${model.modelId}`));
    await Promise.all(promises);

    await client
      .get(`/model/${model.modelId}`)
      .expect(200)
      .then((res) => expect(res.body.baseModel.hp).to.equal(model.hp + 21));

    expect(scope.isDone()).to.be.true();
  });
});
