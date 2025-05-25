import { useEffect, useRef, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserContext, UserDispatchContext } from './contexts/userContext';
import { Routes, Route, useMatch } from 'react-router';
import Menu from './components/Menu';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Users from './components/Users';
import blogService from './services/blogs';
import loginService from './services/login';
import { useNotify } from './hooks/useNotify';
import storage from './services/storage';
import { Container, Typography, Box } from '@mui/material';
import './styles/App.css';

const App = () => {
  const queryClient = useQueryClient();
  const user = useContext(UserContext);
  const userDispatch = useContext(UserDispatchContext);

  const notify = useNotify();
  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
  });

  const match = useMatch('/blogs/:id');
  const blog =
    match && result.data ? result.data.find((blog) => blog.id === match.params.id) : null;

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.concat({
          ...newBlog,
          user: { id: newBlog.user, name: user.name, username: user.username },
        }),
      );
      notify({
        type: 'common',
        content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      });
      blogFormRef.current.toggleVisibility();
    },
    onError: (error) => {
      notify({ type: 'error', content: error.message });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((item) => (item.id === newBlog.id ? { ...item, likes: newBlog.likes } : item)),
      );
    },
    onError: (error) => {
      notify({ type: 'error', content: error.message });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, variables) => {
      const blogBeDeleted = queryClient
        .getQueryData(['blogs'])
        .find((value) => value.id === variables);
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((item) => item.id !== variables),
      );
      notify({
        type: 'common',
        content: `${blogBeDeleted.title} by ${blogBeDeleted.author} deleted`,
      });
    },
    onError: (error) => {
      notify({ type: 'error', content: error.message });
    },
  });

  const commentBlogMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((item) =>
          item.id === newBlog.id ? { ...item, comments: newBlog.comments } : item,
        ),
      );
    },
    onError: (error) => {
      notify({ type: 'error', content: error.message });
    },
  });

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      userDispatch({ type: 'LOGIN', payload: { user } });
      blogService.setToken(user.token);
    }
  }, [userDispatch]);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      storage.saveUser(user);
      blogService.setToken(user.token);
      userDispatch({ type: 'LOGIN', payload: { user } });
      notify({ type: 'common', content: `Welcome ${user.name}` });
    } catch (error) {
      notify({ type: 'error', content: error.message });
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    userDispatch({ type: 'LOGOUT' });
    storage.removeUser();
  };

  const handleAddBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject);
  };

  const handleUpdateBlog = async (id, newObject) => {
    updateBlogMutation.mutate({ id, newObject });
  };

  const handleDeleteBlog = async (id) => {
    deleteBlogMutation.mutate(id);
  };

  const handleCommentBlog = async (id, comment) => {
    commentBlogMutation.mutate({ id, comment });
  };

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh', // 占据整个视口高度
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // 水平居中
          justifyContent: 'center', // 垂直居中
          bgcolor: 'background.default', // 可选：使用主题背景色
          p: { xs: 2, sm: 3 }, // 在不同屏幕尺寸下添加一些内边距
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
            Blogs
          </Typography>
          <Notification />
          <LoginForm doLogin={handleLogin} />
        </Container>
      </Box>
    );
  }

  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <Container sx={{ mt: 2 }}>
        {/* 例如，为主要内容区添加一个 Container 和上边距 */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
          Blog App
        </Typography>
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="creat new blog" ref={blogFormRef}>
                  <BlogForm handleAddBlog={handleAddBlog} />
                </Togglable>
                {result.isPending ? <div>Loading...</div> : <BlogList blogs={result.data} />}
              </div>
            }
          />
          <Route path="/users/*" element={<Users />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                handleUpdateBlog={handleUpdateBlog}
                handleDeleteBlog={handleDeleteBlog}
                handleCommentBlog={handleCommentBlog}
              />
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
