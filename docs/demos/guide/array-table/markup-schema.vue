<template>
  <div>
    <FormProvider :form="form">
      <SchemaField>
        <SchemaArrayField
          name="array"
          x-decorator="FormItem"
          x-component="ArrayTable"
        >
          <SchemaObjectField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ width: 80, title: 'Index', slot: 'Index' }"
              ><SchemaVoidField
                x-decorator="FormItem"
                x-component="ArrayTableIndex"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{
                prop: 'a1',
                title: 'A1',
                slot: 'A1',
                width: 200,
              }"
            >
              <SchemaStringField
                x-decorator="Editable"
                name="a1"
                :required="true"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A2', slot: 'A2', width: 200 }"
            >
              <SchemaStringField
                x-decorator="FormItem"
                name="a2"
                :required="true"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A3', slot: 'A3', width: 200 }"
            >
              <SchemaStringField
                name="a3"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A4', slot: 'A4', width: 200 }"
            >
              <SchemaStringField
                name="a4"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A5', slot: 'A5', width: 200 }"
            >
              <SchemaStringField
                name="a5"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A6', slot: 'A6', width: 200 }"
            >
              <SchemaStringField
                name="a6"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A7', slot: 'A3', width: 200 }"
            >
              <SchemaStringField
                name="a7"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A8', slot: 'A8', width: 200 }"
            >
              <SchemaStringField
                name="a8"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A9', slot: 'A9', width: 200 }"
            >
              <SchemaStringField
                name="a9"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A10', slot: 'A10', width: 200 }"
            >
              <SchemaStringField
                name="a10"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A11', slot: 'A11', width: 200 }"
            >
              <SchemaStringField
                name="a11"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A12', slot: 'A12', width: 200 }"
            >
              <SchemaStringField
                name="a12"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A13', slot: 'A13', width: 200 }"
            >
              <SchemaStringField
                name="a13"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A14', slot: 'A14', width: 200 }"
            >
              <SchemaStringField
                name="a14"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>
            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{ title: 'A15', slot: 'A15', width: 200 }"
            >
              <SchemaStringField
                name="a15"
                :required="true"
                x-decorator="FormItem"
                x-component="Input"
              />
            </SchemaVoidField>

            <SchemaVoidField
              x-component="ArrayTableColumn"
              :x-component-props="{
                title: 'Operations',
                slot: 'Operations',
                prop: 'operations',
                width: 200,
              }"
            >
              <SchemaVoidField x-component="FormItem">
                <SchemaVoidField x-component="ArrayTableRemove" />
                <SchemaVoidField x-component="ArrayTableMoveUp" />
                <SchemaVoidField x-component="ArrayTableMoveDown" />
              </SchemaVoidField>
            </SchemaVoidField>
          </SchemaObjectField>
          <SchemaVoidField x-component="ArrayTableAddition" title="添加条目" />
        </SchemaArrayField>
      </SchemaField>
      <Submit @submit="log">提交</Submit>
      <Button
        @click="
          () => {
            form.setInitialValues({
              array: range(50),
            })
          }
        "
      >
        加载10W条超大数据
      </Button>
      <!-- <Alert
        :style="{ marginTop: '10px' }"
        title="注意：开启formily插件的页面，因为后台有数据通信，会占用浏览器算力，最好在无痕模式(无formily插件)下测试"
        type="warning"
      /> -->
    </FormProvider>
  </div>
</template>

<script>
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  Submit,
  FormItem,
  ArrayTable,
  ArrayTableColumn,
  ArrayTableAddition,
  ArrayTableMoveDown,
  ArrayTableMoveUp,
  ArrayTableRemove,
  ArrayTableIndex,
  ArrayTableSortHandle,
  Input,
  Editable,
} from '@formily/view-design'
import { Button, Alert } from 'view-design'

const fields = createSchemaField({
  components: {
    FormItem,
    ArrayTable,
    ArrayTableColumn,
    ArrayTableAddition,
    ArrayTableMoveDown,
    ArrayTableMoveUp,
    ArrayTableRemove,
    ArrayTableIndex,
    ArrayTableSortHandle,
    Input,
    Editable,
  },
})

export default {
  components: { FormProvider, Submit, Button, Alert, ...fields },
  data() {
    const form = createForm()
    return {
      form,
    }
  },
  methods: {
    log(...v) {
      console.log(...v)
    },
    range(count) {
      return Array.from(new Array(count)).map((_, key) => ({
        aaa: key,
      }))
    },
  },
}
</script>
