from pickle import FALSE, TRUE
import sqlite3
from sqlite3 import Error
from pathlib import Path


ThuMuc_Chuyen_Du_lieu_Ngay_sinh_NodeJs = Path('./Chuyen_Du_lieu_Ngay_sinh_NodeJs')
ThuMuc = Path('./Du_lieu/json')

folder_Sqlite_Python = Path('./Du_lieu/sqlite_database')
databasePath = folder_Sqlite_Python.joinpath('Python_sqlite.db')

#------------- datavase ==========================
def taoKetNoi(db_file):  #open connection
    """ create a database connection to the SQLite database specified by db_file: (:param db_file: database file, :return: Connection object or None) """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f'Mở kết nối {sqlite3.version}!')
        return conn
    except Error as e:
        print(e)
    return conn

def taoBang(conn, sql):
    """ create a table from the create_table_sql statement: (:param conn: Connection object, :param create_table_sql: a CREATE TABLE statement, :return:) """
    try:
        c = conn.cursor()
        c.execute(sql)
    except Error as e:
        print(e)

def themDuLieu(conn, sql, data):   #close connection
    try:
        cursor = conn.cursor()
        cursor.execute(sql, data)
        conn.commit()
        cursor.close()
    except Error as e:
        print('Không cập nhật được dữ liệu', e)    # finally:    #     if conn:    #         conn.close()

def dongKetNoi(conn):
    if conn:
        conn.close()
        print('Đóng kết nối!')

#----------- JSON ===============================
def readFile(folderName, fileName):
    filePath = folderName.joinpath(f'{fileName}')
    file     = open(filePath, encoding="utf8").read()
    return file

def DocNhanVien(ThuMuc, Ma_so):
    import json
    DuongDan  = ThuMuc.joinpath(f'{Ma_so}')
    TapTin    = open(DuongDan, encoding="utf8")
    ChuoiJson = TapTin.read()
    return json.loads(ChuoiJson)  #return dictionary

def readJson (folderName, fileName):
    import json
    filePath   = folderName.joinpath(f'{fileName}')
    file       = open(filePath, encoding="utf8")
    jsonString = file.read()
    return json.loads(jsonString)  #return dictionary

def LuuJson (Ma_so, DuLieu, ThuMuc_LuuDuLieu) :
    DuongDan = ThuMuc_LuuDuLieu.joinpath(f'{Ma_so}')
    TapTin   = open (DuongDan, 'wb')            # wb = write binary
    TapTin.write(DuLieu)

def writeJson (fileName, data, folderName) :
    filePath = folderName.joinpath(f'{fileName}')
    file     = open (filePath, 'wb')            # wb = write binary
    file.write(data)

#----------- Tao dữ liệu cho từng bảng
def locDuLieuTrung(dsTrung, dsKhongTrung, Maso):
    dsSet = set()
    for i in dsTrung:
        if i[Maso] not in dsSet:
            dsKhongTrung.append(i)
            dsSet.add(i[Maso])

