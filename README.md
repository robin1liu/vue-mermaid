# vue-mermaid

> flowchart of mermaid with vue componet

## Requirements

- [Vue.js](https://github.com/vuejs/vue)
- [mermaid](https://github.com/knsv/mermaid)

## Install Setup

``` bash
# install dependencies
npm install --save vue-mermaid

```

## Usage

### Register component

```js
import VueMermaid from 'vue-mermaid'
Vue.use(VueMermaid)
```

### Use component

```js
export default {
  data:function(){
    return {
      data:[
        {id:'1',text:'A',link:'---',next:['2'],editable:true},
        {id:'2',text:'B',edgeType:'circle',next:['3']},
        {id:'3',text:'C',next:['4','6']},
        {id:'4',text:'D',link:'-- This is the text ---',next:['5']},
        {id:'5',text:'E'},
        {id:'6',text:'F'}
      ]
    }
  },
  methods:{
    editNode(nodeId) {
     alert(nodeId);
    },
  }
}
```
#### Possible edgeType values:
![edge.default](./img/edge_types.png)


### Template

```vue
<template>
  <vue-mermaid :nodes="data" type="graph LR" @nodeClick="editNode"></vue-mermaid>
</template>
```

### Result

![Flowchart](./img/flow.png)

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
```
