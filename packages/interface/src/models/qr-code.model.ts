import { model, property } from '@loopback/repository';
import { EmptyModel, JsonColumn, rproperty } from './alice-model-engine';
import { BaseModelProcessRequest, BaseModelProcessResponse } from './process-requests-respose';
import { Column, Entity } from 'typeorm';

export type QrType =
  // Ones named in a CAPS_CASE are only generated by client Android app
  | 'HEALTHY_BODY'
  | 'WOUNDED_BODY'
  | 'CLINICALLY_DEAD_BODY'
  | 'ABSOLUTELY_DEAD_BODY'
  | 'ASTRAL_BODY'
  | 'ROBOT_BODY'
  // Ones in snake_case are rewritable ones stored in the database
  | 'empty' // Empty QR, can be written.
  | 'pill' // Pharmaceuticals and similar
  | 'implant' // Implant bought in the shop or cut from the body.
  | 'food' // Food item
  | 'ability' // Used for mental abilities - ability which affects the person who scanned it.
  | 'artifact' // Enchanted item.
  | 'event' // Event which affects the person who scanned it.
  | 'reagent' // Magical reagent
  | 'locus' // Ethic group locus
  | 'locus_charge' // Charge for the locus
  | 'box' // Empty box of some merchandise
  | 'body_storage'
  | 'drone' // Not the drone body! This is drone you can jack in
  | 'drone_mod'
  | 'sprite'
  | 'cyberdeck'
  | 'cyberdeck_mod'
  | 'foundation_node'
  | 'reanimate_capsule'
  | 'ai_symbol';

@model()
@Entity({
  name: 'qr',
})
export class QrCode extends EmptyModel {
  @rproperty()
  @Column()
  usesLeft: number = 0;

  @property({ required: true, type: 'string' })
  @Column({ type: 'text', default: 'empty' })
  type: QrType = 'empty';

  @rproperty()
  @Column({ default: '' })
  name: string = '';

  @rproperty()
  @Column({ default: '' })
  description: string = '';

  @property()
  @Column()
  eventType?: string;

  @property()
  @JsonColumn()
  data: {};
}

@model()
export class QrCodeProcessRequest extends BaseModelProcessRequest {
  @rproperty()
  baseModel: QrCode;
}

@model()
export class QrCodeProcessResponse extends BaseModelProcessResponse {
  @rproperty()
  baseModel: QrCode;

  @rproperty()
  workModel: QrCode;
}
