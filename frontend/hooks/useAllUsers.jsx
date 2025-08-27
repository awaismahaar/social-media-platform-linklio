import { useEffect, useState } from 'react';
import axios from 'axios';
const useAllUser = () => {
    const [allUser, setAllUser] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getAllUser() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get-all-users`, {
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                    }
                });
                if (res.data.success) {
                    setAllUser(res.data.users);
                    // console.log(res.data.posts);
                }
            }
            catch (error) {

            }
            finally {
                setLoading(false);
            }
        }
        getAllUser();
    }, []);
    return { allUser, loading };
}

export default useAllUser;