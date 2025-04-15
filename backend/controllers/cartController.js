import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


const createCartItem = (product, quantity, productId) => {
  console.log("Product:", product);
  return {
    product: productId,
    quantity: parseInt(quantity) || 1,
    price: typeof product.price === "number" ? product.price : 0,
    name:
      typeof product.name === "string" && product.name
        ? product.name
        : "Unknown Product",
    image: product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || "https://via.placeholder.com/150"),
    unit:
      typeof product.unit === "string" && product.unit ? product.unit : "piece",
  };
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images countInStock"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log("req.body:", req.body);
    console.log("Adding to cart:", { productId, quantity });

    const product = await Product.findById(productId);
    console.log("Product found:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    const stockValue =
      product.stock !== undefined
        ? product.stock
        : product.countInStock !== undefined
        ? product.countInStock
        : 0;

    console.log("Stock value:", stockValue);

    if (stockValue < quantity) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    console.log("Existing cart:", cart ? "Found" : "Not found");

    const cartItem = createCartItem(product, quantity, productId);

    console.log(
      "Cart item to add (with fallbacks):",
      JSON.stringify(cartItem, null, 2)
    );

    if (!cart) {
      console.log("Creating new cart with item");
      try {
        cart = await Cart.create({
          user: req.user._id,
          items: [cartItem],
        });
        console.log("New cart created successfully");
      } catch (error) {
        console.error("Error creating cart:", error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach((key) => {
            console.error(
              `Validation error for ${key}:`,
              error.errors[key].message
            );
          });
        }
        return res.status(500).json({ message: error.message });
      }
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      console.log("Item index in existing cart:", itemIndex);

      if (itemIndex > -1) {
        console.log("Updating existing item quantity");
        cart.items[itemIndex].quantity += parseInt(quantity) || 1;
      } else {
        console.log("Adding new item to existing cart");
        cart.items.push(cartItem);
      }

      try {
        await cart.save();
        console.log("Cart saved successfully");
      } catch (error) {
        console.error("Error saving cart:", error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach((key) => {
            console.error(
              `Validation error for ${key}:`,
              error.errors[key].message
            );
          });
        }
        return res.status(500).json({ message: error.message });
      }
    }

    cart = await cart.populate(
      "items.product",
      "name price images countInStock"
    );
    res.json(cart);
  } catch (error) {
    console.error("Add to cart error:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    console.log("Updating cart item:", { productId, quantity });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Full product object:", JSON.stringify(product, null, 2));

    const stockValue =
      product.stock !== undefined
        ? product.stock
        : product.countInStock !== undefined
        ? product.countInStock
        : 0;

    console.log("Stock value:", stockValue);

    if (stockValue < quantity) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log("Cart found");

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    console.log("Item index in cart:", itemIndex);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        console.log("Removing item from cart");
        cart.items.splice(itemIndex, 1);
      } else {
        console.log("Updating item in cart");
        cart.items[itemIndex] = createCartItem(product, quantity, productId);
      }

      try {
        await cart.save();
        console.log("Cart saved successfully");
      } catch (error) {
        console.error("Error saving cart:", error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach((key) => {
            console.error(
              `Validation error for ${key}:`,
              error.errors[key].message
            );
          });
        }
        return res.status(500).json({ message: error.message });
      }
    }

    const updatedCart = await cart.populate(
      "items.product",
      "name price images countInStock"
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("Update cart item error:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    const updatedCart = await cart.populate(
      "items.product",
      "name price images countInStock"
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