def create_data():
    NHANVIEN = [];   NGOAINGU = []; NHANVIEN_NGOAINGU = []; DONVI_CHINHANH=[];          DONVI = []; CHINHANH = []; 
    DONXINNGHI = []; YKIEN = [];    PHIEUCONGTAC = [];      NHANVIEN_PHIEUCONGTAC = []; 
    nn    = []  #ngoại ngữ
    cn    = []  #chi nhanh 
    dvM   = []  #Đơn vị
    dvcnM = []  #đơn vị- chi nhánh
    dsNhanVien = DocNhanVien(ThuMuc, 'employee.json')
    
    for DuLieu_NV in dsNhanVien:    # for index in range (0,113):    #     MaSo     = f'NV_{index+1}'    #     DuLieu_NV = DocNhanVien (ThuMuc_Chuyen_Du_lieu_Ngay_sinh_NodeJs, MaSo) 
		#Tạo bảng NHANVIEN
        nv = {}
        nv['Ma_so']         = DuLieu_NV['Ma_so']
        nv['Ho_ten']        = DuLieu_NV['Ho_ten']
        nv['Ten_Dang_nhap'] = DuLieu_NV['Ten_Dang_nhap']
        nv['Mat_khau']      = DuLieu_NV['Mat_khau']
        nv['Gioi_tinh']     = DuLieu_NV['Gioi_tinh']
        nv['CMND']          = DuLieu_NV['CMND']
        nv['Dien_thoai']    = DuLieu_NV['Dien_thoai']
        nv['Mail']          = DuLieu_NV['Mail']
        nv['Muc_luong']     = DuLieu_NV['Muc_luong']
        nv['Ngay_sinh']     = DuLieu_NV['Ngay_sinh']
        nv['Ma_so_don_vi']  = DuLieu_NV['Don_vi']['Ma_so']
        if 'Dia_chi' in DuLieu_NV :
            nv['Dia_chi']   = DuLieu_NV['Dia_chi']
        else: nv['Dia_chi'] = ''
        NHANVIEN.append(nv)

		#Tạo bảng NGOAINGU, bảng NHANVIEN_NGOAINGU
        for i in range(0, len(DuLieu_NV['Danh_sach_Ngoai_ngu'])): 			
            nn.append(DuLieu_NV['Danh_sach_Ngoai_ngu'][i])	#???kiểm tra trùng

            nvnn = {}
            nvnn['Ma_so_nhan_vien'] = DuLieu_NV['Ma_so']
            nvnn['Ma_so_ngoai_ngu'] = DuLieu_NV['Danh_sach_Ngoai_ngu'][i]['Ma_so']
            NHANVIEN_NGOAINGU.append(nvnn)			
		
		#Tạo bảng CHINHANH  
        DuLieu_NV['Don_vi']['Chi_nhanh']['Ma_so_quan_ly'] = ''
        cn.append(DuLieu_NV['Don_vi']['Chi_nhanh'])             #???ktra trùng

		#Tạo bảng DONVI		
        dv = {}
        dv['Ma_so']         = DuLieu_NV['Don_vi']['Ma_so']
        dv['Ten']           = DuLieu_NV['Don_vi']['Ten']
        dv['Ma_so_quan_ly'] = ''
        dvM.append(dv)		

        #Tạo bảng DONVI_CHINHANH
        dvcn = {}
        dvcn['Ma_so_don_vi']    = DuLieu_NV['Don_vi']['Ma_so']
        dvcn['Ma_so_chi_nhanh'] = DuLieu_NV['Don_vi']['Chi_nhanh']['Ma_so']
        dvcnM.append(dvcn)                                #???ktra trùng
	
    locDuLieuTrung(nn,  NGOAINGU, 'Ma_so')
    locDuLieuTrung(dvM, DONVI,    'Ma_so')   
    locDuLieuTrung(cn,  CHINHANH, 'Ma_so')
            
    ds = []
    for i in dvcnM:        ds.append([i['Ma_so_don_vi'], i['Ma_so_chi_nhanh']])
    dsKhongTrung = set(tuple(i) for i in ds)
    for i in dsKhongTrung: DONVI_CHINHANH.append({'Ma_so_don_vi': i[0] , 'Ma_so_chi_nhanh': i[1]})

    dsBang = {'NHANVIEN': NHANVIEN, 'NGOAINGU': NGOAINGU, 'NHANVIEN_NGOAINGU': NHANVIEN_NGOAINGU, 'DONVI': DONVI, 'CHINHANH': CHINHANH, 'DONVI_CHINHANH': DONVI_CHINHANH,
              'DONXINNGHI': DONXINNGHI, 'PHIEUCONGTAC': PHIEUCONGTAC, 'YKIEN': YKIEN, 'NHANVIEN_PHIEUCONGTAC': NHANVIEN_PHIEUCONGTAC  }
    return dsBang


