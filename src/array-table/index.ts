import {
  defineComponent,
  onBeforeUnmount,
  ref,
  Ref,
  shallowRef,
} from '@vue/composition-api'
import { observe } from '@formily/reactive'
import {
  GeneralField,
  IVoidFieldFactoryProps,
  FieldDisplayTypes,
  ArrayField,
} from '@formily/core'
import {
  useField,
  useFieldSchema,
  RecursionField as _RecursionField,
  h,
  Fragment,
  useForm,
} from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { FormPath, isArr, isBool } from '@formily/shared'
import { ArrayBase, ArrayBaseItem, useKey } from '../array-base'
import { stylePrefix } from '../__builtins__/configs'
import type { Schema } from '@formily/json-schema'
import type {
  Table as TableProps,
  TableColumn as ElColumnProps,
  Page as PaginationProps,
} from 'view-design'
import type { VNode, Component } from 'vue'
import {
  Table as ElTable,
  // TableColumn as ElTableColumn,
  Page,
  Select,
  // Option,
  Badge,
} from 'view-design'
import { Space } from '../space'

const RecursionField = _RecursionField as unknown as Component

interface IArrayTableProps extends TableProps {
  pagination?: PaginationProps | boolean
}
interface IArrayTablePaginationProps extends PaginationProps {
  dataSource?: any[]
}

interface ObservableColumnSource {
  field: GeneralField
  fieldProps: IVoidFieldFactoryProps<any, any>
  columnProps: ElColumnProps & { title: string; asterisk: boolean }
  schema: Schema
  display: FieldDisplayTypes
  required: boolean
  name: string
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

type ColumnProps = Overwrite<
  ElColumnProps,
  {
    key: string
    asterisk: boolean
    render?: (props: {
      row: Record<string, any>
      column: ElColumnProps
      index: number
    }) => VNode
  }
>

type RenderChildren = {
  [key in string]?: (...args: any[]) => (VNode | string)[]
}

const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Column') > -1
}

const isOperationsComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Operations') > -1
}

const isAdditionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Addition') > -1
}

