import styles from '../styles/Home.module.css'
import Link from 'next/link'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import { useEffect, useState } from 'react'
import { usePosts, useAuthors } from '../lib/dataRetriever'


export default function Home() {
  const [filter, setFilter] = useState(null)
  const [filterChanged, setFilterChanged] = useState(false)
  const [filteredPosts, setFilteredPosts] = useState(null)
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  const renderPostListItem = (post) => {
    const author = authors.find(a => a.id.toString() === post.userId.toString())
    const name = author && author.name || ''
    const username = author && author.username || 'kilroy'
    const avatar = `https://avatars.dicebear.com/api/gridy/${username}.svg`
    return (
      <Grid item key={post.id} xs={12} sm={12} md={6} lg={4}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label='Author'
                alt={name}
                src={avatar}>
              </Avatar>
            }
            action={
              <Link href={`/post/${post.id}`}>
                <IconButton aria-label="open">
                  <OpenInNew />
                </IconButton>
              </Link>
            }
            title={post.title}
            subheader={`by ${name}`}
          />
          <CardContent>
            {post.body.length <= 140?post.body:post.body.substring(0,140)}...
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>
      </Grid>
    )
  }

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
        <Divider variant="middle" />
        {postsLoading && <CircularProgress />}
        <Grid container spacing={3}>
          {filteredPosts && filteredPosts.map(p => renderPostListItem(p, authors.find(a=>a.id===p.userId)))
          || posts && posts.map(p => renderPostListItem(p, authors.find(a=>a.id===p.userId)))
          }
        </Grid>
      </main>
    </div>
  )
}