def KhoiTaoDuLieuSQlite():             #chạy chương trình
    data = create_data(); #print(a['CHINHANH'])

    # create a database connection
    conn = taoKetNoi(databasePath)  

    # create tables
    if conn is not None:        
        taoBang(conn, """CREATE TABLE IF NOT EXISTS DONVI (Ma_so TEXT PRIMARY KEY, 
                                                               Ten VARCHAR,
                                                               Ma_so_quan_ly TEXT,
                                                               FOREIGN KEY (Ma_so_quan_ly) REFERENCES NHANVIEN (Ma_so) )""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS CHINHANH (Ma_so TEXT PRIMARY KEY, 
                                                                   Ten VARCHAR,
                                                                   Ma_so_quan_ly TEXT,
                                                                   FOREIGN KEY (Ma_so_quan_ly) REFERENCES NHANVIEN (Ma_so))""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS DONVI_CHINHANH (Ma_so_don_vi TEXT,      
                                                                         Ma_so_chi_nhanh TEXT, 
                                                                         PRIMARY KEY(Ma_so_don_vi, Ma_so_chi_nhanh), 
                                                                         FOREIGN KEY (Ma_so_don_vi) REFERENCES DONVI (Ma_so), 
                                                                         FOREIGN KEY (Ma_so_chi_nhanh) REFERENCES CHINHANH (Ma_so) )""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS NHANVIEN (Ma_so TEXT PRIMARY KEY, Ho_ten VARCHAR,       
                                                                   Ten_Dang_nhap TEXT, 
                                                                   Mat_khau TEXT, 
                                                                   Gioi_tinh TEXT, 
                                                                   CMND TEXT, 
                                                                   Dien_thoai TEXT, 
                                                                   Mail VARCHAR, 
                                                                   Muc_luong FLOAT, 
                                                                   Ngay_sinh TEXT, 
                                                                   Ma_so_don_vi TEXT NOT NULL, 
                                                                   FOREIGN KEY (Ma_so_don_vi) REFERENCES DONVI (Ma_so) )""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS NGOAINGU (Ma_so TEXT PRIMARY KEY, 
                                                                   Ten VARCHAR)""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS NHANVIEN_NGOAINGU (Ma_so_nhan_vien TEXT,   
                                                                            Ma_so_ngoai_ngu TEXT, 
                                                                            PRIMARY KEY(Ma_so_nhan_vien, Ma_so_ngoai_ngu), 
                                                                            FOREIGN KEY (Ma_so_nhan_vien) REFERENCES NHANVIEN (Ma_so), 
                                                                            FOREIGN KEY (Ma_so_ngoai_ngu) REFERENCES NGOAINGU (Ma_so) )""")
        #-------------------------------
        taoBang(conn, """CREATE TABLE IF NOT EXISTS DONXINNGHI (Ma_so TEXT PRIMARY KEY,                                                                      
                                                                     Ngay_bat_dau TEXT,
                                                                     So_ngay FLOAT,
                                                                     Ly_do VARCHAR,
                                                                     Ma_so_nhan_vien TEXT,
                                                                     FOREIGN KEY (Ma_so_nhan_vien) REFERENCES NHANVIEN (Ma_so) )""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS PHIEUCONGTAC (Ma_so TEXT PRIMARY KEY, 
                                                                       Dia_diem TEXT,
                                                                       Ngay_bat_dau TEXT,
                                                                       So_ngay INT,
                                                                       Ghi_Chu INT,
                                                                       Ma_so_don_vi TEXT,
                                                                       FOREIGN KEY (Ma_so_don_vi) REFERENCES DONVI (Ma_so) )""")
        taoBang(conn, """CREATE TABLE IF NOT EXISTS YKIEN (Ma_so TEXT PRIMARY KEY,                                                                           
                                                                Ngay TEXT,
                                                                Noi_dung TEXT,
                                                                Ma_so_quan_ly TEXT,                                                                
                                                                Ma_so_don_xin_nghi TEXT,
                                                                FOREIGN KEY (Ma_so_quan_ly) REFERENCES NHANVIEN (Ma_so),
                                                                FOREIGN KEY (Ma_so_don_xin_nghi) REFERENCES DONXINNGHI (Ma_so) )""")  #quan hệ 1-2
        taoBang(conn, """CREATE TABLE IF NOT EXISTS NHANVIEN_PHIEUCONGTAC (Ma_so_nhan_vien TEXT,
                                                                                Ma_so_phieu_cong_tac TEXT,
                                                                                PRIMARY KEY(Ma_so_nhan_vien, Ma_so_phieu_cong_tac), 
                                                                                FOREIGN KEY (Ma_so_nhan_vien) REFERENCES NHANVIEN (Ma_so), 
                                                                                FOREIGN KEY (Ma_so_phieu_cong_tac) REFERENCES PHIEUCONGTAC (Ma_so) )""")
        #-------------------------------
        for x in data['DONVI']            : themDuLieu(conn, f"""INSERT OR REPLACE into DONVI(Ma_so, Ten, Ma_so_quan_ly) VALUES (?,?,?)""",
                                                                [ x['Ma_so'], x['Ten'], x['Ma_so_quan_ly'] ] ) 
        for x in data['CHINHANH']         : themDuLieu(conn, f"""INSERT OR REPLACE into CHINHANH(Ma_so, Ten, Ma_so_quan_ly) VALUES (?,?,?)""", 
                                                                [ x['Ma_so'], x['Ten'], x['Ma_so_quan_ly'] ] ) 
        for x in data['DONVI_CHINHANH']   : themDuLieu(conn, f"""INSERT OR REPLACE into DONVI_CHINHANH(Ma_so_don_vi, Ma_so_chi_nhanh) VALUES (?,?)""", 
                                                                [ x['Ma_so_don_vi'], x['Ma_so_chi_nhanh'] ] ) 
        for x in data['NHANVIEN']         : themDuLieu(conn, f"""INSERT OR REPLACE into NHANVIEN(Ma_so, Ho_ten, Ten_Dang_nhap, Mat_khau, Gioi_tinh, CMND, Dien_thoai, Mail, Muc_luong, Ngay_sinh, Ma_so_don_vi) 
                                                                VALUES (?,?,?,?,?, ?,?,?,?,?, ?)""", 
                                                                [ x['Ma_so'], x['Ho_ten'], x['Ten_Dang_nhap'], x['Mat_khau'], x['Gioi_tinh'], x['CMND'], x['Dien_thoai'], x['Mail'], x['Muc_luong'], x['Ngay_sinh'], x['Ma_so_don_vi'] ] ) 
        for x in data['NGOAINGU']         : themDuLieu(conn, f"""INSERT OR REPLACE into NGOAINGU(Ma_so, Ten) VALUES (?,?)""", 
                                                                [ x['Ma_so'], x['Ten'] ] )
        for x in data['NHANVIEN_NGOAINGU']: themDuLieu(conn, f"""INSERT OR REPLACE into NHANVIEN_NGOAINGU(Ma_so_nhan_vien, Ma_so_ngoai_ngu) VALUES (?,?)""", 
                                                                [x['Ma_so_nhan_vien'], x['Ma_so_ngoai_ngu']]) 
        #-------------------------------
        for x in data['DONXINNGHI']       : themDuLieu(conn, f"""INSERT OR REPLACE into DONXINNGHI(Ma_so, Ngay_bat_dau, So_ngay, Ly_do, Ma_so_nhan_vien) VALUES (?,?,?,?,?)""",
                                                                [ x['Ma_so'], x['Ngay_bat_dau'], x['So_ngay'], x['Ly_do'], x['Ma_so_nhan_vien'] ] )                                                              
        for x in data['PHIEUCONGTAC']     : themDuLieu(conn, f"""INSERT OR REPLACE into PHIEUCONGTAC(Ma_so, Dia_diem, Ngay_bat_dau, So_ngay, Ghi_Chu, Ma_so_don_vi) VALUES (?,?,?,?,?, ?)""",
                                                                [ x['Ma_so'], x['Dia_diem'], x['Ngay_bat_dau'], x['So_ngay'], x['Ghi_Chu'], x['Ma_so_don_vi'] ] )    
        for x in data['YKIEN']            : themDuLieu(conn, f"""INSERT OR REPLACE into YKIEN(Ma_so, Ngay, Noi_dung, Ma_so_quan_ly, Ma_so_don_xin_nghi) VALUES (?,?,?,?,?)""",
                                                                [ x['Ma_so'], x['Ngay'], x['Noi_dung'], x['Ma_so_quan_ly'], x['Ma_so_don_xin_nghi'] ] )    
        for x in data['NHANVIEN_PHIEUCONGTAC']: themDuLieu(conn, f"""INSERT OR REPLACE into NHANVIEN_PHIEUCONGTAC(Ma_so_nhan_vien, Ma_so_phieu_cong_tac) VALUES (?,?)""", 
                                                                [ x['Ma_so_nhan_vien'], x['Ma_so_phieu_cong_tac'] ] ) 

    else:
        print("Error! cannot create the database connection.")
    dongKetNoi(conn)

