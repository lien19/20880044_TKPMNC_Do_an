var path = 'http://127.0.0.1:5001'  //path bên dịch vụ
var path_client = 'http://127.0.0.1:5001'

function ajax_readFile (filePath, targetId){
    return $.ajax({ 
        url     : filePath,   
        cache   : false,   
        success : function(data) { /*alert(data);*/ $(targetId).html(data); }     })  
}
function ajax_read (request){
    return $.ajax({ 
        url     : path+request,   
        cache   : false,   
        success : function(data) { /*alert(data);*/ }  })  //return object
}
function ajax_post (request, data){
    return $.ajax({ 
        url     : path + request, 
        type    : 'POST',  
        data    : data,            //data is an object: {objectData: userdata} (userdata is object variable)
        dataType: 'JSON',          // processData: false,     // contentType: false,     //cache   : false,   
        success : function(result) { /*alert(JSON.stringify(result)); /*$(targetId).html(data); }*/  /*window.location.assign('employee')*/ }
    })
}
function ajax_post (request, data){
    return $.ajax({ 
        url     : path + request, 
        type    : 'POST',  
        data    : data,            //data is an object: {objectData: userdata} (userdata is object variable)
        dataType: 'JSON',          // processData: false,     // contentType: false,     //cache   : false,   
        success : function(result) { /*alert(JSON.stringify(result)); /*$(targetId).html(data); }*/  /*window.location.assign('employee')*/ }
    })
}
function ajax_post_client (request, data){
    return $.ajax({ 
        url     : path_client + request, 
        type    : 'POST',  
        data    : data,            //data is an object: {objectData: userdata} (userdata is object variable)
        dataType: 'JSON',          // processData: false,     // contentType: false,     //cache   : false,   
        success : function(result) { /*alert(JSON.stringify(result)); /*$(targetId).html(data); }*/  /*window.location.assign('employee')*/ }
    })
}
function html_search_employee (objectData){
    KetQua = objectData
    var htmlString = ''
    if(KetQua.length != 0){
        htmlString     += '<table class="table"><thead><tr style="background: lightgray; text-align: center; ">'

        var header = ['Mã số','Họ tên', 'Hình', 'Giới tính', 'CMND', 'Ngày sinh', 'Mức lương', 'Điện thoại', 'Mail', 'Địa chỉ',  'Đơn vị', 'Khả năng ngoại ngữ']
        header.forEach (h => htmlString += `<th>${h}</th>`)
        htmlString     += '</tr></thead><tbody>'

        //KetQua.forEach(kq => { kq['NgayVang'] = []; kq['Danh_sach_Vang'].forEach(nv => { kq['NgayVang'].push(nv['Ngay'], nv['Ly_do']) }); })  //join Ngoại ngữ
        KetQua.forEach(kq => { kq['NgoaiNgu'] = []; kq['Danh_sach_Ngoai_ngu'].forEach(nv => { kq['NgoaiNgu'].push(nv['Ten']) }); })  //join Ngoại ngữ
        
        KetQua.forEach((kq, i) => { htmlString += `<tr><td>${kq['Ma_so']}</td>
                                                    <td>${kq['Ho_ten']}</td>
                                                    <td><img src="http://127.0.0.1:5001/NV_${i+1}.png"  onerror="this.onerror=null; this.src='./NV_1.png'; "></td>
                                                    <td>${kq['Gioi_tinh']}</td>
                                                    <td>${kq['CMND']}</td>
                                                    <td>${kq['Ngay_sinh']}</td>
                                                    <td>${kq['Muc_luong']}</td>
                                                    <td>${kq['Dien_thoai']}</td>
                                                    <td>${kq['Mail']}</td>
                                                    <td>${kq['Dia_chi']}</td>
                                                    <td>${kq['Don_vi']['Ten']}</td>
                                                    <td>${kq['NgoaiNgu'].join(' ,')}</td></tr>` })
        htmlString     += '</tbody> </table>'
    }
    return(htmlString)
}

