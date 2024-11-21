import { Node } from 'cc';
import BaseController from '../../../extensions/app/assets/base/BaseController';
import { PlayerComponent } from '../../app-bundle/app-view/page/game/native/expansion/ecs/component/PlayerComponent';
import { NodeComponent } from '../../pkg-export/@gamex/cc-ecs';
export class GameController extends BaseController<GameController, {
    // 定义了事件，并同时定义参数列表和返回值
    Shoot: (node: NodeComponent, player: PlayerComponent) => void
    Enemy: () => void
    Prop: (node: NodeComponent) => void
    CollectBullet: (node: Node) => void
    CollectEnemy: (node: Node) => void
    CollectProp: (node: Node) => void
}>() {
    shoot(node: NodeComponent, player: PlayerComponent) {
        this.emit(GameController.Event.Shoot, node, player);
    }

    enemy() {
        this.emit(GameController.Event.Enemy);
    }

    prop(node: NodeComponent) {
        this.emit(GameController.Event.Prop, node);
    }

    collectBullet(node: Node) {
        this.emit(GameController.Event.CollectBullet, node);
    }

    collectEnemy(node: Node) {
        this.emit(GameController.Event.CollectEnemy, node);
    }

    collectProp(node: Node) {
        this.emit(GameController.Event.CollectProp, node);
    }
}