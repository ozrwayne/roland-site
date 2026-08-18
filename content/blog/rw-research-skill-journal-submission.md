---
title: "RW Research Skill 更新：科研投稿也可以自动化了"
description: "文章介绍 RW Research Skill 新增的期刊投稿模块：按期刊要求组织主文、图表和作者资料，预检文件与编号，协助填写并复核投稿系统，同时保留作者对最终提交和学术声明的责任。"
slug: "rw-research-skill-更新：科研投稿也可以自动化了"
lang: zh
pubDate: 2026-08-06T02:12:52+08:00
siteDate: 2026-08-06T02:12:52+08:00
sourceUrl: "https://cms.rolandwayne.com/rw-research-skill-%e6%9b%b4%e6%96%b0%ef%bc%9a%e7%a7%91%e7%a0%94%e6%8a%95%e7%a8%bf%e4%b9%9f%e5%8f%af%e4%bb%a5%e8%87%aa%e5%8a%a8%e5%8c%96%e4%ba%86/"
tags:
  - RW Research Skill
  - 科研自动化
  - 期刊投稿
  - AI Agent
  - 学术工作流
cover: "/images/blog/rw-research-skill-journal-submission/cover.webp"
coverAlt: "论文文档经过自动化流程拆分为表格和图表的示意图"
pinned: false
draft: false
---

## 这是我第不知道多少次做综述投稿。

我定下来期刊之后，后面的事，我都交给了 RW Research Skill。

RW Research Skill 是我做的一套科研工作流，全网差不多有几十万人看过我这个skill工作流的介绍。它把研究问题、文献、写作和投稿拆开，给 Agent 规定材料、步骤和停止条件。

OK它是怎么做的呢？

先读期刊的投稿要求，再读我本地的论文、标题页、图表和其他投稿材料。缺什么文件，哪个字段还需要作者确认，哪些东西应该单独上传，它一项一项整理下来。然后 Agent 进入我已经登录的投稿系统，按确认过的内容填写、上传和保存。每次保存以后，它都会重新读取页面，看系统还报错不。

说白了，就是把主文、图表、作者资料和声明整理成一个可以提交的投稿包。

## 它在提交前拦下了一个错误

这本期刊要求 `manuscript` 里面不能嵌入 `Table` 或 `Figure`，表和图需要单独上传。

我的主文里当时还有表格和图片。如果照原文件继续走，这个错误会跟着文件进入投稿包。

RW Research Skill 读了期刊要求，也检查了本地 DOCX。主文里仍然嵌着表格和图片，它便停下上传，先处理文件。

当时的文件顺序是 `Figure 1`、`Table 2`、`Figure 3`。这个期刊的图和表分别编号，不能照着旧文件名继续传。它把编号整理成 `Figure 1`、`Table 1`、`Figure 2`，再核对正文引用、单独文件和上传顺序。

主文改完以后，Agent 重新上传文件，保存，再读一遍投稿页面。系统里的错误消失了，它才告诉我可以进入最后一步。

![图片](/images/blog/rw-research-skill-journal-submission/image-01.png)

不同的期刊对投稿的要求各不相同，人工投稿的时间，很多就花在这种事上。

作者要在期刊官网找要求，再回到电脑里翻文件；改完主文，还要检查图表编号和正文引用；上传以后，页面报错了，又要回头找是哪一个文件出了问题。一次保存不算结束，还得重新打开页面，确认刚才的修改真的生效。

这些工作需要认真，但不需要作者每一步都亲手做。

## 这次更新加了什么

这次更新很大。

RW Research Skill 原来已经处理研究问题、文献、证据、研究设计、论文写作和审查。到投稿这一步，过去更多的是准备投稿材料。

这次我给它接上了一个投稿模块。新增的 `rw-journal-submission` 会建立一份 Submission Packet，把主文、标题页、图表、补充材料、作者资料、声明和门户步骤放在一起管理。

期刊要求图表单独上传时，它先检查主文里还有没有 Word 表格、绘图或嵌入媒体，再核对 Figure 和 Table 的编号、正文引用、独立文件和上传顺序。预检不过，就不进入上传。

