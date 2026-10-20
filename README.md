# Inkwell User Guide

Inkwell is a digital journal for writing, doodling and decorating your pages. Everything you make stays in your own browser. There is no account to create and nothing is uploaded anywhere.

## Contents
1. [Getting started](#getting-started)
2. [The library](#the-library)
3. [The editor](#the-editor)
4. [Text](#text)
5. [Drawing](#drawing)
6. [Photos and stickers](#photos-and-stickers)
7. [Moving, resizing and arranging](#moving-resizing-and-arranging)
8. [Themes and paper](#themes-and-paper)
9. [Backups](#backups)
10. [Privacy](#privacy)
11. [Troubleshooting and FAQ](#troubleshooting-and-faq)
12. [For developers](#for-developers)

## Getting started
Open the Inkwell website in a modern browser (Chrome, Edge, Firefox or Safari), on a computer, tablet or phone. Click **New entry** to start your first page.

Your entries save automatically a moment after every change. The status next to the date shows **Saving…** and then **Saved**.

## The library
The library is the home screen and lists all your entries, newest first.

- **New entry** starts a blank page.
- **Search** filters entries by title or text as you type.
- Click an entry to open it.
- **Delete** on an entry's card removes it permanently, after a confirmation.
- Use the **Theme** menu at the top to change the look of the whole app.

If you open a new entry and leave it empty, it is not kept.

## The editor
At the top you will find the entry **title** and **date**, then the toolbar:

| Button | What it does |
|---|---|
| **Library** | Return to the library |
| **Select** | Pick, move and edit items on the page |
| **Text** | Add a text box |
| **Draw** | Draw with a pen, marker or highlighter |
| **Eraser** | Erase parts of your drawing |
| **Photo** | Add pictures from your device |
| **Sticker** | Open the sticker tray |
| **Paper** | Choose lined, dotted, grid or blank paper |

Extra options appear when you select a tool or an item.

## Text
1. Click **Text**, then click anywhere on the page. A text box appears and you can start typing.
2. With a text box selected, use the text options in the toolbar:
   - **Font:** Caveat (handwriting), Lora (serif), Space Mono (typewriter) or DM Sans (clean sans-serif)
   - **Size:** 10 to 96
   - **Color:** any color
   - **B** and **I:** bold and italic for the words you have highlighted
3. Font, size and color apply to the whole text box. Bold and italic apply only to the selected words.

To edit text later, click **Select** and click inside the box.

## Drawing
1. Click **Draw**. Drawing options appear.
2. Choose a brush:
   - **Pen:** a fine, solid line
   - **Marker:** a thicker, slightly soft line
   - **Highlighter:** a wide, see-through stroke
3. Pick a color and use the slider to set the brush size.
4. Draw on the page with your mouse, finger or stylus.
5. Use **Eraser** to rub out parts of your drawing. It sets its own size from the same slider.

Other controls:
- **Undo stroke** and **Redo** step through your last 25 strokes.
- **Clear drawing** wipes the whole drawing layer (you can undo it right away).

Drawings sit behind text, photos and stickers, so your doodles never block them.

## Photos and stickers
**Photos**
1. Click **Photo** and choose one or more images.
2. Inkwell shrinks large images automatically so your journal stays small and fast.

**Stickers**
1. Click **Sticker** to open the tray, then click a sticker to add it to the page.
2. Click **Sticker** again to close the tray.

## Moving, resizing and arranging
Click **Select**, then click an item. A dashed outline appears with handles.

- **Move:** drag a photo or sticker directly. For a text box, drag the dot at its top-left corner (clicking inside a text box edits it instead).
- **Resize:** drag the dot at the bottom-right corner. For text boxes this changes the width, for stickers the size.
- **Rotate left / Rotate right:** turns the item by 15 degrees each click.
- **Bring to front:** places the item above everything else.
- **Delete:** removes the item. The **Delete** key on your keyboard does the same.

Click an empty part of the page to deselect.

## Themes and paper
- **Theme** (top of the app) changes colors everywhere: Lilac Dusk, Midnight, Matcha, Bubblegum and Ocean. Your choice is remembered.
- **Paper** (in the editor) is saved per entry: lined, dotted, grid or blank.

Text without a custom color follows the theme, so it stays readable in dark themes. If you set a specific text color, it stays that color in every theme.

## Backups
Your entries are stored inside your browser on this device. They are **not** copied anywhere else. That means they can be lost if you clear your browsing data, reinstall your browser, or use a different device or browser.

Protect your work:
- **Export backup** (top of the app) downloads all entries as a single `.json` file. Do this regularly and keep the file somewhere safe.
- **Import backup** loads entries from a backup file. Entries with the same identity are replaced by the backed-up version, and everything else stays.

To move your journal to another device, export on the old one and import on the new one.

## Privacy
- Entries, drawings and photos never leave your device.
- Inkwell has no accounts, tracking or server storage.
- The site loads its fonts from Google Fonts, so your browser contacts Google for those files.
- Private or incognito windows erase entries when closed.

## Troubleshooting and FAQ

**My entries disappeared.**
Browsers delete site data when you clear cookies and site data, or use private mode. If you have a backup file, use **Import backup**.

**Can I use Inkwell on multiple devices?**
Not automatically. Use export and import to copy your journal between them.

**Drawing doesn't work, or the page scrolls when I draw.**
Make sure the **Draw** or **Eraser** button is highlighted. In other modes, touches scroll the page.

**I can't move my text box.**
Clicking inside a text box places the cursor. Select the box and drag the dot at its top-left corner.

**A photo is too large or too small.**
Select it and drag the dot at its bottom-right corner.

**Import says the file is not a backup.**
Only `.json` files created by **Export backup** work.

**Stickers look different on my phone.**
Stickers are emoji, so their style depends on your device's emoji set.

**Is there a limit to how many entries I can keep?**
Browsers allow generous storage, but photos use the most space. If you add many photos, export backups often.

## For developers
Inkwell is a static site with no build step: `index.html`, `style.css` and `app.js`.

- **Run locally:** open `index.html`, or run `python -m http.server` in the folder and visit `http://localhost:8000`.
- **Deploy to GitHub Pages:** push to the `main` branch, then go to **Settings → Pages → Deploy from a branch**, choose `main` and `/ (root)`.
- **Add a theme:** copy a `[data-theme=...]` block in `style.css` and add an `<option>` to the theme menu in `index.html`.
- **Add stickers:** add emoji to the `STICKERS` string in `app.js`.
- **Data:** entries are stored in IndexedDB (database `inkwell`, store `entries`) and contain text, photo and sticker positions plus the drawing as a PNG data URL.
