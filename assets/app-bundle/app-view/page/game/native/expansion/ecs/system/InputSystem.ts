import { EcsSystem, filter, NodeComponent } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { DestroyComponent } from '../component/DestroyComponent';
import { PlayerComponent } from '../component/PlayerComponent';
import { InputSingleton } from '../singleton/InputSingleton';

export class InputSystem extends EcsSystem {
    protected filter = filter.all(PlayerComponent, NodeComponent).exclude(DestroyComponent);

    protected execute(): void {
        const playerEntity = this.find(this.filter);
        if (!playerEntity) return;

        const input = this.ecs.getSingleton(InputSingleton);
        playerEntity.get(NodeComponent).setPosition(input.x, input.y);
    }
}

