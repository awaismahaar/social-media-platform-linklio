import ResetPasswordCP from "@/app/_components/ResetPasswordCP";

async function ResetPassword({params}) { 
    const {token} = await params
    return (
        <>
            <div className='dark:bg-neutral-900 h-screen flex items-center justify-center w-full'>
               <ResetPasswordCP token={token}/>
            </div>
        </>
    )
}
export default ResetPassword;