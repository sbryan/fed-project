import useSWR from 'swr'

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

export const usePosts = () => {
  const { data, error, mutate } = useSWR(`/posts`, fetcher)

  return {
    posts:    data || [],
    setPosts: mutate,
    loading:  (!error && !data),
    error
  }
}

export const useComments = () => {
  const { data, error, mutate } = useSWR(`/comments`, fetcher)

  return {
    comments:    data || [],
    setComments: mutate,
    loading:  (!error && !data),
    error
  }
}

export const useAuthors = () => {
  const { data, error, mutate } = useSWR(`/users`, fetcher)

  return {
    authors:    data || [],
    setAuthors: mutate,
    loading:  (!error && !data),
    error
  }
}

export default {
  usePosts,
  useAuthors,
  useComments,
}
