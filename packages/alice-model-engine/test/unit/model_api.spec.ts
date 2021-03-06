import { Context } from '../../context';
import { EventModelApiFactory } from '../../model_api';

describe('ModelApi', () => {
  it('getCatalogObject', () => {
    const context = new Context({ modelId: '', timestamp: 0, modifiers: [], conditions: [], timers: [] }, [], { foo: [{ id: 'bar' }] });
    const api = EventModelApiFactory(context);

    expect(api.getCatalogObject<{ id: string }>('foo', 'bar')).toEqual({ id: 'bar' });
  });
});
