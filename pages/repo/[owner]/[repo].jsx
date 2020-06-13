import useSwr from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from "react";
import { BsStar, BsCalendar } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Link from 'next/link'

const fetcher = (url) => fetch(url, {
  headers: {
    "Authorization": "token 2d03cfe4a6f361dd7e68ba988d39b7d3cc2688da"
  }
}).then((res) => res.json())

function Page(props) {
  const router = useRouter();

  const { data: repo } = useSwr(`https://api.github.com/repos/${props.owner}/${props.repo}`, fetcher)
  const { data: commits } = useSwr(() => repo.commits_url.slice(0, -6), fetcher)
  const { data: languages } = useSwr(() => repo.languages_url, fetcher)
  const { data: contributors } = useSwr(() => repo.contributors_url+"?limit=3", fetcher)

  if(contributors){
    contributors.length = 10;
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Link href="/">
          <div className='homeBtn'>
            <IoIosArrowBack size={32}/>
          </div>
        </Link>
        <h1>
          Github Dashboard
        </h1>
      </header>

      <main className='page__repo'>
        {repo && (<>
          <div className='repoCard'>
            <div className="title">
              <h2>{repo.name}</h2>
              <a href={repo.owner.html_url} target='_blank'>
                <div className='author'>
                  <div>
                    <img src={repo.owner.avatar_url} alt="" />
                  </div>

                  <div>
                    <h2>{repo.owner.login}</h2>
                  </div>
                </div>
              </a>
            </div>
            <div className="info">
              <div title='Количество звёзд' className="stars"><BsStar /> {repo.stargazers_count}</div>
              {commits && commits[0] && <div title='Последний коммит' className="last_commit"><BsCalendar /> {new Date(Date.parse(commits[0].commit.committer.date)).toLocaleDateString()}</div>}
            </div>
            <div className="link">{repo.html_url.slice(8)}</div>

            <ul className="languages">
              <span>Используемые языки: </span>
              {languages && Object.entries(languages).map(([lang,amount], index)=>
                <li key={index} title={amount} className={lang == repo.language?"main":""}>{lang}</li>
              )}
            </ul>

            <p className="description">{repo.description}</p>

            <div className='repoCard__footer'>
              <a href={repo.html_url} target='_blank'>
                <button className='btn'>Открыть в GitHub</button>
              </a>
              <a href={repo.owner.html_url} target='_blank'>
                <button className='btn'>Профиль создателя</button>
              </a>
            </div>
          </div>

          
          <ul className='contributors'>
            <li className='header'>10 наиболее активных контрибьютеров</li>
            {contributors && 
            contributors.map((contributor)=>
                <li key={contributor.id}>
                  <img src={contributor.avatar_url} alt=""/>
                  <a href={contributor.html_url} target='_blank'>{contributor.login} ({contributor.contributions} действий)</a>
                </li>
            )}
          </ul>
        </>)}
      </main>

      <footer>
        <div>
          Powered by <a href="https://vk.com/iam_toxa" target="_blank"><b>Anton Medvedev</b></a>
        </div>
      </footer>
    </div>
  )
}

Page.getInitialProps = async ({ query }) => {
  const { owner, repo } = query;
  return { owner, repo };
};


export default Page;