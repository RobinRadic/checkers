
// TODO
import { Plugin, PluginFactory } from 'router5/core/plugins';

const defaultOptions = {};

export function mobxPlugin(routerStore, options = defaultOptions):PluginFactory {
  function plugin(router, dependencies) {
    // NOTE: cross-referencing objects
    router.setDependency('routerStore', routerStore);
    routerStore.setRouter(router);

    // Implemented methods
    return {
      onTransitionStart(toState, fromState) {
        routerStore.onTransitionStart(toState, fromState);
      },
      onTransitionSuccess(toState, fromState, opts) {
        routerStore.onTransitionSuccess(toState, fromState, opts);
      },
      onTransitionCancel(toState, fromState) {
        routerStore.onTransitionCancel(toState, fromState);
      },
      onTransitionError(toState, fromState, err) {
        routerStore.onTransitionError(toState, fromState, err);
      },
    };
  }

  plugin['pluginName'] = 'MOBX_PLUGIN';

  return plugin as any;
}
