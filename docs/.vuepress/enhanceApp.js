import pageComponents from '@internal/page-components'
import iview from 'view-design'
import Vue from 'vue'
import '@formily/view-design/style.ts'

Vue.use(iview)

export default ({ Vue }) => {
  for (const [name, component] of Object.entries(pageComponents)) {
    Vue.component(name, component)
  }
}
