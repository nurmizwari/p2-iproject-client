import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "axios";

export const useInventoriesStore = defineStore({
  id: "inventories",
  state: () => ({
    inventories: [],
    categories: [],
    oneProduct: {},
    // totalPakaian: 0,
    // totalWarehouse: 0,
    // total: 0,
    // product:[],
    filter1: "",
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    url: "http://localhost:3000/",
  }),
  getters: {
    filterCategories(state) {
      // console.log(state, "<< ini state dari getter");
      // console.log(state.filter1, "maasuk state");
      // console.log(this.filter1);
      if (state.filter1) {
        return state.inventories.filter((el) => el.CategoryId == state.filter1);
      } else {
        return state.inventories;
      }
    },
  },
  actions: {
    async getInventories() {
      try {
        this.loading = true; //! sebelum fetch datanya belum masuk
        let { data } = await axios({
          url: "https://laksana-baru.herokuapp.com/inventories",
          url: `${this.url}inventories`,
          method: "get",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
          params: {
            page: this.currentPage,
          },
        });
        this.inventories = data.Inventory;
        this.currentPage = data.currentPage;
        this.totalItems = data.totalItems;
        this.totalPages = data.totalPages - 1;
        this.loading = false; //! ini karenna datanya sudah ada jadi harus di false kan biar hilanngn
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async getCategories() {
      try {
        let { data } = await axios({
          // url: "https://laksana-baru.herokuapp.com/categories",
          url: `${this.url}categories`,
          method: "get",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });
        this.categories = data;
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteProduct(id) {
      try {
        let { data } = await axios({
          // url: `https://laksana-baru.herokuapp.com/inventories/${id}`,
          url: `${this.url}inventories/${id}`,
          method: "delete",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });
        this.router.push("/");
        this.getInventories();
        console.log(data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success Deleted",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getProductbyId(id) {
      try {
        // console.log(id, "<< id get inventories");
        let { data } = await axios({
          // url: `https://laksana-baru.herokuapp.com/inventories/${id}`,
          url: `${this.url}inventories/${id}`,
          method: "get",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });

        this.oneProduct = data;
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async addProduct(name, image, stock, CategoryId) {
      try {
        let { data } = await axios({
          // url: "https://laksana-baru.herokuapp.com/inventories",
          url: `${this.url}inventories`,
          method: "post",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
          data: {
            name: name,
            image: image,
            stock: stock,
            CategoryId: CategoryId,
          },
        });
        // this.categories = data;
        this.router.push("/");
        this.getInventories();
        // console.log(data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success Added",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
      }
    },
    async editProduct(name, image, stock, CategoryId) {
      try {
        let { data } = await axios({
          // url: `https://laksana-baru.herokuapp.com/inventories/${this.oneProduct.id}`,
          url: `${this.url}inventories/${this.oneProduct.id}`,
          method: "put",
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
          data: {
            name: name,
            image: image,
            stock: stock,
            CategoryId: CategoryId,
          },
        });
        // this.categories = data;
        this.router.push("/");
        this.getInventories();
        console.log(data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Success Edited",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
      }
    },
  },
});
