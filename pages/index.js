import styles from '../styles/Home.module.css'
import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const API_BASE = 'https://jsonplaceholder.typicode.com';
const fetcher = (path) => fetch(`${API_BASE}${path}`)
  .then(res => {
    if (!res.ok) {
      const message = res.json();
      throw new Error(`${res.status}: ${message}`);
    }
    return res.json();
  })
  .catch(err => {
    throw new Error(err)
  });

const usePosts = () => {
  const { data, error, mutate } = useSWR(`/posts`, fetcher)

  return {
    posts:    data || [],
    setPosts: mutate,
    loading:  (!error && !data),
    error
  }
}

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
  const { posts, setPosts, loading, error } = usePosts();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loading && <Loading/>}
        {posts && posts.length &&
          <ol>
            {posts.map(p => renderPostListItem(p))}
          </ol>}
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
