from flask import Flask, jsonify, render_template, request, send_from_directory, make_response, redirect, url_for
import json
from  XuLyDuLieu import *
# app = Flask(__name__, static_folder='DichVu/static/html')
app = Flask(__name__, static_url_path='')
app.config["JSON_AS_ASCII"]    = False
app.config["JSONIFY_MIMETYPE"] = "application/json; charset=utf-8"  # return data like this return jsonify(data) - without messing with response.headers  # response.headers["Content-Type"] = "application/json; charset=utf-8"
app.config['SECRET_KEY'] = 'S3cret'

folder_Sqlite_Python = Path('./Du_lieu/sqlite_database')
databasePath         = folder_Sqlite_Python.joinpath('Python_sqlite.db')


#----------Xử lý CLIENT

#----------Client Login====================================
@app.route('/', methods=['GET', 'POST'])
def getLoginClient():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString

@app.route('/', methods=['GET', 'POST'])
def postLoginClient():
    if request.method == 'POST':
        objectData = request.form['objectData']       #FormData không null nên không cần check

        if (objectData.client == 'employee') :
            res = make_response( redirect(url_for('getEmployee_Client')) )
            res.set_cookie('employee', objectData['emailEmployee'], max_age=30*24*60*60*100 )
            return res 
        else:
            if (objectData.client == 'unit') :
                res = make_response( redirect(url_for('getEmployee_Client')) )
                res.set_cookie('employee', objectData['emailEmployee'], max_age=30*24*60*60*100 )
                return res 
            else:
                if (objectData.client == 'branch') :
                    res = make_response( redirect(url_for('getEmployee_Client')) )
                    res.set_cookie('employee', objectData['emailEmployee'], max_age=30*24*60*60*100 )
                    return res 

        return jsonify('')

#----------Logout====================================
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    res = make_response( redirect(url_for('getLoginClient')) )
    res.set_cookie('employee', '', expires=0 )
    return res 

#----------Client Nhân viên====================================
@app.route('/nhanvien', methods=['GET', 'POST'])
def getEmployee_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString
    
#----------Client Nghỉ Phép====================================
@app.route('/leave', methods=['GET', 'POST'])
def getLeave_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString    

@app.route('/leave/:param', methods=['GET', 'POST'])
def getLeaveParam_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString
    
#----------công tác====================================
@app.route('/congtac', methods=['GET', 'POST'])
def getBusinessTrip_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString
    
@app.route('/congtac/:param', methods=['GET', 'POST'])
def getBusinessTripParam_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString
    
#----------báo cáo====================================
@app.route('/baocao', methods=['GET', 'POST'])
def getReport_Client():
    htmlString = readFile('.Du_lieu/html', 'index.html')
    return htmlString
    






