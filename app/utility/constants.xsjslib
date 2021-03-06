/**
 * constants
 * contains all global constant values
 * Author: Extentia Information Technology
 * Date: 04/01/2017
 * 
 * */

var CONSTANTS = {
    packageName:"tellme_dev",
    utilityPackgeName: "tellme_dev.app.utility",
    dbutilsPackageName: "tellme_dev.app.dbutils",
    libPackageName: "tellme_dev.app.lib",
    controllerPackageName: "tellme_dev.app.controller",
    schemaName:"TELLMEDEV",
    //dbNamespace: "TELLMEDEV.app.model::tellmedevModel",
    
    USER_TYPE:{
        SUPER_ADMIN: 'Super Admin',
        SUPERVISOR: 'Supervisor',
        EXPERT: 'Expert',
        REPORTER: 'Reporter'
    },
    
    SQL_TABLES: function(){
        return {
                tblUser : '"' + this.schemaName + '"."USERS"',
                tblAddress: '"' + this.schemaName + '"."ADDRESS"',
                tblAnnouncement: '"' + this.schemaName + '"."ANNOUNCEMENT"',
                tblExpertType: '"' + this.schemaName + '"."EXPERT_TYPE"',
                tblFeedback: '"' + this.schemaName + '"."FEEDBACK"',
                tblInventry: '"' + this.schemaName + '"."INVENTRY"',
                tblIssues: '"' + this.schemaName + '"."ISSUES"',
                tblIssueCategory: '"' + this.schemaName + '"."ISSUE_CATEGORY"',
                tblIssueFor: '"' + this.schemaName + '"."ISSUE_FOR"',
                tblIssueImage: '"' + this.schemaName + '"."ISSUE_IMAGE"',
                tblIssueTransaction: '"' + this.schemaName + '"."ISSUE_TRANSACTION"',
                tblNotification: '"' + this.schemaName + '"."NOTIFICATION"',
                tblSupervisorType: '"' + this.schemaName + '"."SUPERVISOR_TYPE"',
                tblUserDeviceDetails: '"' + this.schemaName + '"."USER_DEVICE_DETAILS"' 
        };
    },
    
    
    REQUEST_METHODS:{
        /*Test*/
        GET_TABLE_LIST: 'getTableList',//used
        GET_CONSTANTS: 'getConstants',//used
        /* User Actions*/
        REGISTER_USER:'registerUser',//used 
        LOGIN_USER: 'doLoginAndRetriveUser',//used
        UPDATE_USER:'updateUser',//used
        DELETE_USER:'deleteUser', 
        GET_EXPERT_TYPES: 'getExpertTypes',
        /* Inventry Actions */
        ADD_INVENTRY: 'addInventry', // Add inventry item by category wise, subcategory etc
        UPDATE_INVENTRY: 'updateInventry', // update, continue item, discontinue item etc
        DELETE_INVENTRY: 'deleteInventry', // soft delete 
        INVENTRY_LISTING: 'getInventryList', //by category OR all
        INVENTRY_REPORT: 'getInventryReport', // by deleted, continue, discontinued etc
        
        /* Complaint Actions*/
        REGISTER_COMPLAINT:'registerComplaint',
        COMPLAINT_LISTING: 'getComplaintsList',
        
        /* Notification Actions*/
        SEND_NOTIFICATION: 'sendNotification',
        ADD_NOTIFICATION_TRANSACTION_DETAILS: 'addNotificationTransactionDetails',//for internal use
        GET_NOTIFICATION_HISTORY: 'getNotificationHistory',//for internal use
        
        /* Announcement Actions */
        ADD_ANNOUNCEMENT_TRANSACTION: 'addAnnouncementTransaction',
        GET_ANNOUNCEMENT_TRANSACTION_DETAILS: 'getAnnouncementTransactionDetails',
        PUBLISH_ANNOUNCEMENT: 'publishAnnouncement'
        
    },
   
    REPORT_STATUS_FLAG:{
        OPEN : 'Open',
        INPROGRESS: 'In Progress',
        RESOLVED: 'Resolved',
        CLOSED: 'Closed'
    },
    
    ISSUE_SEVERITY:{
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: 'High'
    },
    
    STATUS_CODE:{
        OK: '200',
        FAIL: '500'
    }
    
    
};