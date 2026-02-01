import React, { useState, useRef, useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import type {
  InterfaceTooltipProps,
  TooltipPlacement,
} from 'types/shared-components/Tooltip/interface';
import styles from './Tooltip.module.css';

const TOOLTIP_OFFSET = 8;

/**
 * Calculates the position for the tooltip based on the trigger element and placement.
 *
 * Computes the top and left coordinates for positioning a tooltip relative to its
 * trigger element. The tooltip is offset from the trigger by TOOLTIP_OFFSET pixels.
 * The resulting coordinates are clamped to ensure the tooltip stays within the
 * viewport bounds with padding to avoid edge overflow.
 *
 * @param triggerRect - The bounding rectangle of the trigger element
 * @param tooltipRect - The bounding rectangle of the tooltip element
 * @param placement - The desired placement position ('top', 'bottom', 'left', or 'right')
 * @returns An object containing the computed top and left coordinates in pixels
 */
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

  // Ensure tooltip stays within viewport bounds with padding
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

/**
 * Tooltip Component
 *
 * A lightweight, accessible tooltip component that displays additional information
 * when users hover over or focus on an element. Uses React Portal for rendering
 * and CSS-based positioning with fixed positioning.
 *
 * Features:
 * - Keyboard accessible (shows on focus, hides on Escape)
 * - ARIA attributes for screen reader support
 * - Configurable show/hide delays
 * - Viewport boundary detection
 * - Repositions on window resize and scroll
 *
 * Props:
 * - children: The trigger element that the tooltip wraps
 * - content: The content to display inside the tooltip
 * - placement: Position relative to trigger ('top', 'bottom', 'left', 'right')
 * - delayShow: Milliseconds to wait before showing (default: 200)
 * - delayHide: Milliseconds to wait before hiding (default: 0)
 * - disabled: When true, tooltip will not appear
 * - className: Additional CSS class for the tooltip element
 *
 * @returns The rendered Tooltip component with trigger and portal content
 *
 * @example
 * ```tsx
 * <Tooltip content="This is helpful information" placement="right">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
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

  // Update position when tooltip becomes visible and on resize/scroll
  useEffect(() => {
    if (isVisible) {
      // Use requestAnimationFrame to ensure the tooltip is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });

      // Reposition on window resize
      const handleResize = (): void => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      };

      // Reposition on scroll (capture phase to catch all scroll events)
      const handleScroll = (): void => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible, updatePosition]);

  // Cleanup timeouts on unmount
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

  const { top, left } = position;
  const positionStyle = { top, left };

  return (
    <>
      <div
        ref={triggerRef}
        role="presentation"
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
          style={positionStyle}
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
