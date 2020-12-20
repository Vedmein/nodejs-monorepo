import { EmptyModel, JsonColumn, NumberProperty, ObjectProperty, StringProperty } from '@alice/alice-common/models/alice-model-engine';
import { BaseModelProcessRequest, BaseModelProcessResponse } from '@alice/alice-common/models/process-requests-respose';
import { Column, Entity } from 'typeorm';

export type QrType =
  // Ones named in a CAPS_CASE are only generated by client Android app
  | 'HEALTHY_BODY'
  | 'WOUNDED_BODY'
  | 'CLINICALLY_DEAD_BODY'
  | 'ABSOLUTELY_DEAD_BODY'
  | 'ASTRAL_BODY'
  | 'ECTOPLASM_BODY'
  | 'ROBOT_BODY'
  // Ones in snake_case are rewritable ones stored in the database
  | 'empty' // Empty QR, can be written.
  | 'pill' // Pharmaceuticals and similar
  | 'implant' // Implant bought in the shop or cut from the body.
  | 'food' // Food item
  | 'ability' // Used for mental abilities - ability which affects the person who scanned it.
  | 'feature_to_buy' // Closed ability to be bought for karma.
  | 'artifact' // Enchanted item.
  | 'event' // Event which affects the person who scanned it.
  | 'reagent' // Magical reagent
  | 'locus' // Ethic group locus
  | 'locus_charge' // Charge for the locus
  | 'box' // Empty box of some merchandise
  | 'body_storage'
  | 'spirit' // Not the spirit body! This is the spirit you can "enter"
  | 'drone' // Not the drone body! This is drone you can jack in
  | 'drone_mod'
  | 'sprite'
  | 'cyberdeck'
  | 'cyberdeck_mod'
  | 'software'
  | 'foundation_node'
  | 'reanimate_capsule'
  | 'ai_symbol'
  | 'focus'; // Magic focus
// When adding new QR types here, add them to kMerchandiseQrTypes also if they are merchandise

@Entity({
  name: 'qr',
})
export class QrCode extends EmptyModel {
  @NumberProperty()
  @Column()
  usesLeft: number = 0;

  @StringProperty()
  @Column({ type: 'text', default: 'empty' })
  type: QrType = 'empty';

  @StringProperty()
  @Column({ default: '' })
  name: string = '';

  @StringProperty()
  @Column({ default: '' })
  description: string = '';

  @StringProperty({ optional: true })
  @Column()
  eventType?: string;

  @ObjectProperty(Object)
  @JsonColumn()
  data: Record<string, any>;
}

export class QrCodeProcessRequest extends BaseModelProcessRequest {
  @ObjectProperty(QrCode)
  baseModel: QrCode;
}

export class QrCodeProcessResponse extends BaseModelProcessResponse {
  @ObjectProperty(QrCode)
  baseModel: QrCode;

  @ObjectProperty(QrCode)
  workModel: QrCode;
}
