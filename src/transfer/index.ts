import { connect, mapProps } from '@formily/vue'

import type { Transfer as IvuTransferProps } from 'view-design'
import { Transfer as IvuTransfer } from 'view-design'
import { getComponentByTag } from '../__builtins__/shared'

export type TransferProps = IvuTransferProps

const TransformIvuTransfer = getComponentByTag<TransferProps>(IvuTransfer, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

export const Transfer = connect(
  TransformIvuTransfer,
  mapProps({ dataSource: 'data' })
)
