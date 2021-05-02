// import Dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { usePosts, useComments, useAuthors } from '../../lib/dataRetriever'

// const EditPostForm = Dynamic(import('../../components/edit-post'), { ssr: false })

const renderComment = (c) => {
  return (
    <li key={c.id}>
      <div className="commentHeader">
        <span>{c.name}</span>
        <address><a href={`mailto:${c.email}`}>{c.email}</a></address>
      </div>
      <div>
        {c.body}
      </div>
    </li>
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
      <hr />
      <h3>{post.title}</h3>
      <div>{post.body}</div>
      {author &&
        <Link href={`/author/${author.id}`}>
          <a><cite>{author.name}</cite></a>
        </Link>
      }
      <hr />
      <h3>Comments:</h3>
        {commentsLoading && <div>Loading comments...</div>}
        {postComments && 
          <ol>
            {postComments.map(c => renderComment(c))}
          </ol>
        }
    </>
  )
}

export default BlogPage
