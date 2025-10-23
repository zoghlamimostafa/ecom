const { User ,  Blog } = require('../models');
const asyncHandler = require("express-async-handler");
const cloudinaryUploadImg = require("../utils/cloudinary");
const generateSlug = require("../utils/generateSlug");
const fs = require("fs");
const path = require("path");

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
  const { id } = req.params;
  
  try {
    console.log("📝 Mise à jour du blog:", id);
    console.log("📊 Données reçues:", req.body);
    
    // Vérifier que le blog existe
    const existingBlog = await Blog.findByPk(id);
    if (!existingBlog) {
      console.log("❌ Blog non trouvé:", id);
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    // Generate new slug if title is being updated
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
      
      // Check if slug already exists (excluding current blog) - Sequelize syntax
      const { Op } = require('sequelize');
      const duplicateSlug = await Blog.findOne({ 
        where: { 
          slug: req.body.slug,
          id: { [Op.ne]: id }
        } 
      });
      
      if (duplicateSlug) {
        const timestamp = Date.now();
        req.body.slug = `${req.body.slug}-${timestamp}`;
        console.log("⚠️ Slug dupliqué, nouveau slug:", req.body.slug);
      }
    }
    
    // Mettre à jour le blog
    await Blog.update(req.body, { 
      where: { id: id }
    });
    
    // Récupérer le blog mis à jour
    const updatedBlog = await Blog.findByPk(id);
    console.log("✅ Blog mis à jour avec succès:", updatedBlog.title);
    
    res.json(updatedBlog);
  } catch (error) {
    console.error("❌ Erreur mise à jour blog:", error);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour du blog",
      error: error.message 
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log("📖 Récupération du blog:", id);
    
    let getBlog;
    
    // Vérifier si c'est un ID numérique ou un slug
    if (/^\d+$/.test(id)) {
      // C'est un ID numérique
      getBlog = await Blog.findByPk(id);
      
      if (getBlog) {
        // Incrémenter le nombre de vues
        await Blog.increment('numViews', { where: { id: id } });
        // Récupérer le blog mis à jour
        getBlog = await Blog.findByPk(id);
      }
    } else {
      // C'est un slug
      getBlog = await Blog.findOne({ where: { slug: id } });
      
      if (getBlog) {
        // Incrémenter le nombre de vues
        await Blog.increment('numViews', { where: { id: getBlog.id } });
        // Récupérer le blog mis à jour
        getBlog = await Blog.findByPk(getBlog.id);
      }
    }
    
    if (!getBlog) {
      console.log("❌ Blog non trouvé:", id);
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    console.log("✅ Blog récupéré:", getBlog.title);
    res.json(getBlog);
  } catch (error) {
    console.error("❌ Erreur récupération blog:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération du blog",
      error: error.message 
    });
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
  const { id } = req.params;
  
  try {
    console.log("🗑️ Suppression du blog:", id);
    
    // Récupérer le blog avant de le supprimer pour accéder aux images
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    // Supprimer les images associées si elles existent
    if (blog.images && Array.isArray(blog.images) && blog.images.length > 0) {
      console.log(`🗑️ Suppression de ${blog.images.length} image(s) associée(s)`);
      
      for (const image of blog.images) {
        try {
          // Si l'image a un public_id, tenter de la supprimer du système de fichiers
          if (image.public_id) {
            const imagePath = path.join(__dirname, '../public/images', `${image.public_id}.jpeg`);
            
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`✅ Image supprimée: ${image.public_id}`);
            }
          }
        } catch (imgError) {
          console.warn(`⚠️ Impossible de supprimer l'image ${image.public_id}:`, imgError.message);
          // Continue même si une image ne peut pas être supprimée
        }
      }
    }
    
    // Supprimer le blog de la base de données
    await Blog.destroy({ where: { id: id } });
    console.log("✅ Blog supprimé avec succès");
    
    res.json({ 
      success: true, 
      message: "Blog supprimé avec succès",
      id: id 
    });
  } catch (error) {
    console.error("❌ Erreur suppression blog:", error);
    throw new Error(error);
  }
});

const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  
  try {
    console.log("👍 Like blog:", blogId, "par user:", req?.user?.id);
    
    // Récupérer le blog
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    const loginUserId = req?.user?.id;
    
    // Pour Sequelize/SQL, les likes et dislikes sont des colonnes JSON ou des tables séparées
    // Si c'est JSON, on manipule le tableau directement
    let likes = blog.likes ? JSON.parse(JSON.stringify(blog.likes)) : [];
    let dislikes = blog.dislikes ? JSON.parse(JSON.stringify(blog.dislikes)) : [];
    
    // Retirer des dislikes si présent
    dislikes = dislikes.filter(id => id !== loginUserId);
    
    // Toggle like
    const alreadyLiked = likes.includes(loginUserId);
    if (alreadyLiked) {
      likes = likes.filter(id => id !== loginUserId);
    } else {
      likes.push(loginUserId);
    }
    
    // Mettre à jour
    await Blog.update({
      likes: likes,
      dislikes: dislikes,
      isLiked: !alreadyLiked,
      isDisliked: false
    }, {
      where: { id: blogId }
    });
    
    const updatedBlog = await Blog.findByPk(blogId);
    console.log("✅ Blog liké/unliké avec succès");
    res.json(updatedBlog);
    
  } catch (error) {
    console.error("❌ Erreur like blog:", error);
    res.status(500).json({ message: "Erreur lors du like", error: error.message });
  }
});

const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  
  try {
    console.log("👎 Dislike blog:", blogId, "par user:", req?.user?.id);
    
    // Récupérer le blog
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    const loginUserId = req?.user?.id;
    
    // Manipulation des tableaux JSON
    let likes = blog.likes ? JSON.parse(JSON.stringify(blog.likes)) : [];
    let dislikes = blog.dislikes ? JSON.parse(JSON.stringify(blog.dislikes)) : [];
    
    // Retirer des likes si présent
    likes = likes.filter(id => id !== loginUserId);
    
    // Toggle dislike
    const alreadyDisliked = dislikes.includes(loginUserId);
    if (alreadyDisliked) {
      dislikes = dislikes.filter(id => id !== loginUserId);
    } else {
      dislikes.push(loginUserId);
    }
    
    // Mettre à jour
    await Blog.update({
      likes: likes,
      dislikes: dislikes,
      isLiked: false,
      isDisliked: !alreadyDisliked
    }, {
      where: { id: blogId }
    });
    
    const updatedBlog = await Blog.findByPk(blogId);
    console.log("✅ Blog disliké/undisliké avec succès");
    res.json(updatedBlog);
    
  } catch (error) {
    console.error("❌ Erreur dislike blog:", error);
    res.status(500).json({ message: "Erreur lors du dislike", error: error.message });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log("📸 Upload images pour blog:", id);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }
    
    // Vérifier que le blog existe
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog non trouvé" });
    }
    
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log("✅ Image uploadée:", newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    
    // Mettre à jour avec Sequelize
    await Blog.update({
      images: urls
    }, {
      where: { id: id }
    });
    
    const updatedBlog = await Blog.findByPk(id);
    console.log("✅ Blog mis à jour avec images");
    res.json(updatedBlog);
    
  } catch (error) {
    console.error("❌ Erreur upload images blog:", error);
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
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