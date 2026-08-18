import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clipboard,
  FileText,
  FlaskConical,
  HeartPulse,
  Mail,
  Menu,
  Microscope,
  Network,
  PenTool,
  Quote,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import GlobalLandmarkBackground from "./components/GlobalLandmarkBackground";
import SVGFollowerCursor from "./components/SVGFollowerCursor";
import { consumeHomeSection } from "./navigation.js";

const navItems = [
  { id: "about", label: "About" },
  { id: "articles", label: "Article" },
  { id: "signaling", label: "Signal" },
  { id: "building", label: "Building" },
  { id: "collaborating", label: "Collaboration" },
];

let pageNavigationRequest = 0;

const getPageSectionTop = (scrollRoot, target) => {
  const rootRect = scrollRoot.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
  return Math.max(
    0,
    scrollRoot.scrollTop + targetRect.top - rootRect.top - scrollMarginTop,
  );
};

const setPageScrollInstantly = (scrollRoot, top) => {
  const previousScrollBehavior = scrollRoot.style.scrollBehavior;
  scrollRoot.style.scrollBehavior = "auto";
  scrollRoot.scrollTo({ top, behavior: "auto" });
  window.requestAnimationFrame(() => {
    scrollRoot.style.scrollBehavior = previousScrollBehavior;
  });
};

const scrollToPageSection = (id) => {
  const scrollRoot = document.querySelector(".content-scroll-region");
  const target = document.getElementById(id);
  if (!scrollRoot || !target) return false;

  const requestId = ++pageNavigationRequest;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nextTop = getPageSectionTop(scrollRoot, target);

  if (reducedMotion) {
    setPageScrollInstantly(scrollRoot, nextTop);
  } else {
    const realign = () => {
      if (requestId !== pageNavigationRequest) return;
      const correctedTop = getPageSectionTop(scrollRoot, target);
      if (Math.abs(correctedTop - scrollRoot.scrollTop) > 1) {
        setPageScrollInstantly(scrollRoot, correctedTop);
      }
    };

    scrollRoot.scrollTo({ top: nextTop, behavior: "smooth" });
    scrollRoot.addEventListener("scrollend", realign, { once: true });
    window.setTimeout(realign, 1300);
  }

  return true;
};

const handlePageSectionLink = (event, id, afterNavigate) => {
  if (!scrollToPageSection(id)) return;
  event.preventDefault();
  afterNavigate?.();
};

const rolandHeroPortrait = "/assets/roland-profile-library.png";
const rolandAvatar = rolandHeroPortrait;
const featuredAustraliaArticles = [
  {
    id: "australia-2026",
    number: "01",
    date: "2026-02-25",
    eyebrow: "经济 · AI · 关键矿产",
    title: "AI、矿产与澳洲经济：2026，澳洲能迎来新国运吗？",
    description: "在 AI 重塑全球价值链的背景下，澳大利亚的位置在哪里？从资源禀赋、地缘优势与加工能力，判断这副好牌能否真正兑现。",
    cover: "/images/blog/australia-2026/cover.jpg",
    href: "/blog/australia-2026/",
    tags: ["澳大利亚", "经济", "AI"],
  },
  {
    id: "ndis-australia-ai-future",
    number: "02",
    date: "2026-02-28",
    eyebrow: "卫生经济学 · 公共政策",
    title: "NDIS正在摧毁澳洲AI时代的新国运",
    description: "从卫生经济学与 AI 转型视角审视 NDIS 的财政扩张、支付机制和生产率问题，以及资源配置如何影响国家竞争力。",
    cover: "/images/blog/ndis-australia-ai-future/cover.jpg",
    href: "/blog/ndis-australia-ai-future/",
    tags: ["澳大利亚", "NDIS", "公共政策"],
  },
  {
    id: "australia-housing-market-2026",
    number: "03",
    date: "2026-03-07",
    eyebrow: "房地产 · 利率 · 住房",
    title: "写在澳大利亚房地产市场崩溃的前夜",
    description: "用供给、信贷和需求三条件框架分析 2026 年澳洲房地产市场，区分系统性崩盘与长期实际阴跌。",
    cover: "/images/blog/australia-housing-market-2026/cover.jpg",
    href: "/blog/australia-housing-market-2026/",
    tags: ["澳大利亚", "房地产", "利率"],
  },
];
const articleTopics = [
  { id: "health", label: "健康与医学" },
  { id: "research", label: "科研与工具" },
  { id: "australia", label: "澳洲与政策" },
  { id: "education", label: "教育与成长" },
];

