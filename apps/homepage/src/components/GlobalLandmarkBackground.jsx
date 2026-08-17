import { useEffect, useRef, useState } from "react";

const FALLBACK_DURATION_SECONDS = 15;
const END_FRAME_GUARD_SECONDS = 1 / 24;
const VIDEO_PANES = [
  ["left", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-left-cleanbg-2x.mp4"],
  ["center", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-center-leftmatch-2x.mp4"],
  ["right", "/videos/australia-landmarks-ai-grok-v1-scroll-15s-right-cleanbg-2x.mp4"],
];

function GlobalLandmarkBackground({ onReady }) {
  const videoRefs = useRef([]);
  const onReadyRef = useRef(onReady);
  const didReportReadyRef = useRef(false);
  const [preparedPanes, setPreparedPanes] = useState([]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let cancelled = false;
    let retryTimer = 0;
    let requestController = null;
    let objectUrls = [];

    const prepareVideoPanes = async () => {
      requestController = new AbortController();

      try {
        const responses = await Promise.all(
          VIDEO_PANES.map(([, source]) => fetch(source, {
            cache: "force-cache",
            credentials: "same-origin",
            signal: requestController.signal,
          })),
        );

        responses.forEach((response) => {
          if (!response.ok) throw new Error(`Background video failed to load: ${response.status}`);
        });

        const blobs = await Promise.all(responses.map((response) => response.blob()));
        if (cancelled) return;

        objectUrls = blobs.map((blob) => URL.createObjectURL(blob));
        setPreparedPanes(
          VIDEO_PANES.map(([pane], index) => [pane, objectUrls[index]]),
        );
      } catch (error) {
        if (cancelled || error.name === "AbortError") return;
        requestController.abort();
        retryTimer = window.setTimeout(prepareVideoPanes, 2000);
      }
    };

    prepareVideoPanes();

    return () => {
      cancelled = true;
      requestController?.abort();
      window.clearTimeout(retryTimer);
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (preparedPanes.length !== VIDEO_PANES.length) return undefined;

    const videos = videoRefs.current.filter(Boolean);
    if (videos.length !== VIDEO_PANES.length) return undefined;
    const scrollRoot = document.querySelector(".content-scroll-region");
    if (!scrollRoot) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      const availableDurations = videos
        .map((video) => video.duration)
        .filter((duration) => Number.isFinite(duration) && duration > 0);
      const duration = availableDurations.length > 0
        ? Math.min(...availableDurations)
        : FALLBACK_DURATION_SECONDS;
      const targetTime = Math.min(
        Math.max(0, duration - END_FRAME_GUARD_SECONDS),
        reducedMotion.matches ? 0 : progress * duration,
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
      if (panesAreSynchronized && !didReportReadyRef.current) {
        didReportReadyRef.current = true;
        onReadyRef.current?.();
      }
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
    reducedMotion.addEventListener("change", requestSync);
    resizeObserver?.observe(scrollRoot);
    videos.forEach((video) => video.load());
    requestSync();

    return () => {
      videos.forEach((video) => {
        video.removeEventListener("loadedmetadata", handleMediaReady);
        video.removeEventListener("loadeddata", handleMediaReady);
        video.removeEventListener("canplay", handleMediaReady);
        video.removeEventListener("seeked", handleMediaReady);
      });
      scrollRoot.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      reducedMotion.removeEventListener("change", requestSync);
      resizeObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [preparedPanes]);

  return (
    <div className="global-landmark-background" aria-hidden="true">
      {preparedPanes.map(([pane, source], index) => (
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
