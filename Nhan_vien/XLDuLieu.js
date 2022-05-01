const controller = {}

//----------Login====================================
controller.loginEmployee = (folder, id, query) => {
    if (query.emailEmployee && query.passEmployee) {
        var data = controller.getAll(folder, id)
        var result = data.find(item => item['Ten_Dang_nhap'] == query.emailEmployee && item['Mat_khau'] == query.passEmployee)
        if (result != undefined) return result
    }
    return null
}
controller.loginUnit = (folder, id, query) => {
    if (query.emailUnit && query.passUnit) {
        var data = controller.getUnit(folder, id)
        var result = data.find(item => item['Quan_ly_Don_vi']['Ten_Dang_nhap'] == query.emailUnit && item['Quan_ly_Don_vi']['Mat_khau'] == query.passUnit)
        if (result != undefined) return result
    }
    return null
}
controller.loginBranch = (folder, id, query) => {
    if (query.emailBranch && query.passBranch) {
        var data = controller.getBranch(folder, id)
        var result = data.find(item => item['Quan_ly_Chi_nhanh']['Ten_Dang_nhap'] == query.emailBranch && item['Quan_ly_Chi_nhanh']['Mat_khau'] == query.passBranch)
        if (result != undefined) return result
    }
    return null
}
controller.isLoggedIn = (req, res, next) => {
    if (req.session.employee || req.session.unit || req.session.branch) { next(); }
    else { res.redirect('/') }
}

controller.getOne = () => { }
controller.update = () => { }
controller.create = () => { }
controller.remove = () => { }



//---------- Hàm dùng chung cho Nhân viên, Đơn vị, Chi nhánh ====================================
controller.write = (folder, id, data) => {
    const fs     = require('fs')
    const path   = require('path')
    var filePath = path.join(folder, `${id}`)
    fs.writeFileSync(filePath, data)
}
controller.getAll = (folder, id) => {
    const fs     = require('fs')
    const path   = require('path')
    var filePath = path.join(folder, `${id}`)
    var data     = fs.readFileSync(filePath, { encoding: 'utf8' })  //return JSON
    return JSON.parse(data)   //convert JSON to OBJECT
}

//Hàm tìm kiếm, return kiểu bool
controller.coKetQuaTimKiem_obj = (item, objectData) => {  //item: object, ketQua: array
    //console.log(JSON.stringify(item))
    for (let prop in item) {
        if (item.hasOwnProperty(prop)) { 
            const curValue = item[prop]; //console.log(curValue)
            if (curValue.toString().toUpperCase().indexOf( objectData['txtTimKiem'].toUpperCase() ) != -1)  {
                //console.log(curValue); console.log(true); 
                return true   
            }           
            if (Array.isArray(curValue) && curValue.length != 0) {                   //Nếu value là mảng
                for (let i in curValue) {
                    var kq = controller.coKetQuaTimKiem_obj(curValue[i], objectData);  //tìm kiếm trong object là phần tử trong mảng
                    if(kq == true) return kq
                }
            }
            if (curValue && typeof curValue === 'object') {  //Nếu value là object
                var kq = controller.coKetQuaTimKiem_obj(curValue, objectData); 
                if(kq == true) return kq          
            }            
        }
    }
    return false
}
//code tham khảo search
// async function convertErpCodes(jsonData, orgName, parentPropertyName) {
//     for (let prop in jsonData) {
//         if (jsonData.hasOwnProperty(prop)) {
//             if (prop === 'erpCode') {
//                 const erpCodeValue = jsonData[prop]
//                 const req = { "query": { "erpCode": erpCodeValue, "orgName": orgName, "typeSysName": parentPropertyName } };
//                 const result = await viewLookupErpService.findOne(req);
//                 if (result)
//                     return result;
//             }
//             const curValue = jsonData[prop];
//             if (Array.isArray(curValue)) {
//                 for (let i in curValue) {
//                     const res = await convertErpCodes(curValue[i], orgName, prop);
//                 }
//             }
//             else if (curValue && typeof curValue === 'object') {
//                 const response = await convertErpCodes(curValue, orgName, prop);
//                 if (response) {
//                     jsonData[prop] = response;
//                 }
//             }
//         }
//     }
// }


//---------- Nhân viên ====================================

// var ds = []
// for (let i = 0; i < 113; i++) {
//     data = employee.getAll('./data/json_employee', `NV_${i+1}`)
//     ds.push(data)
// }   
// var a = JSON.stringify(ds, null, 2)


// var ds = controller.getAll('./Du_lieu/json', 'employee.json')
// ds.forEach(item => {
//     item['Hinh'] = `/${item['Ma_so']}.png`
//     item['Hinh_chinh_sua'] = ''
// })
// var a = JSON.stringify(ds, null, 2)
// controller.write('./Du_lieu/json', 'employee.json', a)


