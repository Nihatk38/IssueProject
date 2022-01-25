export default {
    statusControl: (status) => {
        if (status === 0) {
            return "Beklemede";
        } else if (status === 1) {
            return "Bim Onay Bekleme";
        } else if (status === 2) {
            return "Bim Onay";
        } else if (status === 3) {
            return "Departman Onay";
        } else if (status === 4) {
            return "Onaylandi";
        } else if (status === 5) {
            return "Kilitli";
        } else if (status === 9) {
            return "Reddedildi";
        } else {
            return "Onaylandi"
        }
    },
    statusCheck:(status)=>{
        if (status === 'Processing') {
            return  0;
        } else if (status === 'ITWaiting') {
            return  1;
        } else if (status === 'DepartmentWaiting') {
            return  2;
        } else if (status === 'ManagerWaiting') {
            return  3;
        } else if (status === 'ManagerCommitted') {
            return  4;
        } else if (status === 'Locked') {
            return  5;
        } else if (status === 'Rejected') {
            return  9
        }
    }
}