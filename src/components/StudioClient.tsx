'use client'
import { Studio } from 'sanity'
import config from '../../sanity.config'

export default function StudioClient() {
  return (
    <div id="sanity-studio">
      <Studio config={config} />
    </div>
  )
}


