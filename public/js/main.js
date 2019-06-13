function app(){
    this.appUrl = $('body').data('app-url') + '/';
    this.googleGeoCodeKey = 'AIzaSyDdiPFP5XaE1NiYmw8aHfkC9jdCu4DEj-U';
    this.zipAddress = {};
    this.countryStates = {};
    this.validate();
    this.notify = false;
    this.tempValue1 = '';
    this.tempValue2 = '';
}

app.prototype.showLoader = function(){
    app.load = 5;
    app.timer = 100;
    $('.v-loader').show();
    app.loaderInterval = setInterval(app.progressLoader,app.timer);
}

app.prototype.resetLoader = function(){
    app.load = 5;
    app.timer = 100;
}

app.prototype.closeLoader = function(){
    clearInterval(app.loaderInterval);
    app.resetLoader();
    $('.v-loader').css('width','100%');
    $('.v-loader').css('background-color','#91ea88')

    setTimeout(function(){
        $('.v-loader').css('background-color','#91ea88').hide().css('width','0%').css('background-color','#f59522');
    },3000);
}

app.prototype.progressLoader = function(){
    $('.v-loader').css('width',app.load + '%');

    app.load = app.load + 5;
    if(app.load > 90)
        app.timer = 300;
    else if(app.load > 50)
        app.timer = 500;
    else if(app.load > 25)
        app.timer = 1000;
}

app.prototype.setDecimalNot = function(){
    $('body').find(".decimal_not").inputmask('Regex', { regex: "^([1-9][0-9]*)$" });
}

app.prototype.notifyAmountInString = function(stringAmount){
    app.amount = parseFloat(stringAmount.stripSymbols());
    if(isNaN(app.amount)) return;
    
    app.newAmount = Math.abs(Number(app.amount)) >= 1.0e+12
        ? parseFloat(Math.abs(Number(app.amount)) / 1.0e+12).toFixed(2) + "T"
        :Math.abs(Number(app.amount)) >= 1.0e+9
        ? parseFloat(Math.abs(Number(app.amount)) / 1.0e+9).toFixed(2) + "B"
        : Math.abs(Number(app.amount)) >= 1.0e+6
        ? parseFloat(Math.abs(Number(app.amount)) / 1.0e+6).toFixed(2) + "M"
        : Math.abs(Number(app.amount)) >= 1.0e+3
        ? parseFloat(Math.abs(Number(app.amount)) / 1.0e+3).toFixed(2) + "K"
        : parseFloat(Math.abs(Number(app.amount))).toFixed(2);

    if(app.newAmount == 0.00) return;
    app.shortInfo('$'+app.newAmount.replace('.00',''));
}

app.prototype.marginsNpadding = function(){
    app.styleFactory = {
        'first' : {
            'm' : 'margin',
            'p' : 'padding'
        },
        'last' : {
            'b' : 'bottom',
            't' : 'top',
            'r' : 'right',
            'l' : 'left'
        }
    };

    $('.js-style').each(function(i,el){

        app.sections = $(el).data('style').split('|');

        $.each(app.sections,function(k,cname){
            app.class = cname.split('-');
            app.style = app.styleFactory.first[ app.class[0] ] + '-' +  app.styleFactory.last[ app.class[1] ];
            $(el).css(app.style,app.class[2]);    
        });        
        
    });
}

app.prototype.resetAppUrl = function(){
    app.appUrl = $('body').data('app-url') + '/';
}

/*number formatting*/
Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

Number.prototype.pad = function(n) {
    return ('0'+this).slice(-2);
}

String.prototype.humanDate = function(c,d,t){
    if(this == null || this == '') return;
    var date = new Date(this);
    return ('0'+(date.getMonth() + 1)).slice(-2) + '/' + ('0'+date.getDate()).slice(-2) + '/' + date.getFullYear();
}

String.prototype.humanDateTime = function(c,d,t){
    if(this == null || this == '') return;
    var date = new Date(this);
    var amOrPm = (date.getHours() < 12) ? "AM" : "PM";
    var hour = (date.getHours() < 12) ? date.getHours() : date.getHours() - 12;           
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + hour.pad() + ':' + date.getMinutes().pad() + ' ' + amOrPm;
}

