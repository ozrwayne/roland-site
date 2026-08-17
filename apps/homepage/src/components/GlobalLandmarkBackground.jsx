import { useEffect, useRef } from "react";

const FALLBACK_DURATION_SECONDS = 15;
const END_FRAME_GUARD_SECONDS = 1 / 24;
const VIDEO_PANES = [
  ["left", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-left-cleanbg-2x.mp4"],
  ["center", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-center-leftmatch-2x.mp4"],
  ["right", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-right-cleanbg-2x.mp4"],
];

function GlobalLandmarkBackground() {
  const backgroundRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    if (videos.length !== VIDEO_PANES.length) return undefined;
    const background = backgroundRef.current;
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    let animationFrame = 0;
    let metadataReady = videos.every(
      (video) => video.readyState >= HTMLMediaElement.HAVE_METADATA,
    );

    const syncVideoToScroll = () => {
      animationFrame = 0;
      if (!metadataReady) return;

      const scrollRange = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      const progress = scrollRange > 0
        ? Math.min(1, Math.max(0, scrollRoot.scrollTop / scrollRange))
        : 0;
      const duration = Number.isFinite(videos[0].duration)
        ? videos[0].duration
        : FALLBACK_DURATION_SECONDS;
      const targetTime = Math.min(
        Math.max(0, duration - END_FRAME_GUARD_SECONDS),
        progress * duration,
      );

      videos.forEach((video) => {
        if (Math.abs(video.currentTime - targetTime) > 1 / 120) {
          video.currentTime = targetTime;
        }
      });

      const panesAreSynchronized = videos.every(
        (video) =>
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          !video.seeking &&
          Math.abs(video.currentTime - targetTime) <= 1 / 60,
      );
      if (panesAreSynchronized) background?.classList.add("is-ready");
    };

    const requestSync = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(syncVideoToScroll);
      }
    };

    const handleMediaReady = (event) => {
      event.currentTarget.pause();
      metadataReady = videos.every(
        (video) => video.readyState >= HTMLMediaElement.HAVE_METADATA,
      );
      requestSync();
    };

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(requestSync);

    videos.forEach((video) => {
      video.addEventListener("loadedmetadata", handleMediaReady);
      video.addEventListener("loadeddata", handleMediaReady);
      video.addEventListener("canplay", handleMediaReady);
      video.addEventListener("seeked", handleMediaReady);
    });
    scrollRoot.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync, { passive: true });
    resizeObserver?.observe(scrollRoot);
    requestSync();

    return () => {
      videos.forEach((video) => {
        video.removeEventListener("loadedmetadata", handleMediaReady);
        video.removeEventListener("loadeddata", handleMediaReady);
        video.removeEventListener("canplay", handleMediaReady);
        video.removeEventListener("seeked", handleMediaReady);
      });
      background?.classList.remove("is-ready");
      scrollRoot.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      resizeObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={backgroundRef} className="global-landmark-background" aria-hidden="true">
      {VIDEO_PANES.map(([pane, source], index) => (
        <video
          key={pane}
          ref={(node) => { videoRefs.current[index] = node; }}
          className={`global-landmark-background__video global-landmark-background__video--${pane}`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src={source} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}

export default GlobalLandmarkBackground;
