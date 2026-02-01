import React, { useState, useRef, useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import type {
  InterfaceTooltipProps,
  TooltipPlacement,
} from 'types/shared-components/Tooltip/interface';
import styles from './Tooltip.module.css';

const TOOLTIP_OFFSET = 8;

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
): { top: number; left: number } => {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - TOOLTIP_OFFSET;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + TOOLTIP_OFFSET;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - TOOLTIP_OFFSET;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + TOOLTIP_OFFSET;
      break;
  }

  // ensure tooltip stays within viewport bounds
  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < padding) {
    left = padding;
  } else if (left + tooltipRect.width > viewportWidth - padding) {
    left = viewportWidth - tooltipRect.width - padding;
  }

  if (top < padding) {
    top = padding;
  } else if (top + tooltipRect.height > viewportHeight - padding) {
    top = viewportHeight - tooltipRect.height - padding;
  }

  return { top, left };
};

const Tooltip: React.FC<InterfaceTooltipProps> = ({
  children,
  content,
  placement = 'top',
  delayShow = 200,
  delayHide = 0,
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltipId = useId();

  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const updatePosition = useCallback(() => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const newPosition = calculatePosition(
        triggerRect,
        tooltipRect,
        placement,
      );
      setPosition(newPosition);
    }
  }, [placement]);

  const showTooltip = useCallback(() => {
    if (disabled) return;

    clearTimeouts();
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
  }, [disabled, delayShow, clearTimeouts]);

  const hideTooltip = useCallback(() => {
    clearTimeouts();
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  }, [delayHide, clearTimeouts]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    },
    [isVisible],
  );

  useEffect(() => {
    if (isVisible) {
      // Use requestAnimationFrame to ensure the tooltip is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isVisible, updatePosition]);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  // Don't render tooltip content if no content
  if (!content) {
    return <>{children}</>;
  }

  const tooltipClasses = [
    styles.tooltip,
    styles[placement],
    isVisible && styles.visible,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.tooltipWrapper}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      {createPortal(
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={tooltipClasses}
          style={{
            top: position.top,
            left: position.left,
          }}
          aria-hidden={!isVisible}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
};

export default Tooltip;
