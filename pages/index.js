import styles from '../styles/Home.module.css'
import Link from 'next/link'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useEffect, useState } from 'react'
import { usePosts, useAuthors } from '../lib/dataRetriever'

const renderPostListItem = (post) => (
  <Grid item key={post.id} xs={12} sm={12} md={6} lg={4}>
    <Card>
      <CardContent>
        <a>{post.title}</a>
      </CardContent>
      <CardActions>
        <Link href={`/post/${post.id}`}>
          <a>Read more...</a>
        </Link>
      </CardActions>
    </Card>
  </Grid>
)

export default function Home() {
  const [filter, setFilter] = useState(null)
  const [filterChanged, setFilterChanged] = useState(false)
  const [filteredPosts, setFilteredPosts] = useState(null)
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  useEffect(() => {
    if (filterChanged) {
      if (filter) {
        const author = authors.find(a => a.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
        if (author) {
          const res = posts.filter(p => p.userId === author.id)
          setFilteredPosts(res)
        } else {
          setFilteredPosts(posts)
        }
        setFilterChanged(false)
      } else {
        setFilteredPosts(posts)
      }
    }
  })

  const handleFilterChange = (e) => {
    async function dispatchFilterChanged(v) {
      await setFilterChanged(v)
    }
    async function dispatchFilter(v) {
      await setFilter(v)
    }
    const val = e.currentTarget.offsetParent.querySelector('#filter').value || ''
    if (val !== filter) {
      dispatchFilter(val)
      dispatchFilterChanged(true)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <TextField id="filter" label="Filter by Author" type="search" variant="outlined"
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="filter results by author"
                    onClick={handleFilterChange}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>,
            }}
          />
        </div>
        <hr />
        {postsLoading && <CircularProgress />}
        <Grid container spacing={3}>
          {filteredPosts && filteredPosts.map(p => renderPostListItem(p))
          || posts && posts.map(p => renderPostListItem(p))
          }
        </Grid>
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
