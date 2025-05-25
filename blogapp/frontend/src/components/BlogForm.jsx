import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Box, Stack, Paper, Typography } from '@mui/material';

const BlogForm = ({ handleAddBlog }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    handleAddBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  return (
    // 1. 使用 Paper 组件包裹表单，提供视觉上的区隔和内边距
    <Paper elevation={2} sx={{ padding: { xs: 2, sm: 3 }, marginTop: 2 }}>
      {/* 2. 在表单内部添加一个标题 */}
      <Typography variant="h6" component="h3" sx={{ mb: 2, textAlign: 'center' }}>
        Create New Blog
      </Typography>
      {/* 3. 使用 Box 作为表单元素 */}
      <Box component="form" onSubmit={addBlog} noValidate>
        {/* 4. 使用 Stack 垂直排列表单元素并设置间距 */}
        <Stack spacing={2}>
          <TextField
            label="Title"
            type="text"
            variant="outlined"
            value={newTitle}
            name="NewTitle"
            onChange={({ target }) => setNewTitle(target.value)}
            inputProps={{ 'data-testid': 'titleInput' }} // 5. 传递 data-testid
            fullWidth // 使输入框占据全部宽度
            required // 标记为必填项
          />
          <TextField
            label="Author"
            type="text"
            variant="outlined"
            value={newAuthor}
            name="NewAuthor"
            onChange={({ target }) => setNewAuthor(target.value)}
            inputProps={{ 'data-testid': 'authorInput' }}
            fullWidth
            required
          />
          <TextField
            label="URL"
            type="url" // 6. 将 type 设置为 "url" 以获得更好的语义和可能的浏览器优化
            variant="outlined"
            value={newUrl}
            name="NewUrl"
            onChange={({ target }) => setNewUrl(target.value)}
            inputProps={{ 'data-testid': 'urlInput' }}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained" // 7. "contained" 样式的按钮
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 1 }} // 与上方元素的间距
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

BlogForm.propTypes = {
  handleAddBlog: PropTypes.func.isRequired,
};

export default BlogForm;
