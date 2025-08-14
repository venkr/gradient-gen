# gradients.venki.dev

![OpenAI-style gradient](./ellipses.svg)

A simple project that generates gradients in the style of OpenAI's 2020-2022 website. 
I use it to generate cover images for [my Substack blog](https://venkii.substack.com/).

The method was derived from [Justin Jay Wang's blog post](https://justinjay.wang/methods-for-random-gradients/) - which shows various gradients he tried out as a designer at OpenAI. 

The meat of the method is to generate 12 random SVG ellipses, using different random parameters sampled with the following code:
```
  {
    color: palette[Math.floor(Math.random() * palette.length)],
    fx: 0.1 + Math.random() * 0.3,
    scale: [0.7 + Math.random() * 0.8, 0.7 + Math.random() * 0.8],
    skew: -10 + Math.random() * 20,
    rotation: Math.random() * 360,
    translation: [
      -250 + Math.random() * 500,
      -250 + Math.random() * 500
    ]
  };
```s
Take a look at `EllipseGenerator.tsx` for the full logic.

## Local development

This is a deployed as a static website, but uses bun for hot reloads & bundling. Thus:

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```