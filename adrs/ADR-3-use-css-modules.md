## Date: 11/8/23

## Decision:

Start adding new styles using [css modules](https://github.com/css-modules/css-modules) instead of [styled-components](https://styled-components.com/)

## Why?

* Lot of great reasons here by Sam Magura: https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b
* More personally though, over time I've found CSS-in-JS to be a bit messy. It feels like it clutters up the files.
* Many of the problems styled-components fixes is also fixed by css modules. 
* I enjoy scss.

I wouldn't be against using styled-components in the future, but as I need to re-do the majority of the styles due to removing primereact, I felt this was a good time to switch.