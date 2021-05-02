// import Dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { usePosts, useComments, useAuthors } from '../../lib/dataRetriever'

// const EditPostForm = Dynamic(import('../../components/edit-post'), { ssr: false })

const renderPostListItemForAuthor = (p) => {
  return (
    <li key={p.id}>
      <Link href={`/post/${p.id}`}>
        <a>{p.title}</a>
      </Link>
    </li>
  )
}

const AuthorPage = () => {
  const { id } = useRouter().query
  const { posts, setPosts, postsLoading, postsError } = usePosts();
  const { authors, setAuthors, authorsLoading, authorsError } = useAuthors();

  const author = authors.find(a => a.id.toString() === id.toString()) || null
  const authorPosts = posts.filter(p => id && id.toString() === p.userId.toString()) || []

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
        <title>{author.username}</title>
      </Head>
      <h3>{author.username}</h3>
      <hr />
      <dl>
        <dt>Contact:</dt>
        <dd><label>Name:</label> {author.name}</dd>
        <dd><label>E-Mail:</label> {author.email}</dd>
        <dd><label>Phone:</label> {author.phone}</dd>
        <dd><label>Website:</label> <a href={author.website} id='website'>{author.website}</a></dd>
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
      <h3>Posts:</h3>
        {postsLoading && <div>Loading posts...</div>}
        {authorPosts && 
          <ul>
            {authorPosts.map(p => renderPostListItemForAuthor(p))}
          </ul>
        }
    </>
  )
}

export default AuthorPage
