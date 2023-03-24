# 虚拟宠物医院管理系统：前端

## Introduction
本系统是虚拟宠物医院系统的后台子系统，包含基本信息管理、用户管理、病例管理和测试管理四个模块。

## Config
### 环境
- vue 2.6.11
- element-ui 2.15.9
- axios 0.27.2
- js-md5 0.7.3
- js-cookie 3.0.1
### 跨域
- 本地调试时，将```src/utils/api.js```中的```base```改为```/api```，```vue.config.js```中的```target```改为后端url
- 服务器远程调试时，将```src/utils/api.js```中的```base```改为后端url
