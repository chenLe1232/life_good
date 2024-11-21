import { ecsclass, EcsComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('DamageComponent')
export class DamageComponent extends EcsComponent<MyEntity> {
    static allowRecycling = true;
    protected onRemove() {
        this.attack = 1;
    }

    attack = 1;
}