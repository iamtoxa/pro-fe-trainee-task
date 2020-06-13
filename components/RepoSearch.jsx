import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react';

import { BsSearch } from "react-icons/bs";

const component = (props) => {
  const router = useRouter();
  const input = useRef();
  const [search, setSearch] = useState();

  const submit = ()=>{
    if(input.current.value){
        var newQuery = {page: 1, search: input.current.value};
    } else{
        var newQuery = {page: 1};
    }
    router.push({
        pathname: '/',
        query: { ...newQuery },
    });
  }

  if(search == null && router.query.search != null){
    setSearch(router.query.search);
  }

  
  return (
    <form className='repoSearch' onSubmit={(e)=>{e.preventDefault();submit()}}>
      <input value={search} onChange={(e)=>{setSearch(e.currentTarget.value)}} ref={input} type="text"/>
      <button onClick={submit}><BsSearch size={26}/></button>
    </form>
  )
}

export default component
