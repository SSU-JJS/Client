---
name: github-workflow
description: "Handles the repository's GitHub delivery workflow end to end: creating an issue, creating or renaming a branch, validating changes, making a conventional commit, pushing the branch, and opening a pull request. Use when the user asks for issue creation, branch creation or rename, commit, push, PR creation, or the full GitHub handoff workflow."
user-invocable: false
---

# GitHub Workflow

Use this skill when the user wants the repository change wrapped up into GitHub artifacts, especially requests like:

- "이슈 생성/브랜치/커밋/pr까지 진행"
- "브랜치 이름 바꾸고 PR 열어줘"
- "이 작업 이슈랑 커밋까지 정리해줘"

Keep the flow non-interactive and repository-safe.

## Preconditions

1. Check local state first.
   - `git status --short --branch`
   - `git remote -v`
   - `git log --oneline -5`
2. If there are unrelated staged or modified files, do not revert them. Scope the workflow only to the user-requested change.
3. Check GitHub CLI auth before issue or PR creation.
   - `gh auth status`
4. If network access or auth blocks the workflow, continue as far as possible locally, then surface the exact blocker.

## Required Validation

Before committing non-trivial work, run the repository validation commands from `AGENTS.md`:

- `pnpm tsc --noEmit`
- `pnpm biome lint .`
- `pnpm build`

Report pass/fail status in the final handoff and include the same validation list in the PR body.

## Workflow

1. Summarize the change in one line and identify the conventional commit type.
   - Use `feat(<domain>): ...`, `fix(<domain>): ...`, or `chore: ...`
2. Create or rename the working branch.
   - New branch: `git checkout -b <branch-name>`
   - Rename current branch: `git branch -m <new-branch-name>`
3. Create the GitHub issue if the user asked for it or asked for the full workflow.
   - Prefer a concise title matching the change.
   - Use a body with `Summary` and `Validation` sections.
4. Stage only the intended files.
   - `git add <paths...>`
5. Commit with a conventional message.
   - `git commit -m "<type(scope): summary>"`
6. Push the branch.
   - `git push -u origin <branch-name>`
7. Create the PR.
   - Base branch is usually `main` unless local context says otherwise.
   - PR body should contain:
     - `Summary`
     - `Validation`
     - `Closes #<issue-number>` when applicable

## Naming Guidance

- Issue title: short, user-facing, outcome-oriented
- Branch name: lowercase kebab-case with a type prefix
- Good branch examples:
  - `fix/branding-svg-refresh`
  - `feat/auth-profile-page`
  - `chore/update-mock-handlers`

Prefer branch names that match the commit intent. Include the issue number only when the repository already uses that convention.

## Command Patterns

Use non-interactive `gh` commands.

```bash
gh issue create --repo <owner/repo> --title "<title>" --body "<body>"
gh pr create --repo <owner/repo> --base main --head <branch> --title "<title>" --body "<body>"
```

When body text is multi-line, quote it safely. Avoid shell interpolation bugs from backticks inside double quotes.

## Branch Rename Notes

When the user explicitly asks to rename a branch:

1. Rename locally with `git branch -m`.
2. Push the renamed branch with `git push -u origin <new-branch-name>`.
3. Only delete the old remote branch if the user explicitly asks for it.

Do not delete remote branches as part of the default flow.

## Final Handoff

Return:

- issue number and URL, if created
- branch name
- commit SHA and message
- PR number and URL, if created
- validation results

If any GitHub step failed, clearly separate:

- completed local steps
- blocked remote steps
- exact reason, such as invalid `gh` auth or network restrictions
