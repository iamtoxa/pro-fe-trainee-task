import useSwr from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from "react";

import RepoCard from '../components/RepoCard'
import Paginator from '../components/Paginator'
import RepoSearch from '../components/RepoSearch'

function Page(props) {
  const fetcher = (url) => fetch(url, {
    headers: {
      "Authorization": `token ${props.token}`
    }
  }).then(async (res) => {return {res: await res.json(), response: res}})


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
          <RepoCard className='hovered' key={el.id} item={el} token={props.token}/>)}
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

export const getServerSideProps = async ({query}) => {

  var fs = require('fs');
  var jwt = require('jsonwebtoken');
  var privateKey = fs.readFileSync('./cert/informal-repos-list.2020-06-14.private-key.pem');

  var payload = {
    iat: Math.round(new Date().getTime() / 1000),
    exp: Math.round(new Date().getTime() / 1000) + (60 * 10 - 1),
    iss: 68614
  }

  var jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  var token = await fetch("https://api.github.com/app/installations/9744407/access_tokens", {
    headers: {
      "Authorization": `Bearer ${jwtToken}`,
      "Accept": "application/vnd.github.machine-man-preview+json"
    },
    method: "POST"
  }).then((res) => res.json()).then((data) => { console.log(data.token); return data.token; })

  return { props: {token} };
};

export default Page;