/*
  存储用户信息的pinia 
*/
import { defineStore } from "pinia";
import { getMyToken } from "@/utils/auth";

// id如果是-1说明没有拿到该用户信息
export const useUserStore = defineStore(
  'user',
  {
    state :()=>{
      return {
        token: getMyToken(),
        info: {
          name: '',
          avatar: '',
          id: -1,
        },
        
    
        // 权限信息
        perms: [],
        menus: [],
        roles: [],
      }
    }
  }
)
