---
description: Set a durable goal for long-running autonomous work. Codex keeps working across turns toward a verifiable stopping condition without needing user input each step.
---

# /goal - Follow a Goal (Long-Running Autonomous Work)

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **ONE objective, ONE stopping condition** - No ambiguity
2. **Work autonomously** - Do NOT ask user for input between checkpoints
3. **Checkpoint after each milestone** - Log progress, verify, continue
4. **Stop only when done** - Reach the verifiable end state or report blocker
5. **No hallucinated completions** - Every checkpoint must have real evidence

---

## Phase 0: Goal Contract (BEFORE starting work)

### 0.1 Parse the Goal

Extract from `$ARGUMENTS`:

| Field | Description | Example |
|-------|-------------|---------|
| **Objective** | What to achieve | "Migrate auth to JWT" |
| **Stopping Condition** | When to stop | "All tests pass, legacy auth removed" |
| **Constraints** | What NOT to change | "Keep API shape, no DB changes" |
| **Validation** | How to prove progress | "Run `npm test` after each file" |

### 0.2 Validate Goal Quality

```
GOOD GOAL (proceed):
- Clear objective + verifiable stopping condition
- Enough room for autonomous progress
- Has validation commands or artifacts

BAD GOAL (ask for clarification):
- Vague: "improve the codebase"
- No stopping condition: "keep making it better"
- Too broad: "build a full SaaS platform"
- No validation: "make it faster"
```

If goal is bad, STOP and ask:
```
⚠️ Goal needs clarification:

1. What exactly should be achieved? [specific objective]
2. How do we know it's done? [verifiable stopping condition]
3. What should NOT be changed? [constraints]
4. How to validate progress? [test/build command]
```

### 0.3 Create Goal State File

Create `.opencode/goal-state.md`:

```markdown
# Goal: [Objective]

## Status: ACTIVE
## Started: [timestamp]
## Last Checkpoint: [timestamp]

## Stopping Condition
[Exact description of "done"]

## Constraints
- [What NOT to change]

## Validation Command
[Command to verify progress]

## Checkpoints
### Checkpoint 0: Initialized
- Goal parsed: ✅
- Files scanned: ✅
- Plan created: ✅

## Progress Log
[Auto-updated after each checkpoint]
```

---

## Phase 1: Initial Assessment

### 1.1 Scan Codebase
Before making changes, understand the current state:

1. Read relevant files mentioned in the goal
2. Identify affected modules, tests, configs
3. Check git status for current state
4. Run baseline validation command

### 1.2 Create Execution Plan

```markdown
## Execution Plan

### Step 1: [First scoped change]
- Files: [list]
- Validation: [command]
- Risk: Low/Med/High

### Step 2: [Second scoped change]
- Files: [list]
- Validation: [command]
- Risk: Low/Med/High

### Step N: [Final verification]
- Run full test suite
- Verify stopping condition met
```

### 1.3 Save Plan to Goal State

Update `.opencode/goal-state.md` with the execution plan.

---

## Phase 2: Autonomous Execution Loop

### 2.1 Checkpoint Protocol

After EACH meaningful change:

```markdown
## Checkpoint [N]: [Brief description]
**Time:** [timestamp]
**Changed:** [files modified]
**Validation:** [command output - PASS/FAIL]
**Evidence:** [actual test output, build result, etc.]
**Next:** [what comes next]
**Blocked:** No | [reason if yes]
```

### 2.2 Execution Rules

| Rule | Description |
|------|-------------|
| **Scoped changes** | One logical change per checkpoint |
| **Validate before continuing** | Run validation command after each change |
| **Rollback on failure** | If validation fails, revert and try different approach |
| **No skipping** | Don't skip validation to "save time" |
| **Evidence required** | Every checkpoint needs real command output |
| **Max 3 retries** | If same approach fails 3 times, report blocker |

### 2.3 Progress Reporting

After every 3 checkpoints OR when significant progress made:

