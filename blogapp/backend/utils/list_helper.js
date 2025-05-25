const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  const reducer = (mostLikes, item) => {
    return item.likes > mostLikes.likes
      ? item
      : mostLikes;
  };

  const result = blogs.reduce(reducer, blogs[0]);
  return {
    title: result.title,
    author: result.author,
    likes: result.likes
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  const authors = unique(blogs).map(
    value => {
      return { 'author': value.author, 'blogs': 0 };
    }
  );

  authors.forEach(value => {
    for (let item of blogs) {
      if (value.author === item.author) {
        value.blogs += 1;
      }
    }
  });

  const reducer = (mostBlogs, item) => {
    return item.blogs > mostBlogs.blogs
      ? item
      : mostBlogs;
  };

  return authors.reduce(reducer, authors[0]);
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  const authors = unique(blogs).map(
    value => {
      return { 'author': value.author, 'likes': 0 };
    }
  );

  authors.forEach(value => {
    for (let item of blogs) {
      if (value.author === item.author) {
        value.likes += item.likes;
      }
    }
  });

  const reducer = (mostLikes, item) => {
    return item.likes > mostLikes.likes
      ? item
      : mostLikes;
  };

  return authors.reduce(reducer, authors[0]);
};

function unique(arr) {
  let result = [];
  for (let item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};