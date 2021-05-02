import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePosts, useAuthors } from '../lib/dataRetriever'

const Loading = () => (
  <h3 className={styles.description}>Fetching data...</h3>
)

const renderPostListItem = (post) => (
  <li key={post.id}>
    <Link href={`/post/${post.id}`}>
      <a>{post.title}</a>
    </Link>
  </li>
)

export default function Home() {
  const [filter, setFilter] = useState(null)
  const [filterChanged, setFilterChanged] = useState(false)
  const [filteredPosts, setFilteredPosts] = useState(null)
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  useEffect(() => {
    if (filter && filterChanged) {
      const author = authors.find(a => a.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
      if (author) {
        const res = posts.filter(p => p.userId === author.id)
        setFilteredPosts(res)
      } else {
        setFilteredPosts(posts)
      }
      setFilterChanged(false)
    }
  })

  const handleFilterChange = (e) => {
    async function dispatchFilterChanged(v) {
      await setFilterChanged(v)
    }
    async function dispatchFilter(v) {
      await setFilter(v)
    }
    const val = e.currentTarget.previousElementSibling.value
    if (val !== filter) {
      dispatchFilter(val)
      dispatchFilterChanged(true)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>FED Blog</h1>
        <div>
          <input type='text' id='filter'></input>
          <button onClick={handleFilterChange}>Filter by Author🔍</button>
        </div>
        <hr />
        {postsLoading && <Loading/>}
        {filteredPosts && filteredPosts.length &&
          <ol>
            {filteredPosts.map(p => renderPostListItem(p))}
          </ol>
        || posts && posts.length &&
          <ol>
            {posts.map(p => renderPostListItem(p))}
          </ol>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
