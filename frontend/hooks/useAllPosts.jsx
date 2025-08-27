import { useEffect, useState } from 'react';
import axios from 'axios';
const useAllPosts = (change,uploadPost) => {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getAllPosts() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/get-posts`);
                if (res.data.success) {
                    setAllPosts(res.data.posts);
                    // console.log(res.data.posts);
                }
            }
            catch (error) {

            }
            finally{
                setLoading(false);
            }
        }
        getAllPosts();
    }, [change,uploadPost]);
    return {allPosts,loading};
}

export default useAllPosts;