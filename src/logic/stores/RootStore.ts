import { Symbols } from 'ioc';
import { action, observable, toJS, transaction } from 'mobx';
import { Api, ApplicationConfig, Document, Index, Project, ProjectsConfig, Revision } from 'api';
import { LayoutStore } from './LayoutStore';
import { resolve } from 'utils/promise';
import { BreakpointStore } from './BreakpointStore';
import { inject, injectable, postConstruct } from 'inversify';
import { RouterStore } from './RouterStore';
import { DocumentStore } from './DocumentStore';

const log = require('debug')('store')

@injectable()
export class RootStore {
    @inject(Symbols.Api) api: Api
    @inject(Symbols.LayoutStore) layout: LayoutStore
    @inject(Symbols.BreakpointStore) breakpoints: BreakpointStore
    @inject(Symbols.RouterStore) router: RouterStore
    @inject(Symbols.DocumentStore) doc: DocumentStore

    @observable projects: ProjectsConfig
    @observable config: ApplicationConfig;
    @observable project: Project;
    @observable revision: Revision;
    @observable document: Document;
    @observable fetchLoading: boolean    = false
    @observable projectLoading: boolean  = false
    @observable revisionLoading: boolean = false
    @observable documentLoading: boolean = true

    @postConstruct()
    protected constructed() {
        this.breakpoints.update();
        let title = this.layout.header.title;
    }

    @action
    async fetch(refetch: boolean = false): Promise<Index> {
        if ( this.projects && this.layout && this.config ) {
            return resolve({
                config  : this.config,
                projects: this.projects,
                layout  : this.layout
            })
        }
        this.fetchLoading = true;
        let index         = await this.api.getIndex([ 'layout', 'app', 'projects' ])
        this.config       = index.app
        this.projects     = index.projects
        this.layout.set(index.layout);
        log('fetch', { index })
        this.fetchLoading = false;
        return resolve(index);
    }

    @action
    async setProject(key: string, setDefaultRevision: boolean = false): Promise<Project> {
        if ( this.project && this.project.key === key ) {
            return resolve(this.project)
        }
        this.projectLoading = true;
        let project         = await this.api.getProject(key);
        this.project        = project;
        log('setProject', { project })
        if ( setDefaultRevision ) {
            await this.setRevision(project.default_revision, true);
        }
        this.projectLoading = false;
        return resolve(project)
    }

    @action
    async setRevision(key: string, setDefaultDocument: boolean = false): Promise<Revision> {
        if ( this.revision && this.revision.project === this.project.key && this.revision.key === key ) {
            return resolve(this.revision)
        }
        this.revisionLoading = true;
        let revision         = await this.api.getRevision(this.project.key, key);
        this.revision        = revision;
        log('setRevision', { revision })
        if ( setDefaultDocument ) {
            await this.setDocument(revision.default_document);
        }
        this.revisionLoading = false;
        return resolve(revision)
    }

    @action
    async setDocument(path: string, render: boolean = false): Promise<Document> {
        this.documentLoading = true;
        path                 = render ? path + '?render' : path
        let document         = await                this.api.getDocument(this.project.key, this.revision.key, path);
        transaction(() => {
            this.document = document;
            this.layout.set(document.layout);
            log('setDocument', { document })
            this.documentLoading = false;
        })
        return resolve(document)
    }

    toJS() {
        let js: any = {};
        [ 'projects', 'config', 'project', 'revision', 'document' ].forEach(observable => js[ observable ] = toJS(this[ observable ]))
        js.layout = this.layout.toJS();
        return js;
    }
}