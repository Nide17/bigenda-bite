'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@sanity/client'
import { DocumentsIcon, ChartBarIcon, ExclamationCircleIcon } from '@sanity/icons'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export default function StudioDashboard() {
  const [stats, setStats] = useState({ processes: 0, guides: 0, alerts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [processes, guides, alerts] = await Promise.all([
          readClient.fetch('count(*[_type == "process"])'),
          readClient.fetch('count(*[_type == "guide"])'),
          readClient.fetch('count(*[_type == "alert"])'),
        ])
        setStats({
          processes: typeof processes === 'number' ? processes : 0,
          guides: typeof guides === 'number' ? guides : 0,
          alerts: typeof alerts === 'number' ? alerts : 0,
        })
      } catch (e) {
        console.error('Failed to load stats', e)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="p-4 h-full">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-[#1e1b4b] mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-500 mb-6">Quick overview of your published content.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Processes" count={stats.processes} icon={DocumentsIcon} color="bg-blue-50 text-blue-700 border-blue-200" loading={loading} />
          <StatCard title="Guides" count={stats.guides} icon={DocumentsIcon} color="bg-emerald-50 text-emerald-700 border-emerald-200" loading={loading} />
          <StatCard title="Alerts" count={stats.alerts} icon={ExclamationCircleIcon} color="bg-amber-50 text-amber-700 border-amber-200" loading={loading} />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Getting started</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600">
            <li>Use <strong>Content</strong> to browse and create documents.</li>
            <li>Set <strong>status</strong> to <span className="font-medium">published</span> when content is ready.</li>
            <li>Fill <strong>lastVerifiedDate</strong> and <strong>nextReviewDate</strong> to keep content trustworthy.</li>
            <li>Prefer <strong>English</strong> first; French and Kinyarwanda are optional.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, count, icon: Icon, color, loading }: { title: string; count: number; icon: React.ComponentType<{ className?: string }>; color: string; loading: boolean }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{loading ? '—' : count}</p>
        </div>
        <div className={"rounded-lg border p-2 " + color}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
