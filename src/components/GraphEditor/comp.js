import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import DockPlugin from "rete-dock-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import CustomNodeComponent from "./CustomComponents/node.vue";

class CustomSocket extends Rete.Socket {
  constructor(name) {
    super(name);
  }
  compatibleWith() {
    return true;
  }
}

export default {
  data() {
    return {
      editor: null,
      classes: Array(),
      sockets: {},
      engine: null,
      types: []
    };
  },
  methods: {
    updateDataNode(node) {
      let inOutputs;
      if (node.outputs["o/1"]) {
        inOutputs = node.outputs["o/1"].connections;
      } else {
        inOutputs = node.inputs["i/1"].connections;
      }

      node = this.editor.nodes.filter(n => n.id == node.id)[0];
      node.connected = inOutputs.length || false;
      if (node.connected) {
        let connection = inOutputs[0];
        let other = this.editor.nodes.filter(n => n.id == connection.node)[0];

        let socket = connection.input || connection.output;
        socket = other.inputs.get(socket) || other.outputs.get(socket);

        node.dropdown.updateList(this.types, socket.name, this.editor);
      } else {
        node.dropdown.clearList();
      }
    },
    createDataNodes() {
      let updateDataNode = this.updateDataNode;
      let inputSocket = new CustomSocket("input");
      let outputSocket = new CustomSocket("output");
      this.classes.push(
        class extends Rete.Component {
          constructor() {
            super("from_data");
          }

          builder(node) {
            let out = new Rete.Output("o/1", "-", inputSocket);

            node.addOutput(out);
            node.data.type = node.data.type || null;
            node.data.displayName = "Input";
            node.data.data_name = node.data.data_name || null;
            node.isDataNode = true;
          }

          worker(node) {
            updateDataNode(node);
          }
        }
      );
      this.classes.push(
        class extends Rete.Component {
          constructor() {
            super("to_data");
          }

          builder(node) {
            let inp = new Rete.Input("i/" + 1, "-", outputSocket);

            node.addInput(inp);
            node.data.type = node.data.type || null;
            node.data.displayName = "Output";
            node.data.data_name = node.data.data_name || null;
            node.isDataNode = true;
          }

          worker(node) {
            updateDataNode(node);
          }
        }
      );
    }
  },
  mounted() {
    this.editor = new Rete.NodeEditor(
      "demo@0.1.0",
      document.querySelector(".rete-editor .node-editor")
    );
    this.engine = new Rete.Engine("demo@0.1.0");

    const renderOptions = {
      component: CustomNodeComponent
    };
    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin, renderOptions);
    this.editor.use(DockPlugin, {
      container: document.querySelector(".rete-editor .dock"),
      plugins: [[VueRenderPlugin, renderOptions]]
    });
    this.editor.use(ContextMenuPlugin, {
      allocate() {
        return null;
      },
      searchBar: false, // true by default
      delay: 200,
      items: {},
      nodeItems: {
        Delete: true, // Enable delete
        Clone: false // Disable clone
      }
    });
    this.createDataNodes();

    this.classes.forEach(SomeClass => {
      const component = new SomeClass();
      this.engine.register(component);
      this.editor.register(component);
    });
    this.editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await this.engine.abort();
        await this.engine.process(this.editor.toJSON());
      }
    );
  }
};
