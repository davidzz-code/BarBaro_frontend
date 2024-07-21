import { defineStore } from "pinia";
import axiosClient from "@/axios.config";

export const useServiceStore = defineStore({
  id: "service",
  state: () => ({
    services: [],
    isLoading: false,
  }),
  actions: {
    async getServices() {
      this.isLoading = true;
      try {
        const response = await axiosClient.get('api/v1/services');
        this.services = response.data.data;

      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }

    },
    async createService(form) {
      try {
        const response = await axiosClient.post("api/v1/services", form)
        this.services.push(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async updateService(form) {
      try {
        await axiosClient.patch(`api/v1/services/${form.data.id}`, form);
        await this.getServices();  
      } catch (error) {
        console.log(error);
      }
    },
    async destroyService(id) {
      try {
        await axiosClient.delete(`api/v1/services/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
})
