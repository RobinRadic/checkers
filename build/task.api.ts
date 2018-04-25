import * as js from 'json-server'
import { resolve } from 'path';
import { Application, Router } from 'express'
import * as f from 'faker'
import * as _ from 'lodash';
import { Dictionary, Revision } from '../src/logic/api';
import { FONTAWESOME_ICONS, FontAwesomeIcon, MATERIAL_COLORS, MaterialColorName } from './constants'
import * as Chance from 'chance';

const chance = new Chance()
const server = (cb?: any) => {
    const PORT     = 34564
    const HOSTNAME = 'localhost'

    const app: Application = js.create()
    const router: Router   = js.router(resolve(__dirname, 'api.db.json'));
    const middlewares      = js.defaults();

    app.use(middlewares);
// To handle POST, PUT and PATCH you need to use a body-parser
    app.use(js.bodyParser)
    app.use((req, res, next) => {
        if ( req.method === 'POST' ) req.body.createdAt = Date.now()
        next()
    })

    let { data } = require('./mocks/update-api-db-json');

    data.forEach(mock => {
        app.get(`/api/v1${mock.url}`, (req, res) => {
            res.json(mock.data);
        })
    })


    app.use(router);
    let server = app.listen(PORT, HOSTNAME, () => {
        console.log('running on http://localhost:34564')
    })

    cb({ server, app })
}

export default server


