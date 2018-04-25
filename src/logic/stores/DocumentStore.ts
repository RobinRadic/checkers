import { injectable, inject } from 'inversify';
import { Symbols } from 'ioc';
import { Api, Document } from 'api';
import { LayoutStore } from './LayoutStore';
import { action, observable, toJS } from 'mobx';
import { objectGet, objectSet } from '@radic/util';
import { resolve } from 'utils/promise';


@injectable()
export class DocumentStore {
    @inject(Symbols.Api) api: Api
    @inject(Symbols.LayoutStore) layout: LayoutStore

    @observable current: Document

    storage: { [project: string]: { [revision: string]: { [document: string]: Document } } } = {}

    addToStorage(document: Document) {
        objectSet(this.storage, `${document.project}.${document.revision}.${document.path}`, document);
    }

    hasInStorage(project: string, revision: string, document: string) {
        return this.getFromStorage(project, revision, document) !== undefined
    }

    getFromStorage(project: string, revision: string, document: string) {
        return objectGet(this.storage, `${project}.${revision}.${document}`);
    }

    @action
    async set(project: string, revision: string, document: string) {
        if ( this.hasInStorage(project, revision, document) ) {
            this.current = this.getFromStorage(project, revision, document);
        } else {
            this.current = await this.api.getDocument(project, revision, document + '?render');
            this.addToStorage(toJS(this.current));
        }
        this.layout.set(this.current.layout);
        return resolve(this.current)
    }

}