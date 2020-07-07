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
                        <span
                                class="comment-reply"
                                style="cursor: pointer;"
                                :style="editing?'display:block;':''"
                                @click="handleReplyClick"
                        >{{ editing?'取消回复':'回复' }}</span>
                        <span
                                v-if="comment.isAdmin"
                                class="is-admin"
                        >
              <svg
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
              >
                <path
                        d="M512 0C229.248 0 0 229.248 0 512s229.248 512 512 512 512-229.248 512-512S794.752 0 512 0z m0 896c-212.032 0-384-171.968-384-384S299.968 128 512 128s384 171.968 384 384-171.968 384-384 384z m94.08-513.408L512 192.064l-94.016 190.528-210.304 30.592 152.192 148.288-35.968 209.344L512 672l188.032 98.88-35.904-209.344 152.128-148.288-210.176-30.656z"
                        p-id="6998"
                        fill="#1296db"
                ></path>
              </svg>
            </span>
                        <div
                                v-if="configs.showUserAgent"
                                class="useragent-info"
                        >{{ compileUserAgent }}
                        </div>
                    </div>
                    <time
                            class="comment-time"
                            itemprop="datePublished"
                            :datetime="comment.createTime"
                    >{{ createTimeAgo }}
                    </time>
                    <a
                            class="comment-id"
                            :href="'#comment-'+comment.id"
                    >{{ comment.id }}楼</a>
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
    import {timeAgo} from "@/utils/util";
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
            compileContent() {
                var at = "";
                if (this.comment.parentId !== null && this.comment.parentId > 0) {
                    at =
                        '<a href="#comment-' +
                        this.comment.parentId +
                        '">回复' + this.comment.parentId + '楼' +
                        "</a>";
                }
                return at +  marked(this.comment.content);
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
            }
        }
    };
</script>