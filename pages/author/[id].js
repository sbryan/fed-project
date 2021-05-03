// import Dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../styles/Home.module.css'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'
import { usePosts, useAuthors } from '../../lib/dataRetriever'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  accordion: {
    flexGrow: 1,
    minWidth: '100%',
    width: '100%'
  },
}))

const renderPostListItemForAuthor = (p) => {
  return (
    <ListItem key={p.id}>
      <Link href={`/post/${p.id}`}>
        <a>{p.title}</a>
      </Link>
    </ListItem>
  )
}

const AuthorPage = () => {
  const { id } = useRouter().query
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  const author = authors.find(a => a.id.toString() === id.toString()) || null
  const authorPosts = posts.filter(p => id && id.toString() === p.userId.toString()) || []
  const avatar = author && `https://avatars.dicebear.com/api/gridy/${author.username}.svg` || ''

  const classes = useStyles()

  if (!id || !author) {
    return (
      <>
        <Head>
          <title>Missing user</title>
        </Head>
        <h3>Sorry, we can't find this user anymore...</h3>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{author.name}</title>
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
              title={
                <>
                  <Typography component='span' variant='h3'>
                    {author.name}
                  </Typography>
                  <Typography component='span' variant='h4'>
                    ({author.username})
                  </Typography>
                </>
              } 
              subheader={<Divider variant='middle' />}
            />
            <CardContent>
              <dl>
                <dt>Contact:</dt>
                <dd><label>Name:</label> {author.name}</dd>
                <dd><label>E-Mail:</label> {author.email}</dd>
                <dd><label>Phone:</label> {author.phone}</dd>
                <dd><label>Website:</label> <a href={`https://${author.website}/`} target='_blank' id='website'>{author.website}</a></dd>
                <dl>
                  <dt>Company:</dt>
                  <dd><label>Name:</label> {author.company.name}</dd>
                  <dd><label>Markets:</label> {author.company.catchPhrase}</dd>
                  <dd><label>Products:</label> {author.company.bs}</dd>
                </dl>
              </dl>
              <dl>
                <dt>Address:</dt>
                <dd><label>Street:</label> {author.address.street}</dd>
                <dd><label>Suite:</label> {author.address.suite}</dd>
                <dd><label>City:</label> {author.address.city}</dd>
                <dd><label>Zipcode:</label> {author.address.zipcode}</dd>
                <dd><label>Coordinates:</label>
                <a target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${author.address.geo.lat},${author.address.geo.lng}`} id='coords'>
                  {author.address.geo.lat}, {author.address.geo.lng}
                </a></dd>
              </dl>
            </CardContent>
            <CardActions>
              <Accordion defaultExpanded className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel-content"
                  id="panel-header"
                >
                  <Typography variant='h6'>
                    {postsLoading && 'Loading posts...' ||
                    `Posts (${authorPosts.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {authorPosts.map(p=>renderPostListItemForAuthor(p))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardActions>
          </Card>
        </main>
      </div>
    </>
  )
}

export default AuthorPage
