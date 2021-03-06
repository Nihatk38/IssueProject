import Button from "primevue/button";
import RadioButton from "primevue/radiobutton";
import InputSwitch from "primevue/inputswitch";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import AutoComplete from 'primevue/autocomplete';
import CascadeSelect from 'primevue/cascadeselect';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Textarea from 'primevue/textarea';
import SplitButton from 'primevue/splitbutton';
import ColumnGroup from 'primevue/columngroup';
import Image from 'primevue/image';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import {PrimeIcons} from 'primevue/api';
import Toast from 'primevue/toast';
import Password from 'primevue/password';
import ContextMenu from "primevue/contextmenu";
import ConfirmDialog from "primevue/confirmdialog";
import ScrollPanel from "primevue/scrollpanel";
import Steps from 'primevue/steps';
import TabMenu from "primevue/tabmenu";
import TreeTable from "primevue/treetable";
import Card from "primevue/card";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";
import FileUpload from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';

import Tooltip from "primevue/tooltip";
import Ripple from "primevue/ripple";
import BadgeDirective from "primevue/badgedirective";
import StyleClass from "primevue/styleclass";
import MultiSelect from "primevue/multiselect";
import ToastService from 'primevue/toastservice';
import ConfirmationService from "primevue/confirmationservice";
import PrimeVue from 'primevue/config';

export const prime = (app) => {
    app.use(PrimeVue, {
        ripple: true, inputStyle: 'outlined',
        locale: {
            startsWith: '??le ba??layanlar',
            contains: '????erenler',
            notContains: '????ermeyenler',
            endsWith: 'ile Bitenler',
            equals: 'E??it',
            notEquals: 'E??it De??il',
            noFilter: 'Filtre Yok',
            lt: 'K??????k',
            lte: 'K??????k veya e??it',
            gt: 'B??y??k',
            gte: 'B??y??k veya e??it',
            dateIs: 'Tarih E??ittir',
            dateIsNot: 'Tarih E??it De??il',
            dateBefore: 'Daha ??nce',
            dateAfter: 'Daha Sonra',
            clear: 'Temizle',
            apply: 'Uygula',
            matchAll: 'T??m?? E??le??meli',
            matchAny: 'Herhangi Biri E??le??meli',
            addRule: 'Yeni Kural Ekle',
            removeRule: 'Kural Sil',
            accept: 'Evet',
            reject: 'Hay??r',
            choose: 'Dosya Se??',
            upload: 'Y??kle',
            cancel: '??ptal',
            dayNames: ["Pazar", "Pazartesi", "Sal??", "??ar??amba", "Per??embe", "Cuma", "Cumartesi"],
            dayNamesShort: ["Paz", "Pzt", "Sal", "??ar", "Per", "Cum", "Cmt"],
            dayNamesMin: ["Pa", "Pz", "Sa", "??a", "Pe", "Cu", "Cm"],
            monthNames: ["Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"],
            monthNamesShort: ["Oca", "??ub", "Mar", "Nis", "May", "Haz", "Tem", "A??u", "Eyl", "Eki", "Kas", "Ara"],
            today: 'Bug??n',
            weekHeader: 'Wk',
            firstDayOfWeek: 0,
            dateFormat: 'dd.mm.yy',
            weak: 'Zay??f',
            medium: 'Orta',
            strong: 'G????l??',
            passwordPrompt: '??ifre Giriniz',
            emptyFilterMessage: 'Sonu?? bulunamad??',
            emptyMessage: 'Kay??t bulunamad??'
        }
    });
    app.use(ToastService)
    app.use(ConfirmationService)

    app.component('MultiSelect',MultiSelect);

    app.component('Fieldset', Fieldset);
    app.component('MultiSelect', MultiSelect);
    app.component('Button', Button);
    app.component('InputText', InputText);
    app.component('TabView', TabView);
    app.component('TabPanel', TabPanel);
    app.component('RadioButton', RadioButton);
    app.component('InputSwitch', InputSwitch);
    app.component('Dialog', Dialog);
    app.component('Calendar', Calendar);
    app.component('AutoComplete', AutoComplete);
    app.component('CascadeSelect', CascadeSelect);
    app.component('Dropdown', Dropdown);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('Textarea', Textarea);
    app.component('SplitButton', SplitButton);
    app.component('ColumnGroup', ColumnGroup);
    app.component('Image', Image);
    app.component('InputNumber', InputNumber);
    app.component('InputMask', InputMask);
    app.component('PrimeIcons', PrimeIcons);
    app.component('Toast', Toast);
    app.component('Password', Password);
    app.component('ContextMenu', ContextMenu);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('ScrollPanel', ScrollPanel);
    app.component('Steps', Steps);
    app.component('TabMenu', TabMenu);
    app.component('TreeTable', TreeTable);
    app.component('Card', Card);
    app.component('Accordion', Accordion);
    app.component('AccordionTab', AccordionTab);
    app.component('Checkbox', Checkbox);
    app.component('FileUpload', FileUpload);

    app.directive('tooltip', Tooltip);
    app.directive('ripple', Ripple);
    app.directive('badge', BadgeDirective);
    app.directive('styleclass', StyleClass);


}