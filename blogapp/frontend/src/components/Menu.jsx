import { Link as RouterLink } from 'react-router'; // 1. 导入 RouterLink 并使用别名
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Menu = ({ user, handleLogout }) => {
  return (
    // 2. 使用 AppBar 作为导航栏的根容器
    <AppBar position="static">
      {/* 'static' 使其成为文档流的一部分 */}
      <Toolbar>
        {/* 3. Toolbar 用于组织 AppBar 内的元素 */}
        {/* 4. 使用 Box 来管理左侧导航链接的布局，flexGrow: 1 会让它占据尽可能多的空间，从而将右侧内容推到边缘 */}
        <Box sx={{ flexGrow: 1 }}>
          {/* 5. 将 React Router 的 Link 与 Material UI Button 集成 */}
          <Button color="inherit" component={RouterLink} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
        </Box>
        {/* 6. 右侧的用户信息和登出按钮 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {/* 使用 Typography 显示用户信息 */}
            {user.name} logged-in
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            {/* 登出按钮 */}
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Menu.propTypes = {
  user: PropTypes.object,
  handleLogout: PropTypes.func,
};

export default Menu;
