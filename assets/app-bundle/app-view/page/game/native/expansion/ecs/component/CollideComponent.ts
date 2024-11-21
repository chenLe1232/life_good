
import { ecsclass, EcsComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { Body } from '../../../../../../../../pkg-export/@gamex/cc-sap';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('CollideComponent')
export class CollideComponent extends EcsComponent<MyEntity> {
    static allowRecycling = true;

    public body = new Body<MyEntity>(0);

    protected onAdd(): void {
        this.body.setID(this.entity.uuid)
        this.body.setData(this.entity);
    }

    protected onRemove(): void {
        this.body.setID(0);
        this.body.setData(null);
    }
}