import { Field } from '@formily/core'
import { defineComponent } from '@vue/composition-api'
import { connect, mapProps, h, useField, Fragment } from '@formily/vue'

import type { Upload as IvuUploadProps } from 'view-design'

import { Upload as IvuUpload, Button as IvuButton, Icon } from 'view-design'

interface IvuUploadInternalFileDetail {
  status: 'uploading' | 'finished' | 'fail'
  name: string
  size: number
  percentage: number
  uid: number
  showProgress: boolean
}

export type UploadProps = IvuUploadProps & {
  textContent?: String
  errorAdaptor?: (error?: ErrorEvent) => String
}

const UploadWrapper = defineComponent<UploadProps>({
  name: 'Upload',
  props: {
    textContent: {
      type: String,
      default: '',
    },
    errorAdaptor: {
      type: Function,
      default(error?: ErrorEvent) {
        return error?.message || ''
      },
    },
  },
  setup(curProps: UploadProps, { slots, attrs, listeners, emit }) {
    return () => {
      const fieldRef = useField<Field>()
      const setFeedBack = (error?: ErrorEvent) => {
        const message = curProps.errorAdaptor(error)

        fieldRef.value.setFeedback({
          type: 'error',
          code: 'UploadError',
          messages: message ? [message] : [],
        })
      }

      const props = {
        ...attrs,
        onSuccess(
          file: IvuUploadInternalFileDetail,
          fileList: IvuUploadInternalFileDetail[]
        ) {
          ;(attrs.onChange as Function)?.(file, fileList)
          setFeedBack()
          emit('change', fileList)
        },

        onRemove(
          file: IvuUploadInternalFileDetail,
          fileList: IvuUploadInternalFileDetail[]
        ) {
          ;(attrs.onRemove as Function)?.(file, fileList)
          setFeedBack()
          emit('change', fileList)
        },

        onError(
          error: ErrorEvent,
          file: IvuUploadInternalFileDetail,
          fileList: IvuUploadInternalFileDetail[]
        ) {
          ;(attrs.onError as Function)?.(error, file, fileList)

          setTimeout(() => {
            setFeedBack(error)
          }, 0)
        },
      }
      const children = {
        ...slots,
      }
      if (!slots.default) {
        children.default = () => {
          // const listType = attrs.listType
          const drag = attrs.type === 'drag'

          if (drag) {
            return h(
              Fragment,
              {},
              {
                default: () => [
                  h(
                    'div',
                    { style: 'padding: 20px 0' },
                    {
                      default: () => [
                        h(
                          Icon,
                          {
                            style: 'color: #3399ff',
                            props: { size: 52, type: 'ios-cloud-upload' },
                          },
                          {}
                        ),
                        h(
                          'p',
                          { staticClass: 'ivu-upload__text' },
                          { default: () => [curProps.textContent] }
                        ),
                      ],
                    }
                  ),
                ],
              }
            )
          }

          // if (listType === 'picture-card') {
          //   return h(
          //     'i',
          //     {
          //       staticClass: 'ivu-icon ivu-icon-ios-add',
          //     },
          //     {}
          //   )
          // }

          return h(
            IvuButton,
            { props: { icon: 'ios-cloud-upload-outline' } },
            { default: () => [curProps.textContent] }
          )
        }
      }
      return h(IvuUpload, { attrs: props, on: listeners }, children)
    }
  },
})

export const Upload = connect(
  UploadWrapper,
  mapProps({ readOnly: 'readonly', value: 'fileList' })
)
