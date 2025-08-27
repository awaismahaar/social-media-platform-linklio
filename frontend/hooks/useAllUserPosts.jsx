import { useEffect, useState } from 'react';
import axios from 'axios';
const useAllUserPosts = (change, id) => {
    const [allUserPosts, setAllUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getAllUserPosts() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/get-user-posts/${id}`, {
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("auth-token") && JSON.parse(localStorage.getItem("auth-token"))}`
                    }
                });
                if (res.data.success) {
                    setAllUserPosts(res.data.posts);
                    // console.log(res.data.posts);
                }
            }
            catch (error) {

            }
            finally {
                setLoading(false);
            }
        }
        getAllUserPosts();
    }, [change, id]);
    return { allUserPosts, loading };
}

export default useAllUserPosts