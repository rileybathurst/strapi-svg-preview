# SVGPreview (Strapi Admin Custom Field)

`SVGPreview` is a Strapi admin custom field input component for editing inline SVG markup.

It provides:
- A textarea where editors can paste raw `<svg>...</svg>` code
- A live preview panel rendered in an iframe
- A string/text custom field value saved through Strapi (`type: text`)

## Files in this folder

- `index.js`: The React input component used by Strapi admin (textarea + live SVG preview).
- `index.d.ts`: Type declaration for the exported component.
- `app.example.tsx`: Example registration snippet only.

## Important note about `app.example.tsx`

`app.example.tsx` is **not used automatically** in this package as-is.

To use that registration code in a Strapi project:
1. Move the file into your Strapi admin app folder: `src/admin/`
2. Rename it by removing `.example` from the filename
3. Final filename should be: `src/admin/app.tsx`

After that, Strapi will load it as your admin app configuration, and the custom field registration can run there.

## What the example registration does

The example registers a custom field with:
- Name: `inline-svg`
- Storage type: `text`
- Input component: dynamically imported from your SVG preview extension component

## Expected behavior

When configured in Strapi content-types, the field lets users:
- Paste inline SVG markup
- See a live visual preview
- Persist the raw SVG string value in the entry data
