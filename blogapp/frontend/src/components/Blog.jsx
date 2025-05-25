import React, { useState } from 'react'; // 确保 React 和 useState 已导入
import PropTypes from 'prop-types';
import storage from '../services/storage'; // 保持不变

import {
  Paper,
  Typography,
  Link as MuiLink, // 重命名以区分 React Router Link
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack, // 用于评论表单布局
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';

const Blog = ({ blog, handleUpdateBlog, handleDeleteBlog, handleCommentBlog }) => {
  // 用于存储新评论输入的状态
  const [newComment, setNewComment] = useState('');
  // 用于控制删除确认对话框打开/关闭的状态
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // 如果 blog 对象不存在 (例如，数据还在加载或加载失败)，则不渲染任何内容
  if (!blog) {
    return null;
  }

  // 判断当前登录用户是否有权限删除此博客
  // 保持了你原有的逻辑：如果博客信息中包含用户信息，则比较用户名；否则，默认可以删除
  const canRemove = blog.user ? blog.user.username === storage.me() : true;

  // “点赞”按钮的事件处理函数
  const updateLikes = (event) => {
    event.preventDefault();
    handleUpdateBlog(blog.id, { likes: blog.likes + 1 });
  };

  // 打开删除确认对话框的事件处理函数
  const handleClickOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  // 关闭删除确认对话框的事件处理函数
  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  // 执行删除博客操作，并在操作完成后关闭对话框
  const executeDeleteBlog = () => {
    handleDeleteBlog(blog.id);
    handleCloseDeleteConfirm();
  };

  // 提交新评论的事件处理函数
  const submitComment = (event) => {
    event.preventDefault();
    // 防止提交空白评论
    if (!newComment.trim()) return;
    handleCommentBlog(blog.id, { comment: newComment });
    setNewComment(''); // 评论提交后清空输入框
  };

  return (
    // 2. 使用 Paper 组件作为博客详情页的根容器，提供视觉层级和内外边距
    <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3 }, marginY: 2 }} data-testid="blog">
      {/* 3. 博客标题 */}
      <Typography variant="h4" component="h1" gutterBottom>
        {blog.title}
      </Typography>
      {/* 博客作者 */}
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
        By {blog.author}
      </Typography>

      {/* 4. 博客的 URL 链接 */}
      <Box sx={{ mb: 2 }}>
        <MuiLink href={blog.url} target="_blank" rel="noopener noreferrer" variant="body1">
          {blog.url}
        </MuiLink>
      </Box>

      {/* 5. 点赞信息和“点赞”按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ mr: 1 }}>
          Likes: {blog.likes}
        </Typography>
        <Button
          variant="outlined" // 使用线框按钮样式
          size="small" // 较小的按钮尺寸
          startIcon={<ThumbUpOutlinedIcon />} // 在按钮文字前添加点赞图标
          onClick={updateLikes}
        >
          Like
        </Button>
      </Box>

      {/* 6. 博客添加者信息 */}
      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
        Added by {blog.user?.name || 'Unknown User'}
      </Typography>

      {/* 7. “删除博客”按钮 (仅当用户拥有删除权限时显示) */}
      {canRemove && (
        <Button
          variant="contained" // 使用填充按钮样式
          color="error" // 按钮颜色设为红色，表示这是一个具有潜在破坏性的操作
          size="small"
          startIcon={<DeleteOutlineIcon />} // 添加删除图标
          onClick={handleClickOpenDeleteConfirm} // 点击时打开删除确认对话框
          sx={{ mb: 2 }}
        >
          Remove Blog
        </Button>
      )}

      {/* 8. 删除确认对话框 */}
      <Dialog
        open={openDeleteConfirm} // 控制对话框的显示状态
        onClose={handleCloseDeleteConfirm} // 点击遮罩层或按 ESC 键时关闭对话框
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-dialog-description">
            Are you sure you want to remove the blog &quot;{blog.title}&quot; by {blog.author}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={executeDeleteBlog} color="error" autoFocus>
            {' '}
            {/* autoFocus 使此按钮默认获得焦点 */}
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* 9. 在博客主要信息和评论区之间添加一条分隔线 */}
      <Divider sx={{ marginY: 3 }} />

      {/* 10. 评论区 */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Comments
        </Typography>

        {/* 10.1 添加评论的表单 */}
        <Box component="form" onSubmit={submitComment} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            {' '}
            {/* 使用 Stack 布局输入框和按钮 */}
            <TextField
              label="Write a comment" // 输入框的标签
              variant="outlined"
              size="small"
              fullWidth // 输入框占据全部可用宽度
              multiline // 允许多行输入
              rows={2} // 默认显示2行，可根据输入内容自动扩展
              value={newComment}
              onChange={({ target }) => setNewComment(target.value)}
              inputProps={{ 'data-testid': 'commentInput' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCommentOutlinedIcon />} // 添加评论图标
              disabled={!newComment.trim()} // 如果输入框为空白，则禁用按钮
              sx={{ flexShrink: 0 }} // 防止按钮在 Flex 布局中被压缩
            >
              Comment
            </Button>
          </Stack>
        </Box>

        {/* 10.2 评论列表 */}
        {blog.comments && blog.comments.length > 0 ? (
          <List disablePadding>
            {' '}
            {/* disablePadding 移除 List 组件的默认内边距 */}
            {blog.comments.map((comment, index) => (
              // 为每个评论项使用 React.Fragment 包裹，并提供唯一的 key
              // 假设 comment 是一个对象，并且评论文本存储在 comment.comment 字段中
              // 如果 comment 对象有唯一的 id，优先使用 comment.id作为 key
              <React.Fragment key={comment.id || `comment-${index}`}>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                  {' '}
                  {/* 调整 ListItem 的垂直内边距 */}
                  <ListItemText
                    primary={comment.comment || (typeof comment === 'string' ? comment : '')} // 显示评论文本，兼容 comment 是对象或直接是字符串的情况
                    // 如果评论对象还包含用户信息，可以在 secondary prop 中显示:
                    // secondary={`By: ${comment.user?.name || 'Anonymous'}`}
                  />
                </ListItem>
                {/* 在评论项之间添加分隔线 (除了最后一项之外) */}
                {index < blog.comments.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          // 当没有评论时，显示提示信息
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// Prop Types 保持不变，但对于 blog.comments，如果它是对象数组，可以更具体
Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      username: PropTypes.string.isRequired,
    }),
    // 如果 comments 是对象数组，例如：PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, comment: PropTypes.string }))
    comments: PropTypes.array,
  }),
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
  handleCommentBlog: PropTypes.func.isRequired,
};

export default Blog;
