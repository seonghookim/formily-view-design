import { IFieldResetOptions } from '@formily/core'
import { h, useForm } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { defineComponent } from '@vue/composition-api'

import type { Button as IIvuButton } from 'view-design'
import { Button as IvuButton } from 'view-design'

export type ResetProps = IFieldResetOptions & IIvuButton

export const Reset = observer(
  defineComponent<ResetProps>({
    name: 'Reset',
    props: {
      forceClear: {
        type: Boolean,
        default: false,
      },
      validate: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, context) {
      const formRef = useForm()
      const { listeners, slots } = context
      return () => {
        const form = formRef?.value
        return h(
          IvuButton,
          {
            attrs: context.attrs,
            on: {
              ...listeners,
              click: (e: any) => {
                if (listeners?.click) {
                  if (listeners.click(e) === false) return
                }
                form
                  ?.reset('*', {
                    forceClear: props.forceClear,
                    validate: props.validate,
                  })
                  .then(listeners.resetValidateSuccess as (e: any) => void)
                  .catch(listeners.resetValidateFailed as (e: any) => void)
              },
            },
          },
          slots
        )
      }
    },
  })
)
