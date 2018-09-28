import VueMermaid from './vue-mermaid.vue'

function install(Vue){
  Vue.component("vue-mermaid", VueMermaid);
}

export default {
  install
}