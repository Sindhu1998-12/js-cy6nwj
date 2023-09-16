// Import stylesheets
import './style.css';

// Write Javascript code!
[LL_WEBREPORT_EXCLUDEHTML /]

[LL_WEBREPORT_IF "[LL_REPTAG_&WSID /]"=="" /]
    [LL_WEBREPORT_IF "[LL_REPTAG_WIDGETCONTAINERID NODEINFO:SUBTYPE /]"=="848" /]
    	[LL_REPTAG_WIDGETCONTAINERID SETVAR:DOC /]
    [LL_WEBREPORT_ELSE /]
    	[LL_REPTAG_WIDGETCONTAINERID NODEINFO:VOLUMEID SETVAR:DOC /]
    [LL_WEBREPORT_ENDIF /] 
[LL_WEBREPORT_ELSE /]
    [LL_REPTAG_&WSID SETVAR:DOC /]
[LL_WEBREPORT_ENDIF /]

 



   

    $(document).ready(function(){
        if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            window.location.replace('[LL_REPTAG_URLPREFIXFULL /]/app/nodes/[LL_REPTAG_WIDGETCONTAINERID /]');
        } 
    })  

console.log('Measurements tab');
console.log("[LL_REPTAG_!DOC PERMCHECK:SEECONTENTS /]");
[LL_WEBREPORT_IF "[LL_REPTAG_WIDGETCONTAINERID PERMCHECK:SEECONTENTS /]" == "TRUE" /]
    $('#modifyMeasurement').show();
    console.log("Permissions=See contents: Modify button is enabled!");
[LL_WEBREPORT_ELSE /] 
    $('#modifyMeasurement').hide();
    console.log("Permissions<>See contents: Modify button is disabled!");
[LL_WEBREPORT_ENDIF /]

function measureIsEncoded(str) {
    try{
       return typeof str == "string" && decodeURIComponent(str) !== str; 
    } catch (e){
        console.log(e.name);
    }
}

function IDGeneratorMeasurement() {
	 
		 this.length = 8;
		 this.timestamp = +new Date;
		 
		 var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
		 }
		 
		 this.generate = function() {
			 var ts = this.timestamp.toString();
			 var parts = ts.split( "" ).reverse();
			 var id = "";
			 
			 for( var i = 0; i < this.length; ++i ) {
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];	 
			 }
			 
			 return id;
		 }
}

function IDMeasurement(){
	var x = new IDGeneratorMeasurement();
	var y = x.generate();
	return y;
}

var wsid = '[LL_REPTAG_WIDGETCONTAINERID /]';
var tdsBasicTable = "";
var pdsTable = "";
var techDBValuesMeasurement = "";     
var techDBValuesMeasurementCustom = "";
var measurePropUnitTMCSV = "";
var measureStandardCSV = "";
var loadTableMeasurementObject = { action : "" };
var mCopiedRow = '';

