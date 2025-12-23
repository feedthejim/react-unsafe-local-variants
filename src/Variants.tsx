"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { VariantsProps } from "./types";
import {
  generateVariantId,
  generateReadScript,
  generateVariantCSS,
} from "./script-generator";

/**
 * Variants component - renders different content based on client-side variant value
 *
 * Architecture:
 * 1. Inline script sets HTML attribute (runs during parse, before paint)
 * 2. CSS rules hide non-matching variants (sync, no flash)
 * 3. All variant content rendered to HTML (for SSR)
 * 4. After hydration, React unmounts non-active variants (clean DOM)
 *
 * @example
 * ```tsx
 * import { variant, fromLocalStorage, Variants } from 'react-unsafe-local-variants'
 *
 * const theme = variant({
 *   key: 'theme',
 *   options: ['light', 'dark', 'system'],
 *   default: 'system',
 *   read: fromLocalStorage('theme')
 * })
 *
 * export default function Page() {
 *   return (
 *     <Variants use={theme}>
 *       {{
 *         light: <LightContent />,
 *         dark: <DarkContent />,
 *         system: <SystemContent />
 *       }}
 *     </Variants>
 *   )
 * }
 * ```
 */
export function Variants<const T extends readonly string[]>({
  use,
  children,
}: VariantsProps<T>): ReactNode {
  const variantId = generateVariantId(use.key, use.options);

  // Track active variant after hydration
  const activeVariant = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return (
      document.documentElement.getAttribute(`data-${use.key}`) || use.default
    );
  }, [use.key, use.default]);

  const [shouldCleanup, setShouldCleanup] = useState(false);

  useEffect(() => {
    const handleLoad = () => setShouldCleanup(true);

    // Check if load already fired (common in SPAs or lazy-loaded components)
    if (document.readyState === "complete") {
      setShouldCleanup(true);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  // Generate scripts and CSS
  const readScript = generateReadScript(use);
  const css = generateVariantCSS(use, variantId);

  return (
    <>
      {/* Read script - runs immediately during HTML parsing to set attribute */}
      <script
        dangerouslySetInnerHTML={{ __html: readScript }}
        suppressHydrationWarning
      />
      {/* CSS to show/hide variants - sync, no flash */}
      <style
        dangerouslySetInnerHTML={{ __html: css }}
        data-variant-styles={variantId}
        suppressHydrationWarning
      />
      {/* Variant wrappers - CSS controls display, React controls content after hydration */}
      {use.options.map((option) => {
        // Before hydration (activeVariant null): render all (CSS hides non-matching)
        // After hydration: only render the active variant
        const shouldRender = activeVariant === null || activeVariant === option;

        if (shouldCleanup && !shouldRender) {
          return (
            <div
              key={option}
              data-variant={option}
              data-variant-key={variantId}
              suppressHydrationWarning
            />
          );
        }

        return (
          <div
            key={option}
            data-variant={option}
            data-variant-key={variantId}
            suppressHydrationWarning
          >
            {children[option as T[number]]}
          </div>
        );
      })}
    </>
  );
}