String.prototype.forDropDown = function(c,d,t){
    return this.replace(',','').replace('$','').replace('.00','');
}

String.prototype.firstLettersCap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

app.prototype.showNotify = function(){
    $('body').on('click','.show-notify',function(e){
        app.info($(this).attr('title'));
    });
}

 String.prototype.stripSymbols = function(c,d,t){
    return this.replace('0$','').replace('$','').replace(/%/g,'').replace(/,/g,'').replace('x','');
 }

 String.prototype.makeNumber = function(){
    return parseFloat(this).toFixed(2);
 }

 String.prototype.upperCase = function(){
    return this.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
 }

/*app.prototype.tableHoverColor = function(){
    $('.table').find('td').hover(function(e){
        $(this).closest('tr').css('background-color','#e4e9dd');
    },function(e){
        $(this).closest('tr').css('background-color','#f9f9f9');
    });
}*/

app.prototype.validate = function(){
    var English = {
        badAlphaNumeric: 'This field is not valid ',
        badAlphaNumericExtra: ' ',
        andSpaces: '  ',
        badInt: 'This field is not valid ',
        requiredField: 'This field is required.',
    };
    $.validate({
            language : English,
            modules : 'location,date,security,file,logic',
            scrollToTopOnError : true,
            onError : function(msg){
                        app.notifyClose();
                        app.error('Please fill all the mandatory fields and submit again')    
                    }
            
    });

    $.formUtils.addValidator({
        name : 'greaterThanZero',
        validatorFunction : function( value ){
            return parseInt(value) > 0;
        }
    });

    $.formUtils.addValidator({
        name : 'validStateCountry',
        validatorFunction : function( state ){
            if( state == 0 ) return false;
            return true;
        }
    });

    $.formUtils.addValidator({
        name : 'greaterThan48',
        validatorFunction : function(value,$element,config,$language,$form){
            return value > 48
        }
    });

    $.formUtils.addValidator({
        name : 'sixMultiple',
        validatorFunction : function(value,$element,config,$language,$form){
            if(value % 6 > 0) return false;
            return true;
        }
    });

    $.formUtils.addValidator({
        name : 'isMultiple100',
        validatorFunction : function(value,$element,config,$language,$form){
            value = value.stripSymbols();
            return (value%1000 == 0) ? true : false
        }
    });
    $.formUtils.addValidator({
      name : 'zipcode',
      validatorFunction : function(value, $el, config, language, $form) {
          value = value.replace('_');
         if(value =='00000' || value =='11111' || value =='22222' || value.length!=5) 
            return false;
      },
      errorMessage : 'You have entered wrong zipcode'
    });
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

app.prototype.select2 = function(){
    $('.select2').select2();
}

app.prototype.setMultiple = function(){
    $('body').on('blur','.multiple',function(e){
         app.value = $(this).val();
         app.value.stripSymbols();
         $(this).val(app.value + 'x');
    });
}

app.prototype.setDoBPicker = function(){
    $(".dob").attr('readonly', true);
    $('.dob').datepicker({  
        todayHighlight: true,
        endDate: '-18y', 
        startDate: '01/01/1950',
        autoclose : true ,
        default : 'MM/DD/YYYY' 
    }).change(function(d){
        if($(d.currentTarget).val() != ''){
            $(d.currentTarget).trigger('blur');
            app.notifySelectedDate( $(d.currentTarget).val() );
        }

    });
    app.datePlaceholder('dob');
}

if ($(".time").length > 0){
    
app.prototype.setTimePicker = function(){
    $('.time').timepicker({  
        minuteStep: 1,
        appendWidgetTo: 'body',
        showSeconds: true,
        showMeridian: false,
        defaultTime: false
    });
}
}


app.prototype.setPastDatePicker = function(){
    $(".past-datepicker").attr('readonly', true);
    $('.past-datepicker').datepicker({ 
        todayHighlight: true,
        autoclose : true ,  
        endDate: '+0d',
        default : 'MM/DD/YYYY' 
    }).change(function(d){
       
        if($(d.currentTarget).val() != ''){
            $(d.currentTarget).trigger('blur');
            app.notifySelectedDate( $(d.currentTarget).val() );
        }
    });
    app.datePlaceholder('past-datepicker');
}

app.prototype.setDatePicker = function(){
    $('.datepicker').datepicker({ 
        todayHighlight: true,
        autoclose : true,
        default : 'MM/DD/YYYY'        
    }).change(function(d){
        $(d.currentTarget).trigger('blur');
        app.notifySelectedDate( $(d.currentTarget).val() );
    });
    app.datePlaceholder('datepicker');
}

app.prototype.notifySelectedDate = function(dateString){
    if(dateString === undefined) return;

    app.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    app.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    app.selectedDate = new Date(dateString);
    app.shortInfo( app.days[ app.selectedDate.getDay() ] + ',' + app.selectedDate.getDate() + ' ' + app.months[ app.selectedDate.getMonth() ]  + ',' + app.selectedDate.getFullYear());
}

app.prototype.linkedDatePicker = function(){

    $('.linkedpicker2').datepicker({ 
        todayHighlight: true,
        autoclose : true,
        default : 'MM/DD/YYYY'
    }).change(function(d){
        $(d.currentTarget).trigger('blur');
        app.notifySelectedDate( $(d.currentTarget).val() );
    });

    $('.linkedpicker1').datepicker({ 
        todayHighlight: true,
        autoclose : true,
        default : 'MM/DD/YYYY'        
    }).change(function(d){
        $(d.currentTarget).trigger('blur');  
        app.notifySelectedDate( $(d.currentTarget).val() ); 

        if( $('.linkedpicker2').val() != ''){
            if( new Date($('.linkedpicker2').val() ) <= new Date( $(d.currentTarget).val() ) ){
                $('.linkedpicker2').val('');
            }
        }    
        $('.linkedpicker2').datepicker('setStartDate', new Date( $(d.currentTarget).val() ).addDays(1) );
    });

    app.datePlaceholder('linkedpicker1');
    app.datePlaceholder('linkedpicker2');
}

app.prototype.setFutureDatePicker = function(){
    $('.future-datepicker').datepicker({ todayHighlight : true, autoclose : true, startDate: '+0d'}).change(function(d){
        $(d.currentTarget).trigger('blur');
    });
    app.datePlaceholder('future-datepicker');
}

app.prototype.setFromOneMonth = function(){
    $('.from-one-month-datepicker').datepicker({ todayHighlight : true, autoclose : true, startDate: '-30d'}).change(function(d){
        $(d.currentTarget).trigger('blur');
    });
    app.datePlaceholder('from-one-month-datepicker');
}

app.prototype.addressFromZipCode = function(el){
    app.zipcode = el.val();
    if(app.zipcode == '') return false;
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', { address:app.zipcode, sensor: true, key: app.googleGeoCodeKey }, function(response){
        app.addressFromZipCode = response;
        app.displayZipAddress(el,response);
    });
}

