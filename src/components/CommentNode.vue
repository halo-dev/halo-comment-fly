<template>
  <li
      :id="'li-comment-'+comment.id"
      class="comment"
      :class="isChild?'':'index-1'"
      itemtype="http://schema.org/Comment"
      itemprop="comment"
  >
    <div
        :id="'comment-'+comment.id"
        class="comment-body"
    >
      <div class="comment-avatar">
        <a
            :href="comment.authorUrl"
            rel="nofollow"
            target="_blank"
        ><img
            :alt="comment.author+`'s avatar`"
            :src="avatar"
            class="avatar"
        >
        </a>
      </div>
      <div class="contain-main">
        <div class="comment-meta">
          <div
              class="comment-author"
              itemprop="author"
          >
            <a
                :href="comment.authorUrl"
                rel="nofollow"
                target="_blank"
                class="author-name"
            >{{ comment.author }}</a>
            <span v-if="comment.isAdmin" class="author-admin">博主</span>
            <span
                v-if="comment.parentAuthor"
                class="author-reply"
            >
                <svg :fill="mergedConfigs.darkMode? 'rgba(255,255,255, .6)':'rgba(107, 114, 128, 1)'" t="1648819506796" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3950" width="10" height="10"><path d="M951.52 493.952l-384-419.424c-8.96-9.696-22.944-12.928-35.2-8.096C520.064 71.232 512 83.072 512 96.224l0 224.896c-149.28 9.44-272.768 85.664-358.592 221.824-68 107.936-88.064 214.688-88.896 219.2-2.464 13.408 3.904 26.912 15.776 33.6 11.872 6.72 26.72 5.152 36.96-3.904C118.848 790.368 274.24 655.264 512 643.84l0 283.904c0 13.152 8.032 24.96 20.288 29.792 3.808 1.504 7.776 2.208 11.712 2.208 8.704 0 17.248-3.552 23.392-10.176l384-412.096C962.816 525.248 962.88 506.272 951.52 493.952z" p-id="3951"></path></svg>
              <span v-html="compileParentAuthor" class="reply-author"></span>
            </span>

            <time
                class="comment-time"
                itemprop="datePublished"
                :datetime="comment.createTime"
            > • {{ this.timeAgo(comment.createTime) }}
            </time>
            <span
                class="comment-reply"
                style="cursor: pointer;"
                :style="editing?'display:block;':''"
                @click="handleReplyClick"
            >{{ editing ? '取消回复' : '回复' }}
            </span>
          </div>
        </div>
        <div
            class="comment-content markdown-body"
            itemprop="description"
            v-html="compileContent"
        >
        </div>

      </div>
    </div>
    <comment-editor
        v-if="editing"
        :targetId="targetId"
        :target="target"
        :replyComment="comment"
        :options="options"
        :configs="configs"
    />
    <ol
        v-if="comment.children"
        class="children"
    >
      <template v-for="(children, index) in comment.children">
        <CommentNode
            :isChild="true"
            :targetId="targetId"
            :target="target"
            :comment="children"
            :options="options"
            :configs="configs"
            :key="index"
        />
      </template>
    </ol>
  </li>
</template>
<script>
import "./index";
import {timeAgo, decodeHTML} from "@/utils/util";
import ua from "ua-parser-js";
import marked from "marked";

export default {
  name: "CommentNode",
  props: {
    isChild: {
      type: Boolean,
      required: false,
      default: false
    },
    targetId: {
      type: Number,
      required: false,
      default: 0
    },
    target: {
      type: String,
      required: false,
      default: "posts",
      validator: function (value) {
        return ["posts", "sheets", "journals"].indexOf(value) !== -1;
      }
    },
    comment: {
      type: Object,
      required: false,
      default: () => {
      }
    },
    options: {
      type: Object,
      required: false,
      default: () => {
      }
    },
    configs: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false
    };
  },
  computed: {
    avatar() {
      return (
          this.configs.gravatarSource +
          `/${this.comment.gravatarMd5}?s=256&d=` +
          this.options.comment_gravatar_default
      );
    },
    compileParentAuthor() {
      var at = this.comment.parentAuthor;
      if (this.comment.parentId !== null && this.comment.parentId > 0) {
        at =
            '<a href="#comment-' +
            this.comment.parentId +
            '">' + this.comment.parentAuthor +
            "</a>";

      }
      return at;
    },
    compileContent() {
      return marked(decodeHTML(this.comment.content));
    },
    createTimeAgo() {
      return timeAgo(this.comment.createTime);
    },
    compileUserAgent() {
      var parser = new ua();
      parser.setUA(this.comment.userAgent);
      var result = parser.getResult();
      return (
          result.browser.name +
          " " +
          result.browser.version +
          " in " +
          result.os.name +
          " " +
          result.os.version
      );
    }
  },
  methods: {
    handleReplyClick() {
      this.editing = !this.editing;
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
    },
    timeAgo(dateTimeStamp) {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
      const minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      // const halfamonth = day * 15;
      const month = day * 30;
      const now = new Date().getTime();   //获取当前时间毫秒
      const diffValue = now - dateTimeStamp;//时间差

      if (diffValue < 0) {
        return;
      }
      const minC = diffValue / minute;  //计算时间差的分，时，天，周，月
      const hourC = diffValue / hour;
      const dayC = diffValue / day;
      const weekC = diffValue / week;
      const monthC = diffValue / month;
      let result;
      if (monthC >= 1 && monthC <= 3) {
        result = " " + parseInt(monthC) + "月前";
      } else if (weekC >= 1 && weekC <= 4) {
        if (weekC > 4) {
          result = " " + Math.floor(weekC) + "周前";
        } else {
          result = " " + parseInt(weekC) + "周前";
        }
      } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + "天前";
      } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + "小时前";
      } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + "分钟前";
      } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
      } else {
        var datetime = new Date();
        datetime.setTime(dateTimeStamp);
        var Nyear = datetime.getFullYear();
        var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "/" + Nmonth + "/" + Ndate + " " + Nhour + ":" + Nminute + ":" + Nsecond;
      }
      return result;
    },

  }
};
</script>