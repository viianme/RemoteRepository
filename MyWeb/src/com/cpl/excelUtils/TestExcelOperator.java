package com.cpl.excelUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.cpl.json.Book;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class TestExcelOperator {

	public static void main(String[] args) throws Exception {
		String path = "D:/students.xls";

		ExcelOperator ex = new ExcelOperator();

		HSSFWorkbook workbook = ex.createExcel();
		ex.createSheet(workbook, "學生表一", getExcelColumns(), getDataList());
		ex.createSheet(workbook, "學生表二", getExcelColumns(), new ArrayList<HashMap>());
		ex.export(workbook, path);
	}
	

	private static List<HashMap> getDataList() {
		Gson gson = new Gson();	
		String jsonStr = "[{grade=二年級, name=小明, age=8}, " +
				         " {grade=三年級, name=小光, age=9}, " +
				         " {grade=一年級, name=小榛, age=18}, " + 
				         " {grade=四年級, name=小花, age=10}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
	public static List<ExcelColumnBean> getExcelColumns(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("name" ,"姓名", 0));
		column.add(new ExcelColumnBean("age"  ,"年齡", 1));
		column.add(new ExcelColumnBean("grade","年級", 2));
		return column;
	}
	
	
}
