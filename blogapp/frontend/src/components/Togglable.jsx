import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, Paper, Box } from '@mui/material'; // 1. 导入 Material UI 组件
// 2. 可选：为按钮导入图标，以提供更好的视觉反馈
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // 或者 RemoveCircleOutlineIcon

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  // 为了清晰，从 props 中解构，并为 hideButtonLabel 提供默认值
  const { buttonLabel, hideButtonLabel = 'Cancel', children } = props;
  // 注意：我将 props.buttonLabel 视为展开内容前的按钮文字（即 showButtonLabel）

  return (
    // 3. 使用 Box 组件作为根容器，方便应用一些整体边距
    <Box sx={{ my: 2 }}>
      {/* my: 2 表示垂直方向的 margin */}
      {/* 4. 单个 Material UI Button 用于切换显示/隐藏 */}
      <Button
        variant="contained" // 你可以根据 visible 状态改变按钮样式，例如 visible ? "outlined" : "contained"
        color="primary"
        onClick={toggleVisibility}
        startIcon={visible ? <CancelOutlinedIcon /> : <AddCircleOutlineIcon />} // 根据状态显示不同图标
        sx={{ mb: visible ? 2 : 0 }} // 当内容可见时，按钮下方增加一些外边距，为 Paper 留出空间
      >
        {visible ? hideButtonLabel : buttonLabel} {/* 根据状态显示不同文本 */}
      </Button>

      {/* 5. 使用 Collapse 组件实现平滑的展开/收起动画 */}
      <Collapse in={visible} timeout="auto" unmountOnExit>
        {/* 6. 使用 Paper 组件包裹 props.children，提供视觉容器和样式 */}
        <Paper
          elevation={3} // 添加阴影效果
          sx={{
            padding: { xs: 2, sm: 3 }, // 响应式内边距
            // marginTop: 1, // 如果按钮没有设置 mb，可以在这里加一点与按钮的间距
            maxWidth: '700px', // 核心：限制最大宽度，防止表单过宽
            // mx: 'auto', // 可选：如果希望 Paper 在其容器内水平居中（当容器比 maxWidth 宽时）
            // 默认情况下，它会靠左。
          }}
        >
          {children} {/* 这里将是你的 BlogForm 组件 */}
        </Paper>
      </Collapse>
      {/* 原先在展开内容中固定的 "cancel" 按钮被移除了，因为主切换按钮现在也承担了这个功能。
          如果你的 BlogForm 内部确实需要一个独立的取消按钮，它应该在 BlogForm 内部实现，
          并通过调用 ref.current.toggleVisibility() 来关闭 Togglable。 */}
    </Box>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired, // 这是展开前的按钮文字
  hideButtonLabel: PropTypes.string, // 新增：内容展开后，切换按钮上显示的文字
  children: PropTypes.node.isRequired, // 将 PropTypes.element 改为 PropTypes.node 更通用
};

// 为 hideButtonLabel 提供一个默认值
Togglable.defaultProps = {
  hideButtonLabel: 'Cancel', // 你可以设置为“取消”或任何合适的文字
};

Togglable.displayName = 'Togglable';

export default Togglable;
