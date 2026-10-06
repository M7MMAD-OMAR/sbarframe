# Motion, performance and SEO

## Motion map

Record each component/section/element group, its role, trigger, static decision or animation, animated property owner, timing/easing, relation to adjacent sections, breakpoint/touch behavior and reduced-motion fallback. Static is a valid deliberate decision; it is not permission to omit an explicit owner-requested effect. Use a small shared timing/easing vocabulary to coordinate entrances, emphasis and feedback. Avoid compounded child/parent transforms or two controllers fighting for opacity/position.

Check the first meaningful paint before hydration and before any observer/effect fires. Content must not depend on a shader, animation, hover or delayed JavaScript to become readable. Initial/server output must be deterministic. Read browser APIs inside appropriate effects, not at module scope or SSR render. Never disable pre-rendering just to hide warnings on required content.

Test real controls on actual Framer instances, initial/static canvas, Preview, disabled animation, reduced motion, slow media, failure fallback, scroll/touch/keyboard, multiple instances, unmount/remount, route changes, resize and hidden/offscreen pause. Clean up observers, listeners, timers, animation frames and GPU resources. Bound image/device-pixel-ratio/render-work cost. Record external dependencies and versions.

Native and code techniques have different contracts. Read generated official Framer task maps and current code-component guidance before using unfamiliar methods. Verify root style forwarding, sizing annotations and readable prop defaults. Use native Slots/shared components for repeated content/actions and avoid private DOM/CMS traversal. For critical first-screen content, consider native Appear rather than scroll-dependent effects and verify actual LCP/visibility. This is current Framer guidance, not a mandatory effect on every element.

## Performance method

Choose project budgets with a rationale before implementation. At minimum record delivered bytes/requests for critical media, font families/weights, scripts/embeds and representative slow interactions. No universal component size or Lighthouse 100 score certifies quality. Reject measured regression beyond the adopted budget and retain comparable baselines.

Use repeated lab runs at fixed viewport, device/browser, network/CPU profile, cache state and exact artifact revision. Record individual results and medians. Core Web Vitals good field thresholds are LCP <= 2.5s, INP <= 200ms and CLS <= 0.1 at the 75th percentile, according to the [official Web Vitals reference](https://web.dev/articles/vitals). Verify that reference when establishing a project target. Lighthouse lab metrics do not establish field percentiles or field INP. Missing field data is explicit; follow project-specific owner decisions on lab-only launch evidence and document their limit rather than inventing a field pass.

For native images start with Auto resolution and inspect actual srcset/sizes, dimensions, crop/quality, decoded display and request timing. Framer handles most conversion/resizing, so manual WebP conversion is not a blanket rule. Preserve original assets. For custom images use appropriately sized responsive candidates supported by current Framer APIs. Measure delivered bytes, not repository file sizes. Discover critical LCP images early and avoid lazy loading those assets, defer noncritical media, reserve image/video dimensions and avoid speculative preloads that compete with content. A noncritical hero detail need not be eager.

If a menu works in Preview but fails on iOS, reproduce the exact interaction/browser case and inspect overlapping triggers and real native destinations. The [official mobile-navigation remedy](https://www.framer.com/help/articles/my-navigation-works-in-preview-mode-but-not-on-mobile/) includes timing for a specific absolute-URL case. Do not apply that delay globally or infer actual iOS behavior from viewport emulation.

Restrict custom scripts to pages where needed, avoid duplicate trackers and oversized libraries, subset font families/weights responsibly, optimize video with poster/fallback and limit decorative 3D/shaders. Evaluate plugin changes against visual quality, native editing and real public payload. Respect project identity and recovery policies when diagnosing issues.

## SEO contract

Inventory route/locale/CMS template, title, description, canonical/indexing intent, social image and structured-data applicability. Check semantic headings/landmarks, meaningful alt decisions, crawlable links, robots/sitemap, 404, redirects and initial HTML. Keep essential content outside overlays or user-triggered media when crawlability matters. Structured data must describe real content and be validated; do not invent reviews or organization facts.

Inspect direct published locale routes on full reload and compare current deployment identity. A page component supplies semantics/alt and tells the host which page-level metadata remains necessary. A free-standing component does not require its own sitemap. Document applicability instead of deleting the SEO category.

## Official sources

Reviewed October 6, 2026, refresh per affected work:

- [Native speed and image handling](https://www.framer.com/help/articles/site-optimization/)
- [Repeated PageSpeed checks](https://www.framer.com/help/articles/how-to-optimize-pagespeed-insights/)
- [SEO capabilities](https://www.framer.com/help/articles/guide-to-seo-features-and-tools/)
- [Optimization diagnostics](https://www.framer.com/help/articles/how-to-debug-a-publish-or-optimization-warning/)
- [Browser-only code and optimization errors](https://www.framer.com/help/articles/how-to-fix-cannot-set-properties-of-undefined-optimization-error/)
- [Code-component rendering](https://www.framer.com/developers/components-introduction)
- [Controls](https://www.framer.com/developers/property-controls) and [sizing](https://www.framer.com/developers/auto-sizing)
- [Animation troubleshooting](https://www.framer.com/help/articles/troubleshooting-animation-issues/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), recommended AA target, automated plus manual review
