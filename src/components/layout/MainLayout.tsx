import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'

const MainLayout = () => {
  const location = useLocation()
  const isChatPage = location.pathname.startsWith('/chat')

  return (
    <div className='flex min-h-screen flex-col'>
      <Header></Header>
      <main className='flex-1'>
        <Outlet></Outlet>
      </main>
      {!isChatPage && <Footer></Footer>}
    </div>
  )
}

export default MainLayout