app.prototype.displayZipAddress = function(el,result){
    //console.log(result)
      $.each(result.address_components, function(i,obj){
        console.log(obj.types)
      });  
}

app.prototype.getStatesForCountry = function(country){
    if(country === undefined) country = 'US';
    $.ajax({
        url : "/fetch-state",
        type : "GET",
        data : { country: country },
        cache: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            app.countryStates = data;
            app.displayCountryStates();
        },
        error:function (err) {
            console.log(err);
        },

    });
};

app.prototype.displayCountryStates = function(){
    if($('.state').length == 0) return false;

    $('.state option').remove();
    $.each( app.countryStates, function( key, value ) {
        $('.state').append('<option value="'+key+'">'+value+'</option>');
    });
}

app.prototype.numberMask = function(){
    $('body').find('.only-number').inputmask({
        alias: 'numeric',
        allowMinus: false,
        digits: 2,
        max:1000000, 
        rightAlign : false,
        groupSeparator: ",",
        autoGroup: true,
    }).attr('placeholder','0');
}

app.prototype.decimalMask = function(){
    $('body').find('.decimal').inputmask('decimal', {
        radixPoint: ".",
        groupSeparator: "",
        digits: 2,
        autoGroup: true,
        prefix: '', 
        rightAlign: false,
        digitsOptional: false,
        oncleared: function () { 
            $(this).val(''); 
        }
    })
}

