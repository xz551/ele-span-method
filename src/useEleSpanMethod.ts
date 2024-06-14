import type { TableColumnCtx } from 'element-plus'
interface SpanMethodProps <T> {
    row: T & Record<string, any>
    column: TableColumnCtx<T>
    rowIndex: number
    columnIndex: number
}

/**
 * el-table 行合并方法
 * @param {object[]} list 数据集
 * @param {string[]} primaryKey 参考的数据属性，只要这几个数据属性相同，则合并
 * @param {string[]} mergeKey 要合并的字段，不填写则按照 primaryKey 的字段合并
 */
export default  <T extends object,K extends keyof T>(list:T[],primaryKey:K[],mergeKey?:K[]) => {
    //取出合法的key
    if(!list?.length || !primaryKey?.length){
        return ()=>{}
    }
    let item = list[0]
    let itemKeys = Object.keys(item)
    let pKey = primaryKey.filter(key=>itemKeys.includes(key.toString()))
    if(!pKey.length){
        return ()=>{}
    }
    if(!mergeKey?.length){
        mergeKey = pKey
    }
    //数据整理，按照primaryKey 按照先后 相同的值放到一起
    sortByKey(list,pKey)
    let firstRowspan = pKey[0].toString()+'rowspan'
    let firstColspan = pKey[0].toString()+'colspan'

    return ({ row,column,columnIndex,rowIndex }:SpanMethodProps<T>)=>{
        // console.log(row,column,columnIndex,rowIndex)
        //当前列的属性
        let { property } =column;
        //是否需要合并
        if(mergeKey!.includes(property as K)){
            //找它对应的合并的 rowspan colspan
            let rowspan = property+'rowspan'
            let colspan = property+'colspan'

            if(row[rowspan] && row[colspan]){
                return {
                    rowspan:row[rowspan],
                    colspan:row[colspan]
                }
            }else{
                return {
                    rowspan:row[firstRowspan],
                    colspan:row[firstColspan],
                }
            }

        }else {
            return {
                rowspan:1,
                colspan:1
            }
        }
    }
};

function sortByKey<T extends object,K extends keyof T>(list:T[],primaryKey:K[]):T[]{
    let temp:Record<string, T[]> = {};
    let prop = primaryKey[0]
    for(let i=0;i<list.length;i++){
        let item = list[i];
        let propValue = item[prop] as string
        if(!temp[propValue]){
            temp[propValue]=[]
        }
        temp[propValue].push(item)
    }
    let result:T[] = [];
    for(let n in temp){
        let length = temp[n].length;
        let arr = temp[n].map((item:Record<string, any>,index)=>{
            let rowspanCol = prop.toString()+'rowspan'
            let colspanCol = prop.toString()+'colspan'
            item[rowspanCol] = index === 0 ? length : 0
            item[colspanCol] = index === 0 ? 1 : 0

            return {
                ...item as T
            }
        })
        result.push(
            ...(primaryKey.length > 1 ? sortByKey(arr,primaryKey.slice(1)) : arr)
        )
    }
    return result
}