#----------- Truy vấn dữ liệu cho từng bảng (10 bảng)

def layDuLieuBang(conn, sql, data):
    try:
        cur        = conn.cursor()
        cur.execute(sql, data)
        rows       = cur.fetchall()    #return an array of tuples        
        #convert tuples to dictionary        
        dictionary = [dict((cur.description[idx][0], value) for idx, value in enumerate(row)) for row in rows]  #description: (return column list)
        return dictionary
    except Error as e:
        print(e)


def a():
    # KhoiTaoDuLieuSQlite()
    conn = taoKetNoi(databasePath)
    dsNhanVien              = layDuLieuBang(conn, "SELECT * FROM NHANVIEN", [])
    dsDonVi                 = layDuLieuBang(conn, "SELECT * FROM DONVI", [])
    dsChiNhanh              = layDuLieuBang(conn, "SELECT * FROM CHINHANH", [])
    dsNgoaiNgu              = layDuLieuBang(conn, "SELECT * FROM NGOAINGU", [])
    dsDonVi_ChiNhanh        = layDuLieuBang(conn, "SELECT * FROM DONVI_CHINHANH", [])
    dsNhanVien_NgoaiNgu     = layDuLieuBang(conn, "SELECT * FROM NHANVIEN_NGOAINGU", [])
    dsDonXinNghi            = layDuLieuBang(conn, "SELECT * FROM DONXINNGHI", [])
    dsPhieuCongTac          = layDuLieuBang(conn, "SELECT * FROM PHIEUCONGTAC", [])
    dsYKien                 = layDuLieuBang(conn, "SELECT * FROM YKIEN", [])
    dsNhanVien_PhieuCongTac = layDuLieuBang(conn, "SELECT * FROM NHANVIEN_PHIEUCONGTAC", [])
    dongKetNoi(conn)
    print(a)


