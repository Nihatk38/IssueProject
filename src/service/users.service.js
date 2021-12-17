
import apiService from "./apiService";

const UsersService = {

    getUserList() {
        return apiService.get(`/api/user/get`).then(r => {

            return r.data
        }).catch(e => {
            console.log(e)
        })
    },

    getRole(){
        return apiService.get(`/api/role/get`).then(r =>{
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },




    addUser(user) {
        return apiService.post("/api/user/add", user);
    },
    getUser(Id){
      return apiService.get(`/api/User/GetByUserId/${Id}`)
    },

    updateUser(model) {
        return apiService.put(`/api/user/update/`, model);
    },

    deleteUser(userId) {
        return apiService.delete("/api/user/Delete/" + userId);
    },

    getDepartmentList() {
        return  apiService.get(`/api/department/get`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getDepartment(){
        return apiService.get(`/api/department/get`).then(r =>{
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    deleteDepartment(departmentId) {
        return apiService.delete("/api/department/DeleteDepartment/" + departmentId);
    } ,
    addDepartment(department) {
        return apiService.post("/api/department/add", department);
    },
};
export default UsersService;
