/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */
// noinspection TypeScriptPreferShortImport
import { Client } from './client';
// noinspection TypeScriptPreferShortImport
import { Document, Index, Project, Revision } from './swagger'
import { AxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';
import { ApiRequestConfig } from 'interfaces';
import { resolve } from 'utils/promise';

const log = require('debug')('api')

@injectable()
export class Api {
    client: Client

    constructor() { log('constructor', this) }

    configure(options: ApiRequestConfig) {
        log('configure', { options })
        this.client.configure(options)
    }

    async getIndex(fetch: string[], config: AxiosRequestConfig = {}): Promise<Index> {
        config.params = { fetch }
        return await this.client.get('', config).then(res => resolve(res.data));
    }

    async getProjects(config: AxiosRequestConfig = {}): Promise<{ [key: string]: string; }> {
        return await this.client.get('/projects', config).then(res => resolve(res.data));
    }

    async getProject(project: string, config: AxiosRequestConfig = {}): Promise<Project> {
        return await this.client.get('/projects/' + project, config).then(res => resolve(res.data));
    }

    async getRevisions(project: string, config: AxiosRequestConfig = {}): Promise<string[]> {
        return await this.client.get(`/projects/${project}/revisions`, config).then(res => resolve(res.data));
    }

    async getRevision(project: string, revision: string, config: AxiosRequestConfig = {}): Promise<Revision> {
        return await this.client.get(`/projects/${project}/revisions/${revision}`, config).then(res => resolve(res.data));
    }

    async getDocuments(project: string, revision: string, config: AxiosRequestConfig = {}): Promise<string[]> {
        return await this.client.get(`/projects/${project}/revisions/${revision}/documents`, config).then(res => resolve(res.data));
    }

    async getDocument(project: string, revision: string, document: string, config: AxiosRequestConfig = {}): Promise<Document> {
        return await this.client.get(`/projects/${project}/revisions/${revision}/documents/${document}`, config).then(res => resolve(res.data));
    }


}
