# michalmariuszlewandowski.github.io

This is your GitHub Pages website repository.

## Files

- `index.html` — homepage
- `styles.css` — styling
- `math.js` — KaTeX auto-render setup for LaTeX-style math in HTML
- `posts/` — short article explanation pages linked from the research cards
- `cv.pdf` — your CV linked from the homepage
- `.nojekyll` — tells GitHub Pages to serve the site as plain static files

## Publish it on GitHub Pages

### Browser-only method

1. Sign in to GitHub.
2. Create a new repository named exactly `michalmariuszlewandowski.github.io`.
3. Set the repository to **Public** unless you already know your GitHub plan supports private Pages.
4. Open the new repository.
5. Click **Add file** → **Upload files**.
6. Upload every file from this folder: `index.html`, `styles.css`, `cv.pdf`, `.nojekyll`, and this `README.md`.
7. Commit the upload to the `main` branch.
8. Open **Settings** → **Pages**.
9. Under **Build and deployment**, choose **Deploy from a branch**.
10. Select branch `main` and folder `/ (root)`.
11. Click **Save**.
12. Wait a few minutes, then visit `https://michalmariuszlewandowski.github.io/`.

### Git method

```bash
git clone git@github.com:michalmariuszlewandowski/michalmariuszlewandowski.github.io.git
cd michalmariuszlewandowski.github.io
cp /path/to/index.html .
cp /path/to/styles.css .
cp /path/to/cv.pdf .
touch .nojekyll
git add .
git commit -m "Initial website"
git push origin main
```

Then in GitHub open **Settings** → **Pages** and make sure the source is `main` and `/ (root)`.

## Editing later

- Change text in `index.html`.
- Change article explanations in the corresponding `posts/*.html` file.
- Change styling in `styles.css`.
- Write inline math as `\( ... \)` or `$ ... $`, and display math as `\[ ... \]` or `$$ ... $$`.
- Replace `cv.pdf` when you update your CV.
- Commit and push again. GitHub Pages will redeploy automatically.

## Common problems

- 404 page: make sure the repository name is exactly `michalmariuszlewandowski.github.io`.
- 404 page: make sure `index.html` is in the repository root, not inside another folder.
- Styles missing: make sure `styles.css` is in the repository root.
- CV link broken: make sure the file is named exactly `cv.pdf`.
- Old version still showing: wait up to 10 minutes and hard refresh the browser.
