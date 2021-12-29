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
    },
    getRejectReason(issueId)
    {
        return client().get(`/api/Issue/RejectReason/${issueId}`)
    },
    getVersionInfo(Id)
    {
        return client().get(`/api/Issue/VersionInfo/${Id}`)
    },
    getTitleInfo(TitleControl)
    {
        return client().get(`/api/Issue/TitleInfo/${TitleControl}`)
    },
    getTitleInfoByDepartmentId(DepartmentId)
    {
        return client().get(`/api/Issue/TitleInfoByDepartmentId/${DepartmentId}`)
    },
    getSubTitleInfo(titleId)
    {
        return client().get(`/api/Issue/SubTitleInfo/${titleId}`)
    },
    deleteIssue(Id) {
        return client().delete(`/api/Issue/Delete/${Id}`)
    },
    addTitle(title) {
        return client().post(`api/Issue/AddSubtitle`, title)
    },
    updateTitle(title) {
        return client().put(`api/title/UpdateTitle`, title)
    },
    uploadFile(formData){
        return client().post('api/Issue/Upload', formData);
    }
}
export default IssuesService;