#----------Login====================================
def kiemTraDangNhap_NhanVien (query, databasePath) :
    if query['emailEmployee'] and query['passEmployee'] :
        conn = taoKetNoi(databasePath)
        data = layDuLieuBang(conn, f"""SELECT * FROM NHANVIEN 
                                        WHERE Ten_Dang_nhap = {query['emailEmployee'].strip()}
                                        AND   Mat_khau = {query['passEmployee'].strip()}
                                        """, [])
        dongKetNoi(conn)
        if data != None: return data    
    return None

def kiemTraDangNhap_DonVi (query, databasePath) :    
    if query['emailUnit'] and query['passUnit'] :
        conn = taoKetNoi(databasePath)
        data = layDuLieuBang(conn, f"""SELECT nv.Ma_so, dv.Ma_so_quan_ly, nv.Ten_Dang_nhap, nv.Mat_khau
                                        FROM NHANVIEN nv
                                        JOIN DONVI dv
                                        ON nv.Ma_so = dv.Ma_so_quan_ly
                                        WHERE nv.Ten_Dang_nhap = ?
                                        AND nv.Mat_khau = ?
                                        """ , [ query['emailUnit'].strip(), query['passUnit'].strip() ])
        dongKetNoi(conn)
        if data != None: return data                                     
    return None

# query={'emailUnit':'NV_30', 'passUnit':'NV_30'}
# data = kiemTraDangNhap_DonVi(query, './Du_lieu/sqlite_database/Python_sqlite.db')
# print(data)

def kiemTraDangNhap_ChiNhanh (query, databasePath) :
    if query['emailBranch'] and query['passBranch'] :
        conn = taoKetNoi(databasePath)
        data = layDuLieuBang(conn, f"""SELECT nv.Ma_so, dv.Ma_so_quan_ly, nv.Ten_Dang_nhap, nv.Mat_khau
                                        FROM NHANVIEN nv
                                        JOIN CHINHANH dv
                                        ON nv.Ma_so = dv.Ma_so_quan_ly
                                        WHERE nv.Ten_Dang_nhap = ?
                                        AND nv.Mat_khau = ?
                                        """ , [ query['emailBranch'].strip(), query['passBranch'].strip() ])
        dongKetNoi(conn)
        if data != None: return data     
    return None

# def isLoggedIn (req,res,next) :
#     if req.session.employee or req.session.unit or req.session.branch :  next()
#     else:  res.redirect('/') 

