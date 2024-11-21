import { GameController } from '../../../../../../../../app-builtin/app-controller/GameController';
import { EcsSystem, MoveComponent, NodeComponent, filter } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { DestroyComponent } from '../component/DestroyComponent';
import { EnemyComponent } from '../component/EnemyComponent';
import { PlayerComponent } from '../component/PlayerComponent';
import { PropComponent } from '../component/PropComponent';
import { DataSingleton } from '../singleton/DataSingleton';

export class DestroySystem extends EcsSystem {
    private destroyFilter = filter.all(DestroyComponent);

    protected afterExecute(dt: number): void {
        this.query(this.destroyFilter).forEach(entity => {
            if (entity.has(EnemyComponent) && entity.has(NodeComponent)) {
                GameController.inst.prop(entity.get(NodeComponent));
            } else if (entity.has(PlayerComponent)) {
                this.ecs.getSingleton(DataSingleton).over = true;
            }

            if (entity.has(EnemyComponent)) {
                GameController.inst.collectEnemy(entity.node);
            } else if (entity.has(PropComponent)) {
                GameController.inst.collectProp(entity.node);
            } else if (entity.has(MoveComponent)) {
                GameController.inst.collectBullet(entity.node);
            } else {
                entity.node.destroy();
            }

            entity.destroy();
        })
    }
}

