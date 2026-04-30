---
description: Debugging command. Activates DEBUG mode for systematic problem investigation.
---

# /debug - Systematic Problem Investigation

$ARGUMENTS

---

## Purpose

This command activates DEBUG mode for systematic investigation of issues, errors, or unexpected behavior. Designed to handle both simple bugs and complex multi-layer issues.

---

## Pre-requisites

**MUST READ before debugging:**
- `@[skills/systematic-debugging]` - 4-phase methodology
- `@[skills/brainstorming]` - Ask clarifying questions first

---

## Step 1: Classify Bug Severity

| Level | Description | Approach |
|-------|-------------|----------|
| **L1 - Simple** | Clear error, single file, obvious cause | Quick fix (5-15 min) |
| **L2 - Medium** | Multiple files, unclear cause | Systematic investigation (30-60 min) |
| **L3 - Complex** | Cross-layer, race conditions, intermittent | Deep analysis + evidence (1-4 hours) |
| **L4 - Critical** | Production down, data loss risk | Emergency protocol |

> ⚠️ **STOP**: Ask user about severity if unclear. Don't assume L1 for unknown bugs.

---

## Step 2: Gather Evidence (BEFORE touching code)

### 2.1 User Interview
```markdown
## 📋 Bug Report
- **What happened?** [Symptom]
- **What should happen?** [Expected]
- **Steps to reproduce?** [1, 2, 3...]
- **When did it start?** [Date/commit]
- **How often?** [Always / Sometimes / Rare]
- **Any recent changes?** [Deploys, updates, config]
```

### 2.2 Evidence Collection Checklist
```markdown
## 🔍 Evidence Collected
- [ ] Error message (full stack trace)
- [ ] Console logs (browser + server)
- [ ] Network tab (request/response, status codes)
- [ ] Database state (relevant records)
- [ ] Git history (recent commits to affected files)
- [ ] Environment (dev/staging/prod, OS, browser)
- [ ] Screenshots/recordings (for UI bugs)
```

### 2.3 Reproduction Attempt
```markdown
## 🔄 Reproduction
**Rate:** [ ] 100% | [ ] 50-90% | [ ] 10-50% | [ ] <10%

**Minimal reproduction:**
1. [Smallest steps to trigger bug]
2. ...

**Isolated?** [ ] Yes | [ ] No (depends on other state)
```

---

## Step 3: Form Hypotheses (NOT random guessing)

### 3.1 Hypothesis Generation
```markdown
## 💡 Hypotheses (ordered by likelihood)

### H1: [Most likely cause] - Confidence: 70%
**Evidence for:** [What supports this]
**Evidence against:** [What contradicts this]
**How to test:** [Specific verification step]

### H2: [Second possibility] - Confidence: 20%
...

### H3: [Less likely] - Confidence: 10%
...
```

### 3.2 Common Cause Categories
| Category | Common Causes | Check First |
|----------|---------------|-------------|
| **Data** | null/undefined, wrong type, stale cache | Console.log inputs |
| **State** | Race condition, async timing, stale closure | Add logging with timestamps |
| **Network** | Failed request, wrong payload, CORS | Network tab |
| **Database** | Wrong query, missing data, constraints | Run query manually |
| **Config** | Env vars, feature flags, permissions | Check .env files |
| **Dependencies** | Version mismatch, breaking changes | Check package.json |

---

## Step 4: Investigate Systematically

### 4.1 Investigation Protocol
```markdown
## 🔬 Investigation Log

### Testing H1: [Hypothesis]
**Method:** [What I did]
**Result:** ✅ Confirmed | ❌ Eliminated | ⚠️ Inconclusive
**Evidence:** [Logs, screenshots, data]
**Next step:** [Continue or move to H2]

### Testing H2: [Hypothesis]
...
```

### 4.2 Debugging Tools by Layer

| Layer | Tools | Commands |
|-------|-------|----------|
| **Frontend** | Browser DevTools, React DevTools, Vue DevTools | `console.log()`, breakpoints |
| **Network** | Network tab, Postman, curl | Check request/response |
| **Backend** | Server logs, debugger | `console.log()`, breakpoints |
| **Database** | DB client, Prisma Studio | Direct queries |
| **Git** | `git log`, `git blame`, `git bisect` | Find breaking commit |

### 4.3 For Intermittent/Flaky Bugs
```markdown
## 🎲 Flaky Bug Analysis

**Possible causes:**
- [ ] Race condition (async timing)
- [ ] Shared state mutation
- [ ] Network latency variation
- [ ] Cache invalidation
- [ ] Time-dependent logic
- [ ] Order-dependent operations

**Strategy:**
1. Add extensive logging with timestamps
2. Run multiple times, collect patterns
3. Check for async/await issues
4. Look for shared mutable state
```