app.prototype.currencyMask = function(){
    $('body').find('.currency').inputmask('decimal', {
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        prefix: '$', 
        rightAlign: false,
        digitsOptional: false,
        oncleared: function () { 
            $(this).val(''); 
        },
        onComplete: function(){
            var inputValue = $(this).val();
            if(inputValue == '$0') $(this).val('');
        }
    }).attr('placeholder','$0.00');
}

app.prototype.sqftMask = function(){
    $('body').find('.sqft').inputmask('decimal', {
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        prefix: '', 
        rightAlign: false,
        digitsOptional: false,
        oncleared: function () { 
            $(this).val(''); 
        },
        onComplete: function(){
            var inputValue = $(this).val();
            if(inputValue == '$0') $(this).val('');
        }
    }).attr('placeholder','0.00');
}

app.prototype.percentageMask = function(){
    $('body').find('.percentage').inputmask('decimal', {
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        placeholder: "0.00",
        autoGroup: true,
        suffix: '%', 
        rightAlign: false,
        digitsOptional: false,
        showMaskOnHover : true,
        oncleared: function () { 
            $(this).val(''); 
        },
    }).blur(function() {
        var inputValue = $(this).val();
        inputValue = inputValue.replace(/[^0-9.-\s]/gi, '');
        if(inputValue == ''){
            $(this).val('');
        }

        if( !$(this).hasClass('gt-100') ){
            if(inputValue > 100.00) 
                $(this).val('100.00%');
        }
    }).click(function() {
        var inputValue = $(this).val();
        inputValue = inputValue.replace(/[^0-9.-\s]/gi, '');
        if(inputValue == '' ||inputValue == '0.00%'){
            $(this).val('');
        }
    }).attr('placeholder','0.00%');
}

app.prototype.multiplesMask = function(){
    $('body').find('.multiple').inputmask('integer',{
        rightAlign : false,
        suffix : 'x',
        autoGroup : false,
        digits: 2,
        digitsOptional: true,
        radixPoint: ".",
    });
}

app.prototype.routingApi = function(value){
    var url = '/routing-api';
    var data = {'rn':value};
    var msg = "Please wait while loading the Bank name";
    app.wait(msg);
    app.ajaxRequest(url,'get',data,app.routingApiSuccess,app.routingApiFailure,true);
}

app.prototype.routingApiSuccess = function(response)
{
    app.notifyClose();
    $('body').find('.account_bank_name').val(response);
    // $('body').find('.account_bank_name').removeAttr("data-validation");
    app.clearError(".account_bank_name");
}
app.prototype.clearError = function(class_name)
{
    $(class_name).removeClass("error").addClass("valid");
    $(class_name).attr("style","");
    $(class_name).parent().removeClass("has-error").addClass("has-success");
    $(class_name).siblings(".form-error").remove();
}

app.prototype.routingApiFailure = function(error)
{
    console.log(error);
    app.notifyClose();
    $('body').find('.account_bank_name').val('');
    error = $.parseJSON(error.responseText);
    app.error(error.error);
    app.notifyClose();
}

app.prototype.ajaxRequest = function(url,requestType,data,successCallback,failureCallback,processData){

    app.resetAppUrl();
    if(url !== undefined && url.indexOf('http') == -1){
        if(url.substring(0,1) != '/')
            url = app.appUrl + url
        else
             url = app.appUrl + url.substring(1);
    }
         

    app.showLoader(); 

    $.ajax({
        url : url,
        method : requestType,
        data : data,
        headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val()
            },
        processData : (processData !== undefined) ? processData : false,
        contentType: false,
        success : function(response){

            app.closeLoader();
            if(successCallback != null){
                successCallback(response);
            }else{
                app.notifyClose();
                app.success( response.msg );
            }
        },
        error : function(err){

            app.closeLoader();
            if(err != null){
                failureCallback(err);
            }else{
                app.notifyClose();
                app.error( response.responseJSON.msg );
            }
        }

    });
}

