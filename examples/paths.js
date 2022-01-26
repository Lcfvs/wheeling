import { resolve } from 'path'
import { fileURLToPath } from 'url'

export const path = fileURLToPath(import.meta.url)
export const root = resolve(path, `../assets`)
export const js = resolve(root, `./js`)
