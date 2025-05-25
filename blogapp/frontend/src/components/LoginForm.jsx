import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Typography, Box, Paper, Stack } from '@mui/material';

const LoginForm = ({ doLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    doLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    // 1. 使用 Paper 组件为表单提供一个视觉上独立且有层级感的容器
    <Paper
      elevation={3} // 添加阴影效果
      sx={{
        padding: { xs: 2, sm: 3 }, // 响应式内边距：超小屏幕 (xs) 为 16px，小屏幕 (sm) 及以上为 24px
        marginTop: 4, // 与上方元素的间距
        maxWidth: 400, // 限制表单的最大宽度
        margin: 'auto', // 水平居中表单
      }}
    >
      {/* 2. 使用 Typography 作为表单标题 */}
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
        Log in to application
      </Typography>

      {/* 3. 使用 Box 作为表单元素，并传递 onSubmit 事件处理器 */}
      <Box component="form" onSubmit={handleLogin} noValidate>
        {/* noValidate 禁用浏览器默认的校验提示 */}
        {/* 4. 使用 Stack 垂直排列表单元素并设置间距 */}
        <Stack spacing={2}>
          <TextField
            label="Username" // 5. 标签现在是 TextField 的一部分
            type="text"
            variant="outlined" // TextField 的常用样式
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            inputProps={{ 'data-testid': 'username' }} // 6. 传递 data-testid
            fullWidth // 使 TextField 占据其容器的全部宽度
            required // 添加星号标记并启用基础的 HTML5 校验
            autoFocus // 组件加载时自动聚焦此字段
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            inputProps={{ 'data-testid': 'password' }}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained" // 7. "contained" 按钮样式，适用于主要操作
            color="primary" // 使用主题中的 primary 颜色
            fullWidth
            size="large" // 让按钮更大一些
            sx={{ mt: 1 }} // 在按钮前添加一些上边距
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

LoginForm.propTypes = {
  doLogin: PropTypes.func.isRequired,
};

export default LoginForm;
