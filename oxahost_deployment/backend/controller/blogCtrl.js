const { User ,  Blog } = require('../models');
;
;
const asyncHandler = require("express-async-handler");
const cloudinaryUploadImg = require("../utils/cloudinary");
const generateSlug = require("../utils/generateSlug");
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
  try {
    // Generate slug from title
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
      
      // Check if slug already exists and make it unique if necessary
      const existingBlog = await Blog.findOne({ where: { slug: req.body.slug } });
      if (existingBlog) {
        const timestamp = Date.now();
        req.body.slug = `${req.body.slug}-${timestamp}`;
      }
    }
    
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    // Generate new slug if title is being updated
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
      
      // Check if slug already exists (excluding current blog)
      const existingBlog = await Blog.findOne({ slug: req.body.slug, id: { $ne: id } });
      if (existingBlog) {
        const timestamp = Date.now();
        req.body.slug = `${req.body.slug}-${timestamp}`;
      }
    }
    
    await Blog.update(req.body, { where: { id: id }, 
      new: true,
     });
    const updateBlog = await Blog.findByPk(id);
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    let getBlog;if (id.match(/^[0-9a-fA-F]{24}$/)) {/* TODO: Remplacer par include dans Sequelize */
        /* TODO: Remplacer par include dans Sequelize */;
      
      if (getBlog) {
        await Blog.update({ $inc: { numViews: 1 } }, { where: { id: 
          id } });
    const updated = await Blog.findByPk(
          id);
    // updated représente l'objet mis à jour;
      }
    } else {
      // It's a slug
      getBlog = await Blog.findOne({ where: { slug: id } })
        /* TODO: Remplacer par include dans Sequelize */
        /* TODO: Remplacer par include dans Sequelize */;
      
      if (getBlog) {
        await Blog.update({ $inc: { numViews: 1 } }, { where: { id: 
          getBlog._id } });
    const updated = await Blog.findByPk(
          getBlog._id);
    // updated représente l'objet mis à jour;
      }
    }
    
    if (!getBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.findAll();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    const deletedBlog = await Blog.destroy({ where: { id: id } });
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;// Find the blog which you want to be liked
  const blog = await Blog.findByPk(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;// Find the blog which you want to be liked
  const blog = await Blog.findByPk(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
};