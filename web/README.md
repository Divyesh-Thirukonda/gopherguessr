# Gopher Guessr

A Geoguessr like game for the UMN Twin Cities campus.

## Next.js App Router Guide (by Jin)

As of right now (version 14.2) Next.js App Router has some confusing and unexpected behaviors. I made this guide mostly for those who are familiar with the older Next.js Pages Router, but not the newer App Router, and explains some things that tripped me up when I was first learning App Router. If you're completely new to Next.js but are familiar with React, I would recommend the the free [Learn Next.js course](https://nextjs.org/learn). If you aren't familiar with React, I would recommend the free [React Foundations course](https://nextjs.org/learn/react-foundations) then the aforementioned Next.js course.

### Server Components vs Client Components

By default, every page and component in a Next.js App Router project is a React Server Component. This means it will only run when the page is either statically or dynamically rendered on the server; it will not run on the client. Server Components enable faster data fetching, Server Actions, and limit the amount of JavaScript we have to ship to the user. If you need the component to render on the client in addition to the server (for example if you need to use React Hooks like useState), add `"use client;"` to the top of the file. If you've used Next.js Pages Router in the past, this behavior is new.

Learn more here: [Server and Client Components](https://nextjs.org/learn/react-foundations/server-and-client-components)

### Static Rendering vs Dynamic Rendering

By default, Next.js App Router tries to determine which pages are static (not personalized to the user and don't serve live data) and which pages are dynamic (personalized to the user or serve live data). Unfortunately, it doesn't always do a great job of this and can lead to some confusing bugs. If you know a page is dynamic, adding `export const dynamic = "force-dynamic";` to the top of the `page.js` file will force Next.js to render it dynamically. This is similar to how Next.js Pages Router worked, where `getServerSideProps()` forced a page to render dynamically.

Learn more here: [Server Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies)

### Caching

By default, Next.js App Router tries to cache as much as it possibly can. Unfortunately, this leads to a ton of confusing behaviors that can't be easily debugged in the development environment. There are four, yes FOUR different caches things can end up in. This is new behavior in Next.js App Router, and will thankfully mostly be turned off by default when Next.js 15 comes out later this year. For now, if a page is dynamic, adding `export const dynamic = "force-dynamic";` will prevent it from being stuck in cache. If you're following from the last bit about Static and Dynamic rendering, this means adding `export const dynamic = "force-dynamic";` to every page that is dynamic is pretty much a silver bullet to fixing Next.js weirdness.

Learn more here: [Caching in Next.js](https://nextjs.org/docs/app/building-your-application/caching)

### Learning More

If you like to learn by doing, the free [Learn Next.js course](https://nextjs.org/learn) is a great resource. If you're more of a visual learner, [leerob](https://www.youtube.com/@leerob) has great videos on a multitude of Next.js topics.