---

## Step 5: Root Cause Analysis (5 Whys)

```markdown
## 🎯 Root Cause Analysis

**Symptom:** [What user reported]

1. **Why?** [First observation]
2. **Why?** [Deeper reason]
3. **Why?** [Still deeper]
4. **Why?** [Getting closer]
5. **Why?** [ROOT CAUSE]

**Root cause category:**
- [ ] Code logic error
- [ ] Missing validation
- [ ] Incorrect assumption
- [ ] Race condition
- [ ] Configuration issue
- [ ] Third-party bug
- [ ] Data corruption
```

---

## Step 6: Fix Implementation

### 6.1 Fix Checklist
```markdown
## 🔧 Fix Plan

**Root cause:** [Identified cause]
**Fix approach:** [How to fix]
**Files to modify:** [List files]
**Risk assessment:** [ ] Low | [ ] Medium | [ ] High

**Before fixing:**
- [ ] Created backup/branch
- [ ] Understood all affected code
- [ ] Considered edge cases
```

### 6.2 Fix Format
```markdown
### Code Change

**File:** `[filepath]`

```[language]
// ❌ BEFORE (buggy)
[old code]

// ✅ AFTER (fixed)
[new code]

// 💡 WHY: [Explanation of root cause and fix]
```
```

---

## Step 7: Verification

```markdown
## ✅ Verification Checklist

### Primary Verification
- [ ] Bug no longer reproduces (test multiple times)
- [ ] Original test case passes
- [ ] Edge cases tested

### Regression Verification
- [ ] Related functionality still works
- [ ] No new console errors
- [ ] No new TypeScript/lint errors
- [ ] Existing tests pass

### Prevention
- [ ] Added test case for this bug
- [ ] Added validation to prevent recurrence
- [ ] Updated documentation if needed
- [ ] Checked for similar bugs elsewhere
```

---

## Step 8: Post-Mortem (for L3/L4 bugs)

```markdown
## 📝 Bug Post-Mortem

**Bug ID:** [Reference]
**Severity:** L[3/4]
**Time to fix:** [Duration]

### Timeline
- [Time] Bug reported
- [Time] Investigation started
- [Time] Root cause found
- [Time] Fix deployed
- [Time] Verified

### What went wrong
[Technical explanation]

### Why it wasn't caught
[Gap in testing/review/process]

### Prevention measures
1. [Concrete action item]
2. [Another action item]

### Lessons learned
[What to do differently next time]
```

---

## Output Format (Summary)

```markdown
## 🔍 Debug: [Issue Title]

### 1. Symptom
[What's happening]

### 2. Evidence Collected
- Error: `[error message]`
- File: `[filepath]`
- Reproduction rate: [Always/Sometimes/Rare]

### 3. Hypotheses Tested
| # | Hypothesis | Result | Evidence |
|---|------------|--------|----------|
| H1 | [Cause] | ✅/❌ | [What proved/disproved] |
| H2 | [Cause] | ✅/❌ | [What proved/disproved] |

### 4. Root Cause
🎯 **[Explanation using 5 Whys result]**

### 5. Fix Applied
```[language]
// Before (buggy)
[old code]

// After (fixed)
[new code]
```

### 6. Verification
- [x] Bug fixed
- [x] Regression tested
- [x] Test added

### 7. Prevention
🛡️ [How to prevent recurrence]
```

---

## Quick Reference Commands

```bash
# Git - Find breaking commit
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-commit>

# Git - Recent changes to file
git log --oneline -20 -- path/to/file.ts
git blame path/to/file.ts

# Search for pattern
grep -r "errorPattern" --include="*.ts"

# Check logs (if using PM2)
pm2 logs app-name --err --lines 100

# Database (Prisma)
npx prisma studio
```

---

## Anti-Patterns (NEVER DO)

| ❌ Anti-Pattern | ✅ Correct Approach |
|-----------------|---------------------|
| Random code changes | Test hypothesis first |
| "It works on my machine" | Check environments |
| Ignoring evidence | Follow the data |
| Fixing symptoms only | Find root cause |
| Not reproducing first | Always reproduce |
| Skipping verification | Test thoroughly |
| No regression test | Always add test |

---

## Examples

```
/debug login not working
/debug API returns 500 on POST /orders
/debug form doesn't submit after clicking button
/debug data not saving after drag and drop
/debug intermittent timeout on checkout
/debug memory leak in dashboard
```
