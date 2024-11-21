import { GameController } from '../../../../../../../../app-builtin/app-controller/GameController';
import { EcsSystem } from '../../../../../../../../pkg-export/@gamex/cc-ecs';

export class EnemySystem extends EcsSystem {
    private pause = 0;

    protected execute(dt: number): void {
        this.pause -= dt;
        if (this.pause > 0) return;
        this.pause = 4;

        GameController.inst.enemy();
    }
}

