import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import { root } from './paths.js'

export const app = fastify()

app.register(fastifyStatic, {
  prefix: '/assets/:subpath(.*)/',
  root
})
