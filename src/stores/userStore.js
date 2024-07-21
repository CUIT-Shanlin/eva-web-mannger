/*
  存储用户信息的pinia 
*/
import { defineStore } from "pinia";
import { getMyToken } from "@/utils/auth";

export const useUserStore = defineStore(
  'user',
  {
    state :()=>{
      return {
        token: getMyToken(),
        name: '',
        avatar: '',
        id: 0,
    
        // 权限信息
        perms: [],
        menus: []
      }
    }
  }
)
