import { merge } from 'lodash';
import { Document } from '../src/db/interface';
import { ConfigToken, DBConnectorToken } from '../src/di_tokens';

function dbName(di: any, alias: string): String {
    return di.get(ConfigToken).db[alias];
}

export async function createModel(di: any, id?: string, fields?: any): Promise<Document> {
    let modelsDb = di.get(DBConnectorToken).use(dbName(di, 'models'));

    if (!fields) {
        fields = { value: '' };
    }

    if (!id) {
        id = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    let model = merge({
        _id: id,
        timestamp: Date.now(),
    }, fields);

    await modelsDb.put(model);

    return model;
}

export function getModel(di: any, id: string, dbAlias: string = 'models') {
    let modelsDb = di.get(DBConnectorToken).use(dbName(di, dbAlias));
    return modelsDb.getOrNull(id);
}

export function getModelVariants(di: any, id: string, aliases: string[] = ['models', 'workingModels', 'viewModels']) {
    let pending = aliases.map((alias) => getModel(di, id, alias));
    return Promise.all(pending);
}

export function pushEvent(di: any, event: any) {
    let eventsDb = di.get(DBConnectorToken).use(dbName(di, 'events'));
    return eventsDb.put(event);
}