进入投稿系统以后，Agent 先读当前页面和报错。它只填写作者确认过的字段，保存以后重新读取页面。遇到退回，也继续处理原来的草稿，记录退回原因，修改对应文件，再上传和复核，不会另建一篇投稿，把记录弄乱。

这相当于给 RW Research Skill 外接了一项投稿能力。科研工作可以从研究问题一路走到投稿前审核，中间的文件和状态不会在不同对话里丢掉。

![图片](/images/blog/rw-research-skill-journal-submission/image-02.png)

## 人、Skill 和 Agent 分别做什么

人做研究，人也要承担所有的责任。投哪本期刊，论文写了什么，作者顺序怎么排，谁是通讯作者，贡献、资金、伦理和利益冲突怎样声明，这些都要由作者和团队确认。最终的 `Submit` 也由人完成。

Skill 负责规则。它规定投稿前要查哪些期刊要求，文件怎么组织，哪些字段必须等作者确认，什么情况下要停止。它也区分 `材料齐了`、`门户草稿已保存`、`可以提交` 和 `已经提交`。这几个状态不能混在一起。

Agent 才是实际干活的那个。它读取本地文件和网页，修改文档，上传材料，保存草稿，再把页面读回来。遇到验证码、支付、权限变化或最终提交，它会停下来，交给人去做。

![图片](/images/blog/rw-research-skill-journal-submission/image-03.png)

## 自动投稿会不会带来学术不端

这次没有让 AI 替我写一篇综述。论文是我的，研究内容是我的，作者信息也由我确认。

AI 处理的是这些内容的结构化。它把作者已经提供的信息放进对应字段，按照期刊要求整理文件，再检查本地材料和投稿系统是否一致。它没有生成新的数据，也没有增加一个不存在的作者。贡献、伦理、利益冲突和 AI 使用声明仍然要由作者确认。

这次自动投稿没有新增研究内容，也没有替作者作出学术声明。它没有产生新的学术不端问题，减少的是人工搬文件、核对字段和重复检查的时间。论文真实性、数据、作者信息和声明仍然由人负责。投稿流程自动化以后，这些责任没有转给 Agent。

## 投稿这件事，可以少花一点时间了

论文写完以后还有很多琐碎工作。期刊指南散在不同页面，文件在本地不同目录，作者信息和声明又要逐项确认。以前这段时间只能由作者自己花时间一点一点做。

现在，其中一部分已经可以交给 AI。

RW Research Skill 当前的公共仓库是 `ozrwayne/rw-research-skill`。已经安装的人，可以从 `rw-research-router` 或 `rw-academic-writing` 把任务接到投稿模块。

我最后做的事，是看完它给出的审核结果，自己按下 `Submit`。

好了，投稿完成，去做下一件事了。

欢迎到GitHub上为RW Research Skill 点一个Star！

链接：https://github.com/ozrwayne/rw-research-skill

往期相关：

[科研到底是不是为了找一个正确答案？](https://mp.weixin.qq.com/s?__biz=MzU3MzM2MjY0MQ==&mid=2247489473&idx=1&sn=35fc083823a58c896887b03538178af6&scene=21#wechat_redirect)

[rw research skill的彩蛋：ADHD友好](https://mp.weixin.qq.com/s?__biz=MzU3MzM2MjY0MQ==&mid=2247489427&idx=1&sn=6a1bdb8b4a8107c539870311529ad1b5&scene=21#wechat_redirect)

[RW科研skill更新：自动了解你的科研基础](https://mp.weixin.qq.com/s?__biz=MzU3MzM2MjY0MQ==&mid=2247489417&idx=1&sn=ae842353f3a431efc4066b2766cbcbcd&scene=21#wechat_redirect)

[大学生如何用WorkBuddy写出高质量论文？](https://mp.weixin.qq.com/s?__biz=MzU3MzM2MjY0MQ==&mid=2247489381&idx=1&sn=17ced67607ce89469dd85993b893efbb&scene=21#wechat_redirect)
