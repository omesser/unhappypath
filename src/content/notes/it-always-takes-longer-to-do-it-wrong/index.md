---
title: 'It always takes longer to do it wrong'
description: 'Every shortcut looks reasonable in the moment. You are just putting another empty roll on the tower. When it falls, it falls on whoever happens to be standing there.'
pubDate: 2026-07-03
tags: [technical-debt, engineering, architecture]
---

A short weekend note on the cost of shortcuts — or "micro-laziness", depending
how you look at it. Also a podcast recommendation, and an anecdote about toilet
paper.

Friday morning, listening to Huberman with Andy Stumpf. Interesting man,
interesting life (Navy SEAL vet), a lot of stories. I'll take just one small one
from there — on why it pays to do things right, and why shortcuts always take
longer.

He talks about his kids finishing toilet-paper rolls and, instead of throwing
the cardboard away, stacking the empty roll on the new one. Slowly they build a
tower of empties next to the toilet. Roll done? Park it on the holder, or on the
floor. Then another. Until there's a cute little tower. Not very stable.

Eventually the tower falls on someone. Nobody dies. It just tends to happen when
it's inconvenient. Everyone knows this tower. Of course they do.

Andy, no matter what he tries, cannot get the kids to stop. His line on it:

> It always takes longer to do it wrong.

End of toilet-paper stories.

This is true of almost everything. It is extremely familiar in software
engineering. The famous "technical debt" applies to more than code — toilet
paper, cleaning, laundry, dishes. You name it. Same pattern we know too well:

- Approve a half-architecture because "we need to show progress".
- Push a new process without understanding the real consequences. We ship fast.
- Leave broken pieces in the system because "nobody is complaining right now"
  and "we're focused on the critical things" (always).
- Build on old code with no plan for how you get off it.

Sound familiar?

Every one of those decisions looks reasonable in the moment. We are not actually
solving it. We are just putting another roll on the tower. And another.

Until one day it falls. You never know who it falls on. Sometimes they just
happened to be walking past. It does not stay with the person who deferred it in
the first place. It becomes a problem for everyone who has to work with what was
built.

So: enforce technical discipline. Find the people who will lead that work and
actually connect to it. Allocate people and tasks to lowering entropy. Not only
at the team or code level — at the system and architecture level too. AI only
makes this more necessary than it already was.

_Adapted from a [LinkedIn post](https://www.linkedin.com/posts/odedmesser_%D7%98%D7%95%D7%91-%D7%A4%D7%95%D7%A1%D7%98-%D7%A7%D7%A6%D7%A8-%D7%9C%D7%A1%D7%95%D7%A4%D7%A9-%D7%91%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%A2%D7%9C-%D7%94%D7%A2%D7%9C%D7%95%D7%AA-%D7%A9%D7%9C-share-7478788039096594432-7Bfx/) (Hebrew original), July 2026._
