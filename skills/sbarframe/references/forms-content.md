# Forms, content and localization

## Form contract

Inventory label, internal name, purpose, native input type, required status, accepted formats, boundary constraints, error message and receiving destination. Use native validation where it meets the requirement. Select custom code or a service only for a demonstrated gap. Confirm native behavior live; browser validation may accept values a business rule rejects.

Test empty and whitespace-only fields, malformed email/URL, minimum/maximum boundaries, valid values, correction after error, Enter submission, keyboard focus order, touch, repeated clicks, pending/disabled state, failure/retry and success. Associate errors with fields and announce asynchronous results appropriately. Keep values after recoverable failure and do not expose submitted personal data in logs/screenshots.

For phone/name fields avoid imposing an arbitrary regional/Latin-only regex. If uploads, conditional fields or backend constraints apply, confirm current capability and receiving-service checks. Do not embed API keys in a component. For custom endpoints verify server-side validation, abuse controls, permitted origins and timeout handling where relevant.

A client success state proves only that state. Delivery requires approved test data and observed receiving-service evidence. A production submission or message is allowed only when user authority covers it. If recipient access is unavailable, retain delivery as blocked and continue local input tests. Record privacy/consent requirements from actual flows without inventing jurisdictional conclusions.

## CMS and route contract

Use documented native bindings or supported APIs. Do not scrape private child props or import generated private CMS modules. Map optional/reference/image/slug fields and repeatable data before building cards. Test empty collection, zero results, combined filters, clear/reset, pagination and return navigation. Native dynamic filtering and empty layouts exist; check current docs before recommending a workaround.

Test index and detail routes directly and via a real card click, browser back/forward, drafts, unpublished/missing items, empty/long titles, missing images and replacement assets. Ensure links have one semantic owner; nesting anchors can cause published placeholders. A correct item rendered inside editor Preview does not prove its public route.

## Arabic and other locales

Review native localization sources and approval states, source language, translated content, metadata, CMS, forms, navigation, footer and error states. Preserve stable identifiers, brands and slugs unless the requested locale contract changes them. Test mixed-script copy, Arabic shaping/leading, numerals, phone/email strings, directional icons and reading order.

Use actual RTL layout/reverse controls rather than mirroring every image/icon mechanically. Confirm direct locale URLs, full reload, canonical/hreflang/lang output and locale-preserving links. SPA navigation alone may leave source-level SEO tags unchanged; do not infer a broken locale setup from that one observation. Updated slugs/locales need redirect/rewrite coverage. Native editor/Preview freshness must be checked against actual visible state after changes.

## Official sources

Reviewed October 6, 2026; refresh affected docs and record updates in project COMPLIANCE.md.

- [Native field types and required fields](https://www.framer.com/help/articles/add-different-field-types-to-native-form/)
- [Create your first form](https://www.framer.com/academy/lessons/creating-your-first-form), older UI lesson, validate current editor
- [Dynamic filters](https://www.framer.com/help/articles/how-to-add-dynamic-filters/)
- [CMS empty layouts](https://www.framer.com/updates/empty-states-in-cms-lists)
- [Unsupported CMS internals](https://www.framer.com/help/articles/issues-with-code-components-accessing-the-cms/)
- [RTL layout guidance](https://www.framer.com/help/articles/rtl-best-practices/)
- [Hreflang after navigation](https://www.framer.com/help/articles/hreflang-tags-dont-change-after-switching-language/)
- [Nested link warnings](https://www.framer.com/help/articles/how-to-fix-nested-links-optimization-warning/)
