import Link from 'next/link'
import { useRouter } from 'next/router'

const component = (props) => {
  const router = useRouter();
  const current = Number(router.query.page) || 1
  
  const { total, perPage } = props;

  const maxPage = Math.ceil(total / perPage) > 100 ? 100 : Math.ceil(total / perPage);

  var pages = [current]
  if (current > 1) {
    for (let index = current - 1; index > 0 && index > current - 4; index--) {
      pages.unshift(index);
    }
  }

  for (let index = current + 1; pages.length < 7 && index <= maxPage; index++) {
    pages.push(index);
  }

  return (
    <div className='paginator'>
      {!pages.includes(1) && <Link replace href={{ pathname: '/', query: { ...router.query, page: 1 } }}>
        <button>{'<'}</button>
      </Link>}

      {pages.map(page=>{
        return <Link key={page} replace href={{ pathname: '/', query: { ...router.query, page: page } }}>
          <button>{page}</button>
        </Link>
      })}

      {!pages.includes(maxPage) && <Link replace href={{ pathname: '/', query: { ...router.query, page: maxPage } }}>
        <button>{'>'}</button>
      </Link>}
    </div>
  )
}

export default component
