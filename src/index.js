import { assign, mapActions, select } from './utils';

function noop() {}

export function Provider(store) {
  return appObject => {
    return assign(appObject, {
      $store: store
    });
  };
}

export function connect(mapStateToData, actions) {
  if (typeof mapStateToData !== 'function') {
    mapStateToData = select(mapStateToData || []);
  }
  const store = getApp().$store;
  return pageObject => {
    const onLoad = pageObject.onLoad || noop;
    const onUnload = pageObject.onUnload || noop;

    let data = mapStateToData(
      store ? store.getState() : {},
      pageObject.data || {}
    );

    let boundActions = actions ? mapActions(actions, store) : { store };
    function update(instance) {
      let mapped = mapStateToData(store ? store.getState() : {}, instance.data);
      for (let i in mapped)
        if (mapped[i] !== data[i]) {
          data = mapped;
          return instance.setData(data);
        }
      for (let i in data)
        if (!(i in mapped)) {
          data = mapped;
          return instance.setData(data);
        }
    }

    return assign(
      pageObject,
      assign(assign({}, boundActions), {
        data: assign(pageObject.data, data),
        onLoad: function(options) {
          if (typeof this.unsubscribe !== 'function') {
            this.unsubscribe = store.subscribe(() => {
              update(this);
            });
          }
          onLoad.call(this, options);
        },
        onUnload: function() {
          onUnload.call(this);
          if (typeof this.unsubscribe === 'function') {
            this.unsubscribe();
          }
        }
      })
    );
  };
}
