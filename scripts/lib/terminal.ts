export interface KeyEvent {
  name: 'up' | 'down' | 'right' | 'left' | 'enter' | 'space' | 'escape' | 'quit' | 'unknown';
  raw: string;
}

/** Get terminal rows/cols, defaulting to 24x80 */
export function termRows(): number {
  return process.stdout.rows || 24;
}
export function termCols(): number {
  return process.stdout.columns || 80;
}

/** Escape regex special characters */
export function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Enter TUI mode: raw input + alternate screen + hide cursor.
 * Returns a cleanup function that restores everything.
 */
export function enterTui(): () => void {
  const wasRaw = process.stdin.isRaw;
  process.stdin.setRawMode(true);
  process.stdin.resume();
  // Alternate screen buffer + hide cursor
  process.stdout.write('\x1B[?1049h\x1B[?25l');
  return () => {
    // Show cursor + exit alternate screen
    process.stdout.write('\x1B[?25h\x1B[?1049l');
    if (!wasRaw) process.stdin.setRawMode(false);
    process.stdin.pause();
  };
}

export function waitForKey(): Promise<KeyEvent> {
  return new Promise((resolve) => {
    const handler = (data: Buffer) => {
      const s = data.toString();
      process.stdin.removeListener('data', handler);
      if (s === '\x1B[A' || s === 'k') { resolve({ name: 'up', raw: s }); return; }
      if (s === '\x1B[B' || s === 'j') { resolve({ name: 'down', raw: s }); return; }
      if (s === '\x1B[C') { resolve({ name: 'right', raw: s }); return; }
      if (s === '\x1B[D') { resolve({ name: 'left', raw: s }); return; }
      if (s === '\r' || s === '\n') { resolve({ name: 'enter', raw: s }); return; }
      if (s === ' ') { resolve({ name: 'space', raw: s }); return; }
      if (s === '\x1B') { resolve({ name: 'escape', raw: s }); return; }
      if (s === 'q' || s === 'Q') { resolve({ name: 'quit', raw: s }); return; }
      if (s === '\x03') { resolve({ name: 'quit', raw: s }); return; }
      resolve({ name: 'unknown', raw: s });
    };
    process.stdin.on('data', handler);
  });
}

// ---- Scrollable list renderer ----

export interface ScrolledListState {
  /** First visible item index (0-based) */
  scrollOffset: number;
}

/**
 * Render a scrollable list that adapts to terminal height.
 * Uses alternate screen buffer — must be called inside enterTui().
 *
 * - headerLines: always shown at top (title + separator)
 * - itemLines: the scrollable list items
 * - footerLines: always shown at bottom (separator + hint)
 * - cursorIndex: currently highlighted item index (0-based)
 * - selectedIndex: the "selected" item index for sort mode (null = none)
 *
 * Each call clears the entire screen and redraws. No line-counting bugs.
 */
export function renderScrolledList(
  state: ScrolledListState,
  headerLines: string[],
  itemLines: string[],
  footerLines: string[],
  cursorIndex: number,
  _selectedIndex: number | null,
): void {
  const rows = termRows();
  const fixedRows = headerLines.length + footerLines.length;
  // Reserve 2 lines for scroll indicators ("↑ ... more above" / "↓ ... more below")
  const maxVisible = Math.max(3, rows - fixedRows - 2);

  // Auto-scroll to keep cursor in view
  if (itemLines.length <= maxVisible) {
    state.scrollOffset = 0;
  } else {
    if (cursorIndex < state.scrollOffset) {
      state.scrollOffset = cursorIndex;
    } else if (cursorIndex >= state.scrollOffset + maxVisible) {
      state.scrollOffset = cursorIndex - maxVisible + 1;
    }
    state.scrollOffset = Math.max(0, Math.min(state.scrollOffset, itemLines.length - maxVisible));
  }

  // Build output
  const out: string[] = [];
  for (const h of headerLines) out.push(h);

  if (itemLines.length <= maxVisible) {
    for (const item of itemLines) out.push(item);
  } else {
    if (state.scrollOffset > 0) {
      out.push(`  ↑ ... ${itemLines.length - state.scrollOffset} more above ...`);
    }
    const end = Math.min(state.scrollOffset + maxVisible, itemLines.length);
    for (let i = state.scrollOffset; i < end; i++) {
      out.push(itemLines[i]);
    }
    if (end < itemLines.length) {
      out.push(`  ↓ ... ${itemLines.length - end} more below ...`);
    }
  }

  for (const f of footerLines) out.push(f);

  // Full repaint: go home, clear screen, write everything.
  // Join with \n instead of appending \n per-line — a trailing \n would
  // push the final cursor past the bottom, scrolling the header off screen.
  process.stdout.write('\x1B[H\x1B[0J' + out.join('\n'));
}
