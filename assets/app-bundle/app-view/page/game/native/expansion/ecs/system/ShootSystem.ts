import { GameController } from '../../../../../../../../app-builtin/app-controller/GameController';
import { EcsSystem, NodeComponent, filter } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { PlayerComponent } from '../component/PlayerComponent';

export class ShootSystem extends EcsSystem {
    private playerFilter = filter.all(PlayerComponent, NodeComponent);

    private pause = 0;

    protected execute(dt: number): void {
        const playerEntity = this.find(this.playerFilter);
        if (!playerEntity) return;

        this.pause -= dt;
        if (this.pause > 0) return;

        const node = playerEntity.get(NodeComponent);
        const player = playerEntity.get(PlayerComponent);
        this.pause = player.interval;

        GameController.inst.shoot(node, player);
    }
}