#---------- Hàm dùng chung cho Nhân viên, Đơn vị, Chi nhánh ====================================
#Hàm tìm kiếm, return kiểu bool
def coKetQuaTimKiem_obj (item, objectData) : #item: object, ketQua: array
    for prop in item :
        if item.has_key(prop) :
            curValue = item[prop]; #console.log(curValue)
            if objectData['txtTimKiem'].upper() in str(curValue).upper() :
                #console.log(curValue); console.log(true); 
                return TRUE     

            if type(curValue) == list and len(curValue) != 0 :                  #Nếu value là mảng
                for i in curValue :
                    kq = coKetQuaTimKiem_obj(i, objectData);                    #tìm kiếm trong object là phần tử trong mảng
                    if(kq == TRUE): return kq  

            if curValue != None and type(curValue) == dict :                    #Nếu value là object
                kq = coKetQuaTimKiem_obj(curValue, objectData); 
                if(kq == TRUE): return kq          
                    
    return FALSE


#----------sqlite to JSON-employee====================================


def getAll_Employee (databasePath) :
    conn = taoKetNoi(databasePath)
    #------Dictionary of employee
    data = layDuLieuBang(conn, f"""SELECT * FROM NHANVIEN """, [])
    for i in range( len(data) ):
        data[i]['Don_vi']              = layDuLieuBang(conn, f"""SELECT Ma_so, Ten FROM DONVI WHERE Ma_so=? """, [data[i]['Ma_so_don_vi'].strip() ])[0]
        data[i]['Don_vi']['Chi_nhanh'] = layDuLieuBang(conn, f"""SELECT cn.Ma_so, cn.Ten 
                                                            FROM DONVI_CHINHANH dvcn
                                                            JOIN CHINHANH cn
                                                            ON dvcn.Ma_so_chi_nhanh = cn.Ma_so
                                                            WHERE Ma_so_don_vi=? """, [data[i]['Don_vi']['Ma_so'].strip()  ])[0]
        data[i]['Danh_sach_Ngoai_ngu'] = layDuLieuBang(conn, f"""SELECT nn.Ma_so, nn.Ten 
                                                            FROM NHANVIEN_NGOAINGU nvnn
                                                            JOIN NGOAINGU nn
                                                            ON nvnn.Ma_so_ngoai_ngu = nn.Ma_so
                                                            WHERE Ma_so_nhan_vien=? """, [data[i]['Ma_so'].strip()  ])
        del data[i]['Ma_so_don_vi']

    dongKetNoi(conn)
    if data != None: return data
    else: return []

#---------- Công ty ====================================
def getUnit (databasePath) :
    conn        = taoKetNoi(databasePath)
    #------Dictionary of data
    data        = layDuLieuBang(conn, f"""SELECT Ma_so, Ten, Ma_so_quan_ly FROM DONVI """, [])
    lstEmployee = getAll_Employee(databasePath)

    for u in data:
        for e in lstEmployee :
            if e['Ma_so'] == u['Ma_so_quan_ly'] : 
                u['Quan_ly_Don_vi'] = e
                u['Chi_nhanh']      = e['Don_vi']['Chi_nhanh']
        del u['Ma_so_quan_ly']
    return data

# data = getUnit(databasePath)
# print(data[0])

def getBranch (databasePath) :
    conn        = taoKetNoi(databasePath)
    #------Dictionary of employee
    data        = layDuLieuBang(conn, f"""SELECT Ma_so, Ten, Ma_so_quan_ly FROM CHINHANH """, [])
    lstEmployee = getAll_Employee(databasePath)
    lstUnit     = getUnit(databasePath)
    for b in data:
        b['Quan_ly_Chi_nhanh'] = [e for e in lstEmployee if e['Ma_so'] == b['Ma_so_quan_ly'] ][0]
        b['Don_vi']            = [u for u in lstUnit     if b['Ma_so'] == u['Chi_nhanh']['Ma_so'] ]
        del b['Ma_so_quan_ly']
    return data


def getLanguage (databasePath) :
    conn = taoKetNoi(databasePath)
    #------Dictionary of data
    data = layDuLieuBang(conn, f"""SELECT Ma_so, Ten FROM NGOAINGU """, [])
    return data

#----------sqlite to JSON-BusinessTrip====================================
            
