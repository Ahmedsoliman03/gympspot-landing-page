# Section videos

Drop the real marketing clips here using these exact filenames — the section
`<VideoFrame>` components already point at them and will start playing the
moment the user clicks the play button:

- `gyms.mp4` — "For Gyms" section
- `coaches.mp4` — "For Coaches" section

Until a file exists, the frame shows a themed poster + play button. No video
bytes are fetched until the user clicks play (lazy-loaded for performance).

Optional: add matching poster images and pass `poster="/videos/gyms.jpg"` to
the `<VideoFrame>` in each section component.
