package com.cpl.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

public class SqlServerDBUtility {

	//url="jdbc:sqlserver://127.0.0.1:1433;databaseName=DB"
	private String url = "jdbc:sqlserver://";
	private String userid="";
	private String passwd="";
	Connection conn;
	ResultSet rs;
	Statement st;
	
	public SqlServerDBUtility(){};
	public SqlServerDBUtility(String ip,String userid, String passwd, String databaseName){
		this.url += ip + ":1433;databaseName=" + databaseName;
		this.userid = userid;
		this.passwd = passwd;	
	}
	
	public int openConnection(){
		return start();
	}
	
	private int start(){
		int retVal = 1;
		try {
			Class.forName("com.mircosoft.sqlserver.jdbc.SQLServerDriver");
			conn = DriverManager.getConnection(url, userid, passwd);
		} catch (ClassNotFoundException e) {
			retVal = -1;
			System.out.println("Exception :" + e.getMessage());
		} catch (SQLException e) {
			retVal = -1;
			System.out.println("Exception :" + e.getMessage());
		}
		return retVal;
	}
	
	public Connection getConnection(){
		return this.conn;
	}
	
	public void closeConnection(){
		try {
			conn.close();
			conn=null;
		} catch (SQLException e) {
			System.out.println("Exception :" + e.getMessage());
		}
		
	}
	
	public boolean isClose(){
		boolean retVal = true;
		try {
			retVal = conn.isClosed();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retVal;
	}
	
	public void setAutoCommit(boolean cmmit){
		try {
			conn.setAutoCommit(cmmit);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void commit(){
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void rollback(){
		try {
			conn.rollback();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public ResultSet doSqlSelect(String sql) throws SQLException{
		st = conn.createStatement();
		return st.executeQuery(sql);
	}
	
	/**

	@parm	 sql	傳入 sql 語法
	@parm    d	ResultSet 是否可以上下移動
	@return ResultSet
*/
	public ResultSet doSqlSelect(String sql,boolean d) throws SQLException{	
		if (d)
			st = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
		else
			st = conn.createStatement();
		return st.executeQuery(sql);
	
	}
	
	public Vector doSqlSelect(String sql, int i){
		Vector vt = new Vector();
		ResultSet rs;
		try {
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			vt = resultSetToVector(rs,i);
			rs.close();
			st.close();
		}catch (SQLException sqlexception) {
			System.out.println("doSelect SQLException");
			try {
				st.close();
			}catch (Exception e) {
				while(sqlexception!=null){
					System.out.println("SQLState: " + sqlexception.getSQLState());
	                System.out.println("Message:  " + sqlexception.getMessage());
	                System.out.println("Vendor:   " + sqlexception.getErrorCode());
	                System.out.println("SQL:   " + sql);
	                sqlexception = sqlexception.getNextException();
	                System.out.println("");
				}
			}
		}catch(Exception exception){
			System.out.println("doSelect Exception: "+ exception);
			exception.printStackTrace();
		}
		return vt;
	}
	
	private Vector resultSetToVector(ResultSet rs, int i){
		Vector vt = new Vector();
		try {
			while(rs.next()){
				for(int k=1; k<=i; k++){
					vt.addElement(rs.getObject(k));
				}
			}
		}catch (SQLException e) {
			e.printStackTrace();
		}
		return vt;
	}
	
	public List<HashMap<String, Object>> doSqlSelectList(String sql){
		ResultSet rs;
		List<HashMap<String, Object>> list = null;
		try{
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			list =  resultSetToList(rs);
			rs.close();
			st.close();
		}catch (SQLException sqlexception) {
			System.out.println("doSelect SQLException");
			try {
				st.close();
			}catch (Exception e) {
				while(sqlexception!=null){
					System.out.println("SQLState: " + sqlexception.getSQLState());
	                System.out.println("Message:  " + sqlexception.getMessage());
	                System.out.println("Vendor:   " + sqlexception.getErrorCode());
	                System.out.println("SQL:   " + sql);
	                sqlexception = sqlexception.getNextException();
	                System.out.println("");
				}
			}
		}catch(Exception exception){
			System.out.println("doSelect Exception: "+ exception);
			exception.printStackTrace();
		}
		return list;
	}
	
	private List<HashMap<String, Object>> resultSetToList(ResultSet rs) throws SQLException{
		ResultSetMetaData md = rs.getMetaData();
		int columns = md.getColumnCount();
		List<HashMap<String,Object>> rows = new ArrayList<HashMap<String,Object>>();
		while(rs.next()){
			HashMap<String,Object> row = new HashMap<String,Object>();
			for(int k=1; k<=columns; ++k){
				row.put(md.getColumnName(k), rs.getObject(k));
			}
			rows.add(row);
		}
		return rows;
	}
	
	public int doSqlUpdate(String sql){
		int retVal = 1;
		try {
			st = conn.createStatement();
			retVal = st.executeUpdate(sql);
			st.close();
		} catch (SQLException e) {
			System.out.println("Excepiton e:" + e.getMessage());
			System.out.println(sql);
			try{
				st.close();
				retVal = -1;
			}catch(SQLException ee){}
			//Sytem.out.println(sql);
		}
		return retVal;
	}
	
	public boolean isClosed(){
		boolean retVal = false;
		try{
			retVal = conn.isClosed();
		}catch(SQLException e){
			System.out.println("Excepiton e:" + e.getMessage());
		}
		return retVal;
	}
	
}
