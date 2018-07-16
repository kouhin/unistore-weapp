# unistore-weapp

用于微信小程序的 [unistore](https://github.com/developit/unistore) 绑定

## 安装

方法1: 通过npm或yarn

```shell
npm install unistore-weapp
```

请自行搜索如何在小程序中使用npm.

方法2: Clone这个库，并编译

``` shell
git clone https://github.com/kouhin/unistore-weapp.git
npm install
npm run build
```

可以直接在程序中使用 `/dist/unistore-weapp.js` (CMD) 或 `/dist/unistore-weapp.es.js` (ES module).

## 使用方法

1. 绑定`store`到`App`

``` js
import createStore from './libs/unistore';
import { Provider } from './libs/unistore-weapp';

const store = createStore();

App(Provider(store)({
  onLaunch: function() {
    // ...
  }
}));
```

之后在程序中可以随时通过 `getApp().$store` 来访问store.

2. 在页面上使用connect

``` js
import { connect } from './libs/unistore-app';

const mapStateToData = (state, data) => {
};

const actions = (store) => ({
  increment(state) {
    return { count: state.count+1 }
  },
  incrementAndLog: ({ count }, event) => {
    console.info(event)
    return { count: count+1 }
  },
  async getStuff(state) {
    let res = await fetch('/foo.json')
    return { stuff: await res.json() }
  },
  incrementAsync(state) {
    setTimeout( () => {
      store.setState({ count: state.count+1 })
    }, 100)
  }
});

Page(connect(mapStateToData, actions)({
  data: {
  },
  actions: { // 定义在这里的action将覆盖传入connect的同名action
  },
  doIncreament() {
    this.actions.increment();
  }
}));
```

## LICENSE

MIT
