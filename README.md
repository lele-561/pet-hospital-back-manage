# pm-analysis: front-end

## Introduction
A thesis managing project, based on gauss database. The front end is developed using _vue 2.0_.

## Config
### cross-domain
- Go to ```vue.config.js``` and change ```target``` to the port used by the back-end. 
- Go to ```src/utils/api.js```and change ```base``` to the port used by the front-end.

node.js版本过高时请先运行以下命令：
```set NODE_OPTIONS=--openssl-legacy-provider```
