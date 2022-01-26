import { listener, preventDefault } from '../wheeling.js'

export default listener({
  type: 'click',
  hooks: [
    preventDefault
  ]
})