app.prototype.confirm = function(title,message,confirmBtn,confirmBtnClass,cancelBtn,cancelBtnClass,successCallback,failureCallback,response)
{
        bootbox.confirm({
        title: (title != null)? title:false,
        message: (message != null)? message:false,
        buttons: {
            cancel: {
                label: (cancelBtn != null)? cancelBtn:'<i class="fa fa-times"></i> Cancel',
                className: (cancelBtnClass != null)? cancelBtnClass:'btn syn-button-cancel',
            },
            confirm: {
                label: (confirmBtn != null)? confirmBtn:'<i class="fa fa-check"></i> Confirm',
                className: (confirmBtnClass != null)? confirmBtnClass:'btn syn-button-primary',
            }
        },
        callback: function (result) {
            if(result)
            {
                if(successCallback != null){
                    successCallback(response);
                }
            }
            else
            {
                if(failureCallback != null){
                    failureCallback();
                }
            }
        }
    });
}

app.prototype.displayRequestErrors = function(requestErrors,status){
    if(status == 422){
        $('.validation-err').remove();
        app.updateToError("Please fill all the mandatory fields and submit again.");
        app.html = '<ul>';
        $.each(requestErrors,function(className,msg){
            if( $('.' + className.split('.').join('_')).length > 0 ){
                $('.' + className.split('.').join('_')).addClass('error');
                $('.' + className.split('.').join('_')).closest('.form-group').removeClass('has-success').append('<p class="help-block form-error">' + msg + '</p>');
                app.html += '<li>' + msg + '</li>';
            }else{
                $('.' + className.split('.').join('-')).closest('.form-group').removeClass('has-success').append('<p class="help-block form-error">' + msg + '</p>');
                app.html += '<li>' + msg + '</li>';
            }

            app.notifyClose();
            app.error(app.html);
        });
    }
    else if(status == 404)
    {
        window.location="/404"
    }
    else
    {
        app.updateToError(" Error Occured");
        
    }
    
}

app.prototype.cleanValidationMessage = function(element){
    element.closest('.form-group').find('.validation-err').remove();
}

app.prototype.pdf = function(){
    if($( ".pdf-div" ).length > 0){
        for(var i=0;i<$( ".pdf-div" ).length;i++){
            PDFObject.embed($('#pdf-url'+i).val() == '' ? 'none' : $('#pdf-url'+i).val() , '#pdf-view'+i);
        }
    }
}

app.prototype.notifyClose = function(){
    try{

        $('body').removeClass('wait-loader');
        $('body').find('.alert-info.animated').remove();

        app.notify.close();
    }catch(err){
        return false;
    }
}

app.prototype.wait = function(msg){

    $('body').addClass('wait-loader');
    msg = ( msg !== undefined ) ? msg : 'Please wait while the process is completing..';

    app.notify = $.notify({
        message: '<i class="fa fa-circle-o-notch fa-spin" style="font-size:18px"></i>&nbsp;' + msg 
    },{
        type: 'info',
        allow_dismiss : false,
        placement : { from : 'top', align : 'center' },
        delay : false
    });
}

app.prototype.success = function(msg){
    if(msg != undefined){
        app.notify = $.notify({
            message: msg ,
            allow_dismiss : true
        },{
            type: 'success',
            placement : { from : 'top', align : 'center' },
            allow_dismiss : true
        });
    }

}

app.prototype.frontEndNotify = function(msg,type){
    app.notify = $.notify({
            message: msg ,
            allow_dismiss : true
        },{
            type: type,
            placement : { from : 'top', align : 'right' },
            allow_dismiss : true
        });
}

app.prototype.warning = function(msg){
    app.notify = $.notify({
        message: msg ,
        allow_dismiss : true
    },{
        type: 'warning',
        placement : { from : 'top', align : 'center' },
        allow_dismiss : true
    });
}

