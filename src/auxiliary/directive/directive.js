import Tooltip from "primevue/tooltip";
import Ripple from "primevue/ripple";
import CodeHighlight from "../../view/config/AppCodeHighlight";
import BadgeDirective from "primevue/badgedirective";
import StyleClass from "primevue/styleclass";

export const directive = (app) => {
    app.directive('tooltip', Tooltip);
    app.directive('ripple', Ripple);
    app.directive('code', CodeHighlight);
    app.directive('badge', BadgeDirective);
    app.directive('styleclass', StyleClass);
}