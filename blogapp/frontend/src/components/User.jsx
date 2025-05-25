import PropTypes from 'prop-types';
// 1. 导入 Material UI 组件
import { Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom'; // 如果博客标题需要链接，则取消注释

const User = ({ user }) => {
  // 2. 如果 user 数据不存在 (例如，ID 无效或数据仍在加载)，显示提示信息
  if (!user) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, my: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          User Not Found
        </Typography>
        <Typography color="text.secondary">
          The user you are looking for does not exist or could not be loaded.
        </Typography>
      </Paper>
    );
  }

  return (
    // 3. 使用 Paper 组件作为用户详情的根容器，提供视觉层级和内边距
    <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3 }, marginY: 2 }}>
      {/* 用户名作为页面标题 */}
      <Typography variant="h4" component="h2" gutterBottom>
        {user.name}
      </Typography>
      {/* （可选）可以添加更多用户信息，如 username 等 */}
      {/* <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        @{user.username}
      </Typography> */}
      <Divider sx={{ my: 2 }} /> {/* 分隔线 */}
      {/* "Added Blogs" 小标题 */}
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Added Blogs
      </Typography>
      {/* 4. 显示用户创建的博客列表 */}
      {user.blogs && user.blogs.length > 0 ? (
        // 使用 List 和 ListItem 展示博客标题
        <List dense component="nav" aria-label="user blogs list">
          {/* dense 使列表项更紧凑 */}
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} disablePadding>
              {/* 这里可以选择是否将博客标题也做成链接 */}
              {/* 例如：
              <ListItemButton component={RouterLink} to={`/blogs/${blog.id}`}>
                <ListItemText primary={blog.title} />
              </ListItemButton>
              */}
              <ListItemText primary={blog.title} sx={{ pl: 2 }} />{' '}
              {/* 简单显示标题，添加一些左内边距 */}
            </ListItem>
          ))}
        </List>
      ) : (
        // 如果用户没有创建任何博客，则显示提示信息
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This user has not added any blogs yet.
        </Typography>
      )}
    </Paper>
  );
};

User.propTypes = {
  user: PropTypes.object,
};

export default User;
