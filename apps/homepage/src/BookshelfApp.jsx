import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

let embeddedPdfUrl = null;

function getEmbeddedPdfUrl(dataUrl) {
  if (!dataUrl.startsWith("data:application/pdf;base64,")) return dataUrl;
  if (embeddedPdfUrl) return embeddedPdfUrl;

  const encodedPdf = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binaryPdf = window.atob(encodedPdf);
  const pdfBytes = new Uint8Array(binaryPdf.length);
  for (let index = 0; index < binaryPdf.length; index += 1) {
    pdfBytes[index] = binaryPdf.charCodeAt(index);
  }
  embeddedPdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
  return embeddedPdfUrl;
}

function openEmbeddedPdf(event, dataUrl) {
  event.currentTarget.href = getEmbeddedPdfUrl(dataUrl);
}

export const books = [
  {
    id: "welcome",
    number: "01",
    title: "Welcome — Why This Site Exists",
    kicker: "Personal / Introduction",
    year: "2025",
    artwork: "/assets/books/welcome.webp",
    tone: "light",
    accent: "#9bcde8",
    thickness: 20,
    href: "https://www.rolandwayne.com/blog/welcome/",
  },
  {
    id: "research-skill",
    number: "02",
    title: "RW Research Skill 更新：科研投稿也可以自动化了",
    kicker: "Research / Automation",
    year: "2026",
    artwork: "/assets/books/rw-research-skill-journal-submission.webp",
    tone: "light",
    accent: "#d26b4c",
    thickness: 26,
    href: "https://www.rolandwayne.com/blog/rw-research-skill-%E6%9B%B4%E6%96%B0%EF%BC%9A%E7%A7%91%E7%A0%94%E6%8A%95%E7%A8%BF%E4%B9%9F%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BA%86/",
  },
  {
    id: "research-answer",
    number: "03",
    title: "科研到底是不是为了找一个正确答案？",
    kicker: "Research / Method",
    year: "2026",
    artwork: "/assets/books/research-correct-answer.webp",
    tone: "dark",
    accent: "#a65d3e",
    thickness: 16,
    href: "https://www.rolandwayne.com/blog/%E7%A7%91%E7%A0%94%E5%88%B0%E5%BA%95%E6%98%AF%E4%B8%8D%E6%98%AF%E4%B8%BA%E4%BA%86%E6%89%BE%E4%B8%80%E4%B8%AA%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88%EF%BC%9F/",
  },
  {
    id: "heart-medicine",
    number: "04",
    title: "年轻人心梗更凶险，但 90% 的人不知道该用哪个药",
    kicker: "Health / Emergency",
    year: "2026",
    artwork: "/assets/books/x-2036839765476053299.webp",
    tone: "dark",
    accent: "#b51e25",
    thickness: 22,
    href: "https://www.rolandwayne.com/blog/x-2036839765476053299/",
  },
  {
    id: "heart-risk",
    number: "05",
    title: "为什么心梗年轻化，且往往首次即致命",
    kicker: "Health / Cardiology",
    year: "2026",
    artwork: "/assets/books/x-2036449395248668903.webp",
    tone: "light",
    accent: "#ef3d32",
    thickness: 30,
    href: "https://www.rolandwayne.com/blog/x-2036449395248668903/",
  },
  {
    id: "apple-watch",
    number: "06",
    title: "为什么 iWatch 会成为 AI 个人健康最重要的基础设施之一",
    kicker: "Health / AI",
    year: "2026",
    artwork: "/assets/books/x-2042247698523578865.webp",
    tone: "light",
    accent: "#63c5bd",
    thickness: 18,
    href: "https://www.rolandwayne.com/blog/x-2042247698523578865/",
  },
  {
    id: "self-learning",
    number: "07",
    title: "应试教育已死，自主学习永生",
    kicker: "Education / Learning",
    year: "2026",
    artwork: "/assets/books/x-2033898692391145673.webp",
    tone: "dark",
    accent: "#e54128",
    thickness: 24,
    href: "https://www.rolandwayne.com/blog/x-2033898692391145673/",
  },
  {
    id: "personal-growth",
    number: "08",
    title: "从三本小镇青年到留澳全奖医学博士，这条路我走了十年",
    kicker: "Memoir / Education",
    year: "2026",
    artwork: "/assets/books/x-2033018070395208107.webp",
    tone: "light",
    accent: "#cf512f",
    thickness: 28,
    href: "https://www.rolandwayne.com/blog/x-2033018070395208107/",
  },
  {
    id: "second-brain",
    number: "09",
    title: "280字看懂，剩下的复制给 Claude Code，你的 AI 第二大脑就搭好了",
    kicker: "AI / Knowledge",
    year: "2026",
    artwork: "/assets/books/claude-code-second-brain-280.webp",
    tone: "light",
    accent: "#9f82d7",
    thickness: 32,
    href: "https://www.rolandwayne.com/blog/claude-code-second-brain-280/",
  },
  {
    id: "housing-market",
    number: "10",
    title: "写在澳大利亚房地产市场崩溃的前夜",
    kicker: "Australia / Housing",
    year: "2026",
    artwork: "/assets/books/australia-housing-market-2026.webp",
    tone: "dark",
    accent: "#c24731",
    thickness: 20,
    href: "https://www.rolandwayne.com/blog/australia-housing-market-2026/",
  },
  {
    id: "ndis",
    number: "11",
    title: "NDIS 正在摧毁澳洲 AI 时代的新国运",
    kicker: "Australia / Policy",
    year: "2026",
    artwork: "/assets/books/ndis-australia-ai-future.webp",
    tone: "dark",
    accent: "#8d151c",
    thickness: 15,
    href: "https://www.rolandwayne.com/blog/ndis-australia-ai-future/",
  },
  {
    id: "australia-economy",
    number: "12",
    title: "AI、矿产与澳洲经济：2026，澳洲能迎来新国运吗？",
    kicker: "Australia / Economy",
    year: "2026",
    artwork: "/assets/books/australia-2026.webp",
    tone: "light",
    accent: "#c88d2c",
    thickness: 27,
    href: "https://www.rolandwayne.com/blog/australia-2026/",
  },
  {
    id: "enterprise-ai-whitepaper-2026",
    number: "13",
    title: "2026 企业 AI 转型白皮书",
    kicker: "WIS / White Paper",
    year: "2026",
    artwork: "/assets/wis-logo-dark.png",
    tone: "dark",
    accent: "#10296f",
    thickness: 30,
    href: "/assets/books/wayne-insightspring-enterprise-ai-whitepaper-2026.pdf",
    format: "pdf",
    cover: "wis",
  },
  {
    id: "x-2044403611573354658",
    number: "14",
    title: "中年男人为什么伟哥越吃越没效果",
    kicker: "男性健康 / 勃起功能障碍",
    year: "2026",
    artwork: "/assets/books/x-2044403611573354658.jpg",
    tone: "dark",
    accent: "#b64f36",
    thickness: 27,
    href: "https://www.rolandwayne.com/blog/x-2044403611573354658/",
  },
  {
    id: "x-2045850686513140191",
    number: "15",
    title: "阳痿和早泄，到底是不是一回事？",
    kicker: "男性健康 / 勃起功能障碍",
    year: "2026",
    artwork: "/assets/books/x-2045850686513140191.jpg",
    tone: "dark",
    accent: "#536b91",
    thickness: 27,
    href: "https://www.rolandwayne.com/blog/x-2045850686513140191/",
  },
];

