import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import { defineComponent } from '@vue/composition-api'
import { getComponentByTag } from '../__builtins__/shared'
import { PreviewSelectText } from '../preview-text'
import type {
  Radio as IvuProps,
  RadioGroup as IvuGroupProps,
} from 'view-design'
import { Radio as Ivu, RadioGroup as IvuGroup } from 'view-design'

export type RadioGroupProps = IvuGroupProps & {
  value: any
  options?: (Omit<IvuProps, 'value'> & {
    value: IvuProps['label']
    label: string
  })[]
}

export type RadioProps = IvuProps

const TransformIvuGroup = getComponentByTag(IvuGroup, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

const RadioGroupOption = defineComponent<RadioGroupProps>({
  name: 'RadioGroup',
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
                      Ivu,
                      { props: { label: option } },
                      { default: () => [option] }
                    )
                  } else {
                    return h(
                      Ivu,
                      {
                        props: {
                          ...option,
                          value: undefined,
                          label: option.value,
                        },
                      },
                      { default: () => [option.label] }
                    )
                  }
                }),
            }
          : slots
      return h(
        TransformIvuGroup,
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

export const RadioGroup = connect(
  RadioGroupOption,
  mapProps({ dataSource: 'options' }),
  mapReadPretty(PreviewSelectText)
)
export const Radio = Ivu
