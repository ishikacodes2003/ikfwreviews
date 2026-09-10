# IKFW Reviews

## Create a ZIP for sharing

Run the following command from the project directory:

```bash
git ls-files --cached --others --exclude-standard | zip ../ikfwreviews.zip -@
```

The archive is created at `../ikfwreviews.zip`. It includes all Git-tracked files and any untracked files that are not ignored by `.gitignore`. Ignored files and directories—such as `node_modules`—are excluded.

If an older archive already exists, delete it first so removed or newly ignored files are not retained in the ZIP:

```bash
rm -f ../ikfwreviews.zip
git ls-files --cached --others --exclude-standard | zip ../ikfwreviews.zip -@
```
