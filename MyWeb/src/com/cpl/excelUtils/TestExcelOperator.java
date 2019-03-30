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
		
		//�ץX�d��
		workbook = ex.createWorkbook(file);
		ex.createSheet(workbook, "�ǥͪ�", getExcelColumns(), getDataList());
		ex.createSheet(workbook, "�����N�X", getExcelColumns2(), getDataList2());
		ex.export(workbook);
		
		
		//�פJ�d��
		workbook = ex.getWorkbook(file);
		List<HashMap> student = ex.parse(workbook);
		List<HashMap> city    = ex.parseBySheet(workbook,1);
		System.out.println("parse result student:"+student);
		System.out.println("parse result city:"+city);
//		*/
		
		/*
		String path = "D:/04_���/20190315�G�⥫��.xlsx";
		
		File file = new File(path);
		ExcelOperator ex = new ExcelOperator();
		Workbook workbook = ex.getWorkbook(file);
		List<HashMap> asset = ex.parse(workbook,1);
		System.out.println("parse result asset:"+asset);
		
		*/
	}
	
	
	
	public static List<ExcelColumnBean> getExcelColumns(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("name" ,"�m�W", 0));
		column.add(new ExcelColumnBean("age"  ,"�~��", 1));
		column.add(new ExcelColumnBean("grade","�~��", 2));
		return column;
	}
	

	private static List<HashMap> getDataList() {
		Gson gson = new Gson();	
		String jsonStr = "[{grade=�G�~��, name=�p��, age=8}, " +
				         " {grade=�T�~��, name=�p��, age=9}, " +
				         " {grade=�@�~��, name=�p�d, age=18}, " + 
				         " {grade=���~��, name=�p��, age=17}, " + 
				         " {grade=�G�~��, name=�p��, age=15}, " + 
				         " {grade=�|�~��, name=�p��, age=10}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
	
	public static List<ExcelColumnBean> getExcelColumns2(){
		List<ExcelColumnBean> column = new ArrayList<ExcelColumnBean>();
		column.add(new ExcelColumnBean("city" ,"����", 0));
		column.add(new ExcelColumnBean("code" ,"�N�X", 1));
		return column;
	}
	
	
	private static List<HashMap> getDataList2() {
		Gson gson = new Gson();	
		String jsonStr = "[{city=�x�_, code=01}, " +
				         " {city=���, code=02}, " +
				         " {city=�s��, code=03}, " + 
				         " {city=�]��, code=04}, " + 
				         " {city=�x��, code=05}, " + 
				         " {city=����, code=06}, " + 
				         " {city=���L, code=07}, " + 
				         " {city=�Ÿq, code=08}, " + 
				         " {city=�x�n, code=09}]";
		
		Type collectionType = new TypeToken<List<HashMap>>() {}.getType();
		return gson.fromJson(jsonStr, collectionType);
	}
	
	
}
