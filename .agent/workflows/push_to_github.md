---
description: How to push code to GitHub
---

# Syncing with GitHub

Since you have an existing repository linked, follow these steps to save your changes and upload them to GitHub.

1.  **Stage your changes**:
    ```bash
    git add .
    ```

2.  **Commit your changes** (Save a snapshot):
    ```bash
    git commit -m "feat: Completed full implementation of Bank Exam Portal"
    ```

3.  **Push to GitHub** (Upload):
    ```bash
    git push origin main
    ```

> [!NOTE]
> If you get an error saying `updates were rejected because the remote contains work that you do not have locally`, you may need to pull first:
> `git pull origin main --rebase`
