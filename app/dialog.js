define(function (require) {

    var d = require('crystal-extra/dialog/factory')(require('./loader'), require('crystal-extra/dialog/build-bootstrap3-dialog-element'));

    return {
        setShop: d('Shop.Dialog'),
        setShopSingle: d('Shop.DialogSingle'),
        setCity: d('City.Dialog'),
        setLaunchDate: d('MiniCoupon.Edit.DialogTime'),
        previewMiniCoupon: d('MiniCoupon.Edit.DialogPreview'),
        viewTime: d('List.Launched.DialogTime'),
        detail:{
        	minicoupon: d('MiniCoupon.List.DialogDetail'),
        	cpm: d('Cpm.List.Launch.DialogDetail'),
            button: d('Button.List.Launch.DialogDetail'),
            brand: d('List.Brand.DialogDetail'),
            brandPkg: d('List.BrandPackage.DialogDetail')
        },
        rejectReason: d('List.Launched.DialogRejectReason'),
        cpm: {
            setImage: d('Cpm.Edit.DialogImage'),
            setComment: d('Cpm.Edit.DialogComment'),
            setPromotion: d('Cpm.Edit.DialogPromotion'),
        },
        list: {
            modifyDailyAmount: d('List.Plan.DialogDailyamount'),
            log: d('List.DialogLog'),
            planLog: d('List.Plan.DialogLog')
        }
    }
})