app.prototype.error = function(msg){
    app.notify = $.notify(
    {
        message : msg
    },{
        type : 'danger',
        placement : { from : 'top', align : 'center' },
        allow_dismiss : true
    }
    );
}

app.prototype.shortInfo = function(msg,timer){
    app.notifyClose();
    app.notify = $.notify({
        message : msg
    },{
        type : 'info',
        placement : { from : 'bottom', align : 'right' },
        delay : (timer === undefined) ? 1000 : timer
    });
}

app.prototype.info = function(msg, options){

    if(options === undefined){
        
        app.notify = $.notify(
            {
                message : msg 
            },{
                type : 'info',
                placement : { from : 'top', align : 'center' },
                delay : false
            }
        );

        return;
    }

    app.notifyLinkMenus(msg,options,function(newMsg){
        app.notify = $.notify(
            {
                message : newMsg 
            },{
                type : 'info',
                placement : { from : 'top', align : 'center' },
                delay : false
            }
        );
    });
    
}

app.prototype.updateToError = function(msg){
    if(app.notify === undefined){
        app.success(msg);
        return;
    }

    app.notifyClose();
    app.error(msg);
}

app.prototype.updateToSuccess = function(msg,options){

    if(app.notify == false){
        app.success(msg);
        return;
    }

    app.notify = app.notify.update({
        type : 'success',
        message :msg,
        delay : false,
        allow_dismiss : true
    });
}

app.prototype.notifyLinkMenus = function(msg, options,callback){
    if(options != false){
        msg = '<p class="msg">' + msg + '</p>';
        msg += '<ul class="message-options">';
        $.each(options,function(option,url){
            msg += '<li><a href="' + app.appUrl + url + '">' + option + '</a></li>';
        });
        msg += '</ul>';
    }

    callback(msg);

}

app.prototype.ssn = function(){
    if($(".ssn").length > 0)
    {
        if($(".ssn").val()!="")
        {
            $(".ssn").get(0).type='password';
        }
    }
    
}

app.prototype.ein = function(){
    if($(".ein").length > 0)
    {
        if($(".ein").val()!="")
        {
            $(".ein").get(0).type='password';
        }
    }
    
}

app.prototype.modal = function(){

    $('.modal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
    });
    $('.modal').on('hidden.bs.modal', function () {
        if($('.modal').hasClass("in")){
            $('body').addClass('modal-open');
        }
    });
}

app.prototype.datePlaceholder = function(className){
    $('.' + className).attr('placeholder','MM/DD/YYYY');
}

app.prototype.amountPlaceHolder = function(){
    $('.currency').attr('placeholder','$0.00');
}

app.prototype.greaterThanError = function(value,compareValue,msg){
    if(value > compareValue)
        app.error(msg);
}

app.prototype.lessThanError = function(value,compareValue,msg){
    if(value < compareValue)
        app.error(msg);
}

app.prototype.makeDisabled = function(){
    $('.make-disabled').prop('disabled',true).val('');
    $('.make-readonly').prop('readonly',true);
}

app.prototype.setPhoneMask = function(){
    $(".phone").inputmask("mask", {
            "mask": "999-999-9999"
    });  
}

app.prototype.setZipCodeMask = function(){
    $("body").find('.zipcode').inputmask("mask", {
        "mask" : "99999"
    });
}

app.prototype.paginate = function(msg,url,requestType,data,successCallback,failureCallback,processData)
{
    msg = ( msg !== undefined ) ? msg : 'Please wait while loading..';
    app.wait(msg);
    app.ajaxRequest(url,requestType,data,successCallback,failureCallback,processData);   
}

app.prototype.pagination = function(parentDiv,msg,requestType,data,successCallback,failureCallback,processData)
{   

    $('body').on('click','.' + parentDiv + ' .page-link',function(e){
        e.preventDefault();
        if($(this).attr('href') != undefined)
        {
           app.notifyClose();
            var url = $(this).attr('href');
            app.paginate(msg,url,requestType,data,successCallback,failureCallback,processData);
        }

    });
}

