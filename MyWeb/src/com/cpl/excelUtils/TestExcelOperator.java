package com.cpl.excelUtils;

import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class TestExcelOperator {

	public static void main(String[] args) throws Exception {
		
//		/*
		String path = "D:/excelExample.xlsx";
		
		File file = new File(path);
		ExcelOperator ex = new ExcelOperator();
	
		Workbook workbook;
		
		//匯出範例
		workbook = ex.createWorkbook(file);
		ex.createSheet(workbook, "學生表", getExcelColumns(), getDataList());
		ex.createSheet(workbook, "城市代碼", getExcelColumns2(), getDataList2());
		ex.export(workbook);
		
		
		//匯入範例
		workbook = ex.getWorkbook(file);
		List<HashMap> student = ex.parse(workbook);
		List<HashMap> city    = ex.parseBySheet(workbook,1);
		System.out.println("parse result student:"+student);
		System.out.println("parse result city:"+city);
//		*/
		
		/*
		String path = "D:/04_文件/20190315二手市集.xlsx";
		
		File file = new File(path);
		ExcelOperator ex = new ExcelOperator();
		Workbook workbook = ex.getWorkbook(file);
		List<HashMap> asset = ex.parse(workbook,1);
		System.out.println("parse result asset:"+asset);
		
		*/
	}
	
	
	
	public static List<ExcelColumnBean> getExcelColumns(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("name" ,"姓名", 0));
		column.add(new ExcelColumnBean("age"  ,"年齡", 1));
		column.add(new ExcelColumnBean("grade","年級", 2));
		return column;
	}
	

	private static List<HashMap> getDataList() {
		Gson gson = new Gson();	
		String jsonStr = "[{grade=二年級, name=小明, age=8}, " +
				         " {grade=三年級, name=小光, age=9}, " +
				         " {grade=一年級, name=小榛, age=18}, " + 
				         " {grade=五年級, name=小天, age=17}, " + 
				         " {grade=二年級, name=小秋, age=15}, " + 
				         " {grade=四年級, name=小花, age=10}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
	
	public static List<ExcelColumnBean> getExcelColumns2(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("city" ,"城市", 0));
		column.add(new ExcelColumnBean("code" ,"代碼", 1));
		return column;
	}
	
	
	private static List<HashMap> getDataList2() {
		Gson gson = new Gson();	
		String jsonStr = "[{city=台北, code=01}, " +
				         " {city=桃園, code=02}, " +
				         " {city=新竹, code=03}, " + 
				         " {city=苗栗, code=04}, " + 
				         " {city=台中, code=05}, " + 
				         " {city=彰化, code=06}, " + 
				         " {city=雲林, code=07}, " + 
				         " {city=嘉義, code=08}, " + 
				         " {city=台南, code=09}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
}
