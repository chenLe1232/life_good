import { ecsclass, EcsSingleton } from '../../../../../../../../pkg-export/@gamex/cc-ecs';

@ecsclass('DataSingleton')
export class DataSingleton extends EcsSingleton {
    over = false;
}