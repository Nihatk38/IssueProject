import apiService from "./apiService";

const IssuesService = {
    addIssue(issue) {
        return apiService.post(`api/issue/add`, issue)
    },

    getIssueListPrivate() {
        return apiService.get(`/api/issue/privateIssueList`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getIssueListPublic() {
        return apiService.get(`/api/issue/ComeToMeIssues`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    IssueConfirm(confirmModel) {
        return apiService.post(`/api/issue/confirm`, confirmModel).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })

    },
    rejectIssue(confirmModel) {
        return apiService.post(`/api/issue/reject`, confirmModel).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getSelectedIssue(Id) {
        return apiService.get(`/api/Issue/IssueInfo/${Id}`)
    },
    getRejectInfo(Id) {
        return apiService.get(`/api/Issue/RejectReason/${Id}`)
    }


}
export default IssuesService;