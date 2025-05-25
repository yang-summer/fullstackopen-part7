import React from 'react'; // 确保导入 React，尤其当使用 Fragment 时
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router'; // 1. 从 react-router-dom 导入 Link 并重命名
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider, // 2. 导入所需 Material UI 组件
} from '@mui/material';

const BlogList = ({ blogs }) => {
  // 3. 处理列表为空的情况
  if (!blogs || blogs.length === 0) {
    return (
      <Typography variant="subtitle1" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
        Don&apos;t have a blog yet, create the first one!
      </Typography>
    );
  }

  // 4. 保持用户原有的排序逻辑。
  // toSorted() 是一个创建新排序数组的好方法。如果考虑旧浏览器兼容性，
  // 可以用 blogs.slice().sort((a, b) => b.likes - a.likes)
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    // 5. 使用 Box 包裹 List，方便设置整体样式，例如背景色和上边距
    <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 2, borderRadius: 1, boxShadow: 1 }}>
      {/* 6. 使用 List 作为列表容器 */}
      <List>
        {sortedBlogs.map((blog, index) => (
          // 7. 使用 React.Fragment 来包裹 ListItem 和 Divider，并提供唯一的 key
          <React.Fragment key={blog.id}>
            {/* 8. ListItem 作为每个博客条目的容器 */}
            <ListItem disablePadding>
              {/* 如果 ListItemButton 占据全部空间，可使用 disablePadding */}
              {/* 9. ListItemButton 使条目可点击，并与 React Router Link 集成 */}
              <ListItemButton component={RouterLink} to={`/blogs/${blog.id}`}>
                {/* 10. ListItemText 用于显示博客信息 */}
                <ListItemText
                  primary={blog.title} // 主要文本：博客标题
                  secondary={`author: ${blog.author} | likes: ${blog.likes}`} // 次要文本：作者和点赞数
                  primaryTypographyProps={{ fontWeight: 'medium' }} // 给标题加粗一点
                />
              </ListItemButton>
            </ListItem>
            {/* 11. 可选：在列表项之间添加分隔线 (除了最后一项) */}
            {index < sortedBlogs.length - 1 && <Divider component="li" variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
};

export default BlogList;