const articles = [
  {
    id: "good-death",
    number: "11",
    topic: "health",
    reveal: 5,
    title: "医生最难的活，是让人好好死",
    cover: "/assets/article-covers/good-death.jpg",
    href: "https://www.rolandwayne.com/blog/x-2040778541324009954/",
  },
  {
    id: "heart-medicine",
    number: "12",
    topic: "health",
    reveal: 2,
    title: "年轻人心梗更凶险，但 90% 的人不知道该用哪个药",
    cover: "/assets/article-covers/heart-medicine.jpg",
    href: "https://www.rolandwayne.com/blog/x-2036839765476053299/",
  },
  {
    id: "local-model",
    number: "13",
    topic: "research",
    reveal: 3,
    title: "本地大模型，到底是个啥？",
    cover: "/assets/article-covers/local-model.jpg",
    href: "https://www.rolandwayne.com/blog/x-2039732426092740774/",
  },
  {
    id: "business-class",
    number: "14",
    topic: "education",
    reveal: 4,
    title: "在公务舱听到几句话，才明白钱会流向谁",
    cover: "/assets/article-covers/business-class.jpg",
    href: "https://www.rolandwayne.com/blog/x-2039371466136060265/",
  },
  {
    id: "opportunity-trouble",
    number: "15",
    topic: "education",
    reveal: 1,
    title: "所有大机会来之前，都伪装成不起眼的麻烦事",
    cover: "/assets/article-covers/opportunity-trouble.jpg",
    href: "https://www.rolandwayne.com/blog/x-2038629423910719662/",
  },
  {
    id: "heart-risk",
    number: "01",
    topic: "health",
    reveal: 4,
    title: "为什么心梗年轻化，且往往首次即致命",
    cover: "/assets/article-covers/heart-risk.webp",
    href: "https://www.rolandwayne.com/blog/x-2036449395248668903/",
  },
  {
    id: "apple-watch",
    number: "02",
    topic: "health",
    reveal: 3,
    title: "为什么 iWatch 会成为 AI 个人健康最重要的基础设施之一",
    cover: "/assets/article-covers/apple-watch.webp",
    href: "https://www.rolandwayne.com/blog/x-2042247698523578865/",
  },
  {
    id: "research-skill",
    number: "03",
    topic: "research",
    reveal: 5,
    title: "RW Research Skill 更新：科研投稿也可以自动化了",
    cover: "/assets/article-covers/research-skill.webp",
    href: "https://www.rolandwayne.com/blog/rw-research-skill-%E6%9B%B4%E6%96%B0%EF%BC%9A%E7%A7%91%E7%A0%94%E6%8A%95%E7%A8%BF%E4%B9%9F%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BA%86/",
  },
  {
    id: "research-answer",
    number: "04",
    topic: "research",
    reveal: 4,
    title: "科研到底是不是为了找一个正确答案？",
    cover: "/assets/article-covers/research-answer.webp",
    href: "https://www.rolandwayne.com/blog/%E7%A7%91%E7%A0%94%E5%88%B0%E5%BA%95%E6%98%AF%E4%B8%8D%E6%98%AF%E4%B8%BA%E4%BA%86%E6%89%BE%E4%B8%80%E4%B8%AA%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88%EF%BC%9F/",
  },
  {
    id: "second-brain",
    number: "05",
    topic: "research",
    reveal: 1,
    title: "280字看懂，剩下的复制给Claude Code，你的AI第二大脑就搭好了",
    cover: "/assets/article-covers/second-brain.webp",
    href: "https://www.rolandwayne.com/blog/claude-code-second-brain-280/",
  },
  {
    id: "housing-market",
    number: "06",
    topic: "australia",
    reveal: 5,
    title: "写在澳大利亚房地产市场崩溃的前夜",
    cover: "/assets/article-covers/housing-market.webp",
    href: "https://www.rolandwayne.com/blog/australia-housing-market-2026/",
  },
  {
    id: "ndis",
    number: "07",
    topic: "australia",
    reveal: 4,
    title: "NDIS正在摧毁澳洲AI时代的新国运",
    cover: "/assets/article-covers/ndis.webp",
    href: "https://www.rolandwayne.com/blog/ndis-australia-ai-future/",
  },
  {
    id: "australia-economy",
    number: "08",
    topic: "australia",
    reveal: 2,
    title: "AI、矿产与澳洲经济：2026，澳洲能迎来新国运吗？",
    cover: "/assets/article-covers/australia-economy.webp",
    href: "https://www.rolandwayne.com/blog/australia-2026/",
  },
  {
    id: "self-learning",
    number: "09",
    topic: "education",
    reveal: 5,
    title: "应试教育已死，自主学习永生",
    cover: "/assets/article-covers/self-learning.webp",
    href: "https://www.rolandwayne.com/blog/x-2033898692391145673/",
  },
  {
    id: "personal-growth",
    number: "10",
    topic: "education",
    reveal: 3,
    title: "从三本小镇青年到留澳全奖医学博士，这条路我走了十年",
    cover: "/assets/article-covers/personal-growth.webp",
    href: "https://www.rolandwayne.com/blog/x-2033018070395208107/",
  },
];

const KNOWLEDGE_GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function boxesOverlap(a, b, gap = 0) {
  return (
    Math.abs(a.x - b.x) < a.hw + b.hw + gap &&
    Math.abs(a.y - b.y) < a.hh + b.hh + gap
  );
}

function pushNodeFromBox(node, box, gap, fallbackAngle) {
  if (!boxesOverlap(node, box, gap)) return;

  const dx = node.x - box.x;
  const dy = node.y - box.y;
  const overlapX = node.hw + box.hw + gap - Math.abs(dx);
  const overlapY = node.hh + box.hh + gap - Math.abs(dy);

  if (overlapX < overlapY) {
    node.x += (Math.sign(dx) || Math.sign(Math.cos(fallbackAngle)) || 1) * overlapX;
  } else {
    node.y += (Math.sign(dy) || Math.sign(Math.sin(fallbackAngle)) || 1) * overlapY;
  }
}

function buildKnowledgeLayout(width, height) {
  const mobile = width <= 680;
  const coverWidth = mobile ? 50 : clamp(width * 0.041, 72, 84);
  const coverHeight = coverWidth * 0.75;
  const marginX = mobile ? 22 : 48;
  const marginY = mobile ? 24 : 42;
  const driftPadding = mobile ? 10 : 24;
  const topicWidth = mobile ? 82 : 132;
  const topicHeight = mobile ? 24 : 36;
  const anchors = mobile
    ? [
        { x: 0.24, y: 0.24 },
        { x: 0.76, y: 0.24 },
        { x: 0.74, y: 0.79 },
        { x: 0.26, y: 0.79 },
      ]
    : [
        { x: 0.205, y: 0.29 },
        { x: 0.795, y: 0.29 },
        { x: 0.79, y: 0.73 },
        { x: 0.21, y: 0.73 },
      ];
  const topics = articleTopics.map((topic, index) => ({
    ...topic,
    x: anchors[index].x * width,
    y: anchors[index].y * height,
    hw: topicWidth / 2,
    hh: topicHeight / 2,
  }));
  const keepout = {
    x: width / 2,
    y: height / 2,
    hw: mobile ? width * 0.37 : Math.min(width * 0.245, 470),
    hh: mobile ? height * 0.19 : Math.min(height * 0.205, 190),
  };
  const nodes = [];
  const topicRadius = mobile
    ? clamp(Math.min(width, height) * 0.14, 43, 56)
    : clamp(Math.min(width, height) * 0.153, 81, 103);
  const radiusPattern = [0.95, 1.7, 1.15, 1.45];

  topics.forEach((topic, topicIndex) => {
    const topicArticles = articles.filter(article => article.topic === topic.id);
    const angleOffset = -Math.PI / 2 + topicIndex * 0.17;

    topicArticles.forEach((article, articleIndex) => {
      const angle = angleOffset + (articleIndex * Math.PI * 2) / topicArticles.length;
      const radius = topicRadius * radiusPattern[articleIndex % radiusPattern.length];

      nodes.push({
        ...article,
        topicIndex,
        topic,
        x: topic.x + Math.cos(angle) * radius,
        y: topic.y + Math.sin(angle) * radius,
        hw: coverWidth / 2,
        hh: coverHeight / 2,
        angle,
        phase: (topicIndex * 4 + articleIndex) * KNOWLEDGE_GOLDEN_ANGLE,
      });
    });
  });

  const clampNode = node => {
    node.x = clamp(node.x, marginX + node.hw + driftPadding, width - marginX - node.hw - driftPadding);
    node.y = clamp(node.y, marginY + node.hh + driftPadding, height - marginY - node.hh - driftPadding);
  };

  nodes.forEach(clampNode);
  for (let pass = 0; pass < 72; pass += 1) {
    nodes.forEach(node => {
      pushNodeFromBox(node, keepout, mobile ? 13 : 28, node.angle);
      topics.forEach(topic => pushNodeFromBox(node, topic, mobile ? 14 : 30, node.angle));
      clampNode(node);
    });

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        const gap = mobile ? 12 : 30;
        if (!boxesOverlap(a, b, gap)) continue;

        const dx = a.x - b.x || Math.cos((first + 1) * KNOWLEDGE_GOLDEN_ANGLE);
        const dy = a.y - b.y || Math.sin((second + 1) * KNOWLEDGE_GOLDEN_ANGLE);
        const overlapX = a.hw + b.hw + gap - Math.abs(dx);
        const overlapY = a.hh + b.hh + gap - Math.abs(dy);
        if (overlapX < overlapY) {
          const move = overlapX / 2 + 0.5;
          const direction = Math.sign(dx) || 1;
          a.x += direction * move;
          b.x -= direction * move;
        } else {
          const move = overlapY / 2 + 0.5;
          const direction = Math.sign(dy) || 1;
          a.y += direction * move;
          b.y -= direction * move;
        }
        clampNode(a);
        clampNode(b);
      }
    }
  }

  // Finish with card-only relaxation so topic keepouts cannot pull two cards
  // back together on the last pass.
  for (let pass = 0; pass < 36; pass += 1) {
    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        const gap = mobile ? 12 : 30;
        if (!boxesOverlap(a, b, gap)) continue;

        const dx = a.x - b.x || Math.cos((first + 1) * KNOWLEDGE_GOLDEN_ANGLE);
        const dy = a.y - b.y || Math.sin((second + 1) * KNOWLEDGE_GOLDEN_ANGLE);
        const overlapX = a.hw + b.hw + gap - Math.abs(dx);
        const overlapY = a.hh + b.hh + gap - Math.abs(dy);
        if (overlapX < overlapY) {
          const move = overlapX / 2 + 0.5;
          const direction = Math.sign(dx) || 1;
          a.x += direction * move;
          b.x -= direction * move;
        } else {
          const move = overlapY / 2 + 0.5;
          const direction = Math.sign(dy) || 1;
          a.y += direction * move;
          b.y -= direction * move;
        }
        clampNode(a);
        clampNode(b);
      }
    }
  }

  return {
    width,
    height,
    mobile,
    coverWidth,
    coverHeight,
    topics,
    nodes,
  };
}

