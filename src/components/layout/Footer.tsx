import { Globe, Instagram, Linkedin, Sparkles, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import { footerLinkGroups } from '@/data/footer'

const socialLinks = [
  { label: 'Twitter', href: '#', icon: Twitter },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'Instagram', href: '#', icon: Instagram }
]

const Footer = () => {
  return (
    <footer className='border-t border-slate-200/80 bg-white'>
      <Container className='py-16'>
        <div className='grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]'>
          <div className='max-w-sm space-y-6'>
            <Logo />
            <p className='text-sm leading-7 text-slate-500'>
              The premium destination for IT professionals in Vietnam. We help developers find meaningful work at the
              best tech companies.
            </p>
            <div className='flex items-center gap-3'>
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition duration-300 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                  >
                    <Icon className='h-4 w-4' />
                  </a>
                )
              })}
            </div>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className='space-y-5'>
              <h3 className='text-sm font-semibold text-slate-950'>{group.title}</h3>
              <ul className='space-y-3'>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className='text-sm text-slate-500 transition-colors hover:text-violet-700'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className='border-t border-slate-200/80'>
        <Container className='flex flex-col gap-4 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between'>
          <p className='flex items-center gap-1.5'>
            <span>© 2024 ITJobVN Network. Made with</span>
            <Sparkles className='h-3.5 w-3.5 text-rose-500' />
            <span>in Ho Chi Minh City.</span>
          </p>
          <div className='flex flex-wrap items-center gap-5'>
            <span className='inline-flex items-center gap-1.5'>
              <Globe className='h-4 w-4' />
              English (EN)
            </span>
            <span>15,204 jobs online</span>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
