import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { resetCart } from "../cart/cartSlice";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  message: "",
};

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async ({ adminView = false }, { rejectWithValue }) => {
    try {
      console.log("Making API request to get orders...");
      const url = adminView ? "/orders" : "/orders/myorders";
      console.log("Request URL:", url);

      const response = await api.get(url);
      console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to get orders"
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get order"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/orders", orderData);
      dispatch(resetCart());
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          (typeof error === "string" ? error : "Failed to create order")
      );
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          (typeof error === "string" ? error : "Failed to update payment")
      );
    }
  }
);

export const deliverOrder = createAsyncThunk(
  "orders/deliverOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/deliver`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update delivery status"
      );
    }
  }
);

export const updateOrderDeliveryStatus = createAsyncThunk(
  "orders/updateOrderDeliveryStatus",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/deliver`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update delivery status"
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/admin");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to get all orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderError: (state) => {
      state.error = null;
    },
    resetOrderDetail: (state) => {
      state.order = null;
    },
    resetOrderState: (state) => {
      state.orders = [];
      state.order = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload", action.payload);
        state.orders = action.payload;
        console.log("state.orders", state.orders);
        state.success = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        state.message = "Order created successfully";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        state.message = "Payment successful";
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        state.message = "Order marked as delivered";
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateOrderDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.success = true;
        state.message = "Order marked as delivered";
      })
      .addCase(updateOrderDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.success = true;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetOrderError, resetOrderDetail, resetOrderState } =
  orderSlice.actions;

export default orderSlice.reducer;
