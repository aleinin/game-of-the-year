## Date: 11/2/23

## Decision: 

Going forward goty-client will use Vite instead of create-react-app

## Why not CRA? 
create-react-app has fallen out of favor as the years have gone by. It's something that I shed no tears about. 

I've always found CRA to be more in-the-way than helpful. I'd prefer to more directly build out apps. 

I made an effort to use CRA as it was an industry standard when I first started building goty-client.

However,

* Less supported in 2023
* Harder to maintain/configure due to abstractions
* I personally dislike it and prefer Vite
* Poor performance, bulky.

## Why vite? 
Why not Next.js, or something else?

I chose Vite as, at the time of writing, its the best solution for a rather vanilla un-opinionated React tooling system. 

While Next is great, it's quite opinionated and the benefits it does bring (SSR, and so on) don't particular benefit my use case. Also, with the framework being so opinionated, I suspect that it'll be harder to maintain overtime as Next's opinions change.