const Product = require("../models/productModel");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const Order = require("../models/orderModel");
const fs = require("fs"); // Importation de fs pour manipuler les fichiers
const cloudinaryUploadImg = require("../utils/cloudinary"); // Assurez-vous que cette fonction est bien définie

// Création d'un produit
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Fonction d'upload d'images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath); // Utiliser urls et non fs
      fs.unlinkSync(path); // Supprimer le fichier temporaire après l'upload
    }

    res.json(urls); // Renvoie les images uploadées
  } catch (error) {
    throw new Error(error);
  }
});

// Mise à jour d'un produit
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Utilisation correcte de l'ID dans les params
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Suppression d'un produit
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Utilisation correcte de l'ID
  validateMongoDbId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Récupération d'un produit par ID ou slug
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    let findProduct;
    
    // Check if the id is a valid MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      validateMongoDbId(id);
      findProduct = await Product.findById(id).populate("color");
    } else {
      // It's a slug
      findProduct = await Product.findOne({ slug: id }).populate("color");
    }
    
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Récupération de tous les produits
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Tri des produits
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Sélection des champs
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("Cette page n'existe pas");
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// Ajouter un produit à la liste de souhaits
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyAdded) {
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
      res.json(updatedUser);
    } else {
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
      res.json(updatedUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Ajouter une évaluation
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: { star, comment, postedby: _id },
          },
        },
        { new: true }
      );
    }

    const allRatings = await Product.findById(prodId);
    let totalRating = allRatings.ratings.length;
    let ratingSum = allRatings.ratings.reduce((prev, curr) => prev + curr.star, 0);
    let finalRating = Math.round(ratingSum / totalRating);

    await Product.findByIdAndUpdate(
      prodId,
      { totalrating: finalRating },
      { new: true }
    );

    res.json({ finalRating });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages
};
