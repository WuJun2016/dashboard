# Harvester Plugin

## Summary
rancher和harvester核心代码和组件十分相似, harvester希望能方便的复用rancher ui的通用组件及核心steve架构的代码, 而不需要往rancher dashboard repo推送代码. 目的是希望harvester能独立发版而不与rancher绑定.


### Related Issues

https://github.com/rancher/dashboard/issues/4109

## Motivation
希望harvester可以利用rancher的核心代码和通用组件, 并且可以独立构建发版, 同时多集群harvester ui也可以方便的和rancher集成.

### Goals

1. 希望Harvester单集群可以和rancher release独立开
2. 希望rancher dashboard可以通过插件配置的方式集成harvester的功能
3. 希望harvester 多集群可以为每个导入的harvester单独配置用户访问的资源是离线的还是在线的以及对应的版本

### Non-goals [optional]


## Proposal

### User Stories

#### 1. 希望Harvester单集群可以和rancher release独立开
ranchr dashboard 将通过npm包的方式共享rancher核心代码, 以便其他项目通过该npm包来生成包含核心的steve及通用component前端架构. 
harvester 将作为一个插件的形式来开发业务功能 （这个目录下的文件将会打包成一个文件提供给多集群）.     

Note: 目前计划harvester v1.1.0还会往rancher dashboard里面合， 等下个版本才会真正独立开发

![](code.png)

#### 2. 希望rancher dashboard可以通过插件配置的方式集成harvester的功能
rancher会把上述提供的资源包作为一个插件的方式加载到rancher ui中.
    **为保证不同权限的用户都能访问到离线插件资源, harvester 将需要通过api （v1/public-assets）的方式提供给不同用户访问该资源的能力.  pending**

#### 3. 希望harvester 多集群可以为每个导入的harvester单独配置用户访问的资源是离线的还是在线的以及对应的版本
1. **为了使每个导入的harvester集群能单独设置是使用离线资源还是在线资源，需要harvester后端把harvester setting里面的ui-source的信息通过其他方式暴露出来. (因为cluster member没有访问setting的权限). pending**
2. **为了使每个导入的harvester集群能单独配置使用的harvester plugin版本，而目前提供的ui-index是给单集群配置完整资源访问地址的, 所有需要harvester后端在setting中增加一个配置来保存加载plugin的地址, 并且可以让任意权限用户访问.  pending**

Tip: 目前rancher提供的插件配置页面无法满足为不同harvester配置不同插件版本的需求.

![](arch.png)

### User Experience In Detail
1. 单集群用户在单集群setting中使用ui-source 和 ui-index来决定获取资源的方式及地址 
2. 多集群：
    1. 用户在rancher中导入harvester集群， 
       1. 导入的harvester不支持plugin, 就加载内置打包到rancher里面的harvester plugin 资源（该资源是离线的）
       2. 导入的harvester支持plugin,  则当用户点击harvester集群时, 前端应该能通过一种方式获得到 ui-source 和 plugin-index （新添加的setting）的值, ui可以根据给定的值去获取对应的插件资源.
    2. admin用户可以在导入的harvester集群的setting页面里面配置ui-source及plugin-index

### API changes
1. 后端需要添加一个没有访问权限控制的接口来提供离线版插件资源 (v1/public-assets)
2. 在harvester setting页面添加plugin-index配置项
3. 任意权限用户都可以访问到ui-index和ui-source的值

## Design


### Implementation Overview
![](single.png)

![](mul.png)


### Test plan


### Upgrade strategy

## Note [optional]


