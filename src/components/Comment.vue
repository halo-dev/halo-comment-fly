<template>
  <div
    :class="mergedConfigs.darkMode ? 'halo-comment dark-mode': 'halo-comment'"
    id="halo-comment"
  >

    <comment-editor
      :targetId="id"
      :target="target"
      :options="options"
      :configs="mergedConfigs"
    />

    <div
      class="comment-load-button"
      v-if="!mergedConfigs.autoLoad && !loaded"
    >
      <a
        class="button-load"
        href="javascript:void(0)"
        rel="nofollow noopener"
        @click="loadComments"
      >加载评论</a>
    </div>

    <comment-loading
      v-show="commentLoading"
      :configs="typeof configs === 'string' ? JSON.parse(configs) : configs"
    />

    <ol
      class="comment-nodes"
      v-if="comments.length>=1"
    >
      <template v-for="(comment, index) in comments">
        <CommentNode
          :targetId="id"
          :target="target"
          :comment="comment"
          :options="options"
          :configs="mergedConfigs"
          :key="index"
        />
      </template>
    </ol>

    <div
      v-if="loaded && !commentLoading && comments.length<=0"
      class="comment-empty"
    >暂无评论</div>

    <div
      v-if="pagination.pages>1"
      class="comment-page"
    >
      <pagination
        :page="pagination.page"
        :size="pagination.size"
        :total="pagination.total"
        @change="handlePaginationChange"
      />
    </div>
  </div>
</template>
<script>
import "./index";
import commentApi from "../api/comment";
import optionApi from "../api/option";
export default {
  name: "Comment",
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    type: {
      type: String,
      required: false,
      default: "post",
      validator: function(value) {
        return ["post", "sheet", "journal"].indexOf(value) !== -1;
      }
    },
    configs: {
      type: Object,
      required: false,
      default: () => ({
        // auto load comment,default true
        autoLoad: true,
        showUserAgent: true,
        gravatarSource: "//cdn.v2ex.com/gravatar",
        loadingStyle: "default",
        darkMode: false
      })
    },
  },
  data() {
    return {
      comments: [],
      pagination: {
        pages: 0,
        page: 0,
        sort: "",
        size: 5,
        total: 0
      },
      commentLoading: false,
      loaded: false,
      repliedSuccess: null,
      replyingComment: null,
      options: {
        comment_gravatar_default: "mm"
      }
    };
  },
  computed: {
    target() {
      // pluralize it
      return `${this.type}s`;
    },
    mergedConfigs() {
      let propConfigs = this.configs;
      if (typeof this.configs === 'string') {
        propConfigs = JSON.parse(this.configs);
      }
      return Object.assign(
              {
                autoLoad: true,
                showUserAgent: true,
                gravatarSource: "//cdn.v2ex.com/gravatar",
                loadingStyle: "default",
                darkMode: false
              },
              propConfigs
      );
    }
  },
  created() {
    if (this.mergedConfigs.autoLoad) {
      this.loadComments();
    }
    this.loadOptions();
  },
  methods: {
    loadComments() {
      this.comments = [];
      this.commentLoading = true;
      commentApi
        .listComments(this.target, this.id, "tree_view", this.pagination)
        .then(response => {
          this.comments = response.data.data.content;
          this.pagination.size = response.data.data.rpp;
          this.pagination.total = response.data.data.total;
          this.pagination.pages = response.data.data.pages;
        })
        .finally(() => {
          this.commentLoading = false;
          this.loaded = true;
        });
    },
    loadOptions() {
      optionApi.list().then(response => {
        this.options = response.data.data;
      });
    },
    handlePaginationChange(page) {
      this.pagination.page = page;
      this.loadComments();
    }
  }
};
</script>
<style lang="scss">
$color: #898c7b;
@import "../styles/global";
@import "../styles/github-markdown";
</style>
