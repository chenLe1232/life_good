
import { ecsclass, EcsComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('BulletComponent')
export class BulletComponent extends EcsComponent<MyEntity> {
    static allowRecycling = true;
}