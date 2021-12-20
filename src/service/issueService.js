import client from "@/axios";

const IssuesService = {
    addIssue(issue) {
        return client().post(`api/issue/add`, issue)
    },

    getIssueListPrivate() {
        return client().get(`/api/issue/privateIssueList`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getIssueListPublic() {
        return client().get(`/api/issue/ComeToMeIssues`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    IssueConfirm(confirmModel) {
        return client().post(`/api/issue/confirm`, confirmModel).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })

    },
    rejectIssue(confirmModel) {
        return client().post(`/api/issue/reject`, confirmModel).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getSelectedIssue(Id) {
        return client().get(`/api/Issue/IssueInfo/${Id}`)
    },
    getRejectInfo(Id) {
        return client().get(`/api/Issue/RejectReason/${Id}`)
    }


}
export default IssuesService;