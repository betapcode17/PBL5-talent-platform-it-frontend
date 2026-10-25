import { useState, type FormEvent } from 'react'
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Container from '@/components/ui/Container'

const NewsletterSection = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setIsSubscribed(true)
    setTimeout(() => {
      setEmail('')
    }, 3000)
  }

  return (
    <section className='bg-white py-14 sm:py-20'>
      <Container>
        <div className='relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 px-6 py-12 shadow-[0_25px_70px_-15px_rgba(124,58,237,0.35)] sm:px-12 lg:px-16 lg:py-16'>
          {/* Ambient light effects */}
          <div className='pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl' />
          <div className='pointer-events-none absolute right-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-indigo-400/15 blur-2xl' />

          <div className='relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
            {/* Text & Value Proposition */}
            <div className='space-y-4 text-white'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide backdrop-blur'>
                <Sparkles className='h-3.5 w-3.5 text-amber-300' />
                <span>{t('home.newsletter.badge')}</span>
              </div>

              <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem]'>
                {t('home.newsletter.title')}
              </h2>

              <p className='max-w-xl text-sm leading-relaxed text-violet-100 sm:text-base'>
                {t('home.newsletter.subtitle')}
              </p>

              <div className='flex flex-wrap items-center gap-4 pt-1 text-xs font-medium text-violet-200'>
                <span className='inline-flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-400' />
                  {t('home.newsletter.statEngineers')}
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <ShieldCheck className='h-4 w-4 text-emerald-400' />
                  {t('home.newsletter.statZeroSpam')}
                </span>
                <span>• {t('home.newsletter.statUnsubscribe')}</span>
              </div>
            </div>

            {/* Subscription Form */}
            <div>
              {isSubscribed ? (
                <div className='rounded-2xl border border-emerald-400/30 bg-emerald-500/20 p-6 text-center text-white backdrop-blur'>
                  <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white'>
                    <CheckCircle2 className='h-6 w-6' />
                  </div>
                  <h3 className='text-lg font-bold'>{t('home.newsletter.successTitle')}</h3>
                  <p className='mt-1 text-xs text-emerald-100'>
                    {t('home.newsletter.successSubtitle')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:flex-row'>
                  <div className='relative flex-1'>
                    <Mail className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                    <input
                      type='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('home.newsletter.placeholder')}
                      className='h-14 w-full rounded-2xl border border-white/20 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none shadow-md placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-violet-300'
                    />
                  </div>
                  <button
                    type='submit'
                    className='h-14 cursor-pointer rounded-2xl bg-slate-950 px-7 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                  >
                    {t('home.newsletter.button')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default NewsletterSection