```markdown
## 📊 Progress Report

**Goal:** [objective]
**Status:** IN PROGRESS | BLOCKED | COMPLETE
**Checkpoints completed:** N/M
**Current step:** [description]
**Files changed:** [count]
**Tests passing:** [status]

### Recent changes:
- [Checkpoint N-2]: [what was done]
- [Checkpoint N-1]: [what was done]
- [Checkpoint N]: [what was done]

### Next steps:
- [What will be done next]

### Blockers (if any):
- [What is blocking and why]
```

---

## Phase 3: Stopping Condition Verification

### 3.1 Check Completion

When all planned steps are done, verify the stopping condition:

```markdown
## ✅ Stopping Condition Check

**Condition:** [original stopping condition]

### Evidence:
1. [Test results - paste actual output]
2. [Build results - paste actual output]
3. [Manual verification if applicable]

### Verdict: MET | NOT MET

If NOT MET:
- What's missing: [specific gap]
- Remaining steps: [what to do]
```

### 3.2 Final Report

```markdown
## 🎯 Goal Complete

**Objective:** [what was achieved]
**Duration:** [start to end time]
**Checkpoints:** [total count]

### Summary
[What was done, key decisions made]

### Files Changed
- [file 1]: [what changed]
- [file 2]: [what changed]

### Verification
- [x] Stopping condition met
- [x] All tests passing
- [x] No regressions introduced

### Artifacts
- [Any created files, configs, etc.]
```

---

## Phase 4: Goal Management Commands

### Pause Goal
When user says "pause" or work is blocked:
1. Save current state to `.opencode/goal-state.md`
2. Set status to PAUSED
3. Report what was in progress

### Resume Goal
When user says "resume":
1. Read `.opencode/goal-state.md`
2. Check what was last completed
3. Continue from next checkpoint

### Clear Goal
When user says "clear" or goal is abandoned:
1. Report what was accomplished so far
2. List any partial changes that may need cleanup
3. Remove or archive goal state

### Status Check
When user says "status" or just `/goal` without arguments:
1. Read `.opencode/goal-state.md`
2. Report current progress
3. Show next planned steps

---

## Execution Flow

```
START
  │
  ├─ Parse goal from $ARGUMENTS
  ├─ Validate goal quality
  ├─ Create goal-state.md
  │
  ├─ Phase 1: Scan codebase
  ├─ Phase 1: Create execution plan
  │
  ├─ Phase 2: Loop {
  │     ├─ Make scoped change
  │     ├─ Run validation
  │     ├─ Log checkpoint
  │     ├─ Report progress (every 3)
  │     └─ Continue until done
  │   }
  │
  ├─ Phase 3: Verify stopping condition
  ├─ Phase 3: Generate final report
  │
  END
```

---

## Example Goals

### Code Migration
```
/goal Migrate authentication from session-based to JWT. All existing tests must pass. Do not change API response shapes.
```

### Large Refactor
```
/goal Refactor the payment module to use strategy pattern. Each payment method should be a separate file. Run tests after each file change.
```

### Feature Implementation
```
/goal Implement dark mode toggle with system preference detection. Must work on mobile. Run `npm run build` to verify no errors.
```

### Bug Investigation + Fix
```
/goal Fix the intermittent timeout in the checkout flow. Investigate root cause, implement fix, add regression test. Stop when test passes 10 times in a row.
```

### Prototype Creation
```
/goal Build a CLI tool that converts markdown to HTML. Support headers, lists, code blocks, and links. Stop when it correctly converts the README.md.
```

---

## Anti-Patterns (NEVER DO)

| ❌ Anti-Pattern | ✅ Correct Approach |
|-----------------|---------------------|
| Skip validation to save time | Always run validation command |
| Claim done without evidence | Show actual command output |
| Ask user between every step | Work autonomously, report at checkpoints |
| Change unrelated files | Stick to goal scope |
| Ignore test failures | Rollback and try different approach |
| No progress logging | Log every checkpoint |
| Vague stopping condition | Define exact verification criteria |

---

## Quick Reference

```
/goal [objective] without stopping until [stopping condition]
/goal                    → Show current goal status
/goal pause              → Pause autonomous work
/goal resume             → Resume from last checkpoint
/goal clear              → Clear current goal
/goal status             → Detailed progress report
```
