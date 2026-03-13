import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header></Header>
      <main className='flex-1'>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
