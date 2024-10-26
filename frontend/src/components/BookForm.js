import { useEffect, useState } from "react";
import { useBookContext } from "../hooks/useBookContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const BookForm = () => {
    const {dispatch} = useBookContext();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState('');
    const [publisher, setPublisher] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors]= useState(null);

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];  // Lấy file ảnh đầu tiên
    
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setImagePreview(reader.result);  // Lưu link ảnh để hiển thị
    //     };
    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // };
    
    const handleImage = (e) =>{
        const file = e.target.files[0];
        setFileToBase(file);
        console.log(file);
    }

    const setFileToBase = (file) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setImages(reader.result);
        }

    }
    useEffect(()=>{
        const fetchCategories= async () =>{
            const response = await fetch('/api/categoryBooks');
            const json = await response.json();

            if(response.ok){
                setCategories(json);
            }
            else{
                console.error('Failed to fetch categories');
            }
        }
        fetchCategories();
    },[]);

    // const handleSubmit = async (e) =>{
    //     e.preventDefault();
    //     const book = {title, author, description, images, publisher, categoryId};
     
    //     const response = await fetch('/api/books',{
    //         method: 'POST',
    //         body: JSON.stringify(book),
    //         headers:{
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const json = await response.json();

    //     if(!response.ok){
    //         setErrors(json.errors);
    //     }
    //     if(response.ok){
    //         setTitle('');
    //         setAuthor('');
    //         setDescription('');
    //         setImages(null);  
    //         setImagePreview(null);
    //         setPublisher('');
    //         setCategoryId('');
    //         setErrors(null);
    //         console.log('new book added',json);
    //         dispatch({type:'CREATE_BOOK', payload: json})
    //     }
    // }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const {data} = await axios.post('/api/books', {title,author, description, images,publisher, categoryId})
            if  (data.success === true){
                setTitle('');
                setDescription('');
                setImages('');
                setPublisher('');
                setAuthor('');
                setCategoryId('');
               
                toast.success('product created successfully');
                const response = await fetch('/api/books');
                const json = await response.json();
                dispatch({type:'CREATE_BOOK', payload: json})            
            }
            console.log(data);
        } catch (error) {
            console.log(error)
        }

    }
      
    return(
        <form className="create" onSubmit={handleSubmit} encType="multipart/form-data">
            <h3>Add a new Book</h3>
            <label>Book Title: </label>
            <input
                type = "text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
             <label>Book Author: </label>
            <input
                type = "text"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
            />
             <label>Book Description: </label>
            <input
                type = "text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />
             <label>Book Images: </label>
             <input type="file" onChange={handleImage} />
           
            <div>
                <img src={images} alt="Selected" style={{ width: '200px', height: '200px' }} />
            </div>
        
             <label>Book Publisher: </label>
            <input
                type = "text"
                onChange={(e) => setPublisher(e.target.value)}
                value={publisher}
            />
            <label>Book Category: </label> 
            <select onChange={(e) => setCategoryId(e.target.value)} value={categoryId}>
                <option value="" >Chọn thể loại</option>
               {categories.map(category =>(
                <option key={category._id} value={category._id}>
                    {category.nameCategory}
                </option>
               ))}
            </select>
            <button>Add Book</button>
            {errors &&  <div>{errors}</div>}
        </form>
    );
}

export default BookForm;