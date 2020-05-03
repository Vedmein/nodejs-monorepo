import { TestFixture } from './fixture';
import { expect } from '@loopback/testlab';
import { duration } from 'moment';

describe('Fixture', function() {
  // eslint-disable-next-line no-invalid-this
  this.timeout(15000);

  let fixture: TestFixture;

  beforeEach('setupApplication', async () => {
    fixture = await TestFixture.create();
  });

  afterEach(async () => {
    await fixture.destroy();
  });

  it('Ping', async () => {
    await fixture.client.get('/ping').expect(200);
  });

  it('Save and get location partial', async () => {
    await fixture.saveLocation({ manaDensity: 15 });
    const { workModel } = await fixture.getLocation();
    expect(workModel).to.containDeep({ manaDensity: 15 });
  });

  it('Send character event', async () => {
    await fixture.saveCharacter({ resonance: 12 });
    await fixture.sendCharacterEvent({ eventType: 'increase-resonance-spell', data: {} });
    expect(await fixture.getCharacter()).containDeep({ workModel: { resonance: 13 } });
    expect(fixture.getCharacterNotifications().length).to.equal(1);
  });

  it('Send location event', async () => {
    await fixture.saveLocation({ manaDensity: 5 });
    await fixture.sendLocationEvent({ eventType: 'reduce-mana-density', data: { amount: 3 } });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 2 } });
  });

  it('Send scheduled event', async () => {
    await fixture.saveLocation({ manaDensity: 5 });
    await fixture.sendLocationEvent({
      eventType: 'schedule-event',
      data: { delayInSeconds: 10, event: { eventType: 'reduce-mana-density', data: { amount: 3 } } },
    });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 5 } });
    fixture.advanceTime(duration(5, 'seconds'));
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 5 } });
    fixture.advanceTime(duration(5, 'seconds'));
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 2 } });
  });

  it('Send increaseManaDensityDelayed event', async () => {
    await fixture.saveLocation({ manaDensity: 5 });
    await fixture.sendLocationEvent({
      eventType: 'increase-mana-density-delayed',
      data: { delayInSeconds: 10, amount: 10 },
    });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 5 } });
    fixture.advanceTime(duration(5, 'seconds'));
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 5 } });
    fixture.advanceTime(duration(5, 'seconds'));
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 15 } });
  });

  it('Send character event with location event as side-effect', async () => {
    await fixture.saveCharacter();
    await fixture.saveLocation({ manaDensity: 10 });
    await fixture.sendCharacterEvent({ eventType: 'density-drain-spell', data: { location: { id: 0, manaLevel: 10 }, amount: 3 } });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 7 } });
  });

  it('Send character event which aquires location', async () => {
    await fixture.saveCharacter();
    await fixture.saveLocation({ manaDensity: 100 });
    await fixture.sendCharacterEvent({ eventType: 'density-halve-spell', data: { location: { id: 0, manaLevel: 100 } } });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 50 } });
  });

  it('Location is actualized before putting in context', async () => {
    await fixture.saveCharacter();
    await fixture.saveLocation({ manaDensity: 100 });
    await fixture.sendLocationEvent({
      eventType: 'schedule-event',
      data: { delayInSeconds: 10, event: { eventType: 'reduce-mana-density', data: { amount: 20 } } },
    });
    fixture.advanceTime(duration(10, 'seconds'));
    await fixture.sendCharacterEvent({ eventType: 'density-halve-spell', data: { location: { id: 0, manaLevel: 100 } } });
    expect(await fixture.getLocation()).containDeep({ workModel: { manaDensity: 40 } });
  });

  it('Consume QR code', async () => {
    await fixture.saveQrCode({ usesLeft: 5, type: 'event' });
    await fixture.sendQrCodeEvent({
      eventType: 'consume',
      data: { id: '0' },
    });
    expect(await fixture.getQrCode()).containDeep({ workModel: { usesLeft: 4, type: 'event' } });
  });

  it('Completely consume QR code', async () => {
    await fixture.saveQrCode({ usesLeft: 1, type: 'event' });
    await fixture.sendQrCodeEvent({
      eventType: 'consume',
      data: {},
    });
    expect(await fixture.getQrCode()).containDeep({ workModel: { usesLeft: 0, type: 'empty' } });
  });

  it('QR codes with events', async () => {
    await fixture.saveCharacter({ resonance: 10 });
    await fixture.saveQrCode({ usesLeft: 5, type: 'event', eventType: 'increase-resonance-spell', data: {} });
    await fixture.sendCharacterEvent({
      eventType: 'scan-qr',
      data: { qrCode: '0' },
    });
    expect(await fixture.getQrCode()).containDeep({ workModel: { usesLeft: 4, type: 'event' } });
    expect(await fixture.getCharacter()).containDeep({ workModel: { resonance: 11 } });
  });
});
