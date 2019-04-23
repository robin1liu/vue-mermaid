<template>
  <div id="mermaid" class="mermaid">{{parseCode}}</div>
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
  data: function() {
    return {
      edges: [
        { type: "default", open: "[", close: "]" },
        { type: "round", open: "(", close: ")" },
        { type: "circle", open: "((", close: "))" },
        { type: "asymetric", open: ">", close: "]" },
        { type: "rhombus", open: "{", close: "}" }
      ]
    };
  },
  mounted() {
    this.init();
    this.loadNodes();
  },
  computed: {
    nodeObject() {
      const { nodes } = this;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const arrayToObject = (arr, keyField) =>
          Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));
        return arrayToObject(nodes, "id");
      } else {
        return {};
      }
    },
    parseCode() {
      const { nodes, styles } = this;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const parseCode = this.type + "\n";
        const code =
          parseCode +
          nodes
            .map(item => {
              if (item.next && item.next.length > 0) {
                return item.next
                  .map(n => {
                    const next = this.nodeObject[n] || this.nodeObject[n.id];
                    if (next != null && typeof next != "undefined") {
                      return `${this.buildNode(item)}${this.buildLink(
                        item
                      )}${this.buildNode(next)}`;
                    } else {
                      //TODO error
                      return `${this.buildNode(item)}`;
                    }
                  })
                  .join("\n");
              } else {
                return `${this.buildNode(item)}
                    click ${item.id} clickTest
                    `;
              }
            })
            .join("\n") +
          "\n" +
          styles.join(" \n") +
          "\n" +
          nodes
            .filter(item => item.editable)
            .map(item => {
              return `click ${item.id} mermaidClick "edit"`;
            })
            .join("\n");
        this.load(code);
        return code;
      } else {
        return "";
      }
    }
  },
  methods: {
    buildNode(item) {
      let edge = !item.edgeType
        ? this.edges.find(e => {
            return e.type === "default";
          })
        : this.edges.find(e => {
            return e.type === item.edgeType;
          });
      return `${item.id}${edge.open}${item.text}${edge.close}`;
    },
    buildLink(item) {
      return item.link ? item.link : "-->";
    },
    loadNodes() {
      this.load(this.parseCode);
    },
    init() {
      const _t = this;
      window.mermaidClick = function(id) {
        _t.edit(id);
      };
      mermaid.initialize(this.config);
    },
    load(code) {
      if (code) {
        var container = document.getElementById("mermaid");
        if (container) {
          container.removeAttribute("data-processed");
          container.replaceChild(
            document.createTextNode(code),
            container.firstChild
          );
          mermaid.init(code, container);
        }
      }
    },
    edit(id) {
      this.$emit("nodeClick", id);
    }
  }
};
</script>

<style>
</style>