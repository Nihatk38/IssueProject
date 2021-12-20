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
            return "Departman Müdür Onay";
        } else if (status === 5) {
            return "Kilitli";
        } else if (status === 9) {
            return "Reddedildi";
        } else {
            return "Onaylandi"
        }
    }
}