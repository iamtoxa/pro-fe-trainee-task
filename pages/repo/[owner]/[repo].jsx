import useSwr from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from "react";
import { BsStar, BsCalendar } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Link from 'next/link'



function Page(props) {
  const router = useRouter();

  const fetcher = (url) => fetch(url, {
    headers: {
      "Authorization": `Bearer ${props.token}`
    }
  }).then((res) => res.json())

  const { data: repo } = useSwr(`https://api.github.com/repos/${props.owner}/${props.repo}`, fetcher)
  const { data: commits } = useSwr(() => repo.commits_url.slice(0, -6), fetcher)
  const { data: languages } = useSwr(() => repo.languages_url, fetcher)
  const { data: contributors } = useSwr(() => repo.contributors_url + "?limit=3", fetcher)

  if (contributors) {
    contributors.length = 10;
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className='homeBtn' onClick={()=>{router.back()}}>
          <IoIosArrowBack size={32} />
        </div>
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
              {languages && Object.entries(languages).map(([lang, amount], index) =>
                <li key={index} title={amount} className={lang == repo.language ? "main" : ""}>{lang}</li>
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
              contributors.map((contributor) =>
                <li key={contributor.id}>
                  <img src={contributor.avatar_url} alt="" />
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

export const getServerSideProps = async ({query}) => {
  const { owner, repo } = query;

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

  return { props: {owner, repo, token} };
};


export default Page;