function segmentEndpoint(box, target, gap) {
  const dx = target.x - box.x;
  const dy = target.y - box.y;
  const distance = Math.hypot(dx, dy) || 1;
  const edgeScale = Math.min(
    Math.abs(dx) > 0.001 ? box.hw / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.001 ? box.hh / Math.abs(dy) : Infinity,
  );
  return {
    x: box.x + dx * edgeScale + (dx / distance) * gap,
    y: box.y + dy * edgeScale + (dy / distance) * gap,
  };
}

function ArticleKnowledgeSvg({ active, topicsVisible, linesVisible, revealStage }) {
  const svgRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const lineRefs = useRef(new Map());
  const layoutRef = useRef(null);
  const [layout, setLayout] = useState(() => buildKnowledgeLayout(1320, 645));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const nextLayout = buildKnowledgeLayout(rect.width, rect.height);
      layoutRef.current = nextLayout;
      setLayout(nextLayout);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    layoutRef.current = layout;
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = time => {
      const current = layoutRef.current;
      if (!current) return;
      const baseAmplitude = reducedMotion || !active ? 0 : current.mobile ? 3.5 : 8;
      const endpointGap = current.mobile ? 3 : 4;

      current.nodes.forEach((node, index) => {
        const amplitude = baseAmplitude * (0.78 + ((index * 3) % 5) * 0.1);
        const speedX = 0.00046 + (index % 4) * 0.00004;
        const speedY = 0.00042 + ((index + 2) % 5) * 0.000035;
        const dx = Math.sin(time * speedX + node.phase) * amplitude;
        const dy = Math.cos(time * speedY + node.phase * 1.37) * amplitude * 0.88;
        const rotation = Math.sin(time * 0.0004 + node.phase) * (current.mobile ? 0.45 : 0.75);
        const nodeElement = nodeRefs.current.get(node.id);
        const lineElement = lineRefs.current.get(node.id);
        const center = { x: node.x + dx, y: node.y + dy };

        nodeElement?.setAttribute(
          "transform",
          `translate(${center.x.toFixed(2)} ${center.y.toFixed(2)}) rotate(${rotation.toFixed(2)})`,
        );

        if (lineElement) {
          const topic = current.topics[node.topicIndex];
          const start = segmentEndpoint(topic, center, endpointGap);
          const end = segmentEndpoint(
            { x: center.x, y: center.y, hw: node.hw, hh: node.hh },
            topic,
            endpointGap,
          );
          lineElement.setAttribute("x1", start.x.toFixed(2));
          lineElement.setAttribute("y1", start.y.toFixed(2));
          lineElement.setAttribute("x2", end.x.toFixed(2));
          lineElement.setAttribute("y2", end.y.toFixed(2));
        }
      });

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [active, layout]);

  return (
    <svg
      ref={svgRef}
      className={`knowledge-network-svg reveal-stage-${revealStage}${active ? " is-active" : ""}${topicsVisible ? " topics-visible" : ""}${linesVisible ? " lines-visible" : ""}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
      aria-label="Roland Wayne 文章主题知识网络"
    >
      <g className="knowledge-network-lines" aria-hidden="true">
        {layout.nodes.map((node, nodeIndex) => (
          <line
            key={node.id}
            ref={element => {
              if (element) lineRefs.current.set(node.id, element);
              else lineRefs.current.delete(node.id);
            }}
            className="knowledge-network-line"
            pathLength="1"
          />
        ))}
      </g>

      <g className="knowledge-network-topics">
        {layout.topics.map(topic => (
          <text
            className="knowledge-network-topic"
            x={topic.x}
            y={topic.y}
            textAnchor="middle"
            dominantBaseline="middle"
            key={topic.id}
          >
            {topic.label}
          </text>
        ))}
      </g>

      <g className="knowledge-network-covers">
        {layout.nodes.map((node, nodeIndex) => (
          <a
            className="knowledge-network-cover-link"
            href={node.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${node.topic.label}：${node.title}`}
            key={node.id}
          >
            <g
              ref={element => {
                if (element) nodeRefs.current.set(node.id, element);
                else nodeRefs.current.delete(node.id);
              }}
            >
              <g
                className={`knowledge-network-cover cover-reveal-${node.reveal}`}
                style={{ "--cover-exit-delay": `${(nodeIndex * 73) % 310}ms` }}
              >
                <title>{node.title}</title>
                <rect
                  className="knowledge-network-cover-back"
                  x={-node.hw}
                  y={-node.hh}
                  width={node.hw * 2}
                  height={node.hh * 2}
                />
                <image
                  href={node.cover}
                  x={-node.hw}
                  y={-node.hh}
                  width={node.hw * 2}
                  height={node.hh * 2}
                  preserveAspectRatio="none"
                />
              </g>
            </g>
          </a>
        ))}
      </g>
    </svg>
  );
}