const getArrayTableSources = (
  arrayFieldRef: Ref<ArrayField>,
  schemaRef: Ref<Schema>
) => {
  const arrayField = arrayFieldRef.value
  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (
      isColumnComponent(schema) ||
      isOperationsComponent(schema) ||
      isAdditionComponent(schema)
    ) {
      if (!schema['x-component-props']?.['prop'] && !schema['name']) return []
      const name = schema['x-component-props']?.['prop'] || schema['name']
      const field = arrayField.query(arrayField.address.concat(name)).take()
      const fieldProps = field?.props || schema.toFieldProps()
      const columnProps =
        (field?.component as any[])?.[1] || schema['x-component-props'] || {}
      const display = field?.display || schema['x-display']
      const required = schema.reduceProperties((required, property) => {
        if (required) {
          return required
        }
        return !!property.required
      }, false)

      return [
        {
          name,
          display,
          required,
          field,
          fieldProps,
          schema,
          columnProps,
        },
      ]
    } else if (schema.properties) {
      return schema.reduceProperties((buf: any[], schema) => {
        return buf.concat(parseSources(schema))
      }, [])
    } else {
      return []
    }
  }

  const parseArrayTable = (schema: Schema['items']) => {
    const sources: ObservableColumnSource[] = []
    const items = isArr(schema) ? schema : ([schema] as Schema[])
    return items.reduce((columns, schema) => {
      const item = parseSources(schema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  if (!schemaRef.value) throw new Error('can not found schema object')

  return parseArrayTable(schemaRef.value.items)
}

const getArrayTableColumns = (
  reactiveDataSource: Ref<any[]>,
  sources: ObservableColumnSource[]
): ColumnProps[] => {
  return sources.reduce(
    (
      buf: ColumnProps[],
      { name, columnProps, schema, display, required },
      key
    ) => {
      const { title, asterisk, ...props } = columnProps
      if (display !== 'visible') return buf
      if (!isColumnComponent(schema)) return buf
      const render = columnProps?.type
        ? undefined
        : (props: {
            row: Record<string, any>
            column: ElColumnProps
            index: number
          }): VNode => {
            // let index = props.$index
            // const index = reactiveDataSource.value.indexOf(props.row)
            // 因为 iview table 里面作用域插槽暴露的 row 不是原来的数据 row，无法通过 indexOf 查找
            // 直接使用 iview 渲染的 index
            // TODO: 分页里的 index 还有问题
            const index = props.index
            const children = h(
              ArrayBaseItem,
              { props: { index }, key: `${key}${index}` },
              {
                default: () =>
                  h(
                    RecursionField,
                    {
                      props: {
                        schema,
                        name: index,
                        onlyRenderProperties: true,
                      },
                    },
                    {}
                  ),
              }
            )
            return children
          }
      return buf.concat({
        title,
        ...props,
        key: name,
        asterisk: asterisk ?? required,
        render,
      })
    },
    []
  )
}

const renderAddition = () => {
  const schema = useFieldSchema()
  return schema.value.reduceProperties((addition, schema) => {
    if (isAdditionComponent(schema)) {
      return h(
        RecursionField,
        {
          props: {
            schema,
            name: 'addition',
          },
        },
        {}
      )
    }
    return addition
  }, null)
}

const StatusSelect = observer(
  defineComponent({
    props: {
      value: Number,
      onChange: Function,
      options: Array,
      pageSize: Number,
    },
    setup(props, { attrs }) {
      const formRef = useForm()
      const fieldRef = useField<ArrayField>()
      const prefixCls = `${stylePrefix}-array-table`
      const width = String(props.options?.length).length * 15

      return () => {
        const form = formRef.value
        const field = fieldRef.value

        const errors = form.queryFeedbacks({
          type: 'error',
          address: `${field.address}.*`,
        })
        const createIndexPattern = (page: number) => {
          const pattern = `${field.address}.*[${(page - 1) * props.pageSize}:${
            page * props.pageSize
          }].*`
          return FormPath.parse(pattern)
        }

        return h(
          Select,
          {
            style: {
              width: `${width < 60 ? 60 : width}px`,
            },
            class: [
              `${prefixCls}-status-select`,
              {
                'has-error': errors?.length,
              },
            ],
            props: {
              value: props.value,
              popperClass: `${prefixCls}-status-select-dropdown`,
            },
            on: {
              input: props.onChange,
            },
          },
          {
            default: () => {
              return props.options?.map(({ label, value }) => {
                const hasError = errors.some(({ address }) => {
                  return createIndexPattern(value).match(address)
                })

                return h(
                  'i-option',
                  {
                    key: value,
                    props: {
                      label,
                      value,
                    },
                  },
                  {
                    default: () => {
                      if (hasError) {
                        return h(
                          Badge,
                          {
                            props: {
                              isDot: true,
                            },
                          },
                          { default: () => label }
                        )
                      }

                      return label
                    },
                  }
                )
              })
            },
          }
        )
      }
    },
  })
)

const ArrayTablePagination = defineComponent<IArrayTablePaginationProps>({
  inheritAttrs: false,
  props: [],
  setup(props, { attrs, slots }) {
    const prefixCls = `${stylePrefix}-array-table`
    const current = ref(1)
    return () => {
      const props = attrs as unknown as IArrayTablePaginationProps
      const pageSize = props['page-size'] || 10
      const dataSource = props.dataSource || []
      const startIndex = (current.value - 1) * pageSize
      const endIndex = startIndex + pageSize - 1
      const total = dataSource?.length || 0
      const totalPage = Math.ceil(total / pageSize)
      const pages = Array.from(new Array(totalPage)).map((_, index) => {
        const page = index + 1
        return {
          label: page,
          value: page,
        }
      })

      const renderPagination = function () {
        if (totalPage <= 1) return
        return h(
          'div',
          {
            class: [`${prefixCls}-pagination`],
          },
          {
            default: () =>
              h(
                Space,
                {},
                {
                  default: () => [
                    h(
                      StatusSelect,
                      {
                        props: {
                          value: current.value,
                          onChange: (val: number) => {
                            current.value = val
                          },
                          pageSize,
                          options: pages,
                        },
                      },
                      {}
                    ),
                    h(
                      Page,
                      {
                        props: {
                          background: true,
                          layout: 'prev, pager, next',
                          ...props,
                          'page-size': pageSize,
                          total,
                          current: current.value,
                        },
                        on: {
                          'update:current': (val: number) => {
                            current.value = val
                          },
                        },
                      },
                      {}
                    ),
                  ],
                }
              ),
          }
        )
      }

      return h(
        Fragment,
        {},
        {
          default: () =>
            slots?.default?.(
              dataSource?.slice(startIndex, endIndex + 1),
              renderPagination
            ),
        }
      )
    }
  },
})

export const ArrayTable = observer(
  defineComponent<IArrayTableProps>({
    name: 'ArrayTable',
    inheritAttrs: false,
    setup(props, { attrs }) {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()
      const prefixCls = `${stylePrefix}-array-table`
      const getKey = useKey()

      const defaultRowKey = (record: any) => {
        return getKey(record)
      }
      const reactiveDataSource = shallowRef([])

      const dispose = observe(
        fieldRef.value,
        () => {
          reactiveDataSource.value = fieldRef.value.value
        },
        false
      )

      onBeforeUnmount(dispose)

      // hack iview table _columnKey
      // 提高性能
      let prevColumns: Record<string, any>[] = []
      const decideColumns = (
        columns: Record<string, any>[]
      ): Record<string, any>[] => {
        const pick = (cols: Record<string, any>[]) => {
          prevColumns = cols
          return cols
        }
        if (columns.length !== prevColumns.length) return pick(columns)
        for (let i = 0; i < prevColumns.length; i++) {
          const prevColKeys = Object.keys(prevColumns[i]).filter(
            (item) => item[0] !== '_'
          )
          const colKeys = Object.keys(columns[i]).filter(
            (item) => item[0] !== '_'
          )
          if (prevColKeys.length !== colKeys.length) return pick(columns)
          for (let j = 0; j < prevColKeys.length; j++) {
            const prevKey = prevColKeys[j]
            const prevVal = prevColumns[i][prevKey]
            // 不比较 _ 开头的保留属性以及 ElCoumnProps 中的函数 props
            if (
              prevKey[0] !== '_' &&
              typeof prevVal !== 'function' &&
              prevVal !== columns[i][prevKey]
            ) {
              return pick(columns)
            }
          }
        }
        return pick(prevColumns)
      }

      return () => {
        const props = attrs as unknown as IArrayTableProps
        const field = fieldRef.value
        const dataSource = Array.isArray(field.value) ? field.value.slice() : []
        const pagination = props.pagination
        const sources = getArrayTableSources(fieldRef, schemaRef)
        const columns = getArrayTableColumns(reactiveDataSource, sources)
        const renderColumns = () =>
          columns.map(({ render, asterisk, ...props }) => {
            let renderHeader: any = undefined
            if (asterisk) {
              renderHeader = (_, { column }: { column: ElColumnProps }) => {
                return h(
                  'span',
                  {},
                  {
                    default: () => [
                      h(
                        'span',
                        { class: `${prefixCls}-asterisk` },
                        { default: () => ['*'] }
                      ),
                      column.title,
                    ],
                  }
                )
              }
            }
            const slot = props.slot || props.title
            const col = {
              ...props,
              slot,
              renderHeader,
            }

            return {
              h: render,
              col,
              slot,
              asterisk, // * 号
            }
          })

        const renderStateManager = () =>
          sources.map((column, key) => {
            //专门用来承接对Column的状态管理
            if (!isColumnComponent(column.schema)) return
            return h(
              RecursionField,
              {
                props: {
                  name: column.name,
                  schema: column.schema,
                  onlyRenderSelf: true,
                },
                key,
              },
              {}
            )
          })

        const renderTable = (dataSource?: any[], pager?: () => VNode) => {
          const columns = renderColumns()
          const iviewTableColumns = decideColumns(
            columns.map((item) => item.col)
          )
          const tableChildren = columns.reduce((childrens, cur) => {
            childrens[cur.slot] = (props) => [cur.h(props)]
            return childrens
          }, {} as RenderChildren)

          return h(
            'div',
            { class: prefixCls },
            {
              default: () =>
                h(
                  ArrayBase,
                  {},
                  {
                    default: () => [
                      h(
                        ElTable,
                        {
                          props: {
                            // rowKey: defaultRowKey,
                            ...attrs,
                            data: dataSource,
                            columns: iviewTableColumns,
                          },
                        },
                        tableChildren
                      ),
                      pager?.(),
                      renderStateManager(),
                      renderAddition(),
                    ],
                  }
                ),
            }
          )
        }

        if (!pagination) {
          return renderTable(dataSource, null)
        }
        return h(
          ArrayTablePagination,
          {
            attrs: {
              ...(isBool(pagination) ? {} : pagination),
              dataSource,
            },
          },
          { default: renderTable }
        )
      }
    },
  })
)

export const ArrayTableColumn: Component = {
  render(h) {
    return h()
  },
}

export {
  ArrayBaseSortHandle as ArrayTableSortHandle,
  ArrayBaseRemove as ArrayTableRemove,
  ArrayBaseMoveDown as ArrayTableMoveDown,
  ArrayBaseMoveUp as ArrayTableMoveUp,
  ArrayBaseAddition as ArrayTableAddition,
  ArrayBaseIndex as ArrayTableIndex,
  useIndex as useArrayTableIndex,
} from '../array-base'
