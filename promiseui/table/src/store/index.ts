import { ref, Ref, watchEffect } from 'vue'
import { SortDirection, Sorter, SortMethod, TableColumn, TableStore } from '../table-types'

export function createStore<T>(dataSource: Ref<T[]>, columns: Ref<TableColumn[]>): TableStore<T> {
  // 内部使用的data
  const tableData: Ref<T[]> = ref([])
  // 外部传来的data
  watchEffect(() => {
    tableData.value = dataSource.value.slice() || []
  })
  const sortData = (direction: SortDirection, sortMethod: Sorter) => {
    if (direction === 'ASC') {
      tableData.value.sort((a, b) => (sortMethod ? sortMethod(a, b) : 0))
    } else if (direction === 'DESC') {
      // 这里可以用reverse 来提高性能
      tableData.value.sort((a, b) => {
        return sortMethod ? -sortMethod(a, b) : 0
      })
    } else {
      tableData.value = dataSource.value.slice()
    }
  }
  const filterData = (filterMethod: (value: any, index: number, array: any[]) => boolean) => {
    tableData.value = tableData.value.filter(filterMethod)
  }
  return {
    state: {
      tableData,
      _data: dataSource,
      _columns: columns
    },
    sortData,
    filterData
  }
}