import React, { useEffect, useState } from 'react';

/**
 * 开屏界面组件（本体端渲染）
 * 数据来源优先级：
 *   1. WebView 原生注入 window.__SPLASH__（APK 壳可优先注入）
 *   2. 同源 config.json 中的 splash 对象（控制台发布通道 data/config.json）
 *   3. 内置默认开屏
 * 支持：背景图片 / 背景纯色 / 标题 / 副标题 / 按钮文案 / 动效 JSON（loader/duration）/ 自定义 CSS
 */
export interface SplashConfig {
  enabled?: boolean;
  bgImage?: string;
  bgColor?: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  json?: string;
  css?: string;
}

/** 内置默认 CSS（作用域限定在 .splash-screen 内，避免污染全站按钮样式） */
const DEFAULT_SPLASH_CSS = `
.splash-loader {
  display: flex;
  justify-content: center;
  margin: 0 0 18px 0;
}
.splash-loader svg .dash {
  animation: splashDashArray 2s ease-in-out infinite, splashDashOffset 2s linear infinite;
}
.splash-loader svg .spin {
  animation: splashSpinDashArray 2s ease-in-out infinite, splashSpin 8s ease-in-out infinite, splashDashOffset 2s linear infinite;
  transform-origin: center;
}
@keyframes splashDashArray {
  0% { stroke-dasharray: 0 1 359 0; }
  50% { stroke-dasharray: 0 359 1 0; }
  100% { stroke-dasharray: 359 1 0 0; }
}
@keyframes splashSpinDashArray {
  0% { stroke-dasharray: 270 90; }
  50% { stroke-dasharray: 0 360; }
  100% { stroke-dasharray: 270 90; }
}
@keyframes splashDashOffset {
  0% { stroke-dashoffset: 365; }
  100% { stroke-dashoffset: 5; }
}
@keyframes splashSpin {
  0% { rotate: 0deg; }
  12.5%, 25% { rotate: 270deg; }
  37.5%, 50% { rotate: 540deg; }
  62.5%, 75% { rotate: 810deg; }
  87.5%, 100% { rotate: 1080deg; }
}
.splash-dots { display: flex; gap: 10px; justify-content: center; margin: 0 0 18px 0; }
.splash-dots span {
  width: 12px; height: 12px; border-radius: 50%;
  background: #e86ba8; display: inline-block;
  animation: splashDotBounce 1.2s ease-in-out infinite;
}
.splash-dots span:nth-child(2) { animation-delay: 0.15s; }
.splash-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes splashDotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
  40% { transform: scale(1); opacity: 1; }
}
.splash-screen .splash-btn {
  --border-radius: 15px;
  --border-width: 3px;
  appearance: none;
  position: relative;
  padding: 0.7em 2em;
  border: 0;
  border-radius: var(--border-radius);
  background-color: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  z-index: 2;
  cursor: pointer;
}
.splash-screen .splash-btn::after {
  content: "";
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  padding: var(--border-width);
  border-radius: var(--border-radius);
  background-image: conic-gradient(#488cfb, #29dbbc, #ddf505, #ff9f0e, #e440bb, #655adc, #488cfb);
  -webkit-mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
  mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
  -webkit-mask-origin: content-box, padding-box;
  mask-origin: content-box, padding-box;
  -webkit-mask-clip: content-box, padding-box;
  mask-composite: exclude;
  -webkit-mask-composite: destination-out;
  animation: splashHue 500ms linear infinite;
  animation-play-state: paused;
}
.splash-screen .splash-btn:hover::after { animation-play-state: running; }
@keyframes splashHue { to { filter: hue-rotate(1turn); } }
`;

function parseLoader(json?: string): string {
  if (!json) return 'ring';
  try {
    const j = JSON.parse(json);
    return typeof j.loader === 'string' && j.loader ? j.loader : 'ring';
  } catch {
    return 'ring';
  }
}

export const SplashScreen: React.FC = () => {
  const [cfg, setCfg] = useState<SplashConfig | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  // 加载开屏配置
  useEffect(() => {
    let cancelled = false;
    const apply = (config: SplashConfig | null) => {
      if (cancelled) return;
      if (!config || config.enabled === false) {
        setCfg(null);
        return;
      }
      setCfg(config);
    };

    const injected = (window as unknown as { __SPLASH__?: SplashConfig }).__SPLASH__;
    if (injected && typeof injected === 'object') {
      apply(injected);
      return;
    }

    fetch('config.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { splash?: SplashConfig } | null) => {
        if (data && data.splash) apply(data.splash);
        else apply({});
      })
      .catch(() => {
        apply({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 自动关闭时长（优先取动效 JSON 中的 duration）
  useEffect(() => {
    if (!cfg) return;
    let jsonDur = 2600;
    try {
      if (cfg.json) {
        const j = JSON.parse(cfg.json);
        if (typeof j.duration === 'number' && j.duration >= 500) jsonDur = j.duration;
      }
    } catch {
      // 忽略非法 JSON
    }
    const timer = window.setTimeout(() => setLeaving(true), jsonDur);
    return () => window.clearTimeout(timer);
  }, [cfg]);

  // 注入 CSS（用户自定义优先，空则注入内置默认）
  useEffect(() => {
    if (!cfg) return;
    const styleId = 'splash-injected-style';
    const old = document.getElementById(styleId);
    if (old) old.remove();
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = cfg.css && cfg.css.trim() ? cfg.css : DEFAULT_SPLASH_CSS;
    document.head.appendChild(style);
    return () => {
      const cur = document.getElementById(styleId);
      if (cur) cur.remove();
    };
  }, [cfg]);

  // 淡出动画结束后卸载
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (!cfg || !visible) return null;

  const bgStyle: React.CSSProperties = {};
  if (cfg.bgImage && cfg.bgImage.trim()) {
    bgStyle.backgroundImage = `url(${cfg.bgImage})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  } else if (cfg.bgColor && cfg.bgColor.trim()) {
    bgStyle.backgroundColor = cfg.bgColor;
  } else {
    bgStyle.background = 'linear-gradient(135deg, #FDF3F9 0%, #F4E9FB 100%)';
  }

  const title = cfg.title || '陈淑婷工具箱';
  const subtitle = cfg.subtitle || '白嫖怪互联网净土';
  const btnText = cfg.btnText || '开始使用';
  const loaderType = parseLoader(cfg.json);

  return (
    <div
      className={`splash-screen ${leaving ? 'splash-leaving' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s ease',
        opacity: leaving ? 0 : 1,
        ...bgStyle
      }}
    >
      <div className="splash-inner" style={{ textAlign: 'center', padding: '0 24px' }}>
        {loaderType === 'dots' ? (
          <div className="splash-loader splash-dots">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <div className="splash-loader">
            <svg viewBox="0 0 50 50" width="64" height="64">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#e86ba8"
                strokeWidth="3"
                className="dash spin"
              />
            </svg>
          </div>
        )}
        {title ? (
          <h1 style={{ margin: '0 0 8px 0', fontSize: 26, fontWeight: 700, color: '#3b2440' }}>
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#8a6b90' }}>{subtitle}</p>
        ) : null}
        {btnText ? (
          <button type="button" className="splash-btn" onClick={() => setLeaving(true)}>
            {btnText}
          </button>
        ) : null}
      </div>
    </div>
  );
};
