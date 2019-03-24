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
		ex.createSheet(workbook, "�ǥͪ�@", getExcelColumns(), getDataList());
		ex.createSheet(workbook, "�ǥͪ�G", getExcelColumns(), new ArrayList<HashMap>());
		ex.export(workbook, path);
	}
	

	private static List<HashMap> getDataList() {
		Gson gson = new Gson();	
		String jsonStr = "[{grade=�G�~��, name=�p��, age=8}, " +
				         " {grade=�T�~��, name=�p��, age=9}, " +
				         " {grade=�@�~��, name=�p�d, age=18}, " + 
				         " {grade=�|�~��, name=�p��, age=10}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
	public static List<ExcelColumnBean> getExcelColumns(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("name" ,"�m�W", 0));
		column.add(new ExcelColumnBean("age"  ,"�~��", 1));
		column.add(new ExcelColumnBean("grade","�~��", 2));
		return column;
	}
	
	
}
