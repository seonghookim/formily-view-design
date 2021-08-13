import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import { defineComponent } from '@vue/composition-api'
import { PreviewSelectText } from '../preview-text'
import type {
  Select as IvuSelectProps,
  Option as ElOptionProps,
} from 'view-design'
import { Select as IvuSelect } from 'view-design'
import { getComponentByTag } from '../__builtins__/shared'

export type SelectProps = IvuSelectProps & {
  options?: Array<ElOptionProps | string>
}

const SelectOption = defineComponent<SelectProps>({
  name: 'Select',
  props: ['options'],
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
                      'i-option',
                      { props: { label: option, value: option } },
                      {}
                    )
                  } else {
                    return h('i-option', { props: option }, {})
                  }
                }),
            }
          : slots
      return h(
        IvuSelect,
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

const TransformIviewEvent = getComponentByTag<typeof SelectOption>(
  SelectOption,
  {
    change: 'on-change',
    focus: 'on-focus',
    blur: 'on-blur',
  }
)

export const Select = connect(
  TransformIviewEvent,
  mapProps({ dataSource: 'options', loading: true }),
  mapReadPretty(PreviewSelectText)
)
