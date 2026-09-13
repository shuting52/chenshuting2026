import React, { useEffect, useRef } from 'react';

// Core Socialist Values: 12 words
const VALUES_WORDS = [
  '富强',
  '民主',
  '文明',
  '和谐',
  '自由',
  '平等',
  '公正',
  '法治',
  '爱国',
  '敬业',
  '诚信',
  '友善'
];

// Curated vibrant theme colors
const COLORS = [
  '#ef4444', // 鲜红
  '#f59e0b', // 琥珀金
  '#10b981', // 翠绿
  '#3b82f6', // 宝蓝
  '#8b5cf6', // 紫罗兰
  '#ec4899', // 玫瑰粉
  '#06b6d4'  // 晴空青
];

export const ClickEffectManager: React.FC = () => {
  const lastTriggerTimeRef = useRef<number>(0);
  const keyIndexRef = useRef<number>(0);
  const activeNodesCountRef = useRef<number>(0);

  useEffect(() => {
    // Check if clicked element or its ancestors are interactive
    const isInteractiveElement = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      const interactiveSelector = [
        'a',
        'button',
        'input',
        'textarea',
        'select',
        'label',
        'summary',
        '[role="button"]',
        '[role="tab"]',
        '[role="dialog"]',
        '[role="menuitem"]',
        '[role="checkbox"]',
        '[role="switch"]',
        '.iiice-card',
        '.iiice-subcat-item',
        '.modal-content',
        '[data-interactive="true"]'
      ].join(',');

      return Boolean(target.closest(interactiveSelector));
    };

    // Spawn floating word
    const spawnWord = (x: number, y: number) => {
      // Throttle: minimum 160ms between words
      const now = Date.now();
      if (now - lastTriggerTimeRef.current < 160) {
        return;
      }
      lastTriggerTimeRef.current = now;

      // Limit max concurrent DOM nodes to avoid mobile memory lag
      if (activeNodesCountRef.current > 12) {
        return;
      }

      const word = VALUES_WORDS[keyIndexRef.current];
      keyIndexRef.current = (keyIndexRef.current + 1) % VALUES_WORDS.length;

      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const randomRotate = (Math.random() * 20 - 10).toFixed(1); // -10deg to +10deg
      const randomDriftX = (Math.random() * 30 - 15).toFixed(1); // -15px to +15px

      // Create floating span
      const span = document.createElement('span');
      span.textContent = word;
      span.className = 'click-float-word';
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.color = randomColor;
      span.style.setProperty('--drift-x', `${randomDriftX}px`);
      span.style.setProperty('--drift-rotate', `${randomRotate}deg`);

      document.body.appendChild(span);
      activeNodesCountRef.current += 1;

      // Clean up after 1s animation
      setTimeout(() => {
        if (span.parentNode) {
          span.parentNode.removeChild(span);
        }
        activeNodesCountRef.current = Math.max(0, activeNodesCountRef.current - 1);
      }, 1000);
    };

    // Desktop Mouse Click
    let lastTouchTime = 0;
    const handleClick = (e: MouseEvent) => {
      // Prevent double firing right after touch event on mobile devices
      if (Date.now() - lastTouchTime < 450) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (isInteractiveElement(target)) {
        return;
      }

      spawnWord(e.pageX, e.pageY);
    };

    // Mobile Touch Handling (distinguish scrolling/swiping from stationary tap)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      touchStartX = touch.pageX;
      touchStartY = touch.pageY;
      touchStartTime = Date.now();
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.pageX - touchStartX);
      const deltaY = Math.abs(touch.pageY - touchStartY);

      // If moved more than 8px, user is scrolling or swiping, cancel float
      if (deltaX > 8 || deltaY > 8) {
        isScrolling = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      lastTouchTime = Date.now();

      // If it was a scroll gesture or long press (> 400ms), ignore
      if (isScrolling || Date.now() - touchStartTime > 400) {
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
      if (isInteractiveElement(target)) {
        return;
      }

      spawnWord(touch.pageX, touch.pageY);
    };

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
};
