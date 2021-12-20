import client from "@/axios";

const UsersService = {

    getUserList() {
        return client().get(`/api/user/get`).then(r => {

            return r.data
        }).catch(e => {
            console.log(e)
        })
    },

    getRole() {
        return client().get(`/api/role/get`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },


    addUser(user) {
        return client().post("/api/user/add", user);
    },
    getUser(Id) {
        return client().get(`/api/User/GetByUserId/${Id}`)
    },

    updateUser(model) {
        return client().put(`/api/user/update/`, model);
    },

    deleteUser(userId) {
        return client().delete("/api/user/Delete/" + userId);
    },

    getDepartmentList() {
        return client().get(`/api/department/get`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getDepartment() {
        return client().get(`/api/department/get`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    deleteDepartment(departmentId) {
        return client().delete("/api/department/DeleteDepartment/" + departmentId);
    },
    addDepartment(department) {
        return client().post("/api/department/add", department);
    },
};

export default UsersService;
