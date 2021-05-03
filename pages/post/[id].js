// import Dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'

import { usePosts, useComments, useAuthors } from '../../lib/dataRetriever'

// const EditPostForm = Dynamic(import('../../components/edit-post'), { ssr: false })

const renderComment = (c) => {
  const avatar = `https://avatars.dicebear.com/api/gridy/${c.email}.svg`
  return (
    <>
      <Divider variant="inset" component="li" />
      <ListItem key={c.id}>
        <ListItemAvatar>
          <Avatar alt={c.email} src={avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <div>
              <Typography component='span' variant='subtitle1'>{c.name}</Typography>
              <Typography component='span' variant='body2'>
                <cite> - <a href={`mailto:${c.email}`}>{c.email}</a></cite>
              </Typography>
            </div>
            }
          secondary={c.body}
        />
      </ListItem>
    </>
  )
}

const BlogPage = () => {
  const { id } = useRouter().query
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { comments, setComments, commentsLoading, commentsError } = useComments();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  const post = posts.find(p => p.id.toString() === id.toString()) || null
  const author = authors.find(a => post && post.userId.toString() === a.id.toString()) || null
  const postComments = comments.filter(c => id && id.toString() === c.postId.toString()) || []
  const avatar = author && `https://avatars.dicebear.com/api/gridy/${author.username}.svg` || ''

  if (!id || !post) {
    return (
      <>
        <Head>
          <title>Missing post</title>
        </Head>
        <h3>Sorry, we can't find this blog post anymore...</h3>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label='Author'
                  alt={author.name}
                  src={avatar}>
                </Avatar>
              }
              action={
                <IconButton aria-label="close"
                  onClick={()=>window.history.back()}>
                  <CancelIcon />
                </IconButton>
              }
              title={post.title}
              subheader={
                <Typography component='span' variant='body2'>
                  <cite>by&nbsp;
                    <Link href={`/author/${author.id}`}>
                      <a>{author.name}</a>
                    </Link>
                  </cite>
                </Typography>
              }
            />
            <CardContent>
              {post.body}
            </CardContent>
            <CardActions>
              <List
                component="nav"
                subheader={
                  <ListSubheader component="div" variant='h6'>
                    {commentsLoading && 'Loading comments...' ||
                    `Comments (${postComments.length})`}
                  </ListSubheader>
                }>
                {postComments.map(c=>renderComment(c))}
              </List>
            </CardActions>
          </Card>
        </main>
      </div>
    </>
  )
}

export default BlogPage
