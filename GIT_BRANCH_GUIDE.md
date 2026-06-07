# Git Branch Guide

## Standard Branches
- `main` / `master`: Your production-ready main line of code.
- `develop`: Integration branch for new features and updates.

## Creating a Feature Branch
Whenever you are starting work on a new feature, branch out from `main` or `develop`:

```bash
git checkout -b feature/your-feature-name
```

## Creating a Bugfix/Hotfix Branch
```bash
git checkout -b hotfix/issue-name
```

## Committing and Pushing
Make sure your commit messages are descriptive:

```bash
git add .
git commit -m "Add new feature/fix"
git push origin feature/your-feature-name
```