#----------API - post JSON data ====================================
@app.route('/api', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        objectData = request.form['objectData'];  #console.log(objectData.emailEmployee);  #FormData không null nên không cần check
        
        employee = kiemTraDangNhap_NhanVien(objectData); 
        unit     = kiemTraDangNhap_DonVi(objectData); 
        branch   = kiemTraDangNhap_ChiNhanh(objectData); 
        
        if( employee != None) : return json.dumps({'status':"ok", 'client':"employee", 'infoClient': employee}, indent=1,ensure_ascii=False).encode('utf8')  
        else:
            if( employee != None) : return json.dumps({'status':"ok", 'client':"unit", 'infoClient': unit}, indent=1,ensure_ascii=False).encode('utf8')       
            else: 
                if( branch != None ): return json.dumps({'status':"ok", 'client':"branch", 'infoClient': branch}, indent=1,ensure_ascii=False).encode('utf8')     
                else: return json.dumps('')   
    return render_template('api.html')    #return send_from_directory(Path(app.root_path)/'static', )

#----------API post JSON data - Nhân viên ====================================
@app.route('/api/NhanVien/TimKiem', methods=['GET', 'POST'])
def searchEmployee() :
    if request.method == 'POST':
        objectData = request.form['objectData'];                      #FormData không null nên không cần check null
        dsNhanVien = getAll_Employee(databasePath)
        ketQua     = []
        for item in dsNhanVien:
            if( coKetQuaTimKiem_obj(item, objectData) == TRUE) :
                ketQua.push(item)  ; #console.log(JSON.stringify(item))                        
        return jsonify(ketQua)

@app.route('/api/NhanVien/Sua', methods=['GET', 'POST'])
def editEmployee_API() :
    if request.method == 'POST':
        objectData = req.body.objectData;                      #FormData không null nên không cần check null
        dsNhanVien = getAll('./Du_lieu/json', 'employee.json')
        dsNhanVien.forEach(item => {
            if (item['Ma_so'] == objectData['maso']) :
                item      = KhoiTao_NhanVien_Json(item, objectData)
                chuoiJson = JSON.stringify(dsNhanVien, null, 4); 
                write('./Du_lieu', 'employee_c.json', chuoiJson)
                res.json('ok')
        

#----------API post JSON data - Đơn xin nghỉ ====================================
@app.route('/api/Leave/Search', methods=['GET', 'POST'])
def searchLeave_API () :
    if request.method == 'POST':
        objectData       = req.body.objectData;                      #FormData không null nên không cần check null
        dsDonXinNghiPhep = getAll('./Du_lieu/json', 'leave.json')
        ketQua = []
        dsDonXinNghiPhep.forEach(item => {
            if( coKetQuaTimKiem_obj(item, objectData) == true) {
                ketQua.push(item)  ; #console.log(JSON.stringify(item))
            }
        })    
        res.json(ketQua)

@app.route('/api/Leave/Create', methods=['GET', 'POST'])
def createEmployee_API() :
    if request.method == 'POST':
        objectData       = req.body.objectData;                      #FormData không null nên không cần check null
        
        dsDonXinNghiPhep = getAll('./Du_lieu/json', 'leave.json')
        dxn = {}
        dxn     = KhoiTao_DonNghiPhep_Json(dxn, objectData)
        dsDonXinNghiPhep.push(dxn)

        ds  = json.stringify(dsDonXinNghiPhep, null, 4); 
        write('./Du_lieu', 'leave_c.json', ds)
        res.json('ok')

@app.route('/api/Leave/Edit', methods=['GET', 'POST'])
def editEmployee_API() :
    if request.method == 'POST':
        objectData       = req.body.objectData;                      #FormData không null nên không cần check null
        dsDonXinNghiPhep = getAll('./Du_lieu/json', 'leave.json')
        dsDonXinNghiPhep.forEach(item => {
            if (item['Ma_so'] == objectData['maso']) {
                item      = KhoiTao_DonNghiPhep_Json(item, objectData)
                ds        = json.stringify(dsDonXinNghiPhep, null, 4); 
                write('./Du_lieu', 'leave_e.json', ds)
            }
        })
        res.json('ok')

#----------API post JSON data - Phiếu công tác ====================================
@app.route('/api/CongTac/TimKiem', methods=['GET', 'POST'])
def searchBusinessTrip_API() :
    if request.method == 'POST':
        objectData     = req.body.objectData;                      #FormData không null nên không cần check null
        dsPhieuCongTac = getAll('./Du_lieu/json', 'business_trip.json')
        ketQua = []
        dsPhieuCongTac.forEach(item => {
            Object.keys(item).forEach(y => {
                item[y].forEach(obj => {
                    if( coKetQuaTimKiem_obj(obj, objectData) == true) {
                        ketQua.push(obj)  ; #console.log(JSON.stringify(item))
                    }
                })
            })
        })  
        #console.log(JSON.stringify(ketQua))  
        res.json(ketQua)

@app.route('/api/CongTac/TaoMoi', methods=['GET', 'POST'])
def createEmployee_API() :
    if request.method == 'POST':
        objectData     = req.body.objectData;                      #FormData không null nên không cần check null    
        console.log(objectData)
        dsPhieuCongTac = getAll('./Du_lieu/json', 'business_trip.json')
        pct = {}
        pct     = KhoiTao_PhieuCongTac_Json(pct, objectData)
        
        nam = objectData['ngaybatdau'].substr(0,4).toString(); 
        dsPhieuCongTac.forEach(item=>{
            Object.keys(item).forEach(y=>{
                if(y == nam) item[y].push(pct)
            })
        })    

        ds  = json.stringify(dsPhieuCongTac, null, 4); 
        write('./Du_lieu', 'business_trip_c.json', ds)
        res.json('ok')

@app.route('/api/CongTac/Sua', methods=['GET', 'POST'])
def editEmployee_API() :
    if request.method == 'POST':
        objectData       = req.body.objectData;                      #FormData không null nên không cần check null
        dsPhieuCongTac = getAll('./Du_lieu/json', 'business_trip.json')
        dsPhieuCongTac.forEach(item => {
            Object.keys(item).forEach(y => {
                item[y].forEach(obj => {
                    if (obj['Ma_so'] == objectData['maso']) {
                        obj      = KhoiTao_PhieuCongTac_Json(obj, objectData)
                        ds       = json.stringify(dsPhieuCongTac, null, 4); 
                        write('./Du_lieu', 'business_trip_e.json', ds)
                    }
                })
            })
            
        })
        res.json('ok')


#----------get JSON data ====================================
@app.route('/api', methods=['GET', 'POST'])
def getAPI() :
    res.sendFile('index.html', { root: './Du_lieu/html' })



#----------API - get JSON data - image====================================
# router.get('/image/:fileName', (req, res) => {
#     res.sendFile('index.html', {root: './static/html'})
# }) 

#----------API - get JSON data - employee====================================
@app.route('/Employee', methods=['GET', 'POST'])
def getEmployee_API():
    data = DocNhanVien('./data', 'employee')
    return jsonify(data)

@app.route('/Unit_Employee', methods=['GET', 'POST'])
def getUnit_Employee_API():
    data = getAll_Unit_Employees('./data', 'company', './data', 'employee')
    return jsonify(data)

@app.route('/Language_Employee', methods=['GET', 'POST'])
def getLanguage_Employee_API():
    data = getAll_Language_Employees('./data', 'company', './data', 'employee')
    return jsonify(data)


#----------API - get JSON data - business_trip ====================================
@app.route('/BusinessTrip', methods=['GET', 'POST'])
def getBusinessTrip_API():
    data = DocNhanVien('./data', 'business_trip')
    return jsonify(data)

@app.route('/Year_Month_BusinessTrip/:year', methods=['GET', 'POST'])
def getYear_Month_BusinessTrip_API():
    year = request.params.year
    data = getAll_Year_Month_BusinessTrip('./data', 'company', './data', 'business_trip', year)
    return jsonify(data)

@app.route('/Year_Unit_BusinessTrip/:year', methods=['GET', 'POST'])
def getYear_Unit_BusinessTrip_API():
    year = request.params.year
    data = getAll_Year_Unit_BusinessTrip('./data', 'company', './data', 'business_trip', year)
    return jsonify(data)


#----------API - get JSON data - leave====================================
@app.route('/Leave', methods=['GET', 'POST'])
def getLeave_API():
    data = DocNhanVien('./data', 'leave')
    return jsonify(data)

#----------get JSON data - company====================================
@app.route('/api/Unit', methods=['GET', 'POST'])
def getUnit_API():
    data = getUnit('./Du_lieu/json', 'company.json')
    if data == None : res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else: res.header('Content-Type', 'application/json; charset=utf8').send(json.stringify(data, null, 4))

@app.route('/api/Branch', methods=['GET', 'POST'])
def getBranch_API():
    data = getBranch('./Du_lieu/json', 'company.json')
    if data == None : res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else: res.header('Content-Type', 'application/json; charset=utf8').send(json.stringify(data, null, 4))

@app.route('/api/Language', methods=['GET', 'POST'])
def getLanguage_API():
    data = getLanguage('./Du_lieu/json', 'company.json')
    if data == None : res.header('Content-Type', 'application/json; charset=utf8').send('[]')
    else: res.header('Content-Type', 'application/json; charset=utf8').send(json.stringify(data, null, 4))




if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8081, debug=True)