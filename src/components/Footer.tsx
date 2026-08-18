import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1e1b4b] text-neutral-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2">Bigenda Bite</h3>
            <p className="text-sm text-neutral-400 max-w-md">
              Your everyday guide to life and administrative processes in Rwanda.
              Built with care for Rwandans, by Rwandans.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/en/processes" className="text-neutral-400 hover:text-white transition-colors">Official Processes</Link></li>
              <li><Link href="/en/guides" className="text-neutral-400 hover:text-white transition-colors">How-To Guides</Link></li>
              <li><Link href="/en/directory" className="text-neutral-400 hover:text-white transition-colors">Business Directory</Link></li>
              <li><Link href="/en/alerts" className="text-neutral-400 hover:text-white transition-colors">Alerts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/en/membership" className="text-neutral-400 hover:text-white transition-colors">Membership</Link></li>
              <li><Link href="/en/login" className="text-neutral-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/en/register" className="text-neutral-400 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Bigenda Bite. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Built for Rwanda · Made with ☕ and 💻
          </p>
        </div>
      </div>
    </footer>
  )
}


