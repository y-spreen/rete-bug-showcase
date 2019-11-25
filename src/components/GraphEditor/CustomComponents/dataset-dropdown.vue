<template>
  <div class="host" v-if="node" :class="{ output: !isInput }">
    <b-dropdown :disabled="!connected" :text="selectedType" variant="light">
      <b-dropdown-item
        v-for="type in typeOptions"
        :value="type"
        :key="type"
        @click="selectType(type)"
      >
        {{ type }}
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown
      v-if="connected && typeSelection && isInput"
      :disabled="!connected"
      :text="selectedName"
      variant="light"
      class="name"
    >
      <b-dropdown-item
        v-for="name in nameOptions"
        :value="name"
        :key="name"
        @click="selectName(name)"
      >
        {{ name }}
      </b-dropdown-item>
    </b-dropdown>

    <b-input
      v-if="connected && typeSelection && !isInput"
      :value="selectedName"
      placeholder="Select Dataset …"
      class="name"
      @input="nameChange"
    ></b-input>
  </div>
</template>

<script>
import Global from "src/global";

const mockTypes = ["mock1", "mock2"];
const mockNames = ["mock3", "mock4"];

export default {
  props: ["node"],
  data() {
    return {
      text: "Please connect",
      connected: false,
      typeOptions: [],
      nameOptions: [],
      typeSelection: null,
      nameSelection: null,
      editor: null
    };
  },
  watch: {
    node(v) {
      if (!v) return;
      v.dropdown = this;
      v.data.type && this.selectType(v.data.type);
      v.data.data_name && this.selectName(v.data.data_name);
    }
  },
  methods: {
    updateList(fileTypes, type, e) {
      this.editor = e;
      this.typeOptions = mockTypes;
      this.connected = true;
      this.rerender();
    },
    clearList() {
      this.connected = false;
      this.rerender();
    },
    selectName(name) {
      this.nameSelection = name;
      this.node.data.data_name = name;
    },
    selectType(type) {
      this.typeSelection = type;
      this.node.data.type = type;

      this.nameOptions = mockNames;
      const name = this.node.data.data_name;

      if (!this.isInput || mockNames.find(v => v == name)) {
        this.selectName(name);
      } else {
        this.nameSelection = null;
      }
      this.rerender();
    },
    rerender() {
      let node = this.node;
      console.log("rerender " + node.data.displayName);
      Global.pulse();

      setTimeout(() => {
        this.editor && this.editor.view.updateConnections({ node });
      }, 0); // <- this value doesnt change the bug. 0-1000 same thing.
    },
    nameChange(v) {
      this.selectName(v);
    }
  },
  computed: {
    selectedType() {
      if (!this.connected) return "Please connect";
      if (!this.typeSelection) return "Select type …";
      if (!this.typeOptions.length) return "Not available";

      return this.typeSelection;
    },
    selectedName() {
      if (!this.connected) return "";
      if (!this.nameSelection) return "";
      if (this.isInput && !this.nameOptions.length) return "Not available";

      return this.nameSelection;
    },
    isInput() {
      return this.node.name.startsWith("from");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$width: 160px;
.host {
  display: inline-block;
  margin: 0 1em;
  ::v-deep * {
    color: #495057 !important;
  }
  .dropdown {
    min-width: $width;
    ::v-deep * {
      text-align: right;
    }
    display: flex;
  }
  .name {
    margin: 5px 0 0;
  }
  &.output {
    ::v-deep * {
      text-align: left;
    }
  }
  input {
    width: $width;
  }
}
</style>
