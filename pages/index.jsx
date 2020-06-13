import useSwr from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from "react";

import RepoCard from '../components/RepoCard'
import Paginator from '../components/Paginator'
import RepoSearch from '../components/RepoSearch'

const fetcher = (url) => fetch(url, {
  headers: {
    "Authorization": "token 171657ead14f6fd948cb1d105f12ea40019899f7"
  }
}).then(async (res) => {return {res: await res.json(), response: res}})

function Page(props) {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1
  const perPage = 10;

  var { data, error } = useSwr(`https://api.github.com/search/repositories?q=${router.query.search || "stars:>=1"}&sort=stars&order=desc&per_page=${perPage}&page=${currentPage}`, fetcher)
  
  if(data && data.response.headers.get('link')){
    var hypermedia = data.response.headers.get('link').split(', ').map(el=>{return el.split('; ').reverse().map((val,index)=>index==0?val.slice(5,-1):val.slice(1,-1)) }).reduce((acc,[k,v])=>({...acc,[k]:v}),{});
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>
          Github Dashboard
        </h1>
      </header>

      <main className='page__index'>
        <RepoSearch/>

        <div className='reposList' style={{marginBottom: 20}}>
          {data && data.res && data.res.items.map(el=>
          <RepoCard className='hovered' key={el.id} item={el}/>)}
        </div>


        {data && <Paginator total={data.res.total_count} perPage={perPage}/>}

      </main>

      <footer>
        <div>
          Powered by <a href="https://vk.com/iam_toxa" target="_blank"><b>Anton Medvedev</b></a>
        </div>
      </footer>
    </div>
  )
}

export default Page;