def getAll_BusinessTrip (databasePath) :
    conn = taoKetNoi(databasePath)
    #------Dictionary of employee
    sqliteData   = layDuLieuBang(conn, f"""SELECT * FROM PHIEUCONGTAC """, [])
    listEmployee = getAll_Employee(databasePath)
    data         = []
    if len(sqliteData) != 0:
        for item in sqliteData:
            #===-----------------chỉnh sửa item của sqliteData
            item['Don_vi']              = layDuLieuBang(conn, f"""SELECT Ma_so, Ten FROM DONVI WHERE Ma_so=? """, [item['Ma_so_don_vi'].strip() ])[0]
            item['Don_vi']['Chi_nhanh'] = layDuLieuBang(conn, f"""SELECT cn.Ma_so, cn.Ten 
                                                            FROM DONVI_CHINHANH dvcn
                                                            JOIN CHINHANH cn
                                                            ON dvcn.Ma_so_chi_nhanh = cn.Ma_so
                                                            WHERE Ma_so_don_vi=? """, [item['Don_vi']['Ma_so'].strip()  ])[0]
            listEmployeeId              = layDuLieuBang(conn, f"""SELECT Ma_so_nhan_vien FROM NHANVIEN_PHIEUCONGTAC WHERE Ma_so_phieu_cong_tac=? """, [item['Ma_so'].strip() ])
            item['Danh_sach_Nhan_vien'] = []
            if len(listEmployeeId) != 0 and len(listEmployee) != 0 :   
                for e in listEmployee:
                    for id in listEmployeeId: 
                        if e['Ma_so'] == id['Ma_so_nhan_vien'] : item['Danh_sach_Nhan_vien'].append(e)
            #===-----------------tạo object cho BusinessTrip  
            year = item['Ngay_bat_dau'][0:4]
            if(len(data) == 0): data.append({year: [item]})
            else:
                for i in range(len(data)):
                    if year not in data[i] :  #nếu key year chưa có thì thêm vào
                        data[i][year] = [item]
                    else: data[i][year].append(item)

    dongKetNoi(conn)
    if data != None: return data
    else: return []

#----------sqlite to JSON-leave====================================
def getAll_Leave (databasePath) :
    conn         = taoKetNoi(databasePath)
    #------Dictionary of leave
    data         = layDuLieuBang(conn, f"""SELECT * FROM DONXINNGHI """, [])
    listEmployee = getAll_Employee(databasePath)
    for item in data:
        yKienCN = layDuLieuBang(conn, f"""SELECT  yk.Ma_so_quan_ly, yk.Ngay, yk.Noi_dung
                                        FROM CHINHANH cn
                                        LEFT JOIN NHANVIEN nv ON cn.Ma_so_quan_ly = nv.Ma_so
                                        LEFT JOIN YKIEN yk ON yk.Ma_so_quan_ly = cn.Ma_so_quan_ly
                                        WHERE yk.Ma_so_don_xin_nghi=? """, [item['Ma_so'].strip()  ])
        yKienDV = layDuLieuBang(conn, f"""SELECT  yk.Ma_so_quan_ly, yk.Ngay, yk.Noi_dung
                                        FROM DONVI cn
                                        LEFT JOIN NHANVIEN nv ON cn.Ma_so_quan_ly = nv.Ma_so
                                        LEFT JOIN YKIEN yk ON yk.Ma_so_quan_ly = nv.Ma_so
                                        WHERE yk.Ma_so_don_xin_nghi=? """, [item['Ma_so'].strip()  ])
        
        item['Y_kien_Chi_nhanh'] = {}
        item['Y_kien_Don_vi']    = {}
        for e in listEmployee:
            if e['Ma_so'] == item['Ma_so_nhan_vien'] : item['Nhan_vien'] = e
            if len(yKienCN) == 1 and e['Ma_so'] == yKienCN[0]['Ma_so_quan_ly'] : 
                item['Y_kien_Chi_nhanh']['Quan_ly_Chi_nhanh'] = e
                item['Y_kien_Chi_nhanh']['Ngay']              = yKienCN[0]['Ngay']
                item['Y_kien_Chi_nhanh']['Noi_dung']          = yKienCN[0]['Noi_dung']
            if len(yKienDV) == 1 and e['Ma_so'] == yKienDV[0]['Ma_so_quan_ly'] : 
                item['Y_kien_Don_vi']['Quan_ly_Don_vi']       = e
                item['Y_kien_Don_vi']['Ngay']                 = yKienDV[0]['Ngay']
                item['Y_kien_Don_vi']['Noi_dung']             = yKienDV[0]['Noi_dung']
        del item['Ma_so_nhan_vien']

    dongKetNoi(conn)
    if data != None: return data
    else: return []