//-----------------employee--------------------
function html_timkiem_nhanvien (objectData){
    var htmlString = ''
    if(objectData.length != 0){
        objectData.forEach(obj => { htmlString += `<div class="maso_nhanvien" onclick="var maso = $(this).data('id'); NV_click(maso);" 
                        style="border-bottom: 1px solid; padding: 10px;" data-id="${obj['Ma_so']}"> ${obj['Ma_so']} |  ${obj['Ho_ten']} </div>`
        })
    } return htmlString
}
function txtTimKiem_NV_keyEnter(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
    
    ajax_post('/api/NhanVien/TimKiem', {objectData:formData})                              //20880044.js
        .done((data) => {
            var htmlString = html_timkiem_nhanvien(data)
            $('#timkiem_NV').html(htmlString)
        })
}
function NV_click(maso){  
    window.location.href = window.location.href.split('nhanvien')[0] + 'nhanvien?id=' + maso     
}
function formatForm_NV_click(maso){
    ajax_read('/api/Employee')
        .done((obj)=>{ //alert(JSON.stringify(obj))
            ketQua = obj.find(item => item['Ma_so'] == maso) 
            var html_ngoaingu = ''
            if(ketQua){
                //Chèn hình ảnh
                if( ! ketQua['Hinh_chinh_sua'])   $('img').attr('src', path + ketQua['Hinh'])
                else $('img').attr('src', ketQua['Hinh_chinh_sua'])
                //Chèn text
                $('#maso').val(ketQua['Ma_so']); 
                $('#hoten').val(ketQua['Ho_ten'])
                $('#gioitinh').val(ketQua['Gioi_tinh'])
                $('#cmnd').val(ketQua['CMND'])
                $('#ngaysinh').val(ketQua['Ngay_sinh'])
                $('#mucluong').val(ketQua['Muc_luong'])
                $('#dienthoai').val(ketQua['Dien_thoai'])
                $('#mail').val(ketQua['Mail'])
                $('#diachi').val(ketQua['Dia_chi'])
                $('#donvi').val(ketQua['Don_vi']['Ten']) 
                //Danh sách có bao nhiêu ngoại ngữ thì thêm bấy nhiêu tag option
                ketQua['Danh_sach_Ngoai_ngu'].forEach(() => { html_ngoaingu += `<select class="ngoaingu" name="ngoaingu" readonly style="width:70px; margin:5px; border:none; height: 30px; background-color: lightgray; outline-color: lightcoral; pointer-events: none;"> </select>`     })   
                ajax_read('/api/Language').done((o)=>{                   
                    //Thêm giá trị vào các thẻ chứa id
                    $('#khanangngoaingu').html(html_ngoaingu)             
                    $('select[name^="ngoaingu"]').html( '<option disabled></option>' + o.map(item => `<option disabled>${item['Ten']}</option>`)   )
                    $('select[name^="ngoaingu"]').each((i, el)=>{ $(el).val(ketQua['Danh_sach_Ngoai_ngu'][i]['Ten'])     })
                })                 
                //$('.ngoaingu').attr('size', $('#ngoaingu').val().length);               
            }                                
        }) 
}
function btnSua_NV_Click(){
    var maso = window.location.href.split('=')[1]
    if( !maso )   {
        alert('Vui lòng chọn Hồ sơ nhân viên')
        ev.preventDefault()
    }
    $('#form_hosonhanvien input:not(:first)').prop('readonly', false)

    $('#form_hosonhanvien select').css('pointer-events', 'fill')
    $('#form_hosonhanvien select option').prop('disabled', false)

    $('#form_hosonhanvien input:not(:first) , #form_hosonhanvien select').css('background-color', '')
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
    $('#hidden').val('Sua')
}
function btnHuy_NV_Click(ev){   
    var maso = window.location.href.split('=')[1]
    var el  = document.getElementsByClassName('maso_nhanvien')                                          
    var arr = [...el]
    arr.forEach(item => { 
        if( $(item).data('id') == maso )   item.click()                     //form load dữ liệu của Đơn xin nghỉ trước đó đã click chọn  
        else $('#form_hosonhanvien input, #form_hosonhanvien select').val('')   //Nếu không có thì xóa hết dữ liệu đã nhập và khóa form
    })  
    //Hủy sau khi click Sửa or click Tạo mới
    $('#form_hosonhanvien input').prop('readonly', true)

    $('#form_hosonhanvien select').css('pointer-events', 'none')
    $('#form_hosonhanvien select option').prop('disabled', true)

    $('#form_hosonhanvien input , #form_hosonhanvien select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function btnTaoMoi_NV_Click(){
    window.location.href = window.location.href.split('leave')[0] + 'leave/create'
}
function formatForm_btnTaoMoi_NV_Click(){ //đề bài không yêu cầu tạo mới
    $('#form_hosonhanvien input').prop('readonly', false)
    $('#form_hosonhanvien input, #form_hosonhanvien select').val('')
    $('#form_hosonhanvien select').css('pointer-events', 'fill')
    $('#form_hosonhanvien select option').prop('disabled', false)
    $('#form_hosonhanvien input, #form_hosonhanvien select').css('background-color', '')
    
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
}
function btnLuu_NV_Click(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
    
    formData['ngoaingu'] = []
    $('select[name^="ngoaingu"]').each((i, el)=> formData['ngoaingu'].push($(el).val())     )
        
    ajax_post('/api/NhanVien/Sua', {objectData:formData})                                     //20880044.js
        .done((data) => {
            if(data == "ok")  alert('Cập nhật thành công. Đã lưu file JSON')
            else alert("Vui lòng kiểm tra lại.")
        })
    //format
    $('#form_hosonhanvien input').prop('readonly', true)

    $('#form_hosonhanvien select').css('pointer-events', 'none')
    $('#form_hosonhanvien select option').prop('disabled', true)

    $('#form_hosonhanvien input , #form_hosonhanvien select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function nhanvien_Load(){
    return ajax_read('/api/Employee').done((data)=>{ //return object
                var htmlString = html_timkiem_nhanvien(data)
                $('#timkiem_NV').html(htmlString)
                //$('#donvi').attr("size", $('#donvi').val().length);
                //------------chèn Danh sách Đơn vị vào <select>
                ajax_read('/api/Unit').done(obj => { document.getElementById('donvi').innerHTML = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Ten']}</option>`)    })
                    .done(()=>{ 
                        //------------form mới mở ra sẽ luôn hiện nội dung của Đơn xin nghỉ đầu tiên nếu có
                        if(window.location.href.indexOf('nhanvien') != -1) {
                            var maso = window.location.href.split('=')[1]; 
                            if(maso) { formatForm_NV_click(maso)   }         
                        }               
                        //------------format lại form khi Tạo mới Đơn xin nghỉ
                        if(window.location.href.split('/')[4] && window.location.href.split('/')[4].indexOf('create') != -1 ) {
                            formatForm_btnTaoMoi_Click()
                        }
                    })
    })
}




function isEmptyObject(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object;
    // return Object.values(obj).length === 0 && obj.constructor === Object;
    // return Object.entries(obj).length === 0 && obj.constructor === Object;
}


//-----------------leave--------------------
function txtTimKiem_DXN_keyEnter(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
    
    ajax_post('/api/Leave/Search', {objectData:formData})                              //20880044.js
        .done((data) => {
            var htmlString = html_search_leave(data)
            $('#search_leave').html(htmlString)
        })
}
function DXN_click(maso){  
    window.location.href = window.location.href.split('leave')[0] + 'leave?id=' + maso     
}
function formatForm_DXN_click(maso){
    ajax_read('/api/Leave')
        .done((obj)=>{ //alert(JSON.stringify(obj))
            ketQua = obj.find(item => item['Ma_so'] == maso) 
            if(ketQua){
                $('#maso').val(ketQua['Ma_so']); 
                $('#hoten').val(ketQua['Nhan_vien']['Ho_ten'])
                $('#donvi').val(ketQua['Nhan_vien']['Don_vi']['Ten'])
                $('#cmnd').val(ketQua['Nhan_vien']['CMND'])
                $('#ngaybatdau').val(ketQua['Ngay_bat_dau'])
                $('#songay').val(ketQua['So_ngay'])
                $('#lydo').val(ketQua['Ly_do'])
                $('#masoquanlydonvi').val(ketQua.Y_kien_Don_vi.Quan_ly_Don_vi?.Ma_so)
                $('#ngay_donvi').val(ketQua['Y_kien_Don_vi']['Ngay'])
                $('#noidung_donvi').val(ketQua['Y_kien_Don_vi']['Noi_dung'])
                $('#masoquanlychinhanh').val(ketQua.Y_kien_Chi_nhanh.Quan_ly_Chi_nhanh?.Ma_so)
                $('#ngay_chinhanh').val(ketQua['Y_kien_Chi_nhanh']['Ngay'])
                $('#noidung_donvi').val(ketQua['Y_kien_Chi_nhanh']['Noi_dung'])   
            }                                
        }) 
}
function html_search_leave (objectData){
    var htmlString = ''
    if(objectData.length != 0){
        objectData.forEach(obj => {
            htmlString += `<div class="maso_donxinnghi" onclick="var maso = $(this).data('id'); DXN_click(maso)" style="border-bottom: 1px solid; padding: 10px;" data-id="${obj['Ma_so']}"> ${obj['Ma_so']} |  ${obj['Nhan_vien']['Ho_ten']} | `

            if( !isEmptyObject(obj['Y_kien_Chi_nhanh'])  ) 
                htmlString += `<span style="background-color: lightgray; font-size: small;" >Đã phê duyệt </span></div>`
            else if( !isEmptyObject(obj['Y_kien_Don_vi'])  ) 
                htmlString += `<span style="background-color: blue; color: white; font-size: small;" >Đã kiểm tra </span></div>`
            else 
                htmlString += `<span style="background-color: red; color: white; font-size: small;" >Mới tạo</span></div>`
        })
    } return htmlString
}
function btnSua_Click(){
    //if quản lý cho ý kiến rồi thì không đc phép sửa
    //if chưa thì sửa thoải mái
    var maso = window.location.href.split('=')[1]
    if( !maso )   {
        alert('Vui lòng chọn Đơn xin nghỉ')
        ev.preventDefault()
    }
    $('#nhanvien-form_donxinnghi input:not(:first)').prop('readonly', false)
    $('#nhanvien-form_donxinnghi select').css('pointer-events', 'fill')
    $('#nhanvien-form_donxinnghi select option').prop('disabled', false)
    $('#nhanvien-form_donxinnghi input:not(:first) , #nhanvien-form_donxinnghi select').css('background-color', '')
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
    $('#hidden').val('Sua')
    
}
function btnHuy_Click(ev){   
    var maso = window.location.href.split('=')[1]
    var el  = document.getElementsByClassName('maso_donxinnghi')                                          
    var arr = [...el]
    arr.forEach(item => { 
        if( $(item).data('id') == maso )   item.click()                     //form load dữ liệu của Đơn xin nghỉ trước đó đã click chọn  
        else $('#form_donxinnghi input, #form_donxinnghi select').val('')   //Nếu không có thì xóa hết dữ liệu đã nhập và khóa form
    })  
    //Hủy sau khi click Sửa or click Tạo mới
    $('#form_donxinnghi input').prop('readonly', true)
    $('#form_donxinnghi select').css('pointer-events', 'none')
    $('#form_donxinnghi select option').prop('disabled', true)
    $('#form_donxinnghi input , #form_donxinnghi select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function btnTaoMoi_Click(){
    window.location.href = window.location.href.split('leave')[0] + 'leave/create'
}
function formatForm_btnTaoMoi_Click(){
    $('#nhanvien-form_donxinnghi input').prop('readonly', false)
    $('#nhanvien-form_donxinnghi input, #nhanvien-form_donxinnghi select').val('')
    $('#nhanvien-form_donxinnghi select').css('pointer-events', 'fill')
    $('#nhanvien-form_donxinnghi select option').prop('disabled', false)
    $('#nhanvien-form_donxinnghi input, #nhanvien-form_donxinnghi select').css('background-color', '')
    //-------------------Đơn vị--------------
    $('#donvi-form_donxinnghi input').prop('readonly', false)
    $('#donvi-form_donxinnghi input, #donvi-form_donxinnghi select').val('')
    $('#donvi-form_donxinnghi select').css('pointer-events', 'fill')
    $('#donvi-form_donxinnghi select option').prop('disabled', false)
    $('#donvi-form_donxinnghi input, #donvi-form_donxinnghi select').css('background-color', '')
    //-------------------Quản lý--------------
    $('#chinhanh-form_donxinnghi input').prop('readonly', false)
    $('#chinhanh-form_donxinnghi input, #chinhanh-form_donxinnghi select').val('')
    $('#chinhanh-form_donxinnghi select').css('pointer-events', 'fill')
    $('#chinhanh-form_donxinnghi select option').prop('disabled', false)
    $('#chinhanh-form_donxinnghi input, #chinhanh-form_donxinnghi select').css('background-color', '')
    //-------------------Chung--------------
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
}
function btnLuu_Click(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
    if(window.location.href.split('/')[4] && window.location.href.split('/')[4].indexOf('create') != -1) {
        ajax_post('/api/Leave/Create', {objectData:formData})                              //20880044.js
            .done((data) => {
                if(data == "ok")  alert('Tạo mới thành công. Đã lưu file JSON')
                else alert("Vui lòng kiểm tra lại.")
            })
    }
    else{
        ajax_post('/api/Leave/Edit', {objectData:formData})                                     //20880044.js
            .done((data) => {
                if(data == "ok")  alert('Cập nhật thành công. Đã lưu file JSON')
                else alert("Vui lòng kiểm tra lại.")
            })
    }  
    //format
    $('#form_donxinnghi input').prop('readonly', true)
    $('#form_donxinnghi select').css('pointer-events', 'none')
    $('#form_donxinnghi select option').prop('disabled', true)
    $('#form_donxinnghi input , #form_donxinnghi select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function leave_Load(){
    return ajax_read('/api/Leave').done((data)=>{ //return object
                var htmlString = html_search_leave(data)
                $('#search_leave').html(htmlString)
                //------------chèn Danh sách Đơn vị vào <select>
                if(window.location.href.indexOf('leave') != -1) {
                    ajax_read('/api/Employee').done(obj => { document.getElementById('hoten').innerHTML = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Ho_ten']}</option>`)    })
                    ajax_read('/api/Unit').done    (obj => { document.getElementById('masoquanlydonvi').innerHTML = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Quan_ly_Don_vi']['Ma_so']}</option>`)    })
                    ajax_read('/api/Branch').done  (obj => { document.getElementById('masoquanlychinhanh').innerHTML = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Quan_ly_Chi_nhanh']['Ma_so']}</option>`)      })
                        .done(()=>{ 
                            //------------form mới mở ra sẽ luôn hiện nội dung của Đơn xin nghỉ đầu tiên nếu có
                            if(window.location.href.indexOf('leave') != -1) {
                                var maso = window.location.href.split('=')[1];
                                if(maso) { formatForm_DXN_click(maso)   }          
                            }              
                            //------------format lại form khi Tạo mới Đơn xin nghỉ
                            if(window.location.href.split('/')[4] && window.location.href.split('/')[4].indexOf('create') != -1 ) {
                                formatForm_btnTaoMoi_Click()
                            }
                        })
                }                
    })
}
//----------------business_trip---------------------

function html_search_business_trip1 (objectData){
    KetQua = objectData
    var htmlString = ''
    if(KetQua.length != 0){
        htmlString     += '<table class="table"><thead><tr style="background: lightgray; text-align: center; ">'

        var header = ['Mã số','Họ tên', 'Giới tính', 'CMND', 'Ngày sinh', 'Mức lương', 'Điện thoại', 'Mail', 'Địa chỉ',  'Đơn vị']
        header.forEach (h => htmlString += `<th>${h}</th>`)
        htmlString     += '</tr></thead><tbody>'

        //KetQua.forEach(kq => { kq['NgayVang'] = []; kq['Danh_sach_Vang'].forEach(nv => { kq['NgayVang'].push(nv['Ngay'], nv['Ly_do']) }); })  //join Ngoại ngữ
        
        // KetQua.forEach((kq, i) => { htmlString += `<tr><td>${kq['Ma_so']}</td>
        //                                             <td>${kq['Ho_ten']}</td>
        //                                             <td>${kq['Gioi_tinh']}</td>
        //                                             <td>${kq['CMND']}</td>
        //                                             <td>${kq['Ngay_sinh']}</td>
        //                                             <td>${kq['Muc_luong']}</td>
        //                                             <td>${kq['Dien_thoai']}</td>
        //                                             <td>${kq['Mail']}</td>
        //                                             <td>${kq['Dia_chi']}</td>
        //                                             <td>${kq['Don_vi']['Ten']}</td>
        //                                             </tr>` })
        htmlString     += '</tbody> </table>'
    }
    return(htmlString)
}
// objectData.forEach(obj => { htmlString += `<div class="maso_nhanvien" onclick="var maso = $(this).data('id'); NV_click(maso);" 
//                         style="border-bottom: 1px solid; padding: 10px;" data-id="${obj['Ma_so']}"> ${obj['Ma_so']} |  ${obj['Ho_ten']} </div>`
        
function html_search_business_trip (objectData, year){
    var htmlString = ''
    if(objectData.length != 0){
        objectData.forEach(entry => {
            Object.keys(entry).forEach(y => {
                if(y == year){
                    entry[year].forEach(obj => {
                        htmlString += `<div class="maso_phieucongtac" style="border-bottom: 1px solid; padding: 10px;"> ${obj['Ma_so']} |  ${obj['Don_vi']['Ten']} | ${obj['Ngay_bat_dau']} </div>`
                    })
                }
            })
        } )
    }
    return htmlString
}


function html_phieucongtac (objectData){
    var htmlString = ''
    if(objectData.length != 0){
        objectData.forEach(entry => {
            Object.keys(entry).forEach(y => {
                entry[y].forEach(obj => {
                    htmlString += `<div class="maso_phieucongtac" onclick="var maso = $(this).data('id'); PCT_click(maso);" 
                    data-id="${obj['Ma_so']}" style="border-bottom: 1px solid; padding: 10px;"> ${obj['Ma_so']} |  ${obj['Don_vi']['Ten']} | ${obj['Ngay_bat_dau']} </div>`
                })
            })
        } )
    }
    return htmlString
}
function html_timkiem_phieucongtac (objectData){
    var htmlString = ''
    if(objectData.length != 0){
        objectData.forEach(obj => {
            htmlString += `<div class="maso_phieucongtac" onclick="var maso = $(this).data('id'); PCT_click(maso);" 
                data-id="${obj['Ma_so']}" style="border-bottom: 1px solid; padding: 10px;"> ${obj['Ma_so']} |  ${obj['Don_vi']['Ten']} | ${obj['Ngay_bat_dau']} </div>`
        })
    }
    return htmlString
}
function txtTimKiem_PCT_keyEnter(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
    
    ajax_post('/api/CongTac/TimKiem', {objectData:formData})                              //20880044.js
        .done((data) => {
            var htmlString = html_timkiem_phieucongtac(data)
            $('#timkiem_PCT').html(htmlString)
        })
}
function PCT_click(maso){  
    window.location.href = window.location.href.split('congtac')[0] + 'congtac?id=' + maso     
}
function formatForm_PCT_click(maso){
    ajax_read('/api/BusinessTrip')
        .done((o)=>{ 
            var ketQua = {}
            o.forEach(item => {
                Object.keys(item).forEach(y => {
                    item[y].forEach(obj => {
                        if(obj['Ma_so'] == maso) ketQua = obj
                    })
                })                
            }) 
            //alert(JSON.stringify(ketQua))
            var html_nhanvien = ''
            if(ketQua){
                $('#maso').val(ketQua['Ma_so']);                 
                $('#donvi').val(ketQua['Don_vi']['Ten'])
                $('#diadiem').val(ketQua['Dia_diem'])
                $('#ngaybatdau').val(ketQua['Ngay_bat_dau'])
                $('#songay').val(ketQua['So_ngay'])
                $('#ghichu').val(ketQua['Ghi_Chu'])

                //Danh sách có bao nhiêu nhân viên thì thêm bấy nhiêu tag option
                ketQua['Danh_sach_Nhan_vien'].forEach(() => { 
                    html_nhanvien += `
                        <div style="text-align:center; display:flex;">
                            <div style="width:33%;"><select class="nhanvien_maso" name="nhanvien_maso" readonly style="width:95%; margin:5px; border:none; height: 30px; background-color: lightgray; outline-color: lightcoral; pointer-events: none;"></select></div>
                            <div style="width:33%;"><input type="text" class="nhanvien_hoten" name="nhanvien_hoten" readonly style="width:95%; margin:5px; border:none; height: 30px; background-color: lightgray; outline-color: lightcoral; pointer-events: none;"></input></div>
                            <div style="width:33%;"><input type="text" class="nhanvien_cmnd" name="nhanvien_cmnd" readonly style="width:95%; margin:5px; border:none; height: 30px; background-color: lightgray; outline-color: lightcoral; pointer-events: none;"></input></div>
                        </div>`     
                    })   
                ajax_read('/api/Employee').done((o)=>{                   
                    //Thêm giá trị vào các thẻ chứa id
                    $('#dsNhanVien_PCT').html(html_nhanvien)             
                    $('select[name^="nhanvien_maso"]').html( '<option disabled></option>' + o.map(item => `<option disabled>${item['Ma_so']}</option>`)   )
                    $('select[name^="nhanvien_maso"]').each((i, el)=>{ $(el).val(ketQua['Danh_sach_Nhan_vien'][i]['Ma_so'])     })
                    $('input[name^="nhanvien_hoten"]').each((i, el)=>{ $(el).val(ketQua['Danh_sach_Nhan_vien'][i]['Ho_ten'])     })
                    $('input[name^="nhanvien_cmnd"]').each((i, el)=>{ $(el).val(ketQua['Danh_sach_Nhan_vien'][i]['CMND'])     })
                })  
            }                                
        }) 
}

function btnSua_PCT_Click(){
    //if quản lý cho ý kiến rồi thì không đc phép sửa
    //if chưa thì sửa thoải mái
    var maso = window.location.href.split('=')[1]
    if( !maso )   {
        alert('Vui lòng chọn Phiếu công tác')
        ev.preventDefault()
    }
    $('#form_congtac input:not(:first)').prop('readonly', false)
    $('#form_congtac select').css('pointer-events', 'fill')
    $('#form_congtac select option').prop('disabled', false)
    $('#form_congtac input:not(:first) , #form_congtac select').css('background-color', '')
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
    $('#hidden').val('Sua')
    
}
function btnHuy_PCT_Click(ev){   
    var maso = window.location.href.split('=')[1]
    var el  = document.getElementsByClassName('maso_phieucongtac')                                          
    var arr = [...el]
    arr.forEach(item => { 
        if( $(item).data('id') == maso )   item.click()                     //form load dữ liệu của Đơn xin nghỉ trước đó đã click chọn  
        else $('#form_congtac input, #form_congtac select').val('')   //Nếu không có thì xóa hết dữ liệu đã nhập và khóa form
    })  
    //Hủy sau khi click Sửa or click Tạo mới
    $('#form_congtac input').prop('readonly', true)
    $('#form_congtac select').css('pointer-events', 'none')
    $('#form_congtac select option').prop('disabled', true)
    $('#form_congtac input , #form_congtac select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function btnTaoMoi_PCT_Click(){
    window.location.href = window.location.href.split('congtac')[0] + 'congtac/taomoi'
}
function formatForm_btnTaoMoi_PCT_Click(){
    $('#form_congtac input').prop('readonly', false)
    

    $('#form_congtac select').css('pointer-events', 'fill')
    $('#form_congtac select option').prop('disabled', false)
    $('#form_congtac input, #form_congtac select').val('')
    $('#form_congtac input, #form_congtac select').css('background-color', '')
    
    $('#btnSua, #btnTaoMoi').prop('hidden', true)
    $('#btnLuu, #btnHuy').prop('hidden', false)
}
function btnLuu_PCT_Click(ev){
    ev.preventDefault();
    ev.stopPropagation();
    const formData = Object.fromEntries(new FormData(ev.target).entries());  //var a = {emailEmployee: $('#emailEmployee').val(), passEmployee: $('#passEmployee').val()}
        
    formData['dsNhanVien'] = []
    $('select[name^="nhanvien_maso"]').each((i, el)=> formData['dsNhanVien'].push({"nhanvien_maso" :$(el).val()})     )
    formData['dsNhanVien'].forEach((item, i)=>{
        $('select[name^="nhanvien_hoten"]').each((i, el)=> formData['dsNhanVien'][i]["nhanvien_hoten"] = $(el).val()     )
        $('select[name^="nhanvien_cmnd"]').each((i, el)=> formData['dsNhanVien'][i]["nhanvien_cmnd"] = $(el).val()     )
    })
    alert(window.location.href.split('/')[4])
    if(window.location.href.split('/')[4] && window.location.href.split('/')[4].indexOf('taomoi') != -1) {
        ajax_post('/api/CongTac/TaoMoi', {objectData:formData})                              //20880044.js
            .done((data) => {
                if(data == "ok")  alert('Tạo mới thành công. Đã lưu file JSON')
                else alert("Vui lòng kiểm tra lại.")
            })
    }
    else{
        ajax_post('/api/CongTac/Sua', {objectData:formData})                                     //20880044.js
            .done((data) => {
                if(data == "ok")  alert('Cập nhật thành công. Đã lưu file JSON')
                else alert("Vui lòng kiểm tra lại.")
            })
    }  
    //format
    $('#form_congtac input').prop('readonly', true)
    $('#form_congtac select').css('pointer-events', 'none')
    $('#form_congtac select option').prop('disabled', true)
    $('#form_congtac input , #form_congtac select').css('background-color', 'lightgray')
    $('#btnSua, #btnTaoMoi').prop('hidden', false)
    $('#btnLuu, #btnHuy').prop('hidden', true)
    $('#hidden').val('')
}
function congtac_Load(){
    return ajax_read('/api/BusinessTrip').done((data)=>{ //return object
                var htmlString = html_phieucongtac(data)
                $('#timkiem_PCT').html(htmlString)
                //------------chèn Danh sách Đơn vị vào <select>
                if(window.location.href.indexOf('congtac') != -1) {
                    ajax_read('/api/Unit').done(obj => { document.getElementById('donvi').innerHTML = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Ten']}</option>`)    })
                    ajax_read('/api/Employee').done(obj => { 
                        var html_masonhanvien = '<option disabled></option>' + obj.map(item => `<option disabled>${item['Ma_so']}</option>`)
                        $('select[name^="nhanvien_maso"]').each((i, el)=>{ $(el).html(html_masonhanvien)     })
                    })   
                    .done(()=>{
                        //------------form mới mở ra sẽ luôn hiện nội dung của Đơn xin nghỉ đầu tiên nếu có
                        if(window.location.href.indexOf('congtac') != -1) {
                            var maso = window.location.href.split('=')[1]; 
                            if(maso) { formatForm_PCT_click(maso)   }                        
                        }   
                        //------------format lại form khi Tạo mới Đơn xin nghỉ
                        if(window.location.href.split('/')[4] && window.location.href.split('/')[4].indexOf('taomoi') != -1 ) {
                            formatForm_btnTaoMoi_PCT_Click()
                        }   
                    })                
                }
                
                
    })
}








//window.onload = (e) => {alert ('a')}
//window.onbeforeunload = (e) => { return "load"}
// window.addEventListener('popstate', (e) => {            
//     //$('#content').load('employee.html')
// })

//history.pushState({}, '', '/employee')
          