app.prototype.setAllMasks = function(){
    $("input").attr('autocomplete', 'off');
    app.setDatePicker();
    app.setDoBPicker();
    if ($(".time").length > 0){
    app.setTimePicker();
    }
    app.setPastDatePicker();
    app.setFutureDatePicker();
    app.linkedDatePicker();
    app.setFromOneMonth();
    app.numberMask();
    app.currencyMask();
    app.sqftMask();
    app.decimalMask();
    app.select2();
    app.pdf();
    app.ssn();
    app.ein();
    app.modal();
    app.setPhoneMask();
    app.setZipCodeMask();
    app.setAccountMask();
    app.percentageMask();
    app.multiplesMask();
    app.popOver();
    app.toolTip();
    app.EinSsnMask();
    app.setMultiple();
    app.setDecimalNot();
    app.setDropdownList();
}

app.prototype.setDropdownList = function(container = null) {
    $(container).find(".dropdown-selected").html($(container+" .dropdown-select li.active a").text());
    if($(container+" .dropdown-select").length > 0){
        $('body').on("click",container+" .dropdown-select li a",function(e){
            e.preventDefault();
            $(this).parent().parent().find("li").removeClass("active");
            $(this).parent().addClass("active");
            $(this).closest(".dropdown-select").find(".dropdown-selected").html($(this).text());
            var href = $(this).attr("href");
            $(container).find(".dropdown-content").find(".dropdown-pane").addClass('hide');
            $(container).find(".dropdown-content").find(href).removeClass('hide');
        });
    }
};
app.prototype.setAccountMask = function()
{
    $(".phone").blur(function(e)
    {
        $(this).parent().parent().find('.help-block').remove();
        if(this.value.match(/([0-9])\1{2}/))
        {
            $(this).val('');
            $(this).parent().parent().append('<span class="help-block form-error">Please enter a valid Phone Number</span>');
            $(this).removeClass('valid');
            $(this).addClass('error');
            $(this).attr("style" , "border-color: rgb(185, 74, 72)");
            $(this).parent().removeClass('has-success');
            $(this).parent().addClass('has-error');
        }
    });

    $('.account').on('input',function(e){
        $(this).parent().parent().find('.form-error').remove();
        if(this.value.match(/([0-9])/))
        {
            if($(this).parent().find('.account-number').length == 1)
            {
                app.tempValue1 = this.value
                $(this).closest('row').find('.account-number').val(app.tempValue1);
            }
            else
            {
                app.tempValue2 = this.value
                $(this).closest('row').find('.confirm-account-number').val(app.tempValue2);
            }
            
        }
        else
        {
            $(this).val('');
            $(this).parent().append('<span class="help-block form-error">Please enter a valid Account Number</span>');
            $(this).removeClass('valid');
            $(this).addClass('error');
            $(this).attr("style" , "border-color: rgb(185, 74, 72)");
            $(this).parent().removeClass('has-success');
            $(this).parent().addClass('has-error');
        }
    });

    $('.account-number').focusout(function(e){
        var value = app.tempValue1;
        value = value.replace(/\d(?=\d{4})/g, "*");
        $(this).val(value);

    });

    $('.account-number').focusin(function(e){
        var value = app.tempValue1;
        $(this).val(value);

    });

    $('.confirm-account-number').blur(function(e){
        var value = app.tempValue2;
        value = value.replace(/\d(?=\d{4})/g, "*");
        $(this).val(value);
        $(this).parent().parent().find('.form-error').remove();
        if(app.tempValue2 == app.tempValue1)
        {
            $(this).parent().parent().find('.form-error').remove();
            $(this).removeClass('error');
            $(this).addClass('valid');
            $(this).removeAttr("style");
            $(this).parent().removeClass('has-error');
            $(this).parent().addClass('has-success');
        }
        else
        {
            $(this).val('');
            $(this).parent().append('<span class="help-block form-error">Account Number could not be confirmed</span>');
            app.tempValue2 = '';
            $(this).removeClass('valid');
            $(this).addClass('error');
            $(this).attr("style" , "border-color: rgb(185, 74, 72)");
            $(this).parent().removeClass('has-success');
            $(this).parent().addClass('has-error');
        }

    });

    $('.account-number').blur(function(e){
        var value = app.tempValue1;
        var target = $(this).parent().parent().parent().find('.confirm-account-number');
        
            if(app.tempValue2 == app.tempValue1)
            {

                target.parent().parent().find('.form-error').remove();
                target.removeClass('error');
                target.addClass('valid');
                target.removeAttr("style");
                target.parent().removeClass('has-error');
                target.parent().addClass('has-success');
            }
            else
            {
                target.parent().parent().find('.form-error').remove();
                target.val('');
                target.parent().append('<span class="help-block form-error">Account Number could not be confirmed</span>');
                app.tempValue2 = '';
                target.removeClass('valid');
                target.addClass('error');
                target.attr("style" , "border-color: rgb(185, 74, 72)");
                target.parent().removeClass('has-success');
                target.parent().addClass('has-error');
            }
    });
    
}