export function Book({ book, clone, stack, onActivate, onDeactivate }) {
  const style = {
    "--book-thickness": `${book.thickness}px`,
    "--book-accent": book.accent,
    "--stack": stack,
  };

  return (
    <div className="book-slot" style={style}>
      <a
        className={`book-object book-object--${book.tone}${book.cover === "wis" ? " book-object--wis" : ""}`}
        href={book.href}
        target={book.format === "pdf" ? "_blank" : undefined}
        rel={book.format === "pdf" ? "noopener noreferrer" : undefined}
        aria-label={`阅读《${book.title}》`}
        tabIndex={clone ? -1 : 0}
        onClick={book.format === "pdf" ? event => openEmbeddedPdf(event, book.href) : undefined}
        onMouseEnter={() => onActivate(book)}
        onMouseLeave={onDeactivate}
        onFocus={() => onActivate(book)}
        onBlur={onDeactivate}
      >
        <span className="book-back" aria-hidden="true" />
        <span className="book-page-block" aria-hidden="true" />
        <span className="book-page-top" aria-hidden="true" />
        {book.cover === "wis" ? (
          <span className="book-cover book-cover--wis">
            <img className="wis-cover-logo" src={book.artwork} alt="" width="1334" height="375" />
            <strong className="wis-cover-title">{book.title}</strong>
          </span>
        ) : (
          <span className="book-cover">
            <img src={book.artwork} alt="" width="960" height="1440" />
            <span className="book-art-shade" aria-hidden="true" />
            <span className="book-imprint">ROLAND WAYNE / WRITING SERIES</span>
            <span className="book-cover-rule" aria-hidden="true" />
            <strong>{book.title}</strong>
            <span className="book-meta">
              <span>{book.kicker}</span>
              <span>RW / {book.number}</span>
            </span>
            <span className="book-author">Roland Wayne</span>
          </span>
        )}
      </a>
    </div>
  );
}

export function EmbeddedBookshelf() {
  const [activeBook, setActiveBook] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [setCount, setSetCount] = useState(2);
  const shelfWindowRef = useRef(null);
  const shelfTrackRef = useRef(null);
  const firstSetRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const measureLoop = () => {
      const shelfWindow = shelfWindowRef.current;
      const shelfTrack = shelfTrackRef.current;
      const firstSet = firstSetRef.current;
      if (!shelfWindow || !shelfTrack || !firstSet) return;

      const loopDistance = firstSet.offsetWidth;
      const windowWidth = shelfWindow.clientWidth;
      if (!loopDistance || !windowWidth) return;

      shelfTrack.style.setProperty("--loop-distance", `${loopDistance}px`);
      setSetCount(Math.max(3, Math.ceil(windowWidth / loopDistance) + 2));
    };

    measureLoop();
    const observer = new ResizeObserver(measureLoop);
    observer.observe(shelfWindowRef.current);
    observer.observe(firstSetRef.current);
    return () => observer.disconnect();
  }, []);

  const paused = Boolean(activeBook) || reducedMotion;
  const sets = useMemo(() => Array.from({ length: setCount }, () => books), [setCount]);

  return (
    <section className="homepage-bookshelf" aria-label="移动文章书架">
      <div className="homepage-bookshelf-window" ref={shelfWindowRef}>
        <div
          className={`homepage-bookshelf-track${paused ? " is-paused" : ""}`}
          ref={shelfTrackRef}
        >
          {sets.map((set, setIndex) => (
            <div
              className="homepage-book-set"
              key={setIndex}
              ref={setIndex === 0 ? firstSetRef : undefined}
              aria-hidden={setIndex !== 0 ? "true" : undefined}
            >
              {set.map((book, index) => (
                <Book
                  book={book}
                  clone={setIndex !== 0}
                  stack={(setCount * books.length) - (setIndex * books.length + index)}
                  key={`${setIndex}-${book.id}`}
                  onActivate={setActiveBook}
                  onDeactivate={() => setActiveBook(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="homepage-bookshelf-baseline" aria-hidden="true" />
    </section>
  );
}
