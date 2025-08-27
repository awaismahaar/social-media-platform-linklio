import Navbar from '@/components/general/Navbar'
import Sidebar from '@/components/general/Sidebar'
import UserProfile from '@/components/general/UserProfile'

const ProfilePage = async ({params}) => {
    const {id} = await params
    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className='lg:pl-[280px] pt-[80px]'>
                    <UserProfile id={id}/>
                </div>

            </div>
        </>
    )
}

export default ProfilePage