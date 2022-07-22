# Harvester Plugin

## Summary

Rancher Dashboard在支持harvester plugin时需要考虑到的支持场景及harvester团队待解决的问题

### Related Issues

https://github.com/rancher/dashboard/issues/4109

## Motivation

### Goals

1. 任意权限的用户都能访问到打包到容器里面的离线harvester-plugin资源
2. 在rancher中导入的不同版本的harvester可以单独配置用户访问的资源是离线的还是在线的以及对应的版本
3. 因为harvester单集群和多集群提供的打包资源是不一样的, 所以需要有不同的setting来保存 harvester-plugin 和 ui-index的地址. 

### Non-goals [optional]


## Proposal

### User Stories

#### Story 1
1. 把harvester的离线包和rancher的离线包放在一起,  导入的不同版本的harvester都只能访问提供的这个版本的UI.  (和目标2有冲突)
2. 通过harvester/v1 api把 UI资源暴露出来, 这样导入的多个harvester 集群可以访问到不同的 UI.

#### Story 2
1. 后端需要把harvester setting里面的 version 和 ui-index 暴露出来. 

#### Story 3
1. harvester需要在setting中增加一个配置来保存 harvester-plugin的地址

### User Experience In Detail


### API changes

## Design

### Implementation Overview



### Test plan


### Upgrade strategy



## Note [optional]

