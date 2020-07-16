<h1 align="center"><a href="https://github.com/halo-dev" target="_blank">halo-comment-fly</a></h1>



> 适用于 Halo 的评论组件。

![npm](https://img.shields.io/npm/v/halo-comment-normal?style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/halo-comment-normal/badge)](https://www.jsdelivr.com/package/npm/halo-comment-normal)


### 插件预览

![评论插件](https://cdn.jsdelivr.net/gh/hshanx/static@master/uPic/FRc3Um.png)

### 使用指南

1. 进入后台 -> 系统 -> 博客设置 -> 评论设置

2. 将 `评论模块 JS` 修改为：`https://cdn.jsdelivr.net/gh/hshanx/halo-comment-hshan@latest/dist/halo-comment.min.js`


### 主题开发引用指南

#### 方法一

新建 comment.ftl：

```html
<#macro comment target,type>
    <#if !post.disallowComment!false>
        <script src="//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
        <script src="${options.comment_internal_plugin_js!'//cdn.jsdelivr.net/npm/halo-comment-normal@1.1.1/dist/halo-comment.min.js'}"></script>
        <script>
        var configs = {
            autoLoad: true,
            showUserAgent: true
        }
        </script>
        <halo-comment id="${target.id?c}" type="${type}" :configs="configs"/>
    </#if>
</#macro>
```

然后在 post.ftl/sheet.ftl 中引用：

post.ftl：

```html
<#include "comment.ftl">
<@comment target=post type="post" />
```

sheet.ftl：

```html
<#include "comment.ftl">
<@comment target=sheet type="sheet" />
```

#### 方法二

一般在主题制作过程中，我们可以将 head 部分抽出来作为宏模板，如：<https://github.com/halo-dev/halo-theme-anatole/blob/master/module/macro.ftl>，那么我们就可以将所需要的依赖放在 head 标签中：

```html
<head>
    ...
    
    <#if is_post?? && is_sheet??>
        <script src="//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
        <script src="${options.comment_internal_plugin_js!'//cdn.jsdelivr.net/npm/halo-comment-normal@1.1.1/dist/halo-comment.min.js'}"></script>
        <script>
        var configs = {
            autoLoad: true,
            showUserAgent: true
        }
        </script>
    </#if>
    
    ...
</head>
```

然后在 post.ftl/sheet.ftl 中引用：

post.ftl：

```html
<#if !post.disallowComment!false>
    <halo-comment id="${post.id?c}" type="post" :configs="configs"/>
</#if>
```

sheet.ftl：

```html
<#if !sheet.disallowComment!false>
    <halo-comment id="${sheet.id?c}" type="sheet" :configs="configs"/>
</#if>
```

#### 进阶：

可以将 configs 中的属性通过 settings.yaml 保存数据库中，以供用户自行选择，如：

settings.yaml：

```yaml
...

comment:
  label: 评论设置
  items:
    autoLoad:
      name: autoLoad
      label: 自动加载评论
      type: radio
      data-type: bool
      default: true
      options:
        - value: true
          label: 开启
        - value: false
          label: 关闭
    showUserAgent:
      name: showUserAgent
      label: 评论者 UA 信息
      type: radio
      data-type: bool
      default: true
      options:
        - value: true
          label: 显示
        - value: false
          label: 隐藏

...
```

那么我们需要将上面的 script 改为下面这种写法：

```javascript
<script>
var configs = {
    autoLoad: ${settings.autoLoad!},
    showUserAgent: ${settings.showUserAgent!}
}
</script>
```

#### 说明

1. configs 可以不用配置。
2. 具体主题开发文档请参考：<https://halo.run/develop/theme/ready.html>。