#----------sqlite to JSON-Khởi tạo object====================================
def updateEmployee (databasePath, objectData) :
    conn = taoKetNoi(databasePath)
    #themDuLieu(conn, f"""Alter table NHANVIEN add Dia_chi TEXT """, [])
    themDuLieu(conn, f"""UPDATE NHANVIEN SET Ho_ten=?,CMND=?,Gioi_tinh=?,Dien_thoai=?,Dia_chi=?,Mail=?,Muc_luong=?,Ngay_sinh=?
                        WHERE Ma_so=?  """, 
                        [ objectData['hoten'], objectData['cmnd'],objectData['gioitinh'], objectData['dienthoai'],
                        objectData['diachi'], objectData['mail'], objectData['mucluong'], objectData['ngaysinh'], objectData['maso']  ])
    # duyệt objectData['ngoaingu'] => item nào không có thì INSERT, itemitem nào có thì bỏ wa
    # duyệt NHANVIEN_NGOAINGU => item nào không có thì xóa đi
    lstLang    = getLanguage(databasePath); 
    lstLangEmp = layDuLieuBang(conn, f"""SELECT * 
                                        FROM NHANVIEN_NGOAINGU nvnn
                                        JOIN NGOAINGU nn ON nn.Ma_so = nvnn.Ma_so_ngoai_ngu
                                        WHERE Ma_so_nhan_vien = ?   """,   [objectData['maso'] ])
    for i in lstLangEmp:
        if i['Ten'] not in objectData['ngoaingu']: 
            themDuLieu(conn, f"""DELETE FROM NHANVIEN_NGOAINGU 
                                WHERE Ma_so_nhan_vien = ?
                                AND Ma_so_ngoai_ngu   = ?   """, [objectData['maso'], i['Ma_so']  ])
    for i in objectData['ngoaingu']:   #objectData['ngoaingu'] là 1 array of string
        if not any (j['Ten'] == i for j in lstLangEmp)  : 
            msnn = [ a['Ma_so'] for a in lstLang if a['Ten'] == i ][0]
            print(msnn)         
            themDuLieu(conn, f"""INSERT INTO NHANVIEN_NGOAINGU (Ma_so_nhan_vien, Ma_so_ngoai_ngu)
                                VALUES (?,?)  """, [objectData['maso'], msnn])
    #Cập nhật Đơn vị
    msdv = layDuLieuBang(conn, f"""SELECT Ma_so     FROM DONVI     WHERE Ten = ? """,   [objectData['donvi']  ])[0]['Ma_so']
    print(msdv)
    themDuLieu(conn, f"""UPDATE NHANVIEN    
                        SET Ma_so_don_vi = ?
                        WHERE Ma_so      = ?   """, [msdv, objectData['maso']])
    #if( objectData['hinh'] )  item['Hinh_chinh_sua']  = objectData['hinh']    
    
def createEmployee():
    return ''

objectData = {'hoten':'Bành đình thụy Khuê',
            'maso':'NV_1',
            'cmnd':'007958643',
            'gioitinh':'Nam',
            'dienthoai':'0949134444',
            'diachi':'',
            'mail':'bđtkhuê@gmailvn',
            'mucluong':9800000,
            'ngaysinh':'1972-04-01T17:00:00Z',
            'donvi':'Tư vấn du học 2',
            'ngoaingu': ['Pháp','Ý', 'Anh']
            } 
#print(objectData)
# updateEmployee(databasePath, objectData)


def themDiaChi():             #chạy chương trình
    data = create_data(); #print(a['CHINHANH'])
    # create a database connection
    conn = taoKetNoi(databasePath)  
    # create tables
    if conn is not None:        
        for x in data['NHANVIEN']         : themDuLieu(conn, f"""update NHANVIEN
                                                                set Dia_chi = ?
                                                                where Ma_so = ?""", 
                                                                [ x['Dia_chi'], x['Ma_so']   ] ) 
        
    else:
        print("Error! cannot create the database connection.")
    dongKetNoi(conn)

#----------sqlite to JSON-Khởi tạo object====================================
def updateLeave (databasePath, objectData) :
    return ''

def updateBusinessTrip (databasePath, objectData) :
    return ''

def createBusinessTrip (databasePath, objectData) :
    return ''











# if __name__ == '__main__':
    # a()

