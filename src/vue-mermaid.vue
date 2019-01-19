<template>
  <div id='mermaid' class="mermaid">
    {{code}}
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
    config: {
      type: Object,
      default() {
        return { theme: "default", startOnLoad: false };
      }
    }
  },
  data: function() {
    return {
      mermaidNode: [],
      code: '',
      nodeObject:{},
      edges:[
        {type: 'default', open: '[', close: ']'},
        {type: 'round', open: '(', close: ')'},
        {type: 'circle', open: '((', close: '))'},
        {type: 'asymetric', open: '>', close: ']'},
        {type: 'rhombus', open: '{', close: '}'}
      ]
    };
  },
  mounted() {
    this.init();
    if (Array.isArray(this.nodes)) {
      this.mermaidNode = this.nodes;
      this.parseCode();
      this.load();
    }
  },
  methods: {
    parseCode() {
      const arrayToObject = (arr, keyField) =>
        Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));
      this.nodeObject = arrayToObject(this.mermaidNode, "id");
      const parseCode = this.type + '\n';
      this.code = parseCode + this.mermaidNode.map(item => {
        const eventTml = `click ${item.id} clickTest`;
        if (item.next && item.next.length > 0) {
          return item.next.map(n => {
            const next = this.nodeObject[n];
            if (next != null && typeof next != "undefined") {
                return `${this.buildNode(item)}${this.buildLink(item)}${this.buildNode(next)}`
            } else {
              //TODO error
              return `${this.buildNode(item)}`;
            }
          }).join('\n');
          
        } else {
            return `${this.buildNode(item)}
                    click ${item.id} clickTest
                    `;
        }
      }).join('\n');
    },
    buildNode(item){
      let edge = !item.edgeType ? this.edges.find(e => {return e.type === 'default'}) : this.edges.find(e => {return e.type === item.edgeType});
      return `${item.id}${edge.open}${item.text}${edge.close}`
    },
    buildLink(item){
      return item.link ? item.link : '-->';
    },
    setNodes(data) {
      if (data === null || typeof data === "undefined") return;
      if (Array.isArray(data)) {
        this.mermaidNode = data;
        return;
      }
    },
    init() {
      const _t = this;
      window.clickTest = function (id) {
        _t.edit(id);
      }
      mermaid.initialize(_t.config);
    },
    load() {
      var container = document.getElementById("mermaid");
      container.removeAttribute("data-processed");
      container.replaceChild(document.createTextNode(this.code), container.firstChild);
      mermaid.init(undefined, container);
    },
    edit(id){
      console.log(this.nodeObject[id]);
      this.$emit('nodeClick', this.nodeObject[id])
    }
  }
};
</script>

<style>
</style>
