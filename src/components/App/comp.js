import GraphEditor from "../GraphEditor/comp.vue";
import Global from "src/global";

export default {
  name: "app",
  components: {
    GraphEditor
  },
  data() {
    return {
      fade: true
    };
  },
  mounted() {
    Global.pulse = this.pulse;
  },
  methods: {
    pulse() {
      this.fade = false;
      setTimeout(() => {
        this.fade = true;
      }, 10);
    }
  }
};
