import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import { getComponentByTag } from '../__builtins__/shared'
import { Checkbox } from '../checkbox'
import { defineComponent } from '@vue/composition-api'

import type { CheckboxGroup as IvuCheckboxGroupProps } from 'view-design'
import type { CheckboxProps } from '../checkbox'
import { CheckboxGroup as IvuCheckboxGroup } from 'view-design'
import { PreviewSelectText } from '../preview-text'

export type CheckboxGroupProps = IvuCheckboxGroupProps & {
  value: any[]
  options?: Array<CheckboxProps | string>
}

const TransformIvuCheckboxGroup = getComponentByTag(IvuCheckboxGroup, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

const CheckboxGroupOption = defineComponent<CheckboxGroupProps>({
  name: 'CheckboxGroup',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(customProps, { attrs, slots, listeners }) {
    return () => {
      const options = customProps.options || []
      const children =
        options.length !== 0
          ? {
              default: () =>
                options.map((option) => {
                  if (typeof option === 'string') {
                    return h(
                      Checkbox,
                      { props: { option: { label: option, value: option } } },
                      {}
                    )
                  } else {
                    return h(Checkbox, { props: { option } }, {})
                  }
                }),
            }
          : slots
      return h(
        TransformIvuCheckboxGroup,
        {
          attrs: {
            ...attrs,
          },
          on: listeners,
        },
        children
      )
    }
  },
})

export const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options' }),
  mapReadPretty(PreviewSelectText, {
    multiple: true,
  })
)
