## 1. Interactive Notifications (drawer/modal preview)

Edit `src/routes/notifications.tsx`:
- Replace the current `handleClick` deep-link behavior with a local `activeNotification` state. Clicking a card calls `markRead(n.id)` and sets the active notification (no router navigation).
- Render a responsive overlay using the existing `useIsMobile` hook:
  - Mobile: slide-up bottom drawer (rounded-t-3xl panel anchored to bottom, animates via `translate-y-full → translate-y-0` with the project's 300ms cubic-bezier transition, backdrop dim).
  - Desktop: centered modal card (max-w-md, fade+scale in).
- Drawer/modal content: category icon + tag chip, title (H2), timestamp, priority badge (high/medium/low color), full `n.body` text, and a close button (X icon top-right). Backdrop click and Escape key also close.
- Keep the existing unread→read animation. Remove the navigate-based routing for this screen; deep-link routes (`/notifications/$id`, `/traffic/$id`) remain intact for other entry points.

## 2. AI Assistant file attachment

Edit `src/routes/assistant.tsx` (`ChatWindow` composer):
- Add a `Paperclip` lucide icon button inside the composer between the textarea and the mic button.
- Add a hidden `<input type="file" multiple accept="image/*,application/pdf,.doc,.docx,.txt" />` with a `ref`. The paperclip button calls `inputRef.current?.click()`.
- On file selection, store the chosen files in a local `attachments` state and show small chips above the composer (filename + remove ×). Clearing happens on send.
- This is UI-only attachment capture for now (no upload pipeline); files are listed/previewed locally and cleared after submit. Add a short note in the chip area: "Attachments are captured locally — upload coming soon." Will not modify the `/api/chat` payload.

## 3. Profile picture upload

Edit `src/routes/profile.tsx`:
- Add `avatarUrl` state (initial = current placeholder gradient/image) and a hidden `<input type="file" accept="image/*" ref={...} />`.
- Wire the existing camera-overlay button's `onClick` to `fileInputRef.current?.click()`.
- On change, read the first file via `URL.createObjectURL(file)` and set `avatarUrl`. Render the avatar `<img>` using `avatarUrl` when present, falling back to the current placeholder. Revoke the previous object URL on replacement to avoid leaks.
- Persist to `localStorage` (`gs-avatar`) so the picture survives reloads and rehydrate on mount.

## Notes

- No backend / Lovable Cloud changes — all three features are pure frontend/presentation per the request.
- Tokens/colors stay within the existing `--brand-forest` / `--brand-lime` design system; no new globals.
