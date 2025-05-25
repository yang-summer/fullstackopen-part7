import { useQuery } from '@tanstack/react-query';
// 假设你使用的是 react-router-dom v6+
import { Link as RouterLink, Routes, Route, useMatch } from 'react-router';
import User from './User'; // 单个用户详情组件
import userService from '../services/users'; // 用户数据服务

// 1. 导入 Material UI 组件
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress, // 用于显示加载状态
  Link as MuiLink, // Material UI 的 Link 组件，用于美化链接
} from '@mui/material';

const Users = () => {
  // 2. 使用 React Query 获取所有用户数据
  const result = useQuery({
    queryKey: ['users'], // 查询的唯一键
    queryFn: userService.getAll, // 获取数据的函数
    retry: 1, // 失败后重试次数
  });

  // 3. 使用 useMatch 确定当前是否为显示单个用户详情的路径 (例如 /users/:id)
  // 这部分路由逻辑保持不变
  const match = useMatch('/users/:id');
  const user = match && result.data ? result.data.find((u) => u.id === match.params.id) : null; // 根据匹配到的 id 从用户列表中查找对应的用户数据

  // 4. 渲染用户列表的组件逻辑 (之前是 userList 函数)
  const UserListComponent = () => {
    // 4.1. 处理加载状态
    if (result.isLoading) {
      // tanstack-query v4/v5 通常使用 isLoading
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 5,
            minHeight: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    // 4.2. 处理数据获取错误状态
    if (result.isError) {
      return (
        <Typography color="error" sx={{ textAlign: 'center', py: 3 }}>
          Failed to load users. Please try again later.
        </Typography>
      );
    }

    // 4.3. 处理数据为空或不存在的情况
    if (!result.data || result.data.length === 0) {
      return (
        <Typography sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          No users found.
        </Typography>
      );
    }

    // 4.4. 渲染用户数据表格
    return (
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 2 }}>
        {/* 使用 Paper 作为表格的容器，增加阴影 */}
        <Table aria-label="users table">
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            {/* 表头设置浅灰色背景 */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell> {/* 表头单元格，文字加粗 */}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Blogs Created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.data.map(
              (
                userData, // 遍历用户数据，建议重命名循环变量以区分外部的 'user'
              ) => (
                <TableRow
                  key={userData.id} // 为每一行提供唯一的 key
                  hover // 鼠标悬停时高亮该行
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // 移除表格最后一行的边框
                >
                  <TableCell component="th" scope="row">
                    {/* 'th' 使其语义化为行头 */}
                    {/* 使用 Material UI 的 Link 组件包裹 React Router 的 Link 功能 */}
                    <MuiLink component={RouterLink} to={`/users/${userData.id}`} underline="hover">
                      {userData.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell align="right">{userData.blogs.length}</TableCell>{' '}
                  {/* 博客数量，右对齐 */}
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // 5. Users 组件的主渲染逻辑，包含路由配置
  return (
    <Box sx={{ py: 3 }}>
      {/* 为整个 Users 功能区添加一些垂直内边距 */}
      <Routes>
        {/* 用户列表页的路由 */}
        <Route
          path="/"
          element={
            <>
              {/* 使用 React Fragment 避免不必要的 div 包裹 */}
              <Typography variant="h4" component="h1" gutterBottom>
                {/* 页面主标题 */}
                Users
              </Typography>
              <UserListComponent /> {/* 渲染用户列表 */}
            </>
          }
        />
        {/* 单个用户详情页的路由，user 数据已在 Users 组件顶部获取 */}
        <Route path="/:id" element={<User user={user} />} />
      </Routes>
    </Box>
  );
};

export default Users;
