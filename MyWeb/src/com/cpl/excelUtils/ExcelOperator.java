package com.cpl.excelUtils;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.collections.MapUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.cpl.utils.CheckUtils;

/**
 * Jakarta POI 是一套用於訪問微軟格式文件的Java API。 
 * Jakarta POI有很多元件組成，其中有用於操作Excel格式檔案的HSSF和用於操作Word的HWPF， 在各種元件中目前只有用於操作Excel的HSSF相對成熟。
 * 官方主頁http://poi.apache.org/index.html API文件
 * http://poi.apache.org/apidocs/index.html
 * 
 * poi-3.15.jar
 */

public class ExcelOperator {

	/**建立一個Excel檔案*/
	public HSSFWorkbook createExcel(){
		return new HSSFWorkbook();
	}
	
	
	/** 建立一個工作表內容
	 * @throws Exception */
	public void createSheet(HSSFWorkbook workbook, String sheetName, List<ExcelColumnBean> columnList, List<HashMap> dataList) throws Exception{
		HSSFSheet sheet = workbook.createSheet(sheetName);
		
		// 設定單元格格式居中
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);

		//新增表頭內容
		setHeadCell(sheet, columnList, cellStyle);
		
		//新增資料內容
		setDataCell(sheet, columnList, dataList, cellStyle);

	}


	/** 匯出Excel檔案*/
	public void export(HSSFWorkbook workbook, String path) {
		try {
			OutputStream outputStream = new FileOutputStream(path);
			workbook.write(outputStream);
			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**新增表頭內容
	 * @throws Exception */
	private void setHeadCell(HSSFSheet sheet, List<ExcelColumnBean> columnList, HSSFCellStyle cellStyle) throws Exception {	
		
		if( CheckUtils.checkListNull(columnList) ) {
			throw new Exception("請設定表頭內容");
		}
		
		HSSFRow hssfRow = sheet.createRow(0);  // 新增表頭行
		for(ExcelColumnBean coulum : columnList){
			HSSFCell headCell = hssfRow.createCell(coulum.getXloc());
			headCell.setCellValue(coulum.getTitle());
			headCell.setCellStyle(cellStyle);
		}
	}
	
	
	/**新增資料內容*/
	private void setDataCell(HSSFSheet sheet, List<ExcelColumnBean> columnList,  List<HashMap> dataList, HSSFCellStyle cellStyle) {
		for (int i = 0; i < dataList.size(); i++  ) {
			HSSFRow hssfRow = sheet.createRow((int) i +  1);
			HashMap student = dataList.get(i);
			// 建立單元格，並設定值
			
			for(ExcelColumnBean coulum : columnList){
				HSSFCell cell = hssfRow.createCell(coulum.getXloc());
				cell.setCellValue(MapUtils.getString(student, coulum.getField()));
				cell.setCellStyle(cellStyle);
			}
		}
	}
	
	
}
