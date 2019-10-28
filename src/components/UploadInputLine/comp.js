const debounce = require("debounce");
const axios = require("axios");
const config = require("src/config");

const jobCounts = [
  {
    value: "auto",
    text: "Job Count: Auto"
  },
  {
    value: "single",
    text: "Job Count: Single"
  },
  {
    value: "multiple",
    text: "Job Count: Multiple"
  }
];

export default {
  methods: {
    update: debounce(function(value) {
      this.fileType = value;
    }, config.debounceDefault),
    updateUpload(isFinished) {
      return axios.post(config.api_uri + "/my_upload/", {
        file_type: this.fileType,
        job_count: this.selectedJobCount.value,
        is_finished: isFinished || false
      });
    },
    finishUpload() {
      this.updateUpload(true).then(() => {
        window.location.reload();
      });
    }
  },
  mounted() {
    axios.get(config.api_uri + "/my_upload/").then(response => {
      this.fileType = response.data.file_type;
      this.selectedJobCount = jobCounts.filter(
        v => v.value == response.data.job_count
      )[0];
    });
  },
  data() {
    return {
      files: [
        {
          name: "loading …"
        }
      ],
      fileType: null,
      jobCounts,
      selectedJobCount: null
    };
  },
  watch: {
    fileType(newVal, oldVal) {
      if (oldVal !== null && oldVal !== newVal) this.updateUpload();
    },
    selectedJobCount(newVal, oldVal) {
      if (oldVal !== null && oldVal.value !== newVal.value) this.updateUpload();
    }
  }
};
