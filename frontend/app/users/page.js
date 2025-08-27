import Navbar from '@/components/general/Navbar'
import ShowAllUsers from '../_components/ShowAllUsers'
import Sidebar from '@/components/general/Sidebar'

const AllUsers = () => {
  return (
     <>
                <Navbar />
                <Sidebar />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <div className='lg:pl-[280px] pt-[80px]'>
                        <ShowAllUsers />
                    </div>
    
                </div>
            </>
  )
}

export default AllUsers