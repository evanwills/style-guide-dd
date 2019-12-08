# style-guide-dd (Style Guide Driven Development Starter Kit)

## What is `style-guide-dd`

It is a node module that makes it easier to get started with creating a living Style Guide and doing front end development using the principal's of *Style Guide Driven Development*.


## What is *Style Guide Driven Development*?

> *Style Guide Driven Development* is an approach that puts a living style guide at the center of both the design and development process. The goal is to create a design system that establishes a starting point for designs, evolves with the application, and makes development faster.<br />
> [styleguidedrivendevelopment.net](http://styleguidedrivendevelopment.net/)

## The aim of this module

1. Provide easy implementation of a living Style guide using [KSS](https://kss-node.github.io/kss-node/)
2. Automate all the things that should be automated
   1. CSS preprocessor compilation on save
   2. Code linting
   3. Generating living Style guide
   4. Syncing browser when changes happen
3. Provide sane rules for code linting using sass-lint and Standard JS
4. Provide easy way to minify and bundle ECMAscript/JS
5. Ensure easy browser compatibility for CSS using PostCSS
6. (Eventually) Visual regression testing

## Assumptions

`style-guide-dd` makes a few assumptions about your development process some of which can be changed some of which can't

1. You are prepared to use Node, Gulp and KSS as the foundation of your process
2. That you are using Sass/Scss as your CSS preprocessor<br />
   __Note:__ Less, Stylus & CSS-Crush preprocessor are supported. You just need to update the `cssPreProcessor` property in `sgdd.config.json`<br />
   __Note also:__ If you use one of the alternative CSS preprocessors, you'll need to install the appropriate node module yourself
