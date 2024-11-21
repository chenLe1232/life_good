import { ecsclass, EcsComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('HarmComponent')
export class HarmComponent extends EcsComponent<MyEntity> {
    static allowRecycling = true;
    protected onRemove() {
        this.damage = 0;
    }

    damage = 0;
}