const signalGroups = [
  {
    label: "Social",
    description: "日常更新与公开讨论",
    links: [
      {
        name: "X",
        detail: "5.5万+ 粉丝",
        address: "@rwayne",
        href: "https://x.com/rwayne",
        icon: "/assets/signal/x.svg",
        fallback: "X",
      },
      {
        name: "小红书",
        detail: "2500 粉丝",
        address: "Roland.W",
        href: "https://www.xiaohongshu.com/user/profile/63e38e54000000002702ae11?xsec_token=AB2SgiEFidWz3q-X0PP-DNBU0gee09VxqXVPWTNkjSazM=&xsec_source=pc_search",
        icon: "/assets/signal/xiaohongshu.svg",
        fallback: "RED",
      },
      {
        name: "GitHub",
        detail: "rw-research-skill",
        address: "github.com/ozrwayne",
        href: "https://github.com/ozrwayne",
        icon: "/assets/signal/github.svg",
        fallback: "GH",
      },
    ],
  },
  {
    label: "Official",
    description: "机构、研究与正式业务主页",
    links: [
      {
        name: "University of Queensland",
        detail: "昆士兰大学研究人员主页",
        address: "Institution profile",
        href: "https://cchw.habs.uq.edu.au/profile/118/roland-wang",
        verified: true,
        icon: "/assets/signal/uq.png",
        fallback: "UQ",
      },
      {
        name: "Wayne InsightSpring",
        detail: "企业 AI 转型与咨询",
        address: "wayneinsightspring.com",
        href: "https://www.wayneinsightspring.com/",
        icon: "/assets/signal/wis.png",
        fallback: "WIS",
      },
      {
        name: "MedFlow",
        detail: "医学教育与项目主页",
        address: "medflowedu.com",
        href: "https://medflowedu.com/",
        icon: "/assets/signal/medflow-img2.png",
        fallback: "MF",
      },
    ],
  },
];

const serviceOffers = [
  {
    code: "01",
    type: "高端 · 多年期",
    title: "全方位申请指导",
    description: "为家庭提供国际医学院申请的长期指导，从战略规划一直延伸至录取后的选择。",
    scope: "覆盖澳大利亚、英国、香港等地区",
    deliverables: ["战略规划", "学校选择", "申请审核", "面试准备", "录取后支持"],
  },
  {
    code: "02",
    type: "课程 · 本科生与研究生",
    title: "AI 研究思维课程",
    description: "学习如何使用 AI 工具开展学术研究、批判性思考和更严谨的决策。",
    scope: "面向希望提高研究质量与工作效率的学习者",
    deliverables: ["AI 工具", "研究方法", "批判性思维", "决策训练"],
  },
];

const researchOutputs = [
  {
    type: "手稿 · 审稿中",
    title: "低钠盐替代品范围综述",
    detail: "已提交至《欧洲预防心脏病学杂志》。",
  },
  {
    type: "硕士论文 · 2024",
    title: "消费者对低钠盐替代品的偏好",
    detail: "昆士兰大学 · 成绩 85.50%。",
  },
];

const researchInterests = [
  "健康实施科学",
  "离散选择实验",
  "心血管疾病预防",
  "健康经济学",
  "行为科学",
  "人群健康干预",
];

const universityMetrics = [
  ["600+", "全球顶尖高校录取案例"],
  ["3+ 年", "连续实现香港、英国与澳洲医学院录取"],
  ["6+ 年", "医学升学与项目服务经验"],
  ["30万+ 字", "内部培训与知识建设资料"],
];

const universityResponsibilities = [
  {
    label: "医学教育与服务体系",
    items: [
      ["团队管理", "导师团队组建、管理与人才发展机制设计"],
      ["体系搭建", "服务流程标准化体系与智能化文书评价系统"],
      ["项目统筹", "医学本、硕、博申请全流程管理"],
      ["知识建设", "内部知识库与应用场景课程开发"],
    ],
  },
  {
    label: "AI 科研与知识系统",
    items: [
      ["AI 科研体系构建", "为高校和科研机构搭建研究工作流与知识管理系统"],
      ["AI 科研教学", "带领团队在真实医学科研场景中应用 AI 工具"],
      ["AI 医学研究", "覆盖文献检索、数据分析与论文写作等研究环节"],
    ],
  },
];

const universityFields = [
  "卫生经济学研究",
  "临床数据建模",
  "医学升学咨询",
  "项目管理与团队运营",
  "中国市场准入咨询",
  "AI 科研体系构建",
  "AI 科研教学",
  "AI 医学研究",
];

