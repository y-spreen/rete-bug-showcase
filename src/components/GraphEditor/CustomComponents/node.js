import mixin from "rete-vue-render-plugin/src/mixin";
import Socket from "./socket.vue";
import DatasetDropdown from "./dataset-dropdown.vue";

export default {
  mixins: [mixin],
  components: {
    Socket,
    DatasetDropdown
  },
  mounted() {
    if (!this.isDocked) {
      this.dataNode = this.node;
    }
  },
  data() {
    return {
      dataNode: null
    };
  },
  computed: {
    isDocked() {
      return Array(this.$el.parentElement.classList).find(v => v == "dock-item")
        ? true
        : false;
    }
  }
};
