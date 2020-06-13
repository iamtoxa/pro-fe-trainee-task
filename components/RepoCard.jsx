import Link from 'next/link'
import useSwr from 'swr'

import { BsStar, BsCalendar } from "react-icons/bs";

const fetcher = (url) => fetch(url, {
  headers: {
    "Authorization": "token 2d03cfe4a6f361dd7e68ba988d39b7d3cc2688da"
  }
}).then(async (res) => {return {res: await res.json(), response: res}})

const component = (props) => {
  const { item } = props;

  var { data } = useSwr(item.commits_url.slice(0,-6), fetcher)


  return (
    <div className={`repoCard ${props.className}`}>

      <Link href='/repo/[owner]/[repo]' as={`/repo/${item.owner.login}/${item.name}`}><a><h2 className="title">{item.full_name}</h2></a></Link>
      <div className="info">
        <div title='Количество звёзд' className="stars"><BsStar/> {item.stargazers_count}</div>
        {data && data.res && data.res[0] && <div title='Последний коммит' className="last_commit"><BsCalendar/> {new Date(Date.parse(data.res[0].commit.committer.date)).toLocaleDateString()}</div>}
      </div>
      <div className="link">{item.html_url.slice(8)}</div>


      <p className="description">{item.description}</p>

      <div className='repoCard__footer'>
        <Link href='/repo/[owner]/[repo]' as={`/repo/${item.owner.login}/${item.name}`}>
          <button className='btn'>Подробнее</button>
        </Link>

        <a href={item.html_url} target='_blank'>
          <button className='btn'>GitHub</button>
        </a>
      </div>
    </div>
  )
}

export default component
