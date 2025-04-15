import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  products: [],
  product: null,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (
    { keyword = "", pageNumber = 1, category = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (keyword) {
        params.append("keyword", keyword);
      }

      if (pageNumber > 1) {
        params.append("page", pageNumber);
      }

      if (category && category !== "all") {
        params.append("category", category);
      }

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get products"
      );
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to get product"
      );
    }
  }
);

export const createProductReview = createAsyncThunk(
  "products/createProductReview",
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      await api.post(`/products/${productId}/reviews`, review);
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to create review"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete product"
      );
    }
  }
);

export const updateProductReview = createAsyncThunk(
  "products/updateProductReview",
  async ({ productId, reviewId, reviewData }, { rejectWithValue }) => {
    try {
      await api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update review"
      );
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "products/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete review"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductError: (state) => {
      state.error = null;
    },
    resetProductDetail: (state) => {
      state.product = null;
    },
    resetProductState: (state) => {
      state.products = [];
      state.product = null;
      state.page = 1;
      state.pages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, action.payload.product];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload.product;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
        state.product = updatedProduct;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(updateProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductError, resetProductDetail, resetProductState } =
  productSlice.actions;
export default productSlice.reducer;
