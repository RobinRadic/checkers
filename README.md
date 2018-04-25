# Checkers
<small>(Dutch: *dammen*)</small>

Checkers game written in Typescript using React.

Tech:
- **Lang:** Typescript 2.7
- **Lib:** React 16
- **Lib:** Antd 3
- **Lib:** Inversify 4
- **Lib:** MobX 4
- **Lib:** Router5
- **Lib:** Typestyle 1.7
- **Build:** Gulp 4
- **Build:** Webpack 4


## Builds

| `npm run`/`yarn` command  | Type                            | Description                                     |
|--------------------------:|---------------------------------|-------------------------------------------------|
| `serve:dev`               | Development Server              | Starts `webpack-dev-server` with HMR etc         |
| `build:dev`               | Development                     | Development build into `dev` direcotry          |
| `serve:pre`               | Pre Production Server           | Express server with near-identical production output but adds some inspection tools to review (for example) output sizes and bundle inspection |
| `serve:prod`              | Production Server               | Express server with production optimized output |
| `build:prod`              | Production                      | Production optimized final output  |

