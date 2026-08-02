---
title: 'Why "unhappy path"'
description: 'The happy path is the one in the demo. The unhappy path is the one in production — and it is where the interesting engineering lives.'
pubDate: 2026-07-31
tags: [engineering, testing]
---

<!-- TODO(oded): STUB POST — delete once real posts land (ADR-0006). -->

**Short version: the happy path is the one in the demo, and the unhappy path is
the one in production.** Every system has both. Only one of them gets designed
carefully, and it is usually not the one that decides whether users trust you.

The term comes from testing. The happy path is the run where every input is
well-formed, every dependency answers, and nothing times out. The unhappy paths
are everything else: the retry that duplicates a write, the partial failure
nobody modelled, the migration that half-finished at 02:00.

## Why it is the interesting half

Three reasons the unhappy path is where the real work is:

1. **It is where the design assumptions become visible.** Nothing reveals a
   model's shape faster than an input it did not expect.
2. **It is most of the code.** Validation, retries, idempotency, rollback — the
   happy path is often the smallest branch in the file.
3. **It is what users remember.** Nobody praises a system for working. They
   remember how it behaved when it did not.

## What this site is

Notes from that half of the work: systems, engineering leadership, and the
specific ways things go sideways at scale. Wry about the failures, sincere about
the lessons.
