# Harmee Social - Git Branch Management Guide

This document explains how to create and manage branches in Git for the Harmee Social project.

## Table of Contents
1. [Creating Branches](#creating-branches)
2. [Switching Branches](#switching-branches)
3. [Merging Branches](#merging-branches)
4. [Rebasing Branches](#rebasing-branches)
5. [Deleting Branches](#deleting-branches)
6. [Best Practices](#best-practices)

## Creating Branches

### Create a new branch
```bash
git branch feature/video-sharing
```

### Create and switch to a new branch
```bash
git checkout -b feature/messaging-system
# or (Git 2.23+)
git switch -c feature/messaging-system
```

### Create a branch from a specific commit
```bash
git branch bugfix/auth-issue abc1234
```

## Switching Branches

### Switch to an existing branch
```bash
git checkout feature/video-sharing
# or
git switch feature/video-sharing
```

### Switch to previous branch
```bash
git checkout -
```

## Merging Branches

### Merge a feature branch into main
```bash
git checkout main
git pull origin main
git merge feature/video-sharing
git push origin main
```

### Merge with a merge commit (recommended for shared branches)
```bash
git merge --no-ff feature/video-sharing
```

### Merge with squash (combine all commits)
```bash
git merge --squash feature/messaging-system
git commit -m "Add messaging system"
```

## Rebasing Branches

### Rebase feature branch onto main
```bash
git checkout feature/video-sharing
git rebase main
```

### Interactive rebase (edit, squash, reorder commits)
```bash
git rebase -i HEAD~3
```

### Continue after resolving conflicts
```bash
git add .
git rebase --continue
```

### Abort rebase if needed
```bash
git rebase --abort
```

## Deleting Branches

### Delete local branch
```bash
git branch -d feature/video-sharing
```

### Force delete local branch
```bash
git branch -D feature/video-sharing
```

### Delete remote branch
```bash
git push origin --delete feature/video-sharing
```

### Delete multiple branches
```bash
git branch -d feature/video-sharing feature/messaging-system
```

## Branch Naming Convention

For the Harmee Social project, use these prefixes:

```
feature/     - New features (feature/video-sharing)
bugfix/      - Bug fixes (bugfix/auth-error)
hotfix/      - Urgent fixes (hotfix/crash-fix)
refactor/    - Code refactoring (refactor/database-layer)
docs/        - Documentation (docs/api-guide)
chore/       - Maintenance (chore/update-dependencies)
test/        - Testing (test/unit-tests)
```

## Workflow Example

### 1. Create feature branch
```bash
git checkout main
git pull origin main
git checkout -b feature/communities
```

### 2. Make changes and commit
```bash
echo "community code" > src/community.tsx
git add src/community.tsx
git commit -m "Add community management UI"
```

### 3. Push to remote
```bash
git push origin feature/communities
```

### 4. Create Pull Request
Go to GitHub and create a PR from `feature/communities` → `main`

### 5. After approval, merge
```bash
git checkout main
git pull origin main
git merge feature/communities
git push origin main
```

### 6. Delete feature branch
```bash
git branch -d feature/communities
git push origin --delete feature/communities
```

## Advanced Workflows

### Cherry-pick commits
```bash
# Copy specific commit from one branch to another
git checkout main
git cherry-pick abc1234
```

### Stash changes
```bash
# Save work in progress without committing
git stash

# Later, restore the stash
git stash pop
```

### View branch history
```bash
# Show all branches
git branch -a

# Show branch creation info
git branch -v

# Show merged branches
git branch --merged
```

## GitHub Actions for Automated Builds

Each branch push triggers automated builds. Check the Actions tab to monitor builds.

---

**Last Updated:** 2026-06-07