export namespace Generators {
    function getApiResponse(query: string): object {
        let fileName = `api/v1/${query}/json`.replace(/\//g, '.');
        let filePath = resolve(__dirname, 'mocks', fileName);
        return _.cloneDeep(require(filePath));
    }

    function getDataFile(query: string): object {
        let fileName = `_data.${query}.json`
        let filePath = resolve(__dirname, 'mocks', fileName);
        return _.cloneDeep(require(filePath));
    }

    export const Configuration = {
        author : {
            name : 'Robin Radic',
            email: 'rradic@hotmail.com',
            url  : 'https://robin.radic.nl'
        },
        license: 'MIT'
    }

    export interface GeneratorResult {
        [key: string]: any
    }

    export namespace Addon {

        export interface AddonOptions {

        }

        const defaultOptions: AddonOptions = {}

        export interface AddonGeneratorResult extends GeneratorResult {

        }

        export function generate(options: AddonOptions): AddonGeneratorResult {
            options                        = _.merge({}, defaultOptions, options)
            let menu: AddonGeneratorResult = {}
            return menu;
        }

    }

    export namespace Layout {

        export namespace Menu {

            export namespace Item {

                export interface ItemOptions {

                }

                const defaultOptions: ItemOptions = {}

                export interface ItemGeneratorResult extends GeneratorResult {

                }

                export function generate(options: ItemOptions): ItemGeneratorResult {
                    options                           = _.merge({}, defaultOptions, options)
                    let children: ItemGeneratorResult = {}
                    return children;
                }
            }

            export interface MenuOptions {

            }

            const defaultOptions: MenuOptions = {}

            export interface MenuGeneratorResult extends GeneratorResult {
                children: Item.ItemGeneratorResult[]
            }

            export function generate(options: MenuOptions): MenuGeneratorResult {
                options = _.merge({}, defaultOptions, options)

                let menu: MenuGeneratorResult = {
                    children: [
                        Item.generate({}),
                        Item.generate({}),
                        Item.generate({})
                    ]
                }
                return menu;
            }
        }

        export interface LayoutOptions {

        }

        const defaultOptions: LayoutOptions = {}

        export interface LayoutGeneratorResult extends GeneratorResult {
            menu: Menu.MenuGeneratorResult
        }

        export function generate(options: LayoutOptions): LayoutGeneratorResult {
            options                           = _.merge({}, defaultOptions, options)
            let layout: LayoutGeneratorResult = {
                menu: Menu.generate({})
            }
            return layout;

        }
    }

    export namespace Project {

        import LayoutGeneratorResult = Generators.Layout.LayoutGeneratorResult;
        import MetaGeneratorResult = Generators.Project.Meta.MetaGeneratorResult;

        export namespace Revision {

            export namespace Document {
                export interface DocumentOptions {

                }

                const defaultOptions: Partial<Document> = {}

                export interface DocumentGeneratorResult extends GeneratorResult {

                }

                export function generate(options: DocumentOptions): DocumentGeneratorResult {
                    options                               = _.merge({}, defaultOptions, options)
                    let document: DocumentGeneratorResult = {}
                    return document;
                }
            }

            export interface RevisionOptions {

            }

            const defaultOptions: Partial<Revision> = {}

            export interface RevisionGeneratorResult extends GeneratorResult {
                documents: Document.DocumentGeneratorResult[];
            }

            export function generate(options: RevisionOptions): RevisionGeneratorResult {
                options                               = _.merge({}, defaultOptions, options)
                let revision: RevisionGeneratorResult = {
                    documents: [
                        Document.generate({}),
                        Document.generate({}),
                        Document.generate({})
                    ]
                }
                return revision;
            }
        }

        export namespace Meta {
            export function getRandomColorName(): MaterialColorName {
                let names = Object.keys(MATERIAL_COLORS);
                let key   = Math.round(Math.random() * names.length);
                let name  = names[ key ];
                return name as any
            }

            export function getRandomColorValue(): string {
                return MATERIAL_COLORS[ getRandomColorName() ]
            }

            export function getRandomIcon(): FontAwesomeIcon {
                let icons = Object.keys(FONTAWESOME_ICONS);
                let key   = Math.round(Math.random() * icons.length);
                let icon  = icons[ key ]
                return icon as any
            }

            export interface MetaOptions {
                project?: ProjectGeneratorResult

                [key: string]: any

                author?: string
                authors?: string[] | Array<{ [key: string]: any }>
                license?: string
                icon?: FontAwesomeIcon
                color?: MaterialColorName
                links?: { [name: string]: any }
                stylesheets?: string[]
                javascripts?: string[]
                styles?: string[]
                scripts?: string[]

            }

            const defaultOptions: Partial<MetaOptions> = {
                icon       : null,
                color      : null,
                authors    : [],
                license    : 'MIT',
                links      : {
                    Git    : 'https:\/\/github.com\/codex-project',
                    Issues : 'https:\/\/github.com\/codex-project\/codex\/issues',
                    Package: 'https:\/\/packagist.com\/codex-project\/codex'
                },
                author     : 'Robin Radic',
                stylesheets: [],
                javascripts: [],
                styles     : [],
                scripts    : []
            }

            export interface MetaGeneratorResult extends GeneratorResult {

            }

            export function generate(options: MetaOptions = {}): MetaGeneratorResult {
                options                       = _.merge({}, defaultOptions, options);
                let trailingUrlSegment        = options.project ? options.project.package.replace('/', '-') : '<insert>';
                let projectUrlSegment         = `${options.author}/${trailingUrlSegment}`;
                let meta: MetaGeneratorResult = {
                    color      : getRandomColorName(),
                    icon       : getRandomIcon(),
                    license    : Configuration.license,
                    author     : Configuration.author,
                    links      : {
                        vcs    : `https://github.com/${projectUrlSegment}`,
                        issues : `https://github.com/${projectUrlSegment}/issues`,
                        package: `https://packagist.com/${projectUrlSegment}`
                    },
                    stylesheets: [],
                    javascripts: [],
                    styles     : [],
                    scripts    : []
                }
                Object.keys(options).forEach(key => {
                    meta[ key ] = options[ key ]
                })

                return meta;
            }
        }

        export interface ProjectOptions<T extends Dictionary<any>=any> {
            [key: string]: any

            overrides?: {
                vendor?: string
                title?: string
                default_revision?: string
                display_name?: string
                description?: string
            }
            use?: T
            generate?: {
                layout?: boolean
                processors?: boolean
                meta?: false | null | Generators.Project.Meta.MetaOptions
                addons?: boolean
                extras?: boolean
            }
        }

        const defaultOptions: ProjectOptions = {
            overrides: {},
            use      : {},
            generate : {
                layout    : false,
                processors: false,
                meta      : false,
                addons    : true,
                extras    : true
            }
        }

        export interface ProjectGeneratorResult extends GeneratorResult {
            key: string
            package: string
            display_name: string
            default_revision: string
            description: string
            disk: string
            processors?: any
            revisions: { [version: string]: string }
            view: string
            default_document?: string
            extensions?: string[]
            test?: boolean
            path?: string
            layout?: LayoutGeneratorResult
            meta?: MetaGeneratorResult
        }

        export function generate(options: ProjectOptions = {}): ProjectGeneratorResult {
            options              = _.merge({}, defaultOptions, options)
            let vendor           = f.commerce.product().toLocaleLowerCase();
            let title            = f.commerce.productName();
            let key              = _.kebabCase(title)
            let default_revision = 'master';

            let project: ProjectGeneratorResult = {
                key,
                package     : vendor + '/' + key,
                display_name: title,
                default_revision,
                description : f.lorem.words(10),
                disk        : f.database.type(),
                processors  : {},
                revisions   : {
                    [ default_revision ] : 'index',
                    'develop'            : 'index',
                    [ f.system.semver() ]: 'index',
                    [ f.system.semver() ]: 'index',
                    [ f.system.semver() ]: 'index',
                    [ f.system.semver() ]: 'index',
                    [ f.system.semver() ]: 'index',
                    [ f.system.semver() ]: 'index'
                },
                view        : vendor + '/' + key + '::views.default'
            };

            let full: any                                 = getApiResponse('projects/codex')
            let { layout, processors, meta, phpdoc, git } = full

            let addons = [ phpdoc, git ]
            let extras = {
                default_document: 'index',
                extensions      : [ 'md', 'markdown', 'html' ],
                test            : false,
                path            : f.system.filePath()
            }
            Object.keys(options.overrides).forEach(key => {
                project[ key ] = options.overrides[ key ]
            })
            const { generate } = options
            if ( generate.layout ) project.layout = layout
            if ( generate.processors ) project.processors = processors
            if ( generate.meta ) {
                project.meta = Meta.generate({
                    ...options.generate.meta || {},
                    project
                })
            }
            if ( generate.addons ) project.addons = addons
            if ( generate.extras ) project = { ...project, ...extras }

            return project;
        }
    }


    export class Director {
        static generations = {}

        static project(key, assembler: (director: Director.ProjectDirector) => void): Director.ProjectDirector {

            const project = new Director.ProjectDirector({})

            assembler(project);


            return project;
        }

        static addon() {

        }

        static layout() {

        }

    }

    export namespace Director {

        export class ProjectDirector {
            constructor(protected project: Generators.Project.ProjectOptions) {

            }

            addMeta(options) {

            }

            revision(key, assembler: (director: Director.RevisionDirector) => void): Director.RevisionDirector {
                const revision = new Director.RevisionDirector(this.project)
                return revision;
            }

            addRevision(options): Director.RevisionDirector {
                const revision = Director.revision(options.key, (director: Director.RevisionDirector) => {
                    director.addDocument({})
                    director.addDocument({})
                    director.addDocument({})
                    director.addDocument({})
                })
                return revision;
            }

            addPhpdoc(options) {

            }

            finalize() {

            }
        }

        export class Director {
            static revision(key, assembler: (director: Director.RevisionDirector) => void): Director.RevisionDirector {
                const revision = new Director.RevisionDirector({})
                assembler(revision);
                return revision;
            }
        }

        export namespace Director {

            export class RevisionDirector {
                constructor(protected project: Generators.Project.Revision.RevisionOptions) {

                }

                addDocument(options): Director.DocumentDirector {
                    return new Director.DocumentDirector(this);
                }
            }

            export class Director {
                static document(key, assembler: (director: Director.DocumentDirector) => void): Director.DocumentDirector {
                    const document = new Director.DocumentDirector({})
                    assembler(document);
                    return document;
                }
            }

            export namespace Director {

                export class DocumentDirector {
                    constructor(protected revision: Generators.Project.Revision.Document.DocumentOptions) {

                    }
                }

            }


        }
    }
}
Generators.Layout.Menu.generate({})
Generators.Layout.generate({})
Generators.Addon.generate({})
Generators.Project.Meta.generate({})

Generators.Project.generate({});
Generators.Project.Revision.generate({})
Generators.Project.Revision.Document.generate({})


Generators.Director.project('blade_extensions', (director) => {
    const revision = director.addRevision({})
    revision.addDocument({

    })
})

let project = Generators.Project.generate({
    generate: {
        layout: true, addons: true, extras: true, meta: {
            authors: [
                f.helpers.userCard(),
                f.helpers.userCard(),
                f.helpers.userCard()
            ]
        }
    }
})


console.log(project);