//Ktra hình ảnh
const doesImageExist = (url) =>
  new Promise((resolve) => {
    const img = new Image();

    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
function isValidImageURL(str){
    if ( typeof str !== 'string' ) return false;
    return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
}
/*$.ajax({
    type: "HEAD",
    url : "urlValue",
    success: function(message,text,response){
       if(response.getResponseHeader('Content-Type').indexOf("image")!=-1){
             alert("image");
      }
    } 
  }); */

  function checkUrl(url){
    var arr = [ "jpeg", "jpg", "gif", "png" ];
    var ext = url.substring(url.lastIndexOf(".")+1);
    if($.inArray(ext,arr)){
      alert("valid url");
      return true;
   }
 }

controller.KhoiTao_NhanVien_Json = (item, objectData) => {
    var dsDonVi    = controller.getUnit('./Du_lieu/json', 'company.json')
    var dsNgoaiNgu = controller.getLanguage('./Du_lieu/json', 'company.json')

    item['Ho_ten']     = objectData['hoten']
    item['Ma_so']      = objectData['maso']
    item['CMND']       = objectData['cmnd']
    item['Gioi_tinh']  = objectData['gioitinh']
    item['Dien_thoai'] = objectData['dienthoai']
    item['Dia_chi']    = objectData['diachi']
    item['Mail']       = objectData['mail']
    item['Muc_luong']  = objectData['mucluong']
    item['Ngay_sinh']  = objectData['ngaysinh']
    //if( item['Ngay_sinh'] )  item['Ngay_sinh']  = objectData['ngaysinh']
    if( objectData['hinh'] )  item['Hinh_chinh_sua']  = objectData['hinh']
    //đơn vị
    dsDonVi.forEach(dv => {
        if (dv['Ten'] == objectData['donvi']) {
            item['Don_vi'] = dv['Quan_ly_Don_vi']['Don_vi']
        }
    })
    //ds ngoai ngu
    item['Danh_sach_Ngoai_ngu'] = []; 
    objectData['ngoaingu'].forEach(obj => {
        dsNgoaiNgu.forEach(nn => { if (nn['Ten'] == obj)    item['Danh_sach_Ngoai_ngu'].push(nn)      })
    })
    
    return item
}
controller.getAll_Unit_Employees = (folder_company, id_company, folder_employee, id_employee) => {
    var dataUnit = controller.getUnit(folder_company, id_company)
    var dataEmployee = controller.getAll(folder_employee, id_employee)
    var dataEmployeeInUnit = []
    dataUnit.forEach(unit => {
        unit['Danh_sach_Nhan_vien'] = dataEmployee.filter(employee => { employee['Don_vi']['Ma_so'] == unit['Ma_so'] });
        dataEmployeeInUnit.push(unit)
    });
    return dataEmployeeInUnit
}
controller.getAll_Language_Employees = (folder_company, id_company, folder_employee, id_employee) => {
    var dataLanguage = controller.getLanguage(folder_company, id_company)
    var dataEmployee = controller.getAll(folder_employee, id_employee)
    var dataLanguage_Employee = []
    dataLanguage.forEach(language => {
        language['Danh_sach_Nhan_vien'] = dataEmployee.filter(employee => { employee['Don_vi']['Ma_so'] == language['Ma_so'] });
        dataLanguage_Employee.push(language)
    });
    return dataLanguage_Employee
}

controller.getOneEmployee = () => { }
controller.update = () => { }
controller.create = () => { }
controller.remove = () => { }


//---------- Công ty ====================================
controller.getBranch = (folder, id) => {
    var data = controller.getAll(folder, id)
    return data['Chi_nhanh']
}
controller.getUnit = (folder, id) => {
    var Units = []
    var data = controller.getBranch(folder, id);
    data.forEach(branch => {
        branch['Don_vi'].forEach(unit => {
            unit['Chi_nhanh'] = {}
            unit['Chi_nhanh']['Ten'] = branch['Ten']
            unit['Chi_nhanh']['Ma_so'] = branch['Ma_so']
            Units.push(unit)
        })
    });
    return Units
}
controller.getLanguage = (folder, id) => {
    var data = controller.getAll(folder, id)
    return data['Danh_sach_Ngoai_ngu']
}


//---------- Nghỉ phép ====================================
controller.KhoiTao_DonNghiPhep_Json = (item, objectData) => {
    var dsDonVi = controller.getUnit('./Du_lieu/json', 'company.json')
    var dsChiNhanh = controller.getBranch('./Du_lieu/json', 'company.json')
    var dsNhanVien = controller.getAll('./Du_lieu/json', 'employee.json')

    item['Ma_so'] = objectData['maso']
    item['Ngay_bat_dau'] = objectData['ngaybatdau']
    item['So_ngay'] = objectData['songay']
    item['Ly_do'] = objectData['lydo']
    if (objectData['hoten']) {
        dsNhanVien.forEach(dv => {
            if (dv['Ho_ten'] == objectData['hoten']) { item['Nhan_vien'] = dv }
        })
    }
    if (objectData['masoquanlydonvi']) {
        item['Y_kien_Don_vi']['Ngay'] = objectData['ngay_donvi']
        item['Y_kien_Don_vi']['Noi_dung'] = objectData['noidung_donvi']
        dsDonVi.forEach(dv => {
            if (dv['Quan_ly_Don_vi']['Ma_so'] == objectData['masoquanlydonvi']) {
                item['Y_kien_Don_vi']['Quan_ly_Don_vi'] = dv['Quan_ly_Don_vi']
            }
        })
    }
    if (objectData['masoquanlydonvi']) {
        item['Y_kien_Chi_nhanh']['Ngay'] = objectData['ngay_chinhanh']
        item['Y_kien_Chi_nhanh']['Noi_dung'] = objectData['noidung_chinhanh']
        dsChiNhanh.forEach(dv => {
            if (dv['Quan_ly_Chi_nhanh']['Ma_so'] == objectData['masoquanlychinhanh']) {
                item['Y_kien_Chi_nhanh']['Quan_ly_Chi_nhanh'] = dv['Quan_ly_Chi_nhanh']
            }
        })
    } return item
}
controller.getAll_Unit_Leave = (folder_company, id_company, folder_employee, id_employee) => {
    var dataUnit = controller.getUnit(folder_company, id_company)
    var dataEmployee = controller.getAll(folder_employee, id_employee)
    var dataEmployeeInUnit = []
    dataUnit.forEach(unit => {
        unit['Danh_sach_Nhan_vien'] = dataEmployee.filter(employee => { employee['Don_vi']['Ma_so'] == unit['Ma_so'] });
        dataEmployeeInUnit.push(unit)
    });
    return dataEmployeeInUnit
}
controller.getAll_Branch_Employees = (folder_company, id_company, folder_employee, id_employee) => {
    var dataUnit = controller.getUnit(folder_company, id_company)
    var dataEmployee = controller.getAll(folder_employee, id_employee)
    var dataEmployeeInUnit = []
    dataUnit.forEach(unit => {
        unit['Danh_sach_Nhan_vien'] = dataEmployee.filter(employee => { employee['Don_vi']['Ma_so'] == unit['Ma_so'] });
        dataEmployeeInUnit.push(unit)
    });
    return dataEmployeeInUnit
}


controller.getOne = () => { }
controller.update = () => { }
controller.create = () => { }
controller.remove = () => { }


//---------- Công tác ====================================
controller.KhoiTao_PhieuCongTac_Json = (item, objectData) => {
    var dsDonVi    = controller.getUnit('./Du_lieu/json', 'company.json')
    var dsNhanVien = controller.getAll('./Du_lieu/json', 'employee.json')

    item['Ma_so']        = objectData['maso']
    item['Dia_diem']     = objectData['diadiem']
    item['Ngay_bat_dau'] = objectData['ngaybatdau']
    item['So_ngay']      = objectData['songay']
    item['Ghi_Chu']      = objectData['ghichu']
    //Danh sách nhân viên
    item['Danh_sach_Nhan_vien'] = []
    objectData['dsNhanVien'].forEach(obj => {
        dsNhanVien.forEach(nv => {
            if(nv['Ma_so'] == obj['nhanvien_maso']) item['Danh_sach_Nhan_vien'].push(nv)
        })
    })
        
    //đơn vị
    dsDonVi.forEach(dv => {
        if (dv['Ten'] == objectData['donvi']) {
            item['Don_vi'] = dv['Quan_ly_Don_vi']['Don_vi']
        }
    })
    
    return item
}

controller.getAll_Year_Unit_BusinessTrip = (folder_company, id_company, folder_business_trip, id_business_trip, year) => {
    var data_business_trip = controller.getAll(folder_business_trip, id_business_trip)
    var data_unit = controller.getUnit(folder_company, id_company)
    var data = {}
    data_business_trip.forEach(item => {
        if (item[year]) {
            data_unit.forEach(unit => {
                data[year] = []
                unit['Danh_sach_Chuyen_cong_tac'] = item[year].filter(unit_json => unit_json['Don_vi']['Ma_so'] == unit['Ma_so'])
                data[year].push(unit)
            })
        }
    })
    return data            //format: { 2022:[{DV_1:[biz_trip]}, {DV_2:[]}] }
}

controller.getAll_Year_Month_BusinessTrip = (folder_company, id_company, folder_business_trip, id_business_trip, year) => {
    var data_business_trip = controller.getAll(folder_business_trip, id_business_trip)
    var data_unit = controller.getUnit(folder_company, id_company)
    var data = {}
    data_business_trip.forEach(item => {
        if (item[year]) {
            data[year] = []
            for (let i = 1; i <= 12; i++) {
                data[year].push({ [i]: [] })
            }
            item[year].forEach(trip => {
                var j = parseInt(trip['Ngay_bat_dau'].substr(5, 2))
                if (1 <= j && j <= 12) {
                    data[year][j - 1][j].push(trip)
                    //console.log(data[year][j-1][j])
                }
            })
        }
    })
    return data       //format: { 2022:[{1:[biz_trip]}, {2:[]}] }
}

controller.getOneBusinessTrip = () => { }
controller.update = () => { }
controller.create = () => { }
controller.remove = () => { }







module.exports = controller