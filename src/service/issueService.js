import client from "@/axios";

const IssuesService = {
    addIssue(issue) {
        return client().post(`api/issue/add`, issue)
    },
    updateIssue(issue) {
        return client().post(`api/issue/update`, issue)
    },
    revisionIssue(issue) {
        return client().post(`api/issue/revision`, issue)
    },

    getIssueListPrivate() {
        return client().get(`/api/issue/privateIssueList`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getRelevantIssues() {
        return client().get(`/api/issue/GetListRelevantIssues`).then(r => {
            return r.data
        }).catch(e => {
            console.log(e)
        })
    },
    getListIssues() {
        return client().get(`/api/issue/PublicIssueList`).then(r => {
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
    GetAllSubtitleInfo()
    {
        return client().get(`/api/Issue/GetAllSubtitleInfo`)
    },
    GetAllTitleInfo()
    {
        return client().get(`/api/Issue/GetAllTitleInfo`)
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
    addSubtitle(title) {
        return client().post(`api/Issue/AddSubtitle`, title)
    },
    addTitle(title) {
        return client().post(`api/Issue/AddTitle`, title)
    },
    updateTitle(title) {
        return client().put(`api/Issue/UpdateTitle`, title)
    },
    updateSubtitle(title) {
        return client().put(`api/Issue/UpdateSubtitle`, title)
    },
    deleteSubtitle(Id){
        return client().delete(`/api/Issue/DeleteSubtitle/${Id}`)
    },
    uploadFile(formData){
        return client().post('api/Issue/Upload', formData);
    },
    deleteFile(FileInfo,Id){
        return client().delete(`/api/Issue/DeleteFile/${FileInfo}/${Id}`)
    }
}
export default IssuesService;