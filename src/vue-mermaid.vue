<template>
  <div id='mermaid' class="mermaid">
    {{parseCode}}
  </div>
</template>

<script>

import mermaid from "mermaid";
export default {
  name: "VueMermaid",
  props: {
    type: {
      type: String,
      default: "graph TD"
    },
    nodes: {
      type: Array,
      required: true
    },
    styles: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return { theme: "default", startOnLoad: false };
      }
    }
  },
  mounted() {
    this.init();
    this.loadNodes();
  },
  computed:{
    parseCode(){
      const {nodes, styles} = this;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const arrayToObject = (arr, keyField) =>
        Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));
      const nodeObject = arrayToObject(nodes, "id");
      const parseCode = this.type + '\n';
      const code = parseCode + nodes.map(item => {
        if (item.next && item.next.length > 0) {
          return item.next.map(n => {
            const next = nodeObject[n] || nodeObject[n.id];
            if (next != null && typeof next != "undefined") {
              const link = n.link? '|'+n.link+'|':'';
              return `${item.id}(${item.text})-->${link}${next.id}(${next.text})`;
            } else {
              //TODO error
              return `${item.id}(${item.text})`;
            }
          }).join('\n');
          
        } else {
            return `${item.id}(${item.text})`;
        }
      }).join('\n')
      + '\n'
      + styles.join(' \n')
      + '\n'
      +nodes.filter(item => item.editable).map(item => {
        return `click ${item.id} mermaidClick "edit"`;
      }).join('\n');
      this.load(code);
      return code;
      } else {
        return '';
      }
    }
  },
  methods: {
    loadNodes() {
     this.load(this.parseCode);
    },
    init() {
      const _t = this;
      window.mermaidClick = function (id) {
        _t.edit(id);
      }
      mermaid.initialize(this.config);
    },
    load(code) {
      if(code) {
        var container = document.getElementById("mermaid");
        container.removeAttribute("data-processed");
        container.replaceChild(document.createTextNode(code), container.firstChild);
        mermaid.init(code, container);
      }
    },
    edit(id){
      this.$emit('nodeClick', id)
    }
  }
};
</script>

<style>
</style>