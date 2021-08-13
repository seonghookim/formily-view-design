<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaStringField
        name="date"
        title="日期1"
        x-decorator="Editable"
        x-component="DatePicker"
      />
      <SchemaStringField
        name="input"
        title="输入框1"
        x-decorator="Editable"
        x-component="Input"
      />
      <SchemaVoidField
        name="void"
        title="虚拟节点容器"
        x-component="EditablePopover"
        :x-reactions="
          (field) => {
            field.title = field.query('.void.date2').get('value') || field.title
          }
        "
      >
        <SchemaStringField
          name="date2"
          title="日期1-1"
          x-decorator="FormItem"
          x-component="DatePicker"
        />
        <SchemaStringField
          name="input2"
          title="输入框1-2"
          x-decorator="FormItem"
          x-component="Input"
        />
      </SchemaVoidField>
      <SchemaObjectField
        name="object"
        title="对象节点容器"
        x-component="EditablePopover"
        :x-reactions="
          (field) => {
            field.title = (field.value && field.value.date) || field.title
          }
        "
      >
        <SchemaStringField
          name="date"
          title="日期2-1"
          x-decorator="FormItem"
          x-component="DatePicker"
        />
        <SchemaStringField
          name="input"
          title="输入框2-2"
          x-decorator="FormItem"
          x-component="Input"
        />
      </SchemaObjectField>
    </SchemaField>
    <FormButtonGroup>
      <Submit @submit="log">提交</Submit>
    </FormButtonGroup>
  </FormProvider>
</template>

<script>
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  FormButtonGroup,
  FormItem,
  Submit,
  Input,
  DatePicker,
  Editable,
  EditablePopover,
} from '@formily/view-design'
import { Button } from 'view-design'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    DatePicker,
    Editable,
    EditablePopover,
  },
})

export default {
  components: {
    FormButtonGroup,
    FormProvider,
    Button,
    Submit,
    ...SchemaField,
  },

  data() {
    const form = createForm()

    return {
      form,
    }
  },
  methods: {
    log(values) {
      console.log(values)
    },
  },
}
</script>

<style lang="scss" scoped></style>
