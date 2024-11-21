import { ecsclass, EcsComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('DestroyComponent')
export class DestroyComponent extends EcsComponent<MyEntity> {
    static allowRecycling = true;
}