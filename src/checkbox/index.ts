import { connect, h } from '@formily/vue'
import { defineComponent } from '@vue/composition-api'

import type { Checkbox as _IvuCheckboxProps } from 'view-design'
import { Checkbox as IvuCheckbox } from 'view-design'
import { getComponentByTag } from '../__builtins__/shared'

type IvuCheckboxProps = Omit<_IvuCheckboxProps, 'value'> & {
  value: IvuCheckboxProps['label']
}

export interface CheckboxProps extends IvuCheckboxProps {
  option: Omit<_IvuCheckboxProps, 'value'> & {
    value: IvuCheckboxProps['label']
    label: string
  }
}

const CheckboxOption = defineComponent<CheckboxProps>({
  name: 'Checkbox',
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(curtomProps, { attrs, slots, listeners }) {
    return () => {
      const props = attrs as unknown as CheckboxProps
      const option = curtomProps?.option
      if (option) {
        const children = option.label
          ? { default: () => [option.label] }
          : slots
        const newProps = {} as Partial<IvuCheckboxProps>
        Object.assign(newProps, option)
        newProps.label = option.value
        delete newProps.value

        return h(
          IvuCheckbox,
          {
            attrs: {
              ...newProps,
            },
          },
          children
        )
      }

      return h(
        IvuCheckbox,
        {
          attrs: {
            ...props,
          },
          on: listeners,
        },
        slots
      )
    }
  },
})

const TransformCheckboxOption = getComponentByTag(CheckboxOption, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

export const Checkbox = connect(TransformCheckboxOption)
