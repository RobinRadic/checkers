import { Application } from '../Application';
import { Repository } from '../../Config/Repository';
import * as config from '../../../config'

export class LoadConfiguration {
    bootstrap(app: Application) {
        const repo = new Repository;
        app.bind('config').toConstantValue(repo);
        Object.keys(config).forEach(key => {
            repo.set(key, config[ key ]);
        })
    }

}