function SectionHeading({ title, kicker, description, link }) {
  return (
    <div className="section-heading">
      <div>
        {kicker && <span className="section-kicker">{kicker}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <a className="quiet-link" href={link.href} target="_blank" rel="noreferrer">
          {link.label} <ArrowRight size={15} />
        </a>
      )}
    </div>
  );
}

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    let isScrolled = scrollRoot.scrollTop > 1;

    const updateHeader = () => {
      const nextScrolled = isScrolled ? scrollRoot.scrollTop > 0 : scrollRoot.scrollTop > 1;
      if (nextScrolled === isScrolled) return;
      isScrolled = nextScrolled;
      setHeaderScrolled(nextScrolled);
    };

    setHeaderScrolled(isScrolled);
    updateHeader();
    scrollRoot.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      scrollRoot.removeEventListener("scroll", updateHeader);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const navigate = (event, id) => handlePageSectionLink(event, id, closeMenu);
  const navigateTop = (event) => {
    closeMenu();
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return;

    event.preventDefault();
    scrollRoot.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <header ref={headerRef} className={`site-header${headerScrolled ? " is-scrolled" : ""}`}>
      <a
        className="brand-mark"
        href="/"
        aria-label="Roland Wayne，回到顶部"
        onClick={navigateTop}
      >
        <img src={rolandAvatar} alt="" />
        <span className="brand-lockup" aria-hidden="true">
          <span className="brand-word">
            <span className="brand-initial">R</span>
            <span className="brand-tail brand-tail-roland">oland</span>
          </span>
          <span className="brand-word brand-word-wayne">
            <span className="brand-initial">W</span>
            <span className="brand-tail brand-tail-wayne">ayne</span>
          </span>
        </span>
        <span className="sr-only">Roland Wayne</span>
      </a>

      <nav className="desktop-nav" aria-label="页面导航">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={activeSection === item.id ? "active" : ""}
            href="/"
            aria-current={activeSection === item.id ? "location" : undefined}
            onClick={(event) => navigate(event, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a
          className="header-contact"
          href="/"
          aria-label="Contact Roland"
          onClick={(event) => navigate(event, "contacting")}
        >
          Contact
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mobile-anchor-rail" aria-label="移动端快捷导航">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={activeSection === item.id ? "active" : ""}
            href="/"
            onClick={(event) => navigate(event, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {menuOpen && (
          <>
            <button
              className="mobile-menu-scrim"
              type="button"
              aria-label="关闭导航"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              className="mobile-menu"
              aria-label="移动端页面导航"
            >
              {navItems.map((item) => (
                <a key={item.id} href="/" onClick={(event) => navigate(event, item.id)}>
                  <span>{item.label}</span>
                  <ArrowRight size={17} />
                </a>
              ))}
            </nav>
          </>
      )}
      </header>
  );
}

function ViewportScrollbar() {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    const scrollRoot = document.querySelector(".content-scroll-region");
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!scrollRoot || !track || !thumb) return undefined;

    let frame = 0;
    let maxScroll = 0;
    let thumbHeight = 48;
    let thumbTravel = 0;

    const paint = () => {
      frame = 0;
      const trackHeight = track.clientHeight;
      maxScroll = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      const visibleRatio = scrollRoot.scrollHeight > 0
        ? scrollRoot.clientHeight / scrollRoot.scrollHeight
        : 1;
      thumbHeight = Math.max(48, trackHeight * visibleRatio);
      thumbTravel = Math.max(0, trackHeight - thumbHeight);
      const progress = maxScroll > 0 ? scrollRoot.scrollTop / maxScroll : 0;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTravel * progress}px)`;
      track.style.opacity = maxScroll > 0 ? "1" : "0";
      track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const schedulePaint = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const scrollFromTrackPosition = (clientY) => {
      const rect = track.getBoundingClientRect();
      const nextProgress = thumbTravel > 0
        ? clamp((clientY - rect.top - thumbHeight / 2) / thumbTravel, 0, 1)
        : 0;
      scrollRoot.scrollTo({ top: nextProgress * maxScroll, behavior: "auto" });
    };

    const handleTrackPointerDown = (event) => {
      if (event.target === thumb || event.button !== 0) return;
      event.preventDefault();
      scrollFromTrackPosition(event.clientY);
    };

    const handleThumbPointerDown = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const startY = event.clientY;
      const startScrollTop = scrollRoot.scrollTop;
      track.classList.add("is-dragging");
      thumb.setPointerCapture(event.pointerId);

      const handlePointerMove = (moveEvent) => {
        const scrollPerPixel = thumbTravel > 0 ? maxScroll / thumbTravel : 0;
        scrollRoot.scrollTop = clamp(
          startScrollTop + (moveEvent.clientY - startY) * scrollPerPixel,
          0,
          maxScroll,
        );
      };

      const finishDrag = (finishEvent) => {
        track.classList.remove("is-dragging");
        if (finishEvent.pointerId != null && thumb.hasPointerCapture(finishEvent.pointerId)) {
          thumb.releasePointerCapture(finishEvent.pointerId);
        }
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", finishDrag);
        window.removeEventListener("pointercancel", finishDrag);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", finishDrag);
      window.addEventListener("pointercancel", finishDrag);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      scrollRoot.scrollBy({ top: event.deltaY, behavior: "auto" });
    };

    const handleKeyDown = (event) => {
      const keySteps = {
        ArrowUp: -64,
        ArrowDown: 64,
        PageUp: -scrollRoot.clientHeight * 0.88,
        PageDown: scrollRoot.clientHeight * 0.88,
      };
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        scrollRoot.scrollTo({ top: event.key === "Home" ? 0 : maxScroll, behavior: "auto" });
      } else if (event.key in keySteps) {
        event.preventDefault();
        scrollRoot.scrollBy({ top: keySteps[event.key], behavior: "auto" });
      }
    };

    const resizeObserver = new ResizeObserver(schedulePaint);
    resizeObserver.observe(scrollRoot);
    if (scrollRoot.firstElementChild) resizeObserver.observe(scrollRoot.firstElementChild);
    scrollRoot.addEventListener("scroll", schedulePaint, { passive: true });
    window.addEventListener("resize", schedulePaint, { passive: true });
    track.addEventListener("pointerdown", handleTrackPointerDown);
    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("keydown", handleKeyDown);
    thumb.addEventListener("pointerdown", handleThumbPointerDown);
    paint();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scrollRoot.removeEventListener("scroll", schedulePaint);
      window.removeEventListener("resize", schedulePaint);
      track.removeEventListener("pointerdown", handleTrackPointerDown);
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("keydown", handleKeyDown);
      thumb.removeEventListener("pointerdown", handleThumbPointerDown);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="viewport-scrollbar"
      role="scrollbar"
      tabIndex={0}
      aria-label="页面滚动"
      aria-controls="top"
      aria-orientation="vertical"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
    >
      <span ref={thumbRef} className="viewport-scrollbar-thumb" />
    </div>
  );
}

function WritingSection() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const [activated, setActivated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealStage, setRevealStage] = useState(0);
  const [topicsVisible, setTopicsVisible] = useState(false);
  const [linesVisible, setLinesVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    let frame = 0;
    let currentExpansion = 0;
    let targetExpansion = 0;
    let currentBottomOffset = 0;
    let targetBottomOffset = 0;
    let hasActivated = false;
    let exitInProgress = false;
    let exitTimers = [];
    let previousScrollY = scrollRoot.scrollTop;
    let fullHeightBottomOffset = 0;

    const captureExpandedGeometry = () => {
      const section = sectionRef.current;
      if (!section) return;
      const stickyRect = section.querySelector(".article-knowledge-sticky").getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const expandedGutter = viewportWidth <= 680 ? 8 : 12;
      const fullHeight = scrollRoot.clientHeight - expandedGutter * 2;
      fullHeightBottomOffset = stickyRect.height - fullHeight;
    };

    const paint = () => {
      frame = 0;
      const section = sectionRef.current;
      const panel = panelRef.current;
      if (!section || !panel) return;

      currentExpansion += (targetExpansion - currentExpansion) * 0.095;
      if (Math.abs(targetExpansion - currentExpansion) < 0.001) currentExpansion = targetExpansion;
      if (hasActivated) {
        currentBottomOffset = targetBottomOffset;
      } else {
        currentBottomOffset += (targetBottomOffset - currentBottomOffset) * 0.095;
        if (Math.abs(targetBottomOffset - currentBottomOffset) < 0.001) {
          currentBottomOffset = targetBottomOffset;
        }
      }

      const sectionRect = section.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;

      panel.style.setProperty(
        "--knowledge-left",
        `${-sectionRect.left * currentExpansion}px`,
      );
      panel.style.setProperty(
        "--knowledge-right",
        `${-(viewportWidth - sectionRect.right) * currentExpansion}px`,
      );
      panel.style.setProperty(
        "--knowledge-top",
        "0px",
      );
      panel.style.setProperty(
        "--knowledge-bottom",
        `${currentBottomOffset}px`,
      );
      const expansionOverflow = Math.max(0, -currentBottomOffset);
      section.style.setProperty(
        "--knowledge-expanded-overflow",
        `${expansionOverflow * currentExpansion}px`,
      );
      const restingRadius = viewportWidth <= 760 ? 16 : 24;
      panel.style.setProperty(
        "--knowledge-radius",
        `${restingRadius * (1 - currentExpansion)}px`,
      );

      if (currentExpansion !== targetExpansion || currentBottomOffset !== targetBottomOffset) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.querySelector(".article-knowledge-sticky").getBoundingClientRect();
      const viewportBottom = scrollRoot.getBoundingClientRect().bottom;
      const viewportHeight = scrollRoot.clientHeight;
      const entryDepth = viewportBottom - rect.bottom;
      const exitDepth = Math.min(Math.max(viewportHeight * 0.24, 150), 220);
      const currentScrollY = scrollRoot.scrollTop;
      const scrollingDown = currentScrollY > previousScrollY + 0.5;
      const scrollingUp = currentScrollY < previousScrollY - 0.5;
      previousScrollY = currentScrollY;

      const finishExit = () => {
        targetExpansion = 0;
        targetBottomOffset = 0;
        setRevealStage(0);
        setExpanded(false);
        setExiting(false);
        exitInProgress = false;
        if (!frame) frame = window.requestAnimationFrame(paint);
      };

      const startExit = () => {
        if (exitInProgress) return;

        hasActivated = false;
        exitInProgress = true;
        targetExpansion = 0;
        targetBottomOffset = 0;
        setLinesVisible(false);
        setTopicsVisible(false);
        setRevealStage(0);
        setActivated(false);
        setExiting(true);
        setExpanded(false);
        if (!frame) frame = window.requestAnimationFrame(paint);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          finishExit();
          return;
        }

        exitTimers = [window.setTimeout(finishExit, 920)];
      };

      if (
        !hasActivated &&
        !exitInProgress &&
        scrollingDown &&
        entryDepth > 2 &&
        entryDepth < exitDepth
      ) {
        hasActivated = true;
        captureExpandedGeometry();
        targetBottomOffset = Math.max(fullHeightBottomOffset, rect.bottom - viewportBottom);
        targetExpansion = fullHeightBottomOffset < 0
          ? Math.min(Math.max(targetBottomOffset / fullHeightBottomOffset, 0), 1)
          : 1;

        setExiting(false);
        setActivated(true);
        setExpanded(true);
      }

      if (hasActivated && scrollingUp && entryDepth < -24) {
        startExit();
      } else if (hasActivated) {
        targetBottomOffset = Math.max(fullHeightBottomOffset, rect.bottom - viewportBottom);
        targetExpansion = fullHeightBottomOffset < 0
          ? Math.min(Math.max(targetBottomOffset / fullHeightBottomOffset, 0), 1)
          : 1;
      }

      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const scheduleUpdate = () => {
      measure();
    };

    measure();
    currentExpansion = targetExpansion;
    currentBottomOffset = targetBottomOffset;
    paint();
    scrollRoot.addEventListener("scroll", scheduleUpdate, { passive: true });
    const handleResize = () => {
      if (hasActivated) captureExpandedGeometry();
      scheduleUpdate();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      exitTimers.forEach((timer) => window.clearTimeout(timer));
      scrollRoot.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!activated) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTopicsVisible(true);
      setRevealStage(5);
      setLinesVisible(true);
      return undefined;
    }

    const sequence = [
      window.setTimeout(() => setTopicsVisible(true), 620),
      window.setTimeout(() => setRevealStage(1), 780),
      window.setTimeout(() => setRevealStage(2), 900),
      window.setTimeout(() => setRevealStage(3), 1020),
      window.setTimeout(() => setRevealStage(4), 1140),
      window.setTimeout(() => setRevealStage(5), 1260),
      window.setTimeout(() => setLinesVisible(true), 1540),
    ];

    return () => sequence.forEach((timer) => window.clearTimeout(timer));
  }, [activated]);

  return (
    <section className="article-knowledge-section" id="writing" ref={sectionRef}>
      <div className="article-knowledge-sticky">
        <div
          className={`article-knowledge-panel reveal-stage-${revealStage}${activated ? " is-activated" : ""}${exiting ? " is-exiting" : ""}${expanded ? " is-expanded" : ""}${linesVisible ? " lines-visible" : ""}`}
          ref={panelRef}
        >
          <div className="knowledge-center">
            <h2 className="knowledge-heading">
              <span>知识体系的构建</span>
              <span className="knowledge-heading-last">从真实问题开始<i aria-hidden="true">。</i></span>
            </h2>
            <a href="/articles/">
              查看所有文章 <ArrowRight size={17} />
            </a>
          </div>
          <ArticleKnowledgeSvg
            active={activated || exiting}
            topicsVisible={topicsVisible}
            linesVisible={linesVisible}
            revealStage={revealStage}
          />
        </div>
      </div>
    </section>
  );
}

function SignalingSection() {
  return (
    <section className="section stage-section signal-section module-surface" id="signaling">
      <img
        className="section-cloud signal-corner-cloud"
        src="/assets/clouds/signal-cloud-upper-right.png"
        alt=""
        aria-hidden="true"
      />
      <SectionHeading
        title="Signal"
        kicker="Outside this site"
        description="社交媒体与正式主页，所有外部身份集中在这里。"
      />
      <div className="signal-directory">
        {signalGroups.map((group) => (
          <section className="signal-group" key={group.label} aria-labelledby={`signal-${group.label}`}>
            <header className="signal-group-head">
              <h3 id={`signal-${group.label}`}>{group.label}</h3>
              <p>{group.description}</p>
            </header>
            <div className="signal-links" style={{ "--signal-link-count": group.links.length }}>
              {group.links.map((link) => (
                <a
                  className="signal-link cursor-target"
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  key={link.name}
                >
                  <span className="signal-link-icon" data-fallback={link.fallback} aria-hidden="true">
                    <img
                      src={link.icon}
                      alt=""
                      width="36"
                      height="36"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(event) => { event.currentTarget.hidden = true; }}
                    />
                  </span>
                  <span className="signal-link-copy">
                    <strong>{link.name}</strong>
                    <small>{link.detail}</small>
                  </span>
                  <span className="signal-link-meta">
                    {link.verified && <em>Verified institution</em>}
                    <span>{link.address}</span>
                  </span>
                  <ArrowRight className="signal-link-arrow" size={22} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function FeaturedAustraliaSection() {
  const [selectedId, setSelectedId] = useState(featuredAustraliaArticles[0].id);
  const selectedArticle = featuredAustraliaArticles.find((article) => article.id === selectedId)
    ?? featuredAustraliaArticles[0];
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${selectedArticle.date}T00:00:00+08:00`));

  return (
    <div className="article-module-wrap" id="articles">
      <section className="article-module-surface module-surface australia-feature" aria-labelledby="australia-feature-title">
        <header className="australia-feature-heading">
          <div>
            <span>Selected writing / Australia</span>
            <h2 id="australia-feature-title">Article</h2>
          </div>
        </header>

        <div className="australia-feature-layout">
          <div className="australia-feature-directory">
            <div className="australia-feature-list" role="list" aria-label="三篇澳洲精选文章">
              {featuredAustraliaArticles.map((article) => (
                <button
                  className={`australia-feature-item${article.id === selectedArticle.id ? " is-active" : ""}`}
                  type="button"
                  role="listitem"
                  aria-pressed={article.id === selectedArticle.id}
                  onClick={() => setSelectedId(article.id)}
                  key={article.id}
                >
                  <span className="australia-feature-number">{article.number}</span>
                  <span className="australia-feature-item-copy">
                    <small>{article.date.replaceAll("-", ".")} · {article.eyebrow}</small>
                    <strong>{article.title}</strong>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <a className="australia-feature-all" href="/articles/">
              阅读所有文章 <ArrowRight size={17} />
            </a>
          </div>

          <article className="australia-feature-detail" key={selectedArticle.id}>
            <div className="australia-feature-cover">
              <img src={selectedArticle.cover} alt="" loading="lazy" />
              <span>{selectedArticle.number} / Australia dossier</span>
            </div>
            <div className="australia-feature-detail-copy">
              <p className="australia-feature-meta">{formattedDate} · {selectedArticle.eyebrow}</p>
              <h3>{selectedArticle.title}</h3>
              <p>{selectedArticle.description}</p>
              <div className="australia-feature-tags" aria-label="文章主题">
                {selectedArticle.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className="australia-feature-read cursor-target" href={selectedArticle.href}>
                阅读全文 <ArrowRight size={17} />
              </a>
            </div>
          </article>
        </div>

      </section>
      <img
        className="article-corner-cloud"
        src="/assets/clouds/hero-cloud-tall.png"
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}

function BuildingSection() {
  return (
    <section className="section building-section building-hub-section module-surface" id="building">
      <img
        className="section-cloud building-corner-cloud"
        src="/assets/clouds/building-cloud-upper-right.png"
        alt=""
        aria-hidden="true"
      />
      <SectionHeading
        title="Building"
        kicker="Practice / Evidence / Systems"
        description="把服务实践与学术研究放进同一个工作系统：从真实问题出发，以证据建立判断，再把判断转化为可执行的路径。"
      />
      <div className="building-split-layout">
        <section className="building-lane building-service-lane" aria-labelledby="building-services-title">
          <header className="building-lane-header">
            <span>Services / Consulting</span>
            <h3 id="building-services-title">Services</h3>
            <p>帮助家庭做出关于国际医学教育的高质量决策——不仅是获得录取，而是找到正确的前进道路。</p>
          </header>

          <div className="building-principle">
            <span>工作原则</span>
            <strong>敬天爱人，敬畏因果</strong>
            <p>尊重、正直与长远思维。决策质量比任何单一结果更重要；学术匹配、个人成长、职业轨迹与生活满意度都应被纳入判断。</p>
          </div>

          <div className="building-service-stack">
            {serviceOffers.map((service) => (
              <article className="building-service-card" key={service.code}>
                <div className="building-card-meta">
                  <span>{service.code}</span>
                  <small>{service.type}</small>
                </div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <small className="building-card-scope">{service.scope}</small>
                <div className="building-card-tags" aria-label={`${service.title}内容`}>
                  {service.deliverables.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>

          <a
            className="building-lane-action cursor-target"
            href="/"
            onClick={(event) => handlePageSectionLink(event, "contacting")}
          >
            预约咨询 <ArrowRight size={17} />
          </a>
        </section>

        <section className="building-lane building-research-lane" id="researching" aria-labelledby="building-research-title">
          <header className="building-lane-header">
            <span>Research / Academic</span>
            <h3 id="building-research-title">Research</h3>
            <p>研究处于健康经济学与实施科学的交叉领域，关注如何把循证干预转化为现实世界的健康成果。</p>
          </header>

          <div className="building-research-stack" aria-label="研究项目与成果">
            <article className="building-research-record">
              <div className="building-card-meta">
                <span>01</span>
                <small>博士研究项目</small>
              </div>
              <h4>低钠盐替代品在心血管疾病预防中的实施</h4>
              <p>调查低钠盐替代品作为人群层面心血管疾病预防策略的实施，并与 Springfield Healthy Hearts 项目整合。</p>
              <div className="building-card-tags" aria-label="研究方法">
                <span>实施科学</span>
                <span>心血管健康</span>
                <span>离散选择实验</span>
              </div>
            </article>

            {researchOutputs.map((output, index) => (
              <article className="building-research-record" key={output.title}>
                <div className="building-card-meta">
                  <span>{String(index + 2).padStart(2, "0")}</span>
                  <small>{output.type}</small>
                </div>
                <h4>{output.title}</h4>
                <p>{output.detail}</p>
              </article>
            ))}
          </div>

          <section className="building-research-group" aria-labelledby="building-interest-title">
            <div className="building-group-heading building-interest-heading">
              <span id="building-interest-title">研究兴趣</span>
            </div>
            <div className="building-interest-tags">
              {researchInterests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}

function CollaboratingSection() {
  return (
    <section className="section stage-section collaboration-section module-surface" id="collaborating">
      <img
        className="section-cloud university-corner-cloud"
        src="/assets/clouds/university-cloud-lower-left.png"
        alt=""
        aria-hidden="true"
      />
      <div className="university-showcase">
        <div className="university-showcase-intro">
          <span className="section-kicker">University / Partnership</span>
          <h2>Collaboration</h2>
          <p>面向海外高等教育机构、医学教育团队与私营医疗企业的长期合作。</p>
          <div className="university-responsibility-board">
            {universityResponsibilities.map((group) => (
              <section key={group.label}>
                <h3>{group.label}</h3>
                <dl>
                  {group.items.map(([term, description]) => (
                    <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
          <div className="university-fields">
            <span>专业领域</span>
            <div>
              {universityFields.map((field) => <small key={field}>{field}</small>)}
            </div>
          </div>
        </div>
        <article className="university-feature-card">
          <video
            className="university-sunlight-video"
            src="/assets/university-sunlight-warm.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="暖色建筑表面的太阳光线缓慢移动"
          />
          <div className="university-feature-copy">
            <h3>把研究、教育与知识系统连起来</h3>
            <p>以卫生经济研究、临床数据建模和医学教育服务经验，支持课程、团队与 AI 科研体系建设。</p>
            <div className="university-feature-metrics" aria-label="高校合作关键数据">
              {universityMetrics.map(([value, label]) => (
                <div key={label}><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
            <a
              className="cursor-target"
              href="/"
              onClick={(event) => handlePageSectionLink(event, "contacting")}
            >
              洽谈合作 <ArrowRight size={15} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@rolandwayne.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:contact@rolandwayne.com";
    }
  };

  return (
    <section className="section contact-section module-surface" id="contacting">
      <div className="contact-hands-stage" aria-hidden="true">
        <video
          className="contact-hands-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/contact/contact-hands-poster.jpg"
        >
          <source src="/assets/contact/contact-hands.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="contact-copy">
        <span className="section-kicker">Contact</span>
        <h2>告诉我你想要<br />解决的问题</h2>
        <p>
          适合沟通：科研合作 · 国际医学教育 · 高校课程共建 · AI 科研体系 · 知识管理与自动化工作流
        </p>
        <div className="contact-email">
          <span>邮箱</span>
          <code>contact@rolandwayne.com</code>
        </div>
        <div className="contact-actions">
          <button type="button" className="primary-action" onClick={copyEmail}>
            {copied ? <Check size={17} /> : <Clipboard size={17} />}
            {copied ? "已复制" : "复制邮箱"}
          </button>
          <a className="secondary-action" href="mailto:contact@rolandwayne.com">
            写邮件 <Mail size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [pageAssetsReady, setPageAssetsReady] = useState(false);
  const scrollProgressRef = useRef(null);

  useEffect(() => {
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    const updateProgress = () => {
      const max = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      const progress = max > 0 ? scrollRoot.scrollTop / max : 0;
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    updateProgress();
    scrollRoot.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      scrollRoot.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const legacySection = window.location.hash.slice(1);
    const requestedSection = consumeHomeSection() || legacySection;
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    if (!requestedSection) return;
    window.requestAnimationFrame(() => scrollToPageSection(requestedSection));
  }, []);

  useEffect(() => {
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { root: scrollRoot, rootMargin: "-26% 0px -55%", threshold: [0.08, 0.25, 0.5] },
    );
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`homepage-stage${pageAssetsReady ? " is-ready" : ""}`}>
      <GlobalLandmarkBackground onReady={() => setPageAssetsReady(true)} />

      <div className="site-shell">
        <SVGFollowerCursor />
        <a
          className="skip-link"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            scrollToPageSection("about");
            document.getElementById("main-content")?.focus({ preventScroll: true });
          }}
        >
          跳到主要内容
        </a>
        <div ref={scrollProgressRef} className="scroll-progress" />
        <Header activeSection={activeSection} />
        <ViewportScrollbar />

        <div className="content-scroll-region" id="top">
          <main className="main-content-shell" id="main-content" tabIndex="-1">
            <span className="corner-mark top" aria-hidden="true" />
            <span className="corner-mark bottom" aria-hidden="true" />
            <section className="hero-section module-surface" id="about">
            <div className="hero-cloud-layer" aria-hidden="true">
              <img className="hero-cloud-block hero-cloud-block-a" src="/assets/clouds/hero-cloud-wide.png" alt="" />
            </div>
            <span className="hero-kicker"><Sparkles size={15} /> Research · Systems · Article</span>
            <div className="hero-layout">
              <div className="hero-copy-body hero-enter-copy">
                <h1>Roland<br />Wayne</h1>
                <p className="hero-lead">研究员｜系统构建者｜跨界思考者</p>
                <p className="hero-note">
                  昆士兰大学医学院博士候选人，在健康经济学、实施科学与 AI 系统实践之间，寻找更清晰、更可执行的答案。
                </p>
                <div className="hero-actions">
                  <a className="primary-action" href="/" onClick={(event) => handlePageSectionLink(event, "articles")}>看文章 <ArrowRight size={16} /></a>
                  <a className="secondary-action" href="/" onClick={(event) => handlePageSectionLink(event, "building")}>看实践 <ArrowRight size={16} /></a>
                  <a className="secondary-action" href="/" onClick={(event) => handlePageSectionLink(event, "collaborating")}>谈合作 <ArrowRight size={16} /></a>
                </div>
                <div className="hero-stats" aria-label="关键经历">
                  <div><UsersRound size={18} /><span>X 自媒体博主</span><strong>5.4万粉丝</strong></div>
                  <div><BriefcaseBusiness size={18} /><span>行业经验</span><strong>6+ 年</strong></div>
                  <div><FileText size={18} /><span>单条推文最高曝光</span><strong>2000万+</strong></div>
                </div>
              </div>

              <div className="hero-portrait hero-enter-portrait">
                <div className="portrait-aura" aria-hidden="true" />
                <img className="hero-planes" src="/assets/hero-planes.png" alt="" aria-hidden="true" />
                <div className="portrait-frame">
                  <img src={rolandHeroPortrait} alt="Roland Wayne 真人肖像" />
                  <span className="portrait-halftone" aria-hidden="true" />
                  <div className="portrait-caption">
                    <Quote size={15} />
                    <span>Think clearly. Build patiently.</span>
                  </div>
                </div>
                <img className="wis-mark" src="/assets/wis-logo-dark.png" alt="" aria-hidden="true" />
              </div>
            </div>
            </section>

            <WritingSection />
            <FeaturedAustraliaSection />
            <SignalingSection />
            <BuildingSection />
            <CollaboratingSection />
            <ContactSection />
          </main>
        </div>
      </div>
    </div>
  );
}
