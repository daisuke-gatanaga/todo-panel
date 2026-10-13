# todo-panel

UI code for a personal to-do panel that renders inside a Claude chat widget.

This repo holds rendering code only. It contains no task data, notes, or credentials; the list itself lives in a separate private repository and is passed to the panel at render time.

- `panel.js`: readable source
- `panel.min.js`: minified build loaded via jsDelivr (`cdn.jsdelivr.net/gh/<owner>/todo-panel@<commit>/panel.min.js`)

Usage: load the script, then call `TDPanel.mount(data)` with an element `#td` on the page.