app.prototype.popOver = function(){
        $('[data-toggle="popover"]').popover({html:true});
        $('[data-toggle="popover"]').on('click', function(){
            $('[data-toggle="popover"]').not(this).popover('hide');
        });
}

app.prototype.toolTip = function(){
      $('[data-toggle="tooltip"]').tooltip();   
}


app.prototype.setCookie = function(name,value,days){

    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
app.prototype.getCookie = function(name){

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }

    return null;
}

app.prototype.deleteCookie = function(cname) {
    var d = new Date(); 
    d.setTime(d.getTime() - (1000*60*60*24)); 
    var expires = "expires=" + d.toGMTString(); 
    window.document.cookie = cname+"="+"; "+expires;
 
}

app.prototype.toggleMenuBar = function(){
    if( $('body').hasClass('sidebar-collapse') ){
        $('.full-logo').addClass('hide');
        $('.collapsed-logo').removeClass('hide');
        app.setCookie('spmenubar',true,10);
    }else{
        $('.full-logo').removeClass('hide');
        $('.collapsed-logo').addClass('hide');
        app.deleteCookie('spmenubar');
    }
}





app.prototype.keepMenuBarState = function(){
    app.menuBarCookie = app.getCookie('spmenubar');
    if(app.menuBarCookie != null ){
        app.toggleMenuBar();
    }
}

app.prototype.EinSsnMask = function()
{
    $(".ssn").inputmask("mask", {
        "mask":"999-99-9999",
    });

    $(".ein").inputmask("mask", {
        "mask":"99-9999999",
    });
}

app.prototype.showRandomPassword = function(el){
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    
    $('body').find('.pass-text').val(retVal);
    $('body').find('.copy-pass-btn').removeClass('hide');
}

app.prototype.inactiveReset = function(){
    if($(".lgd-in").length == 0) return;
    if(app.inactiveTimer !== undefined)
        clearTimeout(app.inactiveTimer);
    app.inactiveTimer = setTimeout(app.inactiveLogin, 900000);
};


app.prototype.inactiveLogin = function(){
    if($(".lgd-in").length == 0) return;
    $('#inactiveAlertModal').modal('show'); 
    app.inactiveTimer = setTimeout(function(){
        window.location.href = app.appUrl + 'logout';
    },180000);
}

var app = new app();
// app.showLoader();
$(document).ready(function(){

    $('.sidebar-toggle').on('click', function () {
        $('body').toggleClass('sidebar-collapse');
    });
    $('body').find('select').addClass('selectpicker');

    $('.dob,.past-datepicker,.datepicker,.linkedpicker2,.linkedpicker1,.future-datepicker,.from-one-month-datepicker').keyup(function(e){
        $(this).val('');
        app.notifyClose();
        app.info('Please select a date from the datepicker');
        return false;
    });


    $('.zip-code').blur(function(e){
        app.addressFromZipCode( $(this).val() );
    });

    $(".country").change(function(){
        app.getStatesForCountry( $(this).val() );
    });   

    $('input,select').change(function(){
        app.cleanValidationMessage( $(this) );
    });

    $('.select2').change(function(){
        $('.select2 option[value=""]').remove();
    });
    

    
});


