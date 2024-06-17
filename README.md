# element-push 行合并通用方法
依赖 element-ui typescript 
# 使用方法

```node
npm i ele-span-method
```

```javascript
import { eleSpanMethod } from 'ele-span-method'

```

```html

<el-table :data="data" :span-method="eleSpanMethod(data,['id','name'],['name'])">
</el-table>


```


# 参数说明
<T extends object,K extends keyof T>(list:T[],primaryKey:K[],mergeKey?:K[]) => {}

## list： 数据集合
## primaryKey 参考的数据属性，只要这几个数据属性相同，则合并
## mergeKey 要合并的字段，不填写则按照 primaryKey 的字段合并

list可以是不需要经过排序，任意顺序的，指定了 primaryKey 的字段，会经过分组排序
例如
```javascript

[
    {id:'1',name:'A1',age:10},
    {id:'2',name:'A2',age:20},
    {id:'1',name:'A3',age:30},
    {id:'4',name:'A4',age:40},
    {id:'1',name:'A1',age:50},
]

```
primaryKey 参数为 ['id','name']
数据会经过整理，整理后变为

```javascript
 [
    {id:'1',name:'A1',age:10},
    {id:'1',name:'A1',age:50},
    {id:'1',name:'A3',age:30},
    {id:'2',name:'A2',age:20},
    {id:'4',name:'A4',age:40},
]

```
mergeKey，可以设置数据对应的列，不填写则按照 primaryKey 的字段合并


![](\1.png)

![](\2.png)

![](\3.png)