function removeDupsPSpec(names) {
    let unique = {};
    names.forEach(function(i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

var countDecimals = function (value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
};

// Function for exporting Measurements
function exportMeasurements(){
    var url = "[LL_REPTAG_URLPREFIXFULL /][LL_REPTAG_$SWR_ExportMeasureData LLURL:OPEN /]";
	var param="&inputLabel1=[LL_REPTAG_!DOC /]";
	
    console.log(url+param);
    document.getElementById('excelExport').src = url+param;
}

/*function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("tbl_posts_techdbMeasurement");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  /*while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    /*for (i = 2; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
     /* x = rows[i].getElementsByTagName("TD")[10];
      y = rows[i + 1].getElementsByTagName("TD")[10];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      /*rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}*/
// Load CS tables to generate the drop-downs
        $.ajax({
            type: "GET",
            url: "[LL_REPTAG_URLPREFIXFULL /]?func=ll&objId=[LL_REPTAG_$LIMS_PUTM /]&objAction=download&viewType=1",
            dataType: "text",
            async: false,
            success: function(data) {
                measurePropUnitTMCSV = data;
            },
            error: function(err) {
                alert("Getting test methods failed!")
            }
        });
        
        $.ajax({
            type: "GET",
            url: "[LL_REPTAG_URLPREFIXFULL /]?func=ll&objId=[LL_REPTAG_$LIMS_std /]&objAction=download&viewType=1",
            dataType: "text",
            async: false,
            success: function(data) {
                measureStandardCSV = data
                //processLIMSstd(data);
            },
            error: function(err) {
                //console.log(err);
            }
        });

    var sapNumber = [];
    

    $('.Scrollable').on('DOMMouseScroll mousewheel', function(ev) {
        var $this = $(this),
            scrollTop = this.scrollTop,
            scrollHeight = this.scrollHeight,
            height = $this.height(),
            delta = (ev.type == 'DOMMouseScroll' ?
                ev.originalEvent.detail * -40 :
                ev.originalEvent.wheelDelta),
            up = delta > 0;

        var prevent = function() {
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
            return false;
        }

        if (!up && -delta > scrollHeight - height - scrollTop) {
            // Scrolling down, but this will take us past the bottom.
            $this.scrollTop(scrollHeight);
            return prevent();
        } else if (up && delta > scrollTop) {
            // Scrolling up, but this will take us past the top.
            $this.scrollTop(0);
            return prevent();
        }
    });

loadTableMeasurementObject = {action : function() {
        
        var wsid = '[LL_REPTAG_WIDGETCONTAINERID /]';
        var urlMeasureData = '[LL_REPTAG_URLPREFIXFULL /]/open/[LL_REPTAG_$swr_getMeasure_table_data /]'
        var paramMeasurement = "?wsid="+ wsid;
        
        $.ajax({
            type: "GET",
            url: urlMeasureData+paramMeasurement,
            dataType: "text",
            success: function(data) {
                //console.log(data);
                techDBValuesMeasureTable = data;
            },
            error: function(err) {
                //console.log(err);
            },
            async: false
        });
        
        console.log(techDBValuesMeasurement);
        techDBValuesMeasureTable = techDBValuesMeasureTable.replace(/\n/g,'');
        techDBValuesMeasureTable = techDBValuesMeasureTable.replace(/null/g,'""');
        
        if(techDBValuesMeasureTable !== ''){
            techDBValuesMeasureTable = $.parseJSON(techDBValuesMeasureTable);    
        }
        
        if(techDBValuesMeasureTable.length > 0){
            for(var i = 0; i<techDBValuesMeasureTable.length; i++){
                
                var uniqueidMeasureTable = techDBValuesMeasureTable[i]["UNIQUEID"];
                var propertyMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["PROPERTY"]);                   // '3' is the attribute id in category
                var unitMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["UNIT"]);
                //var testMethodMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["TESTMETHOD"]);
                var standardMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["STANDARD"]);
                var targetMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["TARGET"]);
                var rangeMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["RANGE"]);
                var measuredValueTable = decodeURIComponent(techDBValuesMeasureTable[i]["MEASUREDVALUE"]);
                var testNumberMeasureTable = techDBValuesMeasureTable[i]["TESTNUMBER"];
                var measurementDateMeasureTable = techDBValuesMeasureTable[i]["MEASUREMENTDATE"];
                var remarkMeasureTable = techDBValuesMeasureTable[i]["REMARK"];
                remarkMeasureTable = measureIsEncoded(remarkMeasureTable) ? decodeURIComponent(remarkMeasureTable) : remarkMeasureTable
                var linkMeasureTable = decodeURIComponent(techDBValuesMeasureTable[i]["LINK"]);
                
            if ((propertyMeasureTable != "?" || unitMeasureTable != "?" || testMethodMeasureTable != "?" || standardMeasureTable != "?" || targetMeasureTable != "?" || rangeMeasureTable != "?" || typeMeasureTable != "?" || testNumberMeasureTable != "?" || measurementDateMeasureTable != "?" || remarkMeasureTable != "?" || linkMeasureTable != "?") && 
                (propertyMeasureTable != "" || unitMeasureTable != "" || testMethodMeasureTable != "" || standardMeasureTable != "" || targetMeasureTable != "" || rangeMeasureTable != "" || typeMeasureTable != "" || testNumberMeasureTable != "" || measurementDateMeasureTable != "" || remarkMeasureTable != "" || linkMeasureTable != "")) {
                   
                    sizeForm = $('#tbl_posts_techdbMeasurementTable >tbody >tr').length + 1
                    $('#tbl_posts_body_techDB_measurement_table tr:last').after('<tr id="customtechdbMeasurementTable-' + sizeForm + '" class="infr-row binf-table-active"><td><input id="measureTable-' + sizeForm + '" value="'+ propertyMeasureTable +'"></td>' +
                   '<td><input list="measureUnit" name="unit" value="' + unitMeasureTable + '"><datalist id="measureUnit"></datalist></td>'+
                   //'<td><input list="measureMethod" name="testMethod" value="' + testMethodMeasureTable + '"><datalist id="measureMethod"></datalist></td>'+
                   '<td><input list="measureStd" name="std" value="' + standardMeasureTable + '"><datalist id="measureStd"></datalist></td>'+
                   '<td><input name="target" class="decimals" value="' + targetMeasureTable + '" /></td>' +
                   '<td><input name="range" class="decimals" value="' + rangeMeasureTable + '" /></td>' +
                   '<td><input id="measuredValue-' + sizeForm + '" name="measuredTable" class="decimals" value="' + measuredValueTable + '" /></td>'+
                   '<td><input name="testRequest" class="" value="' + testNumberMeasureTable + '" ></td>'+
                   '<td><input type="date" style="line-height:unset" name="date" class="" value="' + measurementDateMeasureTable + '" ></td>'+
                   '<td><textarea data-autoresize class="resize" name="remark" rows="1" style="width:100%; height:auto;  overflow: hidden !important">' + remarkMeasureTable + '</textarea></td>' + 
                   //'<td><input name="link" value="' + linkMeasureTable + '">' + 
                   '<td><a class="btn btn-xs delete-record-measurement" data-id-delete=' + sizeForm + '><i class="binf-btn binf-btn-md binf-btn-danger" id="deleteRowMeasurement"  class="customSettings">Delete</i></a></td>' +
                   '<td><a class="btn btn-xs copy-record-measurement" data-id-copy=' + sizeForm + '><i class="binf-btn binf-btn-md binf-btn-primary" id="copyRowMeasurement"  class="customSettings">Copy</i></a></td>' +
                   '<td><input name="uniqueid" value="' + uniqueidMeasureTable + '" type="hidden"></td></tr>');
                }
                
            }
        }
    }
}
    $(document).ready(function() {
        $('#updateMeasurement').hide();
        $('#cancelMeasurement').hide();

        loadTableMeasurementObject.action();
        
        $.each($('textarea[data-autoresize]'), function() {
            var offset = this.offsetHeight - this.clientHeight;
            if(offset == 0){
                offset = 30;
            }
            var resizeTextarea = function(el) {
                $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            if(this.value != ""){
                console.log(this.value);
                resizeTextarea(this);
            }
            $(this).on('keyup input onmousehover change', function() { resizeTextarea(this);  }).removeAttr('data-autoresize');
        });
        
        $("#addRecord_emptyRow").click(function() {
            console.log('Click customDB');
            
            sizeForm = $('#tbl_posts_techdbMeasurementTable >tbody >tr').length + 1
            $('#tbl_posts_body_techDB_measurement_table tr:last').after('<tr id="customtechdbMeasurementTable-' + sizeForm + '" class="infr-row binf-table-active"><td><input list="propUnit" name="propUnit" value=""><datalist id="propUnit"></datalist></td>'+
        

        $('input').attr('autocomplete', 'off');
                // Autoresize text area when adding a new row.
        $.each($('textarea[data-autoresize]'), function() {
            var offset = this.offsetHeight - this.clientHeight;
            if(offset == 0){
                offset = 30;
            }
            var resizeTextarea = function(el) {
                $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            if(this.value != ""){
                console.log(this.value);
                resizeTextarea(this);
            }
            $(this).on('keyup input onmousehover change', function() { resizeTextarea(this);  }).removeAttr('data-autoresize');
        });
        //measurementTargetTab(index);
        setTimeout(function(){processLIMSpropUnitTm(measurePropUnitTMCSV);}, 10);
        processLIMSstd(measureStandardCSV);
    })
        
        $('#parent-techDBMeasurementTable input, #custom-Parent select').not('#measureInput1, #measureInput3, #measureInput0, #measureInput4, #measureInput7, #measureInput8, #measureInput9').prop('disabled', 'true');
        $('#parent-techDBMeasurementTable textarea').prop('disabled', 'true');
        $('.add-record-measure').css("pointer-events",'none');
        $('.add-record-measure').css("display",'none');
        $('.delete-record-measurement').css("pointer-events",'none');
        $('.delete-record-measurement').css("display",'none');
        $('.copy-record-measurement').css("pointer-events",'none');
        $('.copy-record-measurement').css("display",'none');
        $('#addRecord_emptyRow').css("display",'none');
        $('#paste_mRow').hide();
        $('input').attr('autocomplete', 'off');
        
        
        $('input, select').keydown(function(e) {
            if (e.keyCode==9) {
                e.preventDefault();
                //console.log(e.keyCode)
                $(this).next('input, select').focus();
            }
        });
    });
    
// Function to add filter to the table
function measureFunction(index){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("measureInput" + index);
    if(isNaN(input.value)){
        filter = input.value.toUpperCase();
    } else {
        filter = input.value;
    }
    table = document.getElementById("tbl_posts_body_techDB_measurement_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length - 1; i++) {
        if([index] > 1 && [index] < 8){  
            td = tr[i + 1].getElementsByTagName("td")[index - 1];
            if (td) {
                txtValue = td.firstElementChild.value || td.innerText;
                if(isNaN(Date.parse(txtValue))){
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i + 1].style.display = "";
                    } else {
                        tr[i + 1].style.display = "none";
                    }
                } else {
                    let dateObj = new Date(txtValue);
                    var month = dateObj.getMonth() + 1;
                    var day = dateObj.getDate();
                    var year = dateObj.getFullYear();
                    var lineDate = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year;
                    if (lineDate.indexOf(filter) > -1) {
                        tr[i + 1].style.display = "";
                    } else {
                        tr[i + 1].style.display = "none";
                    }
                }
            }
        } else if ([index] <= 1){
            td = tr[i + 1].getElementsByTagName("td")[index];
            if (td) {
                txtValue = td.firstElementChild.value || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i + 1].style.display = "";
                } else {
                    tr[i + 1].style.display = "none";
                }
            }
        } else if ([index] == 8){
            td = tr[i + 1].getElementsByTagName("td")[index - 1];
            if (td) {
                txtValue = td.firstElementChild.value || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i + 1].style.display = "";
                } else {
                    tr[i + 1].style.display = "none";
                }
            }
        } else if ([index] == 9){
            td = tr[i + 1].getElementsByTagName("td")[index - 1];
            if (td) {
                txtValue = td.firstElementChild.value || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i + 1].style.display = "";
                } else {
                    tr[i + 1].style.display = "none";
                }
            }
        }
    }
}

    $(document).delegate('a.delete-record-measurement', 'click', function(e) {
        var confirmation = confirm("Are you sure you want to delete this entry?")
        if(confirmation){
            e.preventDefault();
            var id = $(this).attr('data-id-delete');
            $('#customtechdbMeasurementTable-' + id).remove();
    
            //regnerate index number on table
            $('#tbl_posts_body_techDB_measurement_table tr').each(function(index) {
                //alert(index);
                $(this).find('span.sn').html(index + 1);
            });
        }
    });
    
    $(document).delegate('a.copy-record-measurement', 'click', function(e){
        e.preventDefault();
        $('#paste_mRow').show();
        let copyBttn = parseInt($(this).attr('data-id-copy')) - 1;
        let tableMeasurements = document.getElementById('tbl_posts_body_techDB_measurement_table');
        let row = tableMeasurements.rows[copyBttn];
        for(let j = 0, col; col = row.cells[j]; j++){
            if($(col).find("input").val() != undefined || $(col).find('textarea').val() != undefined){
                switch(j){
                    case 0:
                        var mProperty = $(col).find("input").val().toString();
                        break;
                    case 1:
                        var mUnit = $(col).find("input").val().toString();
                        break;
                    case 2:
                        var mStandard = $(col).find("input").val().toString();
                        break;
                    case 3:
                        var mTarget = $(col).find("input").val().toString();
                        break;
                    case 4:
                        var mRange =  $(col).find("input").val().toString();
                        break;
                    case 5:
                        var mValue = $(col).find("input").val().toString();
                        break;
                    case 6:
                        var mTestNo = $(col).find("input").val().toString();
                        break;
                    case 7:
                        var mDate = $(col).find("input").val()
                        break;
                    case 8:
                        var mRemark = ($(col).find("textarea").val() == undefined) ? '' : $(col).find("textarea").val();
                        break;    
                }
            }
        }
      
    
    $('#paste_mRow').click(function(e){
        e.preventDefault();
        let mFinalRow = '';
        let mSizeForm = $('#tbl_posts_techdbMeasurementTable > tbody > tr').length + 1;
        mFinalRow = mCopiedRow.replace(/mCopyBttn/g, mSizeForm);
        $('#tbl_posts_body_techDB_measurement_table tr:last').after(mFinalRow);
        $('input[id^="measureTable-"]').prop('disabled', true);
        $('input[id^="measureTableType-"]').prop('disabled', true);
        $('#paste_mRow').hide();
        $.each($('textarea[data-autoresize]'), function() {
            var offset = this.offsetHeight - this.clientHeight;
            if(offset == 0){
                offset = 30;
            }
            var resizeTextarea = function(el) {
                $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            if(this.value != ""){
                console.log(this.value);
                resizeTextarea(this);
            }
            $(this).on('keyup input onmousehover change', function() { resizeTextarea(this);  }).removeAttr('data-autoresize');
        });
    })
        
    /*$.each($('textarea[data-autoresize]'), function() {
          var offset = this.offsetHeight - this.clientHeight;
           if(offset == 0){
               offset = 30;
           }
          var resizeTextarea = function(el) {
            $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
          };
          if(this.value != ""){
              console.log(this.value);
              resizeTextarea(this);
          }
          $(this).on('keyup input onmousehover change', function() { resizeTextarea(this);  }).removeAttr('data-autoresize');
    });*/

    
    
    
    $("#modifyMeasurement").click(function() {

        $('#parent-techDBMeasurementTable input:not([id^="measureTable-"],[id^="measureTableType-"]), #parent-techDBMeasurementTable textarea, #parent-techDBMeasurementTable select').prop('disabled', false);
        $('.add-record-measure').css("pointer-events",'auto');
        $('.add-record-measure').css("display",'inline');
        $('.delete-record-measurement').css("pointer-events",'auto');
        $('.delete-record-measurement').css("display",'inline');
        $('.copy-record-measurement').css("pointer-events",'auto');
        $('.copy-record-measurement').css("display",'inline');
        $('#modifyMeasurement').hide();
        $('#exportMeasure').hide();
        $('#updateMeasurement').show();
        $('#cancelMeasurement').show();
        $('#addRecord_emptyRow').css("display",'inline');
        $('input').attr('autocomplete', 'off');
       // measurementTargetTab(index);
        console.log("function called");
        setTimeout(function(){processLIMSpropUnitTm(measurePropUnitTMCSV);}, 10);
        processLIMSstd(measureStandardCSV);
    });
    
    $("#cancelMeasurement").click(function(){
        var rows2 = $("#tbl_posts_techdbMeasurementTable > tbody > tr");
        for(var i=0;i<rows2.length;i++){
            if(i>0){
                $(rows2[i]).remove();
           }
        }
        
        loadTableMeasurementObject.action();
        $('#parent-techDBMeasurementTable input, #parent-techDBMeasurementTable textarea, #parent-techDBMeasurementTable select').prop('disabled', true);
        $('#measureInput1, #measureInput3, #measureInput0, #measureInput4, #measureInput7, #measureInput8, #measureInput9').prop('disabled', false);
        $('.add-record-measure').css("pointer-events",'none');
        $('.add-record-measure').css("display",'none');
        $('.delete-record-measurement').css("pointer-events",'none');
        $('.delete-record-measurement').css("display",'none');
        $('.copy-record-measurement').css("pointer-events",'none');
        $('.copy-record-measurement').css("display",'none');
        $('#modifyMeasurement').show();
        $('#exportMeasure').show();
        $('#updateMeasurement').hide();
        $('#updateDraftProdspec').hide();
        $('#cancelMeasurement').hide();
        $('#addRecord_emptyRow').css("display",'none');
        $('input').attr('autocomplete', 'off');

        
        setTimeout(function(){processLIMSpropUnitTm(measurePropUnitTMCSV);}, 10);
        processLIMSstd(measureStandardCSV);
    })
    

    function processLIMSpropUnitTm(allText) {
        
        var sapNumber = [];
        var sapUnit = [];
        var sapMethod = [];

        // console.log(allText);
        var allTextLines = allText.split("|newline|");
        for (var i = 0; i < allTextLines.length; i++) {
            
            var data = allTextLines[i].split(';');
            
            //var line = data[1] + ' | ' + data[2] + ' | ' + data[3];
            var line = data[1];
            var line2 = data[2];
            var line3 = data[3];
            
            /*currentPlant = currentPlant.replace(/\s/g,'');
            data[0] = data[0].replace(/\s/g,'');
            
            if(data[0].indexOf(currentPlant) != -1 ){
                 //var filteredLine = data[1] + ' | ' + data[2] + ' | ' + data[3];
                 var filteredLine = data[1];
                 var filteredLine2 = data[2];
                 var filteredLine3 = data[3];
                 
                 sapNumberFiltered.push(filteredLine);
                 sapUnitFiltered.push(filteredLine2);
                 sapMethodFiltered.push(filteredLine3);
            }*/
            
            sapNumber.push(line);
            sapUnit.push(line2);
            sapMethod.push(line3);
            sapNumber = removeDupsPSpec(sapNumber);
            sapUnit = removeDupsPSpec(sapUnit);
            sapMethod = removeDupsPSpec(sapMethod);
        }
        
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        
        if(isIE){
            
        }else{
           //sapNumber = [...new Set(sapNumber)];
        }
        //console.log(isIE);
        var str_form = '';
        var str_form2 = '';
        var str_form3 = '';
        
        /*if(flag){
            for (let l = 0; l < sapNumberFiltered.length; l++) {
                str_form += '<option value ="' + sapNumberFiltered[l] + '" />';
            }
            for (let m = 0; m < sapUnitFiltered.length; m++) {
                str_form2 += '<option value ="' + sapUnitFiltered[m] + '" />';
            }
            for (let n = 0; n < sapNumberFiltered.length; n++) {
                str_form3 += '<option value ="' + sapMethodFiltered[n] + '" />';
            }
        }else{*/
            for (let l = 0; l < sapNumber.length; l++) {
                str_form += '<option value ="' + sapNumber[l] + '" />';
            }
            for (let m = 0; m < sapUnit.length; m++) {
                str_form2 += '<option value ="' + sapUnit[m] + '" />';
            }
            for (let n = 0; n < sapMethod.length; n++) {
                str_form3 += '<option value ="' + sapMethod[n] + '" />';
            }
        //}
        
        
        //$('#materialNo').empty();
        var select_form = document.getElementById("propUnit");
        var select_form2 = document.getElementById("measureUnit");
        var select_form3 = document.getElementById("measureMethod");
        if (select_form) {
            // console.log(str);
            select_form.innerHTML = str_form;
            //console.log(select);
        }
        if (select_form2) {
            // console.log(str);
            select_form2.innerHTML = str_form2;
            //console.log(select);
        } 
        if (select_form3) {
            // console.log(str);
            select_form3.innerHTML = str_form3;
            //console.log(select);
        } 
    }
    
        function processLIMSstd(allText) {
        
        // Used for process chemicals
        
        var sapNumber = [];
        
       // console.log(allText);
        var allTextLines = allText.split("|newline|");
        allTextLines.pop();
        for (var i = 0; i < allTextLines.length; i++) {
            var data = allTextLines[i].replace(';', ' | ')
            sapNumber.push(data);
        }
        var str_form = '';
        for (let l = 0; l < sapNumber.length; l++) {
            str_form += '<option value ="' + sapNumber[l] + '" />';

        }
        //$('#materialNo').empty();
        var select_form = document.getElementById("measureStd");
        if (select_form) {
            // console.log(str);
            select_form.innerHTML = str_form;
            //console.log(select);
        } 
    }

//function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };


   /*     $(window).on('beforeunload',function(e){
      
      if($('#saveText').css('display') != 'none'){
         disableF5(e);
          return 'Data is still being saved. Incorrect values might be displayed if you refresh or close the page.';
      }
      if($('#draftText').css('display') != 'none'){
          return 'Data is saved as draft. Please make sure you saved your work!';
      } 
     }); */

    $("#updateMeasurement").click(function() { 
        
        var allErrors = document.getElementsByClassName("redBorderDropPSpec");
        console.log("you are here");
        if(allErrors.length > 0){
            alert("Please correct red-marked fields with values from dropdown!");
            return;
        } {
             var allErrors1 = document.getElementsByClassName("redBorder");
        console.log("you are here");
        if(allErrors1.length > 0){
            alert("Please correct red-marked fields with values from dropdown!");
            return;
        }
        }
        
        //$("#parent-measurement").append('<div id="pspecLoader"><div class="outer-border" style="margin: 30px auto !important;"><div class="loader"></div></div></div>')
        $("#modifyMeasurement").prop('disabled', true);
        $("#saveTextTechDBMeasure").show();
        //$('#modifyMeasurement').css("margin-right","145px");

        var table_techdb_measurement_add = document.getElementById('tbl_posts_techdbMeasurementTable');
        
        var counter = 0;
        
        for (var i = 3, row; row = table_techdb_measurement_add.rows[i]; i++) {
            if($(row.cells[0]).find("input").val().length < 1){
                counter += 1;
            }
        }
        
        if(counter > 0){
            alert("Missing values on first column, please correct before saving.")
        $('#pspecLoader').remove();
        $("#saveTextTechDBMeasure").hide();
        $("#modifyMeasurement").prop('disabled', false);
            return;
        }

        var iMeasure = 0;
        var techDBLineMeasurement = "";
        var techDBTableMeasurement = "";
        var typeMeasure = "Measurement";
        var wsid = '[LL_REPTAG_WIDGETCONTAINERID /]';
        
        // Lines to be inserted in ZPROPERTIESCUSTOM_TECHDB
        
        for (var i = 3, row; row = table_techdb_measurement_add.rows[i]; i++) {
            //console.log(i);
            //iterate through rows
            //rows would be accessed using the "row" variable assigned in the for loop
            for (var j = 0, col; col = row.cells[j]; j++) {
                var uniqueId = IDMeasurement();
                //iterate through columns
                //columns would be accessed using the "col" variable assigned in the for loop
                if ($(col).find("input").val() != undefined || $(col).find("textarea").val() != undefined) {
                    switch (j) {
                        case 0:
                            var propertyMeasure = encodeURIComponent($(col).find("input").val().toString());
                            break;
                        case 1:    
                            var unitMeasure = encodeURIComponent($(col).find("input").val().toString());
                            break;
                        //case 2:    
                        //    var testMethodMeasure = $(col).find("input").val().toString();
                        //    break;
                        case 2:
                            var standardMeasure = $(col).find("input").val().toString();
                            break;
                        case 3:
                            var targetMeasure = encodeURIComponent($(col).find("input").val());
                            break;
                        case 4:
                            var rangeMeasure = encodeURIComponent($(col).find("input").val());
                            break
                        case 5:
                            var valueMeasure = encodeURIComponent($(col).find("input").val());
                            break;
                        case 6:
                            var testNumberMeasure = $(col).find("input").val();
                            break;
                        case 7:
                            var dateMeasure = $(col).find("input").val();
                            break;
                        case 8:
                            var remarkMeasure = encodeURIComponent($(col).find("textarea").val().toString()).replace(/'/g, '%27');
                            break;
                        /*case 8:
                            var linkMeasure = encodeURIComponent($(col).find("input").val());
                            break;*/
                    }
                }
            }
            var linkMeasure = "";
            var testMethodMeasure = "";
            var currentUserMeasure = '[LL_REPTAG_USERNAME /]';
            var currentDateMeasure = new Date();
            currentDateMeasure = currentDateMeasure.toLocaleString();
            techDBLineMeasurement = techDBLineMeasurement + "(" + wsid + "," + uniqueId + ",\'" + propertyMeasure + "\',\'" + unitMeasure + "\',\'" + testMethodMeasure + "\',\'" + standardMeasure + "\',\'" + targetMeasure + "\',\'" + typeMeasure + "\',\'" + testNumberMeasure + "\',\'"+ dateMeasure + "\',\'" + remarkMeasure+ "\',\'" + linkMeasure + "\',\'" + currentDateMeasure + "\',\'" + currentUserMeasure + "\',\'" + rangeMeasure + "\',\'" + valueMeasure + "\'),"
            
        }
        techDBLineMeasurement = techDBLineMeasurement.substring(0, techDBLineMeasurement.length - 1);
        techDBTableMeasurement = techDBLineMeasurement + ";";
        
        techDBTableMeasurement = encodeURIComponent(techDBTableMeasurement);
        techDBTableMeasurement = String(techDBTableMeasurement);
        
        // console.log(prepolyTable)
         var wsid = '[LL_REPTAG_WIDGETCONTAINERID /]';
         
         var urlMeasure = '[LL_REPTAG_URLPREFIXFULL /]/open/[LL_REPTAG_$swr_update_Measurements_Table /]';
         var paramMeasure = '&wsidMeasure=' + wsid + '&measureTable=' + techDBTableMeasurement;
         
        $.ajax({
            url: urlMeasure, 
            dataType: "text",
            type:'POST',
            data:paramMeasure,
            success: function(data){
                $("#modifyMeasurement").prop('disabled', false);
                $("#saveTextTechDBMeasure").hide();
                $('#pspecLoader').remove();
                //$('#modifyMeasurement').css("margin-right","5px");
                reloadOverviewMeasure()
            console.log(data)
           },
            error: function(err){
            console.log(err);
        	        }
        });
		
	    $('#parent-techDBMeasurementTable input, #parent-techDBMeasurementTable select').prop('disabled', true);
	    $('#measureInput1, #measureInput3, #measureInput0, #measureInput4, #measureInput7, #measureInput8, #measureInput9').prop('disabled', false);
        $('#parent-techDBMeasurementTable textarea').prop('disabled', 'true');
        $('.delete-record-measurement').css("pointer-events",'none');
        $('.delete-record-measurement').css("display",'none');
        $('.add-record-measure').css("pointer-events",'none');
        $('.add-record-measure').css("display",'none');
        $('.copy-record-measurement').css("pointer-events",'none');
        $('.copy-record-measurement').css("display",'none');
        $('#modifyMeasurement').show();
        $('#exportMeasure').show();
        $('#updateMeasurement').hide();
        $('#updateDraftProdspec').hide();
        $('#cancelMeasurement').hide();
        $('#addRecord_emptyRow').css("display",'none');
        $('input').attr('autocomplete', 'off');
        $('#paste_mRow').hide();
        $('#pspecLoader').remove();
		
    });
    
    function reloadOverviewMeasure(){
        var url="[LL_REPTAG_URLPREFIXFULL /][LL_REPTAG_$WR_reloadOverview LLURL:REPORT /]";
        var param="&WSID=[LL_REPTAG_WIDGETCONTAINERID /]";
        $.ajax({
    		url: url+param, 
    		type:'GET',
    		complete: function(data){
    		    //location.reload();
    		    console.log(data);
    			var output=data.responseText;
    			document.getElementById('displayOverview').style.visibility="visible";
    			document.getElementById('displayOverview').outerHTML = output;
    		},
    		error: function(e){
    		    console.log(e);
    		}
        });
    }
    
    var inputs = document.querySelectorAll('input[list]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', function(){
                var optionFound = false;
                datalist = this.list;
                if(this.value === ""){
                    optionFound = true;
                } else {
                       for (let j = 0; j < datalist.options.length; j++){
                            if (this.value === datalist.options[j].value){
                                optionFound = true;
                                break;
                            }
                        }
                    }
                if (optionFound){
                    this.classList.remove("redBorderDropPSpec"); //style.borderColor = "";
                } else {
                    this.classList.add("redBorderDropPSpec");
                    //this.style.borderColor = "red"
                    this.dataset.toggle = "tooltip"
                    this.dataset.placement = "top"
                    this.title = "Please select an option from the drop-down, free text is not allowed"
                } 
            }); 
    };
//});
function measurementTargetTab(index) {
    
    var inputs = document.getElementById(`#measureInput${index} input`);
    for (var i = 0; i < inputs.length; i++)
    var inputElement = inputs[i];
     inputElement.addEventListener('change',function() {
          var inputValue = this.value; 
         // console.log("inputValue" : inputValue );
         });   
    }

  // Check if the input length exceeds 20 characters
    if (inputValue.length > 4) {
        this.classList.add("redBorder"); // Apply red border style
        this.dataset.toggle = "tooltip"
        this.dataset.placement = "top"
        this.title = "Please enter the correct data "
    } else {
        this.classList.remove("redBorder"); // Remove red border style
    }
  
}
      </script>



