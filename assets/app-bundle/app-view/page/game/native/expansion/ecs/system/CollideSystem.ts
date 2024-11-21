import { view } from 'cc';
import { app } from '../../../../../../../../app/app';
import { EcsSystem, IFilter, NodeComponent, filter } from '../../../../../../../../pkg-export/@gamex/cc-ecs';
import { SAP } from '../../../../../../../../pkg-export/@gamex/cc-sap';
import { BulletComponent } from '../component/BulletComponent';
import { CollideComponent } from '../component/CollideComponent';
import { DamageComponent } from '../component/DamageComponent';
import { DestroyComponent } from '../component/DestroyComponent';
import { EnemyComponent } from '../component/EnemyComponent';
import { HarmComponent } from '../component/HarmComponent';
import { PlayerComponent } from '../component/PlayerComponent';
import { PropComponent } from '../component/PropComponent';
import { MyEntity } from '../entity/MyEntity';

export class CollideSystem extends EcsSystem {
    private physics: SAP<MyEntity>; //QuadTree用法与SAP一致

    protected onAdd(): void {
        this.physics = new SAP<MyEntity>()
    }

    protected onRemove(): void {
        this.physics.clear();
        this.physics = null;
    }

    private enemyFilter = filter.all(EnemyComponent, CollideComponent, NodeComponent).exclude(DestroyComponent);
    private playerFilter = filter.all(PlayerComponent, CollideComponent, NodeComponent).exclude(DestroyComponent);
    private bulletFilter = filter.all(BulletComponent, CollideComponent, NodeComponent).exclude(DestroyComponent);
    private propFilter = filter.all(PropComponent, CollideComponent, NodeComponent).exclude(DestroyComponent);

    protected matcher: IFilter = filter.all(CollideComponent, NodeComponent);
    protected onEntityEnter(entity: MyEntity): void {
        this.physics.insert(entity.get(CollideComponent).body);
    }
    protected onEntityLeave(entity: MyEntity): void {
        this.physics.remove(entity.get(CollideComponent).body);
    }

    private playerAndEnemy(playerE: MyEntity, enemyE: MyEntity) {
        if (!playerE.has(DestroyComponent)) {
            playerE.add(DestroyComponent);
        }
    }

    private playerAndProp(playerE: MyEntity, propE: MyEntity) {
        const player = playerE.getComponent(PlayerComponent);
        const prop = propE.getComponent(PropComponent)
        if (prop.type === PropComponent.Type.Attack) {
            player.attack += prop.value;
        } else if (prop.type === PropComponent.Type.Speed) {
            player.speed += prop.value;
        } else if (prop.type === PropComponent.Type.Split) {
            player.split += prop.value;
        }
        propE.add(DestroyComponent);
        app.manager.sound.playEffect({ name: 'effect/eat' });
    }

    private bulletAndEnemy(bulletE: MyEntity, enemyE: MyEntity) {
        bulletE.add(DestroyComponent);
        const damage = bulletE.get(DamageComponent);
        if (damage) {
            (enemyE.get(HarmComponent) || enemyE.add(HarmComponent)).damage += damage.attack;
            app.manager.sound.playEffect({ name: 'effect/hit', interval: 0.1 });
        }
    }

    protected execute(): void {
        const playerNode = this.find(this.playerFilter, NodeComponent);
        const enemyNodes = this.query(this.enemyFilter, NodeComponent);
        const bulletNodes = this.query(this.bulletFilter, NodeComponent);
        const propNodes = this.query(this.propFilter, NodeComponent);
        const winSize = view.getVisibleSize();

        if (playerNode) {
            playerNode.entity.get(CollideComponent).body.setRect(playerNode.boundingBox);
        }
        enemyNodes.forEach(enemyNode => {
            // 出界
            if (enemyNode.maxY < -winSize.height / 2) {
                enemyNode.entity.add(DestroyComponent);
            }
            enemyNode.entity.get(CollideComponent).body.setRect(enemyNode.boundingBox);
        });
        bulletNodes.forEach(bulletNode => {
            // 出界
            if (bulletNode.maxY > winSize.height / 2) {
                bulletNode.entity.add(DestroyComponent);
            }
            bulletNode.entity.get(CollideComponent).body.setRect(bulletNode.boundingBox);
        });
        propNodes.forEach(propNode => {
            // 出界
            if (propNode.maxY < -winSize.height / 2) {
                propNode.entity.add(DestroyComponent);
            }
            propNode.entity.get(CollideComponent).body.setRect(propNode.boundingBox);
        });

        this.physics.trigger((a, b) => {
            if (a.data.has(PlayerComponent)) {
                if (b.data.has(PropComponent)) {
                    this.playerAndProp(a.data, b.data);
                } else if (b.data.has(EnemyComponent)) {
                    this.playerAndEnemy(a.data, b.data);
                }
            } else if (a.data.has(BulletComponent)) {
                if (b.data.has(EnemyComponent)) {
                    this.bulletAndEnemy(a.data, b.data);
                }
            } else if (a.data.has(PropComponent)) {
                if (b.data.has(PlayerComponent)) {
                    this.playerAndProp(b.data, a.data);
                }
            } else if (a.data.has(EnemyComponent)) {
                if (b.data.has(BulletComponent)) {
                    this.bulletAndEnemy(b.data, a.data);
                } else if (b.data.has(PlayerComponent)) {
                    this.playerAndEnemy(b.data, a.data);
                }
            }
        })
    }
}

