const express = require('express')
const app = express()                        //create express application
const XLDuLieu = require('./XLDuLieu')

app.use(express.urlencoded({ extended: true }))   // support encoded bodies
app.use(express.static('Du_lieu/html'))
app.use(express.static('Du_lieu/js'))
app.use(express.static('Du_lieu/image'))
app.use(express.static('./'))

// Port
app.listen(5002)

//----------Use Cookie
let cookieParser = require('cookie-parser')
app.use(cookieParser())

//----------Use Session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge: null },
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
}))

app.use((req, res, next) => {
    res.locals.employee = req.session.employee ? req.session.employee['Ho_ten'] : ''
    res.locals.unit = req.session.unit ? req.session.unit['Ho_ten'] : ''
    res.locals.branch = req.session.branch ? req.session.branch['Ho_ten'] : ''

    res.locals.isEmployee = (req.session.employee != undefined)
    res.locals.isUnit = (req.session.unit != undefined)
    res.locals.isBranch = (req.session.branch != undefined)
    //res.locals.isLoggedIn = req.session.user ? true : false
    next()
})


//----------Xử lý CLIENT

//----------Client Login====================================
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
app.post('/', (req, res) => {
    var objectData = req.body.objectData;               //FormData không null nên không cần check

    if (objectData.client == 'employee') {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100
        req.session.employee = objectData.infoClient;
    }
    else if (objectData.client == 'unit') {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100
        req.session.unit = objectData.infoClient;
    }
    else if (objectData.client == 'branch') {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100
        req.session.branch = objectData.infoClient;
    }
    res.json('')
})
//----------Logout====================================
app.get('/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);
        return res.redirect('/');
    })
})
//----------Client Nghỉ Phép====================================
app.get('/leave', XLDuLieu.isLoggedIn, (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
app.get('/leave/:param', (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
//----------Client Nhân viên====================================
app.get('/nhanvien', XLDuLieu.isLoggedIn, (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
//----------công tác====================================
app.get('/congtac',XLDuLieu.isLoggedIn, (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
app.get('/congtac/:param',XLDuLieu.isLoggedIn, (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})
//----------báo cáo====================================
app.get('/baocao',XLDuLieu.isLoggedIn, (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})




//----------Xử lý SERVICE

//----------API post JSON data - Login====================================
app.post('/api', (req, res) => {
    var objectData = req.body.objectData; console.log(objectData.emailEmployee);  //FormData không null nên không cần check

    var employee = XLDuLieu.loginEmployee('./Du_lieu/json', `employee.json`, objectData);
    var unit = XLDuLieu.loginUnit('./Du_lieu/json', `company.json`, objectData);
    var branch = XLDuLieu.loginBranch('./Du_lieu/json', `company.json`, objectData);

    if (employee != null) res.json({ status: "ok", client: "employee", infoClient: employee })
    else if (unit != null) res.json({ status: "ok", client: "unit", infoClient: unit })
    else if (branch != null) res.json({ status: "ok", client: "branch", infoClient: branch })
    else res.json('')
})
//----------API post JSON data - Nhân viên ====================================
app.post('/api/NhanVien/TimKiem', (req, res)=>{
    var objectData = req.body.objectData;                      //FormData không null nên không cần check null
    var dsNhanVien = XLDuLieu.getAll('./Du_lieu/json', 'employee.json')
    var ketQua     = []
    dsNhanVien.forEach(item => {
        if( XLDuLieu.coKetQuaTimKiem_obj(item, objectData) == true) {
            ketQua.push(item)  ; //console.log(JSON.stringify(item))
        }
    })    
    res.json(ketQua)
})

app.post('/api/NhanVien/Sua', (req, res) => {
    var objectData = req.body.objectData;                      //FormData không null nên không cần check null
    var dsNhanVien = XLDuLieu.getAll('./Du_lieu/json', 'employee.json')
    dsNhanVien.forEach(item => {
        if (item['Ma_so'] == objectData['maso']) {
            var item      = XLDuLieu.KhoiTao_NhanVien_Json(item, objectData)
            var chuoiJson = JSON.stringify(dsNhanVien, null, 4); 
            XLDuLieu.write('./Du_lieu', 'employee_c.json', chuoiJson)
            res.json('ok')
        }
    })
    
})
//----------API post JSON data - Đơn xin nghỉ ====================================
app.post('/api/Leave/Search', (req, res) => {
    var objectData       = req.body.objectData;                      //FormData không null nên không cần check null
    var dsDonXinNghiPhep = XLDuLieu.getAll('./Du_lieu/json', 'leave.json')
    var ketQua = []
    dsDonXinNghiPhep.forEach(item => {
        if( XLDuLieu.coKetQuaTimKiem_obj(item, objectData) == true) {
            ketQua.push(item)  ; //console.log(JSON.stringify(item))
        }
    })    
    res.json(ketQua)
})
app.post('/api/Leave/Create', (req, res) => {
    var objectData       = req.body.objectData;                      //FormData không null nên không cần check null
    
    var dsDonXinNghiPhep = XLDuLieu.getAll('./Du_lieu/json', 'leave.json')
    var dxn = {}
    dxn     = XLDuLieu.KhoiTao_DonNghiPhep_Json(dxn, objectData)
    dsDonXinNghiPhep.push(dxn)

    var ds  = JSON.stringify(dsDonXinNghiPhep, null, 4); 
    XLDuLieu.write('./Du_lieu', 'leave_c.json', ds)
    res.json('ok')
})
app.post('/api/Leave/Edit', (req, res) => {
    var objectData       = req.body.objectData;                      //FormData không null nên không cần check null
    var dsDonXinNghiPhep = XLDuLieu.getAll('./Du_lieu/json', 'leave.json')
    dsDonXinNghiPhep.forEach(item => {
        if (item['Ma_so'] == objectData['maso']) {
            var item      = XLDuLieu.KhoiTao_DonNghiPhep_Json(item, objectData)
            var ds        = JSON.stringify(dsDonXinNghiPhep, null, 4); 
            XLDuLieu.write('./Du_lieu', 'leave_e.json', ds)
        }
    })
    res.json('ok')
})

//----------API post JSON data - Phiếu công tác ====================================
app.post('/api/CongTac/TimKiem', (req, res) => {
    var objectData     = req.body.objectData;                      //FormData không null nên không cần check null
    var dsPhieuCongTac = XLDuLieu.getAll('./Du_lieu/json', 'business_trip.json')
    var ketQua = []
    dsPhieuCongTac.forEach(item => {
        Object.keys(item).forEach(y => {
            item[y].forEach(obj => {
                if( XLDuLieu.coKetQuaTimKiem_obj(obj, objectData) == true) {
                    ketQua.push(obj)  ; //console.log(JSON.stringify(item))
                }
            })
        })
    })  
    //console.log(JSON.stringify(ketQua))  
    res.json(ketQua)
})
app.post('/api/CongTac/TaoMoi', (req, res) => {
    var objectData     = req.body.objectData;                      //FormData không null nên không cần check null    
    console.log(objectData)
    var dsPhieuCongTac = XLDuLieu.getAll('./Du_lieu/json', 'business_trip.json')
    var pct = {}
    pct     = XLDuLieu.KhoiTao_PhieuCongTac_Json(pct, objectData)
    
    var nam = objectData['ngaybatdau'].substr(0,4).toString(); 
    dsPhieuCongTac.forEach(item=>{
        Object.keys(item).forEach(y=>{
            if(y == nam) item[y].push(pct)
        })
    })    

    var ds  = JSON.stringify(dsPhieuCongTac, null, 4); 
    XLDuLieu.write('./Du_lieu', 'business_trip_c.json', ds)
    res.json('ok')
})
app.post('/api/CongTac/Sua', (req, res) => {
    var objectData       = req.body.objectData;                      //FormData không null nên không cần check null
    var dsPhieuCongTac = XLDuLieu.getAll('./Du_lieu/json', 'business_trip.json')
    dsPhieuCongTac.forEach(item => {
        Object.keys(item).forEach(y => {
            item[y].forEach(obj => {
                if (obj['Ma_so'] == objectData['maso']) {
                    var obj      = XLDuLieu.KhoiTao_PhieuCongTac_Json(obj, objectData)
                    var ds       = JSON.stringify(dsPhieuCongTac, null, 4); 
                    XLDuLieu.write('./Du_lieu', 'business_trip_e.json', ds)
                }
            })
        })
        
    })
    res.json('ok')
})

//----------get JSON data ====================================
app.get('/api', (req, res) => {
    res.sendFile('index.html', { root: './Du_lieu/html' })
})

//----------get JSON data - image====================================
// app.get('/api/image/:fileName', (req, res) => {
//     res.sendFile('index.html', {root: './Du_lieu/html'})
// }) 

//----------get JSON data - employee====================================
app.get('/api/Employee', (req, res) => {
    var data = XLDuLieu.getAll('./Du_lieu/json', 'employee.json')
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})
app.get('/api/Unit_Employee', (req, res) => {
    var data = XLDuLieu.getAll_Unit_Employees('./Du_lieu/json', `company.json`, './Du_lieu/json', `employee.json`)
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})

app.get('/api/Language_Employee', (req, res) => {
    var data = XLDuLieu.getAll_Language_Employees('./Du_lieu/json', `company.json`, './Du_lieu/json', `employee.json`)
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})

//----------get JSON data - business_trip ====================================
app.get('/api/BusinessTrip', (req, res) => {
    var data = XLDuLieu.getAll('./Du_lieu/json', `business_trip.json`)
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})
app.get('/api/Year_Month_BusinessTrip/:year', (req, res) => {
    var year = req.params.year
    var data = XLDuLieu.getAll_Year_Month_BusinessTrip('./Du_lieu/json', `company.json`, './Du_lieu/json', `business_trip.json`, year)
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})
app.get('/api/Year_Unit_BusinessTrip/:year', (req, res) => {
    var year = req.params.year
    var data = XLDuLieu.getAll_Year_Unit_BusinessTrip('./Du_lieu/json', `company.json`, './Du_lieu/json', `business_trip.json`, year)
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})

//----------get JSON data - leave====================================
app.get('/api/Leave', (req, res) => {
    var data = XLDuLieu.getAll('./Du_lieu/json', 'leave.json')
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})

//----------get JSON data - company====================================
app.get('/api/Unit', (req, res) => {
    var data = XLDuLieu.getUnit('./Du_lieu/json', 'company.json')
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})
app.get('/api/Branch', (req, res) => {
    var data = XLDuLieu.getBranch('./Du_lieu/json', 'company.json')
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})
app.get('/api/Language', (req, res) => {
    var data = XLDuLieu.getLanguage('./Du_lieu/json', 'company.json')
    if (!data) res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else res.header('Content-Type', 'application/json; charset=utf8').send(JSON.stringify(data, null, 4))
})



