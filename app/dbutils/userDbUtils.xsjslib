/**
 * userDBUtils
 * Responsilbe for db operation for user
 * Author: Extentia Information Technology
 * Date: 04/01/2017
 * 
 * */

var CONSTANTS = $.import('tellme_dev.app.utility','constants').CONSTANTS;
var helper = $.import('tellme_dev.app.utility','helper').helper;
//var userDbUtils = $.import(CONSTANTS.dbutilsPackageName,'userDbUtils').userDbUtils;
/*var inventryDbUtils = $.import(CONSTANTS.dbutilsPackageName,'inventryDbUtils').inventryDbUtils;
var issueDbUtils = $.import(CONSTANTS.dbutilsPackageName,'issueDbUtils').issueDbUtils;
var notificationUtils = $.import(CONSTANTS.libPackageName,'notification').notificationUtils;*/
var sqlTables = CONSTANTS.SQL_TABLES();
var STATUS = CONSTANTS.STATUS_CODE;

var userDbUtilsObj = {
    /*Test Methods*/
    getTableList: function(){
       var tables = helper.setResponse(STATUS.OK,'Retrieve tables list successfully',sqlTables);  
       return tables;
        
    },
    
    getConstants: function(){ 
       var constant = helper.setResponse(STATUS.OK,'Retrieve constants successfully',CONSTANTS);  
       return constant;
    },
    
    
    
    /**
     *This function is used to login and get User profile details
     * @param {Object} reqObj
     * @return {Object} response
    */
    doLoginAndRetriveUser: function(reqObj){
        var response;
        //to check duplicasy and blank inputes of user input data like email, phone 
        if((typeof reqObj.email == "undefined" || reqObj.email == "") && (typeof reqObj.phone == "undefined" || reqObj.phone == "")){
             response = helper.setResponse(STATUS.FAIL,'Email or phone is required',null);
             return response;
        } else if(typeof reqObj.password == "undefined" || reqObj.password == ""){
             response = helper.setResponse(STATUS.FAIL,'Password is required',null);
             return response;
        }
        //var userType = reqObj.user_type;
        var emailId = reqObj.email;
        var pwd = reqObj.password;
        var phone = reqObj.phone;
        var conn = $.db.getConnection();
        var sql = 'SELECT * FROM ' + sqlTables.tblUser +' user, '+sqlTables.tblAddress+' address '
                  +' WHERE user."workplace_address_id" = address."id" AND (user."email" =\''+ emailId +'\' OR user."phone" = \''+ phone +'\') AND user."password" = \''+ pwd +'\'';
        var pstmt = conn.prepareStatement(sql);
        var rs = pstmt.executeQuery();
        var user = {};
        while (rs.next()) {
            user = {
                id: rs.getInteger(1),
                firstname: rs.getString(2),
                lastname: rs.getString(3),
                email: rs.getString(4),
                phone: rs.getString(5),
                user_type: rs.getInteger(10),
                status: rs.getInteger(11),
                createdDate: rs.getDate(12),
                login_status: rs.getString(13),
                place: rs.getString(18),
                lane1: rs.getString(19),
                lane2: rs.getString(20),
                landmark: rs.getString(21),
                area: rs.getString(22),
                pincode: rs.getInteger(23),
                city: rs.getString(24),
                state: rs.getString(25),
                address_type: rs.getInteger(26)
            };
        }
        // to check whether the user is present or not
        if(Object.keys(user).length != 0){
            //update login status flag into table
            this.updateLoginStatus(user.id,'login');
            user.login_status = 1;
            response = helper.setResponse(STATUS.OK,'User successfully logged in',user);
        }else{
            response = helper.setResponse(STATUS.FAIL,'Wrong credentials are entered. Please enter valid credentials.',null);
        }
        
        rs.close();
        pstmt.close();
        conn.close();
       
        return response;
    },
    
    
    /**
     *This function is used to update login status
     * @param {Object} reqObj
     * @return {Object} response
    */
    updateLoginStatus: function(userId,action){
        var conn = $.db.getConnection();
        var rs;
        var sql;
        switch(action){
            case 'login':
                sql = 'UPDATE "TELLMEDEV"."USERS" SET "LOGIN_STATUS" = 1 WHERE "id" = '+ userId +'';
                break;
            case 'logout':
                sql = 'UPDATE "TELLMEDEV"."USERS" SET "LOGIN_STATUS" = 0 WHERE "id" = '+ userId +'';
                break;
        }
        
        var pstmt = conn.prepareStatement(sql);
        rs = pstmt.execute(); 
        conn.commit();
        pstmt.close();
        conn.close();
    },
    
    
    /**
     *This function is used to check if email and phone no is existed in database or not
     * @param {Object} reqObj
     * @return {Object} response
    */
    checkIfEmailOrPhoneIsPresent: function(reqObj){
        var flag;
        var email = reqObj.email;
        var phone = reqObj.phone;
        var sql = 'SELECT * FROM "TELLMEDEV"."USERS" user WHERE user."phone" = \''+ phone +'\' OR user."email" = \''+ email +'\'';
        var conn = $.db.getConnection();
        var pstmt = conn.prepareStatement(sql);
        var rs = pstmt.executeQuery();
        if(rs.next()){
            flag = true;
        }else{
            flag = false;
        }
        rs.close();
        pstmt.close();
        conn.close();
        
        return flag;
    },
    
    
    
    /**
     *This function is returns expert types
     * @param {Object} reqObj
     * @return {Object} response
    */
    getExpertTypes: function(){
        var response;
        var expertTypes = [];
        var sql = 'SELECT * FROM "TELLMEDEV"."EXPERT_TYPE" ';
        var conn = $.db.getConnection();
        var pstmt = conn.prepareStatement(sql);
        var rs = pstmt.executeQuery();
        while(rs.next()){
            expertTypes.push({
                id: rs.getInteger(1),
                type: rs.getString(2)
            });
        }
        
        if(Object.keys(expertTypes).length != 0){
            response = helper.setResponse(STATUS.OK,'expert type details',expertTypes);
        }else{
            response = helper.setResponse(STATUS.FAIL,'Unable to get expert type details',null);
        }
        rs.close();
        pstmt.close();
        conn.close();
        
        return response;
    },
    
    
    /**
     *This function is used to register user
     * @param {Object} reqObj
     * @return {Object} response
    */
    registerUser: function(reqObj){
        var response;
        //to check whether user phone or email is already present or not
        var isUserPresent = this.checkIfEmailOrPhoneIsPresent(reqObj);
        if(isUserPresent == true){
            response = helper.setResponse(STATUS.OK,'Phone OR email is already present',null);
            return response;
        }
        
        //to check duplicasy and blank inputes of user input data like email, phone 
        if((typeof reqObj.email == "undefined" || reqObj.email == "") || (typeof reqObj.phone == "undefined" || reqObj.phone == "")){
             response = helper.setResponse(STATUS.FAIL,'Email or phone is required',null);
             return response;
        } else if(typeof reqObj.password == "undefined" || reqObj.password == ""){
             response = helper.setResponse(STATUS.FAIL,'Password is required',null);
             return response;
        } else if(typeof reqObj.city == "undefined" ||  reqObj.city == ""){
             response = helper.setResponse(STATUS.FAIL,'City is required',null);
             return response;
        }
        
        //if everything is OK, then process the data to persist
        var conn = $.db.getConnection();
        var rs;
        var sql = 'INSERT INTO "TELLMEDEV"."USERS" ("firstname","lastname","email","phone","password","city","workplace_address_id","residence_address_id","user_type","status","created_date","created_by","supervisor_type_id","expert_type_id","LOGIN_STATUS") '+
                  'VALUES(?,?,?,?,?,?,?,?,?,?,CURRENT_UTCTIMESTAMP,?,?,?,?)';
        var pstmt = conn.prepareStatement(sql);
        pstmt.setString(1,reqObj.firstname);
        pstmt.setString(2,reqObj.lastname);
        pstmt.setString(3,reqObj.email);
        pstmt.setString(4,reqObj.phone);
        pstmt.setString(5,reqObj.password);
        pstmt.setString(6,reqObj.city);
        pstmt.setInteger(7,parseInt(reqObj.workplace_address_id));
        pstmt.setInteger(8,parseInt(reqObj.residence_address_id));
        pstmt.setInteger(9,parseInt(reqObj.user_type));
        pstmt.setInteger(10,parseInt(reqObj.status));
        pstmt.setInteger(11,parseInt(reqObj.created_by));
        pstmt.setInteger(12,parseInt(reqObj.supervisor_type_id));
        pstmt.setInteger(13,parseInt(reqObj.expert_type_id));
        pstmt.setInteger(14,0);
        //execute
        rs = pstmt.execute();
        /*if(!rs){
            response = helper.setResponse(STATUS.OK,'Profile registered successfully',rs);
        }else{
            response = helper.setResponse(STATUS.FAIL,'Unable to registered profile',rs);
        }*/
        conn.commit();
        pstmt.close();
        conn.close();
        
        //insert device details into device_details table against current registering user id
        var id = this.getLastInsertedId(sqlTables.tblUser, "email", reqObj.email) || this.getLastInsertedId(sqlTables.tblUser, "phone", reqObj.phone);
        //push this current registered user id into reqObj object
        reqObj.generated_id = id;
        //Now inserting into table device details
        var sucessFlag = this.insertDeviceDetails(reqObj);
        if(sucessFlag == 1){
            response = helper.setResponse(STATUS.OK,'Profile registered successfully',{id: reqObj.generated_id});
        }else{
            response = helper.setResponse(STATUS.FAIL,'Unable to registered profile',null);
        }
        return response;
    },
    
    
    /**
     *This function is generic function, used to get last inserted id from database table
     * @param {Object} reqObj
     * @return {Object} response
    */
    getLastInsertedId : function(tblName, fieldToCheck, value){
        var id;
        var conn = $.db.getConnection();
        var sql = 'SELECT "id" FROM ' + tblName +' WHERE "'+ fieldToCheck +'" = \''+ value +'\'';
        var pstmt = conn.prepareStatement(sql);
        var rs = pstmt.executeQuery();
        while(rs.next()){
            id = rs.getInteger(1);
        }
        
        rs.close();
        pstmt.close();
        conn.close();
        return id;
    }, 
    
    
    
    /** 
     *This function is used to insert user device details along with registered profile
     * @param {Object} reqObj
     * @return {Object} response
    */
    insertDeviceDetails: function(reqObj){
        var successFlag;
        var sql = 'INSERT INTO "TELLMEDEV"."USER_DEVICE_DETAILS"("user_id","device_id","device_type","device_token") VALUES(?, ? , ?, ?)';
        var conn = $.db.getConnection();
        var rs;
        var pstmt = conn.prepareStatement(sql);
        pstmt.setInteger(1,reqObj.generated_id);
        pstmt.setString(2,reqObj.device_id);
        pstmt.setString(3,reqObj.device_type);
        pstmt.setString(4,reqObj.device_token);
        //execute
        rs = pstmt.execute();
        if(!rs){
            successFlag = 1;
        }else{
            successFlag = 0;
        }
        conn.commit();
        pstmt.close();
        conn.close();
        return successFlag;
    },
    
    
    /**
     *This function is used to update user profile
     * @param {Object} reqObj
     * @return {Object} response
    */
    updateUser: function(reqObj){
       // return reqObj;
        var conn = $.db.getConnection();
        var rs;
        var response;
        var sql = 'UPDATE "TELLMEDEV"."USERS" SET "firstname" = ?,"lastname" =? ,"password" = ?, "city" = ?, "workplace_address_id" = ?,'+
                  ' "residence_address_id" = ?,"user_type" = ?, "status" = ?, "supervisor_type_id" = ?,"expert_type_id" = ? WHERE "id" = '+ reqObj.id +'';
        var pstmt = conn.prepareStatement(sql);
        pstmt.setString(1,reqObj.firstname);
        pstmt.setString(2,reqObj.lastname);
        /*pstmt.setString(3,reqObj.email);
        pstmt.setString(4,reqObj.phone);*/
        pstmt.setString(3,reqObj.password);
        pstmt.setString(4,reqObj.city);
        pstmt.setInteger(5,parseInt(reqObj.workplace_address_id));
        pstmt.setInteger(6,parseInt(reqObj.residence_address_id));
        pstmt.setInteger(7,parseInt(reqObj.user_type));
        pstmt.setInteger(8,parseInt(reqObj.status));
        /*pstmt.setInteger(11,parseInt(reqObj.created_by));*/
        pstmt.setInteger(9,parseInt(reqObj.supervisor_type_id));
        pstmt.setInteger(10,parseInt(reqObj.expert_type_id));
        /*pstmt.setInteger(14,0);*/
        //execute
        rs = pstmt.execute();
        if(!rs){
            response = helper.setResponse(STATUS.OK,'Profile updated successfully',null);
        }else{
            response = helper.setResponse(STATUS.FAIL,'Unable to updated profile',null);
        }
        
        conn.commit();
        pstmt.close();
        conn.close();
        
        return response;
    }
    
    
    
};