
import { useEffect, useState, useRef } from 'react'
import {createApi} from 'unsplash-js';
import {debounce} from 'lodash'

const unsplash = createApi({
  accessKey: 'InfmFk73OxSUYroK2mIoEzqyIf5ghp060CCdhDdOn_8',
})

function App() {
  const [input, setInput] = useState('')
  const inputRef = useRef(input);
  const [images, setImages] = useState([])
  const imagesRef = useRef(images);

  const [fetching, setFectching] = useState(false)
  const fetchingRef = useRef(fetching);
  var page;


  const getImage = (query, page  = 1) => {
    setFectching(true)
    fetchingRef.current = true
    return new Promise((resolve, reject) => {
      unsplash.search.getPhotos({
        query,
        page,
        perPage: 5,
      }).then(result => {
        setFectching(false);
        fetchingRef.current = false

        resolve(result.response.results.map(result => result.urls.regular))
        console.log(result)
      })
    }
    ) 
   };

 
 useEffect(() => {
  inputRef.current = input;
    if (input !== ''){
      debounce(() => {
        setImages([])
        getImage(input, page)
        .then(images => {setImages(images);
          imagesRef.current = images;
        
        })
      }, 1000)();
      
    }else{
      setImages([])
    }
 },[input])

 const handleScroll = (e) => {
   const {scrollHeight, scrollTop, clientHeight} = e.target.scrollingElement
   const isBottom = scrollHeight - scrollTop <= clientHeight;
   if(isBottom && !fetchingRef.current){
    getImage(inputRef.current, imagesRef.current.length / 5 + 1)
    .then(newImages => {
      imagesRef.current = [...imagesRef.current, ...newImages];
      setImages(imagesRef.current)
    })
   }
 }

 useEffect(() => {
   document.addEventListener('scroll', handleScroll, {passive:true})

   return () => document.removeEventListener('scroll', handleScroll)
 }, [])

 
  return (
    <div className="App flex flex-col justify-center items-center pb-6">
      <h1 className="text-center text-4xl md:text-5xl mx-5 font-bold mt-12 pb-5">Photo Searcher🖼️</h1>
     
     <input className='bg-[#252526] flex justify-center items-center mt-2 rounded-sm py-1 px-4 outline-input' type="text" placeholder='Enter your prompt' value={input} onChange={(e) => setInput(e.target.value)} />
     

    <div className="grid photos mx-5 md:mx-[10rem] max-w-2xl">

    {images.length > 0 && images.map((url) => {
      return <img className='rounded-md  outline outline-[1.6px] outline-[#A5C9CA] mt-5 md:mt-8' src={url}/>
     }) }
    </div>
     <div>
      {fetching && 'Getting Image!'}
     </div>
    </div>
  )
}

export default App
