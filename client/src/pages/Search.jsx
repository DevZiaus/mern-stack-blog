import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    console.log(sidebarData);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData((prevData) => ({
                ...prevData,
                searchTerm: searchTermFromUrl || prevData.searchTerm,
                sort: sortFromUrl || prevData.sort,
                category: categoryFromUrl || prevData.category,
            }));
        }
        const fetchPosts = async() => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/get-posts?${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setShowMore(data.posts.length === 9);
            }
            setLoading(false);
        }
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSidebarData((prevData) => ({
            ...prevData,
            [id]: value || (id === 'sort' ? 'desc' : id === 'category' ? 'uncategorized' : ''),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        const numberOfPost = posts.length;
        const startIndex = numberOfPost;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput 
                        placeholder="Search..." 
                        id="searchTerm" 
                        type="text" 
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Sort:</label>
                    <Select onChange={handleChange} value={sidebarData.sort} id="sort">
                        <option value='desc'>Latest</option>
                        <option value='asc'>Oldest</option>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Category:</label>
                    <Select onChange={handleChange} value={sidebarData.category} id="category">
                        <option value='uncategorized'>Uncategorized</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                        <option value='nodejs'>Node.js</option>
                        <option value='mongodb'>MongoDB</option>
                    </Select>
                </div>
                <Button type="submit" outline gradientDuoTone='purpleToPink'>
                    Apply Filters
                </Button>
            </form>
        </div>
        <div className="w-full">
            <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Search Results</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {
                    !loading && posts.length === 0 && 
                    <p className="text-xl text-gray-500">No Posts Found</p>
                }

                {
                    loading && <p className="text-xl text-gray-500"> Loading...</p>
                }
                {
                    !loading && posts && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))
                }
                {
                    showMore && <button className="text-teal-500 text-lg hover:underline w-full" onClick={handleShowMore}>Show More</button>
                }
            </div>
        </div>
    </div>